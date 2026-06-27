const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

const reactBuildPath = path.join(__dirname, './my-react-app/dist')

app.post("/api/register", async (req,res) => {
    const { username, email, password, timezone, language } = req.body;

    /*if (!username || !email || !password){
        return res.status(400).json({success: false, message: "Username or email or password are required"})
    }*/

    try{
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        const [current] = await conn.query(
            "SELECT * FROM user WHERE username = ? OR email = ?",
            [username, email]
        )

        if (current.length > 0){
            await conn.end();
            return res.status(409).json({
                success: false, 
                message: "Username or email exists"
            })
        }

        const [result] = await conn.query (
            `INSERT INTO user
            (username,email,password,timezone,language)
            VALUES (?,?,?,?,?)`,
            [username,email,password,timezone,language]
        )

        await conn.end();

        res.status(201).json({
            success: true,
            message: "Registration complete",
            userId: result.insertId
        });
    }catch(err){
        console.error("Registration error", err);
        res.status(500).json({
            success: false,
            message: "Server error while registering"
        });
    }
});

app.post("/api/dashboard/makeSession", async (req,res) => {
    /*if (!username || !email || !password){
        return res.status(400).json({success: false, message: "Username or email or password are required"})
    }*/
    const {game, duration, description, connection, status, userID} = req.body;
    //console.log("d: ", userID);
    console.log("thus: ", game);
    let userId = Number(userID);
    let durationInt = Number(duration);

    try{
        let gameId;
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        const [current] = await conn.query(
            "SELECT id FROM game WHERE name = ?",
            [game]
        )

        if (current.length == 0){
            await conn.end();
            return res.status(409).json({
                success: false, 
                message: "Game not available"
            })
        }

        const [username] = await conn.query(
            "SELECT username FROM user WHERE id = ?",
            [userID]
        )
        
        gameId = current[0].id;
        gameName = game;
        console.log(gameName);
        //console.log(durationInt);
        //console.log(userId);

        const [result] = await conn.query (
            `INSERT INTO session
            (user_id,game_id,duration, description, connection_type, status)
            VALUES (?,?,?,?,?,?)`,
            [userId,gameId,durationInt, description, connection, status]
        )

        await conn.end();

        res.status(201).json({
            success: true,
            message: "Session created",
            userId: result.insertId,
            gameName: gameName,
            username: username,
            game: game
        });
    }catch(err){
        console.error("Session failed", err);
        res.status(500).json({
            success: false,
            message: "Server error while registering"
        });
    }
});

app.delete("/api/dashboard/deleteSessions", async (req, res) =>{
    const { id, user_id } = req.body;
    try{
        console.log(id + " " + user_id);
        const conn = await mysql.createConnection(process.env.DATABASE_URL);

        const [exists] = await conn.query(
            "SELECT * FROM session WHERE id = ? AND user_id = ?",
            [id,user_id]
        )

        if (exists.length === 0) {
            await conn.end();
            return res.status(404).json({
                success: false,
                message: "Session not found or you don't have permission"
            });
        }

        await conn.query(
            "DELETE FROM session WHERE id = ?",
            [id]
        );

        await conn.end();

        res.json({success: true, message: "Deleted successfully"});

    }catch(err){
        console.error("Error: ", err);
        res.status(500).json({success: false, error: "Server error"});
    }
});

app.get("/api/dashboard/sessions", async (req, res) =>{
    try{
        
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        
        const [sessions] = await conn.query(
            "SELECT * FROM session"
        );
        
        await conn.end();

        res.json({success: true, sessions: sessions});

    }catch(err){
        console.error("Error: ", err);
        res.status(500).json({success: false, error: "Server error"});
    }
});

app.post("/api/dashboard/sessions/info", async (req, res) =>{

    const { id } = req.body;

    try{
        
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        
        const [sessions] = await conn.query(
            "SELECT * FROM session WHERE id = ?",
            [id]
        );
        
        //console.log(sessions);

        await conn.end();

        res.json({success: true, sessions: sessions});

    }catch(err){
        console.error("Error: ", err);
        res.status(500).json({success: false, error: "Server error"});
    }
});

app.post('/api/resetPassword', async (req, res) => {
    const { newPassword, username } = req.body;

    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        
        const [validUser] = await conn.query(
            'SELECT * FROM user WHERE username = ?',
            [username]
        )

        if (validUser.length == 0){
            res.status(401).json({});
        }

        const [rows] = await conn.query(
            'UPDATE user SET password = ? WHERE username = ? ', 
            [newPassword, username]
        );
        
        await conn.end();

        if (rows.affectedRows > 0) {
            res.json({ success: true, message: "Sprememeba uspešna" });
        } else {
            res.status(401).json({ success: false, message: "Sprememba neuspesna" });
        }
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ success: false, error: 'Napaka na strežniku' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        
        const [rows] = await conn.query(
            'SELECT id FROM user WHERE username = ? AND password = ?', 
            [username, password]
        );

        let userID = rows[0].id;
        console.log("y: ", userID);

        await conn.end();

        if (rows.length > 0) {
            
            res.json({ success: true, message: "Prijava uspešna",  userID: userID});
        } else {
            res.status(401).json({ success: false, message: "Napačno uporabniško ime ali geslo" });
        }
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ success: false, error: 'Napaka na strežniku' });
    }
});


app.get('/api', async (req, res) => {
    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await conn.query('SELECT * FROM user');
        await conn.end();
        res.json({ ok: true, database: rows[0] });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.use(express.static(reactBuildPath));

app.get('*splat', (req, res) => {
    res.sendFile(path.join(reactBuildPath, 'index.html'));
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server: http://localhost:${port}/api`);
    console.log(`Server: http://localhost:${port}`);
});
