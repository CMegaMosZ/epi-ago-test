import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 🔹 GET: ดึงรายชื่อหน่วยงานและข้อมูล Admin ประจำหน่วยงาน
export async function GET() {
    try {
        const query = `
            SELECT 
                id,
                office AS officeName,
                initial,
                adminUsername,
                adminName,
                email,
                phone,
                status
            FROM department
        `;
        const [rows] = await db.execute(query);
        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// 🔹 PUT: อัปเดตสถานะ หรือข้อมูลหน่วยงาน
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, office, initial, status } = body;

        // 1. อัปเดตข้อมูลหน่วยงาน
        await db.execute(
            'UPDATE department SET office = ?, initials = ? WHERE id = ?',
            [office, initial, id]
        );

        // 2. อัปเดตสถานะใน loginuser (ถ้ามี)
        await db.execute(
            'UPDATE loginuser SET status = ? WHERE department_id = ? AND role = "UNIT_ADMIN"',
            [status, id]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}