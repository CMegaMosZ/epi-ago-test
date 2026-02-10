import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // ลอง Query ง่ายๆ เพื่อเช็คการเชื่อมต่อ
        const [rows] = await db.execute('SELECT 1 as result');
        return NextResponse.json({ 
            success: true, 
            message: "เชื่อมต่อ Database สำเร็จ!", 
            testResult: rows 
        });
    } catch (error: any) {
        console.error("Database Connection Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: "เชื่อมต่อไม่สำเร็จ", 
            error: error.message,
            code: error.code // สำคัญมาก ดูตรงนี้จะรู้สาเหตุ
        }, { status: 500 });
    }
}