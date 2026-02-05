import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // ไฟล์เชื่อมต่อ DB ของคุณ

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || '';
    const position = searchParams.get('position') || '';
    const office = searchParams.get('office') || '';

try {
    const query = `
        SELECT * FROM personal
        WHERE (name LIKE ? OR ? = '') 
        AND (position LIKE ? OR ? = '')
        AND (office LIKE ? OR ? = '')
    `;
    
    // ตัด role ออกจาก params ด้วย (ต้องเหลือ 6 ตัว)
    const params = [
        `%${name}%`, name, 
        `%${position}%`, position, 
        `%${office}%`, office
    ];
    
    const [rows]: any = await db.execute(query, params);
    return NextResponse.json({ success: true, data: rows });
} catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Database Error' }, { status: 500 });
    }
}