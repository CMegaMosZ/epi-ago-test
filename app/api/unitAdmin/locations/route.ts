// /api/locations/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'provinces', 'amphures', 'tambons'
    const parentId = searchParams.get('parentId');

    try {
        let query = '';
        let params: any[] = [];

        if (type === 'provinces') {
            query = 'SELECT changwat_id as id, name FROM l_changwat ORDER BY name ASC';
        } else if (type === 'amphures') {
            query = 'SELECT ampur_id as id, name FROM l_ampur WHERE changwat_id = ? ORDER BY name ASC';
            params = [parentId];
        } else if (type === 'tambons') {
            query = 'SELECT tambon_id as id, name FROM l_tambon WHERE ampur_id = ? ORDER BY name ASC';
            params = [parentId];
        }

        const [rows] = await db.execute(query, params);
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}