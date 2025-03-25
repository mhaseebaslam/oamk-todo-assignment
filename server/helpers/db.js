require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

const executeQuery = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values)
            .then(result => resolve(result))
            .catch(error => reject(error.message));
    });
}

module.exports = { executeQuery };