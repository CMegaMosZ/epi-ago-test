import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const connection = await db.getConnection();
    try {
        const formData = await req.formData();
        
        // รับค่าจากหน้าบ้าน (ต้องชื่อตรงกับที่ data.append ใน page.tsx)
        const person_type_id = formData.get('person_type_id');
        const cid = formData.get('cid');
        const bdate = formData.get('bdate');
        const prename_id = formData.get('prename_id');
        const fname = formData.get('fname');
        const lname = formData.get('lname');
        const office_id = formData.get('office_id');
        const sec_name = formData.get('sec_name');
        const position = formData.get('position');
        const ptel = formData.get('ptel');
        const mobile = formData.get('mobile');
        const file = formData.get('file') as File;

        await connection.beginTransaction();

        // บันทึกลง register_request ตามโครงสร้าง Table ใหม่
        const [regResult]: any = await connection.execute(
            `INSERT INTO register_request 
            (person_type_id, cid, bdate, prename_id, fname, lname, office_id, sec_name, position, ptel, mobile) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [person_type_id, cid, bdate, prename_id, fname, lname, office_id, sec_name, position, ptel, mobile]
        );

        const requestId = regResult.insertId;

        // จัดการไฟล์แนบ (ถ้ามี)
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            await connection.execute(
                `INSERT INTO documentary_evidence (documentary_evidence_id, filename, file_type, file_data) VALUES (?, ?, ?, ?)`,
                [requestId, file.name, file.type, buffer]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ' });

    } catch (error: any) {
        await connection.rollback();
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}
