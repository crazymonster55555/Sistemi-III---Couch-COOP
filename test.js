const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const conn = await mysql.createConnection({
            host: 'student_db',
            user: 'studenti',
            password: 'S039C8R7',  // Your actual password
            database: 'CouchCOOP',
            port: 3306,
            connectTimeout: 60000,  // 60 seconds timeout
            socketPath: undefined   // Don't use socket, use TCP
        });
        
        const [rows] = await conn.query('SELECT NOW() AS now_time');
        await conn.end();
        res.json({ ok: true, database: rows[0] });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});