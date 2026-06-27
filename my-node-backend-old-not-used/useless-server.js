const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Serve React from /app
app.use('/app', express.static(path.join(__dirname, 'my-react-app/dist')));

// Professor's original API at root (keep as is)
app.get('/', async (req, res) => {
    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await conn.query('SELECT NOW() AS now_time');
        await conn.end();
        res.json({ ok: false, database: rows[0] });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Serve React app
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-react-app/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`API: http://localhost:${port}/`);
    console.log(`React App: http://localhost:${port}/app`);
});