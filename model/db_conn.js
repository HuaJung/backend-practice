import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  database: process.env.DATABSE_NAME,
  port: process.env.RDS_PORT,
  password: process.env.RDS_PASSWORD
});

export{ connection }
