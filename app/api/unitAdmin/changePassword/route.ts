import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { username, oldPassword, newPassword } = await req.json();

        // 1. ตรวจสอบว่ารหัสผ่านเดิมถูกต้องหรือไม่
        const [user]: any = await db.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, oldPassword]
        );

        if (user.length === 0) {
            return NextResponse.json(
                { success: false, message: 'รหัสผ่านเดิมไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // 2. อัปเดตรหัสผ่านใหม่
        const [updateResult]: any = await db.execute(
            'UPDATE users SET password = ? WHERE username = ?',
            [newPassword, username]
        );

        if (updateResult.affectedRows > 0) {
            return NextResponse.json({ success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
        } else {
            throw new Error('ไม่สามารถอัปเดตข้อมูลได้');
        }

    } catch (error: any) {
        console.error('Change Password Error:', error);
        return NextResponse.json(
            { success: false, message: 'เกิดข้อผิดพลาดของระบบ' },
            { status: 500 }
        );
    }
}