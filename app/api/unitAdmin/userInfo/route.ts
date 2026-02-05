import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const deptId = searchParams.get('deptId');

        if (!deptId) return NextResponse.json({ success: false, message: "Missing Personal ID" });

        // JOIN ตาราง personal (p) เข้ากับ department (d)
        const query = `
            SELECT 
                p.id, 
                p.name, 
                p.position, 
                d.office AS division,  -- ชื่อแผนก
                p.officePhone, 
                p.internalPhone, 
                p.mobilePhone, 
                p.mail AS email        -- ชื่อเมล
            FROM personal p
            LEFT JOIN department d ON p.department_id = d.id
            WHERE p.department_id = ?  -- ใช้ deptId ในการค้นหา
            ORDER BY p.id DESC
        `;

        const [rows]: any = await db.execute(query, [deptId]);
        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}