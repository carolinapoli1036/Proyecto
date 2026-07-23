import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'mainline.proxy.rlwy.net',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'cJAFXcMfOUznbdanqnQaeAWrjwDVLtrW',
  database: process.env.MYSQLDATABASE || 'railway',
  port: parseInt(process.env.MYSQLPORT || '50935'),
});

export default db;