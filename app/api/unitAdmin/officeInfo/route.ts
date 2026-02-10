import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || id === 'undefined' || id === 'null') {
            return NextResponse.json({ success: false, message: 'ID หน่วยงานไม่ถูกต้อง' }, { status: 400 });
        }

        // ปรับ Query ให้ตรงกับชื่อ Column ใน Table dept_dtl ของคุณ
        const query = `
        SELECT t1.*, c.name as changwat_name, a.name as ampur_name, t.name as tambon_name
        FROM dept_dtl t1
        LEFT JOIN l_changwat c ON t1.gov_changwat_id = c.changwat_id
        LEFT JOIN l_ampur a ON t1.gov_ampur_id = a.ampur_id
        LEFT JOIN l_tambon t ON t1.gov_tambon_id = t.tambon_id
        WHERE t1.id = ?
        `;

        const [rows]: any = await db.execute(query, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลในระบบ' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: rows[0] });
    } catch (error: any) {
        console.error("Database Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        // 1. ตรวจสอบว่ามีข้อมูลส่งมาครบไหม
        const { 
            id, remark1, remark, addr, building, floor, road, moo, 
            website, tel, fax, email, gov_postcode,
            gov_changwat_id, gov_ampur_id, gov_tambon_id // เพิ่ม 3 ตัวนี้
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'ไม่พบ ID หน่วยงาน' }, { status: 400 });
        }

        // 2. ปรับ Query ให้ตรงลำดับและครบถ้วน
        const query = `
            UPDATE dept_dtl 
            SET 
                remark1 = ?, remark = ?, addr = ?, building = ?, floor = ?, 
                road = ?, moo = ?, website = ?, tel = ?, 
                fax = ?, email = ?, gov_postcode = ?,
                gov_changwat_id = ?, gov_ampur_id = ?, gov_tambon_id = ?
            WHERE id = ?
        `;

        // 3. เรียงลำดับ params ให้ "เป๊ะ" ตามลำดับเครื่องหมาย ? ข้างบน
        const params = [
            remark1 ?? null, 
            remark ?? null, 
            addr ?? null, 
            building ?? null, 
            floor ?? null,
            road ?? null, 
            moo ?? null, 
            website ?? null, 
            tel ?? null,
            fax ?? null, 
            email ?? null, 
            gov_postcode ?? null,
            gov_changwat_id ?? null, 
            gov_ampur_id ?? null, 
            gov_tambon_id ?? null,
            id ?? null // ตรวจสอบว่ามี id ปิดท้าย เพื่อให้ตรงกับ WHERE id = ?
        ];

        await db.execute(query, params);

        return NextResponse.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error: any) {
        console.error("Update Error:", error); // พิมพ์ Error ลง terminal เพื่อดูสาเหตุ
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}