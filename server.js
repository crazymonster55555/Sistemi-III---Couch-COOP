const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('/workspace/my-react-app/dist'));

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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        
        const [rows] = await conn.query(
            'SELECT * FROM user WHERE username = ? AND password = ?', 
            [username, password]
        );
        
        await conn.end();

        if (rows.length > 0) {
            res.json({ success: true, message: "Prijava uspešna" });
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

app.use((req, res) => {
    res.sendFile('/workspace/my-react-app/dist/index.html');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`React app: http://localhost:${port}/`);
    console.log(`API: http://localhost:${port}/api`);
});
