import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const connection = await db.getConnection(); // ดึง connection เพื่อทำ Transaction
    try {
        const formData = await req.formData();
        
        // 1. ดึงข้อมูลจาก FormData
        const title = formData.get('title');
        const fname = formData.get('fname');
        const lname = formData.get('lname');
        const idCard = formData.get('idCard');
        const file = formData.get('file') as File;

        await connection.beginTransaction(); // เริ่ม Transaction

        // 2. บันทึกลงตาราง register_request
        const [regResult]: any = await connection.execute(
            `INSERT INTO register_request (title, fname, lname, cid, status) VALUES (?, ?, ?, ?, 'PENDING')`,
            [title, fname, lname, idCard]
        );
        const requestId = regResult.insertId;

        // 3. จัดการรูปภาพและบันทึกลง documentary_evidence
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}_${file.name}`;
            
            // ในที่นี้ผมจะบันทึกแบบ BLOB (Binary) ลงฐานข้อมูลตามที่คุณต้องการทดสอบ
            await connection.execute(
                `INSERT INTO documentary_evidence (request_id, file_name, file_type, file_data) VALUES (?, ?, ?, ?)`,
                [requestId, fileName, file.type, buffer]
            );
        }

        await connection.commit(); // ยืนยันการบันทึกทั้งหมด
        return NextResponse.json({ success: true, message: 'ลงทะเบียนสำเร็จ' });

    } catch (error: any) {
        await connection.rollback(); // ยกเลิกทั้งหมดถ้าพัง
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}
