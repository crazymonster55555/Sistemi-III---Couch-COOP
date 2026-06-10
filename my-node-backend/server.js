const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const app = express();
const port = 3000;



app.get('/', async (req, res) => {
    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await conn.query('SELECT NOW() AS now_time');
        await conn.end();
        res.json({ ok: true, database: rows[0] });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
    app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});