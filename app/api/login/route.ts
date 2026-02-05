import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // ปรับ Path ตามที่ไฟล์ db.ts ของคุณอยู่

export async function POST(req: Request) {
    try {
        const { username, password, role } = await req.json();

        // ค้นหาผู้ใช้ในฐานข้อมูลที่มี username, password และกลุ่มสิทธิ์ (role) ตรงกัน
        // หมายเหตุ: กรณี ADMIN/UNIT_ADMIN เราจะเช็ค role ที่เป็นกลุ่มเจ้าหน้าที่
        let query = '';
        let params = [username, password];

            if (role === 'USER') {
                // เปลี่ยนจาก FROM users เป็น FROM loginuser
                query = 'SELECT username, fullname as name, role, officeInfo_id, department_id FROM loginuser WHERE username = ? AND password = ? AND role = "USER"';
            } else {
                // เปลี่ยนจาก FROM users เป็น FROM loginuser
                query = 'SELECT username, fullname as name, role, officeInfo_id, department_id FROM loginuser WHERE username = ? AND password = ? AND role IN ("ADMIN", "UNIT_ADMIN")';
            }

        const [rows]: any = await db.execute(query, params);

        if (rows.length > 0) {
            const user = rows[0];
            return NextResponse.json({
                success: true,
                role: user.role,
                name: user.name,
                // ส่งค่าเหล่านี้ออกไปให้ Frontend
                officeInfo_id: user.officeInfo_id, 
                deptId: user.department_id  // ตรวจสอบว่าใน DB ชื่อคอลัมน์คือ department_id
            });
        }

        // กรณีไม่พบข้อมูล
        return NextResponse.json(
            { success: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' },
            { status: 401 }
        );

    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' },
            { status: 500 }
        );
    }
}