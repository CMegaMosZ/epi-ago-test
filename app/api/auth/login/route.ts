import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // โค้ดนี้จะตอบรับ "สำเร็จ" ตลอดเวลาเพื่อเช็คว่าเรียก API ติดไหม
    return NextResponse.json({ 
        success: true, 
        role: 'USER', 
        name: 'TESTER (API ทำงานแล้ว)' 
    });
}

// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const { username, password, role } = body;

//         // 1. ตรวจสอบว่ามีข้อมูลส่งมาไหม
//         if (!username || !password) {
//             return NextResponse.json({ success: false, message: 'กรุณากรอกข้อมูล' }, { status: 400 });
//         }

//         // 2. Logic ตรวจสอบ (Mockup ข้อมูลจริง)
//         // --- ประชาชนทั่วไป ---
//         if (role === 'USER' && username === '1234567890123' && password === '1234') {
//             return NextResponse.json({ success: true, role: 'USER', name: 'คุณสมชาย ใจดี' });
//         }

//         // --- เจ้าหน้าที่ ---
//         if (role === 'ADMIN') {
//             if (username === 'admin' && password === '123456') {
//                 return NextResponse.json({ success: true, role: 'ADMIN', name: 'ผู้ดูแลระบบ' });
//             }
//             if (username === 'office01' && password === '123456') {
//                 return NextResponse.json({ success: true, role: 'UNIT_ADMIN', name: 'เจ้าหน้าที่สำนักงาน' });
//             }
//         }

//         // ถ้าไม่ผ่าน
//         return NextResponse.json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });

//     } catch (error) {
//         return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
//     }
// }