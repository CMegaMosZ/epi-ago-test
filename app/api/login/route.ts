import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs'; // นำเข้า bcrypt

export async function POST(req: Request) {
    try {
        const { username, password, role } = await req.json();

        let query = '';
        let params: any[] = [];

        // 1. ดึงข้อมูล User ออกมาโดยใช้แค่ Username หรือ CID เท่านั้น (ยังไม่เช็ค password ใน SQL)
        if (role === 'USER') {
            query = `SELECT person_id as id, fname, lname, password, email FROM hrm_person WHERE cid = ? AND status = '1' LIMIT 1`;
            params = [username];
        } else {
            query = `
            SELECT 
                u.id, u.fname, u.lname, u.password, u.role, 
                u.username AS ago_id, 
                d.id AS office_pk_id,
                d.remark1 AS office_name
                FROM users u
                LEFT JOIN dept_dtl d ON u.username = d.ago_id
                WHERE u.username = ? AND u.status = 1 
                LIMIT 1
                `;
            // query = `SELECT id, fname, lname, password, role, dept FROM users WHERE username = ? AND status = 1 LIMIT 1`;
            params = [username];
        }

        const [rows]: any = await db.execute(query, params);

        // 2. ตรวจสอบว่าพบ User หรือไม่
        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'ไม่พบชื่อผู้ใช้งานนี้' }, { status: 401 });
        }

        const user = rows[0];

        // 3. 🔹 ขั้นตอนสำคัญ: ใช้ bcrypt เทียบรหัสผ่านที่ส่งมา กับ Hash ใน Database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return NextResponse.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
        }

        // 4. ถ้ารหัสผ่านถูกต้อง จัดการส่งข้อมูลกลับไป
        let userRole = 'USER';
        if (role === 'ADMIN') {
            userRole = (user.role === 1 || user.role === 0) ? 'ADMIN' : 'UNIT_ADMIN';
        }

        return NextResponse.json({
            success: true,
            name: `${user.fname} ${user.lname}`,
            role: userRole,
            officeInfo_id: user.office_pk_id,
            agoId: user.ago_id   // <--- บรรทัดนี้ "ต้องมี" และสะกดแบบนี้เป๊ะๆ
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
    }
}