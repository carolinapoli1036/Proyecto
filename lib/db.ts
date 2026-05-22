import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'kodama.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'fLjvMOboBFMpLaUnxeNKnCeWHAePbueG',
  database: process.env.MYSQLDATABASE || 'railway',
  port: parseInt(process.env.MYSQLPORT || '31334'),
});

export default db;