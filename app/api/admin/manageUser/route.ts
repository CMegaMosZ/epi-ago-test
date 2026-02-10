import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// 🔹 GET: ดึงรายชื่อบุคลากรตาม division_id
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const divisionId = searchParams.get('divisionId');

        if (!divisionId) return NextResponse.json({ success: false, message: "Missing Division ID" });

        const [rows]: any = await db.execute(
            'SELECT id, name, position, officePhone, internalPhone, mobilePhone, mail AS email FROM personal WHERE division_id = ? ORDER BY id DESC',
            [divisionId]
        );
        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// 🔹 POST: เพิ่มบุคลากรใหม่เข้ากลุ่มงาน
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, position, divisionId, departmentId } = body;

        const [result]: any = await db.execute(
            'INSERT INTO personal (name, position, division_id, department_id) VALUES (?, ?, ?, ?)',
            [name, position, divisionId, departmentId]
        );

        return NextResponse.json({ success: true, insertId: result.insertId });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// 🔹 DELETE: ลบบุคลากร
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        await db.execute('DELETE FROM personal WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}