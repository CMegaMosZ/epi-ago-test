import mysql from 'mysql2/promise';

export const db = mysql.createPool ({
    host: 'localhost',
    user: 'root',
    password: '123456', // ใส่ password ของคุณ
    database: 'ephonebook',
})