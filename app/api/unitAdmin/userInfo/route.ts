// route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const agoId = searchParams.get('agoId');

        if (!agoId || agoId === 'undefined') {
            return NextResponse.json({ success: false, message: "Missing agoId" }, { status: 400 });
        }

        // ปรับ Query ให้ดึงข้อมูลตามโครงสร้างตารางที่คุณส่งมา
        const query = `
            SELECT 
                p.row_id AS id, 
                CONCAT(p.name, ' ', p.surname) AS name, 
                p.position, 
                d.remark1 AS division,    -- ชื่อหน่วยงานจากตาราง dept_dtl
                p.ptel AS officePhone, 
                p.pext AS internalPhone, 
                p.mobile AS mobilePhone
            FROM personal p
            LEFT JOIN dept_dtl d ON TRIM(p.ago_id) = TRIM(d.ago_id)
            WHERE TRIM(p.ago_id) = TRIM(?)
            ORDER BY p.sort_id ASC         -- เรียงลำดับตามที่กำหนดในฐานข้อมูล
        `;

        const [rows]: any = await db.execute(query, [agoId]);

        return NextResponse.json({ 
            success: true, 
            data: rows 
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}