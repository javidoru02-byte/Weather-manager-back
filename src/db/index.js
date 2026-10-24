const { Pool } = require('pg');
require('dotenv').config();

const isProduction =
  process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
      },
);

module.exports = pool;
