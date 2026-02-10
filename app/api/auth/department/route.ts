import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const officeName = searchParams.get('office') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10; // กำหนดแสดงหน้าละ 10 รายการ
        const offset = (page - 1) * limit;

        // 1. Query หลักเพื่อดึงข้อมูล (Map คอลัมน์ตามที่คุณให้มา)
        const query = `
            SELECT 
                id,
                remark1 as office, 
                remark as initial,
                belong as division,
                tel as phone,
                fax,
                email,
                website,
                addr
            FROM dept_dtl
            WHERE (remark1 LIKE ? OR remark LIKE ? OR ? = '')
            AND status = 1
            ORDER BY sort_id ASC
            LIMIT ? OFFSET ?
        `;

        const params = [
            `%${officeName}%`, 
            `%${officeName}%`, 
            officeName,
            limit, 
            offset
        ];

        // 2. Query เพื่อนับจำนวนทั้งหมด (เอาไว้ใช้ทำ Pagination ฝั่งหน้าบ้าน)
        const countQuery = `
            SELECT COUNT(*) as total FROM dept_dtl 
            WHERE (remark1 LIKE ? OR remark LIKE ? OR ? = '') AND status = 1
        `;

        const [rows]: any = await db.execute(query, params);
        const [countResult]: any = await db.execute(countQuery, [`%${officeName}%`, `%${officeName}%`, officeName]);
        
        const totalRecords = countResult[0].total;

        return NextResponse.json({
            success: true,
            data: rows,
            pagination: {
                total: totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
                currentPage: page,
                limit: limit
            }
        });

    } catch (error: any) {
        console.error('Database Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}