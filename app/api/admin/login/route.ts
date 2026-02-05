// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//     const { username, password } = await request.json();

//     // 0. Super Admin (ผู้ดูแลระบบสูงสุด)
//     if (username === 'superadmin' && password === 'super') {
//         return NextResponse.json({ 
//             success: true, 
//             role: 'SUPER_ADMIN', // ✅ ใส่ขีดล่างให้ชัดเจน
//             name: 'ผู้ดูแลระบบสูงสุด' 
//         });
//     }
    
//     // 1. Admin ส่วนกลาง
//     if (username === 'admin' && password === '123456') {
//         return NextResponse.json({ 
//             success: true, 
//             role: 'ADMIN', 
//             name: 'สมชาย แอดมินส่วนกลาง' 
//         });
//     } 
    
//     // 2. Unit Admin (แอดมินประจำสำนักงาน)
//     if (username === 'office01' && password === '123456') {
//         return NextResponse.json({ 
//             success: true, 
//             role: 'UNIT_ADMIN', 
//             name: 'แอดมิน สำนักงานคดีอาญา' 
//         });
//     }

//     // 3. User ทั่วไป (สำหรับ Tab User)
//     if (username === '1234567890123' && password === '1234') {
//         return NextResponse.json({ 
//             success: true, 
//             role: 'USER', 
//             name: 'คุณสมพงษ์ ใจดี' 
//         });
//     }

//     // กรณีไม่พบข้อมูล
//     return NextResponse.json({ 
//         success: false, 
//         message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
//     }, { status: 401 });
// }