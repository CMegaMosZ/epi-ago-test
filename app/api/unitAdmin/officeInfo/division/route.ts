// /api/unitAdmin/division/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const agoId = searchParams.get('agoId');
        const sectionId = searchParams.get('sectionId'); // สำหรับดึงรายชื่อคนในกลุ่ม

        // กรณีที่ 1: ดึงรายชื่อคนในกลุ่มงาน (สำหรับ Pop-up)
        if (sectionId) {
            const [members]: any = await db.execute(
                `SELECT CONCAT(name, ' ', surname) as fullname, position 
                 FROM users 
                 WHERE section_id = ? AND TRIM(ago_id) = TRIM(?)`, 
                [sectionId, agoId]
            );
            return NextResponse.json({ success: true, data: members });
        }

        // กรณีที่ 2: ดึงรายชื่อกลุ่มงานทั้งหมดของหน่วยงาน
        const [sections]: any = await db.execute(
            `SELECT id, section_name, section_initial, section_tel 
             FROM dept_section 
             WHERE TRIM(ago_id) = TRIM(?) ORDER BY id ASC`, 
            [agoId]
        );
        return NextResponse.json({ success: true, data: sections });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}