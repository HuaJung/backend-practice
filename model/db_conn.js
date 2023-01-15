import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


const pool = mysql.createPool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  database: process.env.DATABASE_NAME,
  password:process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export{pool}
