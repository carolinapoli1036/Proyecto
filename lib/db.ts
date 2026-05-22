import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Manu06',
  database: 'carpoodrive',
  port: 3306,
});

export default db;