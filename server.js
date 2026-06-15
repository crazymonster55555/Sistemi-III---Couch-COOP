const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Serve React static files at root (so assets load correctly)
app.use(express.static('/workspace/my-react-app/dist'));

// Professor's API at /api (so it doesn't conflict with React)
app.get('/api', async (req, res) => {
    try {
        const conn = await mysql.createConnection(process.env.DATABASE_URL);
        const [rows] = await conn.query('SELECT NOW() AS now_time');
        await conn.end();
        res.json({ ok: true, database: rows[0] });
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Send React's index.html for any other request
app.use((req, res) => {
    res.sendFile('/workspace/my-react-app/dist/index.html');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`React app: http://localhost:${port}/`);
    console.log(`API: http://localhost:${port}/api`);
});
