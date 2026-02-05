import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    // รับค่า 'office' ให้ตรงกับ URLSearchParams ใน page.tsx
    const office = searchParams.get('office') || ''; 
    const division = searchParams.get('division') || '';

    try {
        const query = `
            SELECT * FROM department
            WHERE (office LIKE ? OR ? = '') 
            AND (division LIKE ? OR ? = '')
        `;
        
        const params = [`%${office}%`, office, `%${division}%`, division];
        const [rows]: any = await db.execute(query, params);
        
        return NextResponse.json({ success: true, data: rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}