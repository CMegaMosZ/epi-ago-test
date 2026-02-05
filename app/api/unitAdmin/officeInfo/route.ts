import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // ตรวจสอบ path ของ db ให้ถูก

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลของหน่วยงาน' }, { status: 400 });
        }

// ดึงข้อมูลจากตาราง department (หรือ officeinfo ของคุณ) ตาม ID ที่ส่งมา
        const [rows]: any = await db.execute(
            'SELECT * FROM officeInfo WHERE id = ?', 
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'ไม่พบข้อมูล' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: rows[0] });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}