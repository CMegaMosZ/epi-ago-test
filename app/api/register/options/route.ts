import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // ดึงข้อมูลพร้อมกันทั้ง 4 ตาราง
        const [prenames]: any = await db.execute('SELECT prename_id, prename FROM l_prename');
        const [memberTypes]: any = await db.execute('SELECT position_type_id, position_type_name FROM position_type');
        const [positions]: any = await db.execute('SELECT position_id, position_th FROM ago_position');
        const [offices]: any = await db.execute('SELECT id, remark1 as name FROM dept_dtl WHERE status = 1');

        return NextResponse.json({
            success: true,
            data: {
                prenames,
                memberTypes,
                positions,
                offices
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}