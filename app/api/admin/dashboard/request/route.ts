import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const officeId = searchParams.get('officeId');

        if (!officeId) {
            return NextResponse.json({ success: false, message: 'Missing Office ID' }, { status: 400 });
        }

        // Query ดึงข้อมูลจาก register_request
        // เชื่อมกับ l_prename เพื่อเอาชื่อคำนำหน้า (ถ้ามีตารางนี้)
        const query = `
        SELECT *
            FROM register_request
            WHERE r.verify_status IS NULL OR r.verify_status = 0
            ORDER BY r.created_at DESC
        `;

        const [rows]: any = await db.execute(query, [officeId]);

        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}