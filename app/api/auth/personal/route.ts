import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name') || '';
        const position = searchParams.get('position') || '';
        const office = searchParams.get('office') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10; // แสดงหน้าละ 10 รายการ
        const offset = (page - 1) * limit;

        // 1. คำสั่ง SQL สำหรับดึงข้อมูล พร้อม JOIN ชื่อ (ถ้าจำเป็น) หรือใช้คอลัมน์ในตาราง
        // ใช้ CONCAT เพื่อรวมชื่อ-นามสกุลในการแสดงผล
        let query = `
            SELECT DISTINCT
                row_id as id,
                CONCAT(name, ' ', surname) as fullname,
                position,
                office_name as office,
                sec_name as division,
                ptel as officePhone,
                pext as internalPhone,
                mobile as mobilePhone
            FROM personal
            WHERE (CONCAT(name, ' ', surname) LIKE ? OR ? = '')
            AND (position LIKE ? OR ? = '')
            AND (office_name LIKE ? OR ? = '')
            LIMIT ? OFFSET ?
        `;

        const params = [
            `%${name}%`, name,
            `%${position}%`, position,
            `%${office}%`, office,
            limit, offset
        ];

        // 2. คำสั่ง SQL สำหรับนับจำนวนทั้งหมด (เพื่อทำ Pagination ฝั่งหน้าบ้าน)
        const countQuery = `
            SELECT COUNT(*) as total FROM personal
            WHERE (CONCAT(name, ' ', surname) LIKE ? OR ? = '')
            AND (position LIKE ? OR ? = '')
            AND (office_name LIKE ? OR ? = '')
        `;
        
        const [rows]: any = await db.execute(query, params);
        const [totalRows]: any = await db.execute(countQuery, params.slice(0, 6));

        return NextResponse.json({
            success: true,
            data: rows,
            total: totalRows[0].total,
            currentPage: page,
            totalPages: Math.ceil(totalRows[0].total / limit)
        });

    } catch (error: any) {
        console.error('Search Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}