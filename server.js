const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

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
        
        gameId = current[0].id;
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
            userId: result.insertId
        });
    }catch(err){
        console.error("Session failed", err);
        res.status(500).json({
            success: false,
            message: "Server error while registering"
        });
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server: http://localhost:${port}/api`);
    console.log(`Server: http://localhost:${port+1}`);
});
