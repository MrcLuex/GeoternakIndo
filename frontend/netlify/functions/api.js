const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

// Koneksi ke Database langsung di dalam fungsi
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint default
app.get('/api/', (req, res) => {
    res.send('WebGIS Peternakan Berjalan di Netlify Serverless');
});

// Endpoint Provinsi
app.get('/api/provinsi', async (req, res) => {
    try {
        const { hewan, tahun } = req.query;
        let query = `
             SELECT
                nama_provinsi,
                produksi
            FROM "produksi_ternak "
            WHERE 1=1
        `;
        const values = [];

        if (hewan) {
            values.push(hewan);
            query += ` AND hewan = $${values.length}`;
        }

        if (tahun) {
            values.push(tahun);
            query += ` AND tahun = $${values.length}`;
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error database');
    }
});

// Endpoint Populasi
app.get('/api/populasi', async (req, res) => {
    try {
        const { hewan, tahun } = req.query;
        let query = `
            SELECT
                nama_provinsi,
                populasi
            FROM populasi
            WHERE 1=1
        `;
        const values = [];

        if (hewan) {
            values.push(hewan);
            query += ` AND hewan = $${values.length}`;
        }

        if (tahun) {
            values.push(tahun);
            query += ` AND tahun = $${values.length}`;
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error database');
    }
});

// Export agar bisa dibaca Netlify
module.exports.handler = serverless(app);
