import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'carpodrive123',
  database: 'carpodrive',
  port: 3306,
});

export default db;