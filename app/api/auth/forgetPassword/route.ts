import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { cid } = await req.json();
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

        // 1. ตรวจสอบก่อนว่ามีเลขบัตรประชาชนนี้ในระบบ hrm_person หรือไม่
        const [person]: any = await db.execute(
            'SELECT person_id FROM hrm_person WHERE cid = ? LIMIT 1',
            [cid]
        );

        if (person.length === 0) {
            return NextResponse.json(
                { success: false, message: 'ไม่พบเลขบัตรประชาชนนี้ในระบบ' },
                { status: 404 }
            );
        }

        const personId = person[0].person_id;

        // 2. บันทึกข้อมูลลงในตาราง log_forget_password_person
        // เราจะสร้าง Token แบบสุ่มเบื้องต้นไว้ก่อน
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const [insertResult]: any = await db.execute(
            `INSERT INTO log_forget_password_person 
            (person_id, cid, token_reset_password, change_password_status, token_status, ip) 
            VALUES (?, ?, ?, 0, 1, ?)`,
            [personId, cid, token, ip]
        );

        if (insertResult.affectedRows > 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'ส่งคำขอสำเร็จ กรุณารอเจ้าหน้าที่ตรวจสอบ' 
            });
        }

        throw new Error('บันทึกข้อมูลไม่สำเร็จ');

    } catch (error: any) {
        console.error('Forget Password Log Error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดภายในระบบ' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // ดึง remark1 มาเป็นชื่อสำนักงาน
        const [rows]: any = await db.execute('SELECT id, remark1 as name FROM dept_dtl WHERE status = 1 ORDER BY sort_id ASC');
        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}