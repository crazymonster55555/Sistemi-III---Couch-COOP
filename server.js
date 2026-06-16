const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('/workspace/my-react-app/dist'));

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
