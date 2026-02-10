import mysql from 'mysql2/promise';

// ตรวจสอบว่าดึงค่าจาก .env ได้จริงไหม (ดูที่ Terminal ตอนรัน)
console.log("Connecting to Database with User:", process.env.DB_USER);

export const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',        // ถ้า .env พัง ให้ใช้ 'root' เป็น Default
  password: process.env.DB_PASSWORD || '',    // ถ้าไม่มีรหัส ให้ใช้ค่าว่าง
  database: process.env.DB_NAME || 'ephonebook',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});