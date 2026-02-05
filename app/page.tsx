'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fingerprint, Lock, User, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import Swal from 'sweetalert2'
import Image from 'next/image';


export default function LoginPage() {
    const router = useRouter(); 
    const [activeTab, setActiveTab] = useState<'USER' | 'ADMIN'>('USER'); 
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isForgetPasswordOpen, setIsForgetPasswordOpen] = useState(false);
    // --- STATES ---
    const [idCard, setIdCard] = useState('')
    const [passwordValue, setPasswordValue] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const isPasswordActive = isPasswordFocused || passwordValue.length > 0;
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isIdFocused, setIsIdFocused] = useState(false) 
    const [idError, setIdError] = useState('') 
    const isIdActive = isIdFocused || idCard.length > 0
    const isIdError = idError.length > 0; 

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- 1. เพิ่มการตรวจสอบเงื่อนไขการกรอกข้อมูล (Validation) ---
    if (activeTab === 'USER') {
        if (!idCard || !passwordValue) {
            Swal.fire({
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกเลขบัตรประชาชนและรหัสผ่าน',
                icon: 'warning',
                confirmButtonColor: '#2563eb' // สีน้ำเงินตาม Theme User
            });
            return; // หยุดการทำงาน ไม่ให้ส่งไป API
        }
    } else {
        if (!adminUsername || !adminPassword) {
            Swal.fire({
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน',
                icon: 'warning',
                confirmButtonColor: '#ea580c' // สีส้มตาม Theme Admin
            });
            return; // หยุดการทำงาน
        }
    }

    // --- 2. ถ้าผ่านเงื่อนไขด้านบนแล้ว ค่อยเริ่มการ Loading และเรียก API ---
    setIsLoading(true);
    console.log("กำลังส่งข้อมูลไปยัง API...");

    const payload = {
        username: activeTab === 'USER' ? idCard : adminUsername,
        password: activeTab === 'USER' ? passwordValue : adminPassword,
        role: activeTab === 'USER' ? 'USER' : 'ADMIN'
    };

try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        setTimeout(() => {
            if (data.success) {
                // ✅ 1. เก็บ deptId แยกไว้เพื่อให้หน้า Table ดึงง่ายๆ
                if (data.deptId) {
                    localStorage.setItem('deptId', data.deptId.toString());
                }

                // ✅ 2. เก็บข้อมูล User ทั้งหมด
                localStorage.setItem('user', JSON.stringify({
                    fullname: data.name,
                    role: data.role,
                    officeInfo_id: data.officeInfo_id,
                    deptId: data.deptId
                }));
                
                Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ',
                    text: `ยินดีต้อนรับคุณ ${data.name}`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // ✅ 3. Redirect ตาม Role
                    if (data.role === 'ADMIN') {
                        router.push('/phonebook/admin/dashboard');
                    } else if (data.role === 'UNIT_ADMIN') {
                        router.push('/phonebook/unitAdmin/officeInfo');
                    } else {
                        router.push('/phonebook/auth/personal');
                    }
                });
            } else {
                setIsLoading(false);
                Swal.fire({ icon: 'error', title: 'เข้าสู่ระบบไม่สำเร็จ', text: data.message });
            }
        }, 1200);

    } catch (error) {
        setIsLoading(false);
        Swal.fire({ icon: 'error', title: 'Error', text: 'เชื่อมต่อฐานข้อมูลไม่ได้' });
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 bg-[url('/login_background.jpg')] bg-cover bg-center bg-fixed">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate__animated animate__fadeIn">
                
                {/* --- HEADER --- */}
                <div className="bg-[#ed6f00] p-6 text-white text-center">
                    <div className="relative w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-100 text-orange-600 overflow-hidden">
                            <Image 
                                src="/OAG_logo.png" 
                                alt="Logo"
                                fill
                                className="object-contain animate__animated animate__pulse animate__infinite p-2"
                                priority
                            />
                    </div>
                <h1 className="text-2xl font-bold">OAG e-Phonebook</h1>
                <p className="text-md opacity-90 mt-1">ระบบสมุดโทรศัพท์ สำนักงานอัยการสูงสุด</p>
                </div>

                {/* --- TAB SELECTOR WITH SLIDE EFFECT --- */}
<div className="relative flex p-1 bg-gray-100 mx-8 rounded-xl mt-6 mb-2 h-11">
    {/* Sliding Background */}
    <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${
            activeTab === 'USER' ? 'left-1' : 'left-[50%]'
        }`}
    />

    {/* Tab Buttons */}
    <button onClick={() => setActiveTab('USER')}
        className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-300 ${activeTab === 'USER' ? 'text-blue-600' : 'text-gray-500'}`}>
        USER
    </button>
    <button onClick={() => setActiveTab('ADMIN')}
        className={`relative z-10 flex-1 py-2 text-sm font-bold transition-colors duration-300 ${activeTab === 'ADMIN' ? 'text-orange-600' : 'text-gray-500'}`}>
        ADMIN
    </button>
</div>

{/* --- FORM SLIDER CONTAINER (ปรับความสูงให้เท่ากัน) --- */}
    <div className="relative overflow-hidden min-h-[300px]"> {/* กำหนด min-h เพื่อให้ขนาดไม่กระตุกเวลาสลับ */}
        <form onSubmit={handleLogin}>
    <div 
        className="transition-transform duration-500 ease-in-out flex w-[200%]"
        style={{ transform: activeTab === 'USER' ? 'translateX(0%)' : 'translateX(-50%)' }}
    >
        {/* --- ฝั่ง USER (ครึ่งซ้าย) --- */}
        <div className="w-1/2 p-8 pt-4 space-y-6 flex flex-col justify-between">
            <div className="space-y-8">
                {/* Input 1: ID Card */}
                <div className="relative">
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#0f3fa6] transition-colors pb-1">
                        <input type="text" placeholder="หมายเลขบัตรประชาชน" value={idCard}
                            onChange={(e) => setIdCard(e.target.value.replace(/\D/g, '').slice(0, 13))}
                            className="w-full outline-none bg-transparent text-gray-700" maxLength={13} />
                    </div>
                    <div className="text-right text-[10px] text-gray-400 mt-1">{idCard.length} / 13</div>
                </div>

                {/* Input 2: Password */}
                <div className="relative">
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#0f3fa6] transition-colors pb-1">
                        <input type={showPassword ? "text" : "password"} placeholder="รหัสผ่าน" value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="w-full outline-none bg-transparent text-gray-700 pr-10" />
                        {passwordValue.length > 0 && (
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 text-gray-400 hover:text-[#0f3fa6]">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        )}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 leading-tight">
                        <p className="text-[13px] py-1 text-gray-800 font-medium">
                            *รหัสผ่านเริ่มต้น คือ วันเดือนปีเกิด
                        </p>
                        <p className="text-[12px] py-1 text-gray-800">
                            (ตัวอย่าง : 1 มกราคม 2540 รหัสผ่านคือ 01012540)
                        </p>
                    </div>
                </div>
            </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                >
                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
        </div>

        {/* --- ฝั่ง ADMIN (ครึ่งขวา) --- */}
        <div className="w-1/2 p-8 pt-4 space-y-6 flex flex-col justify-between border-l border-gray-50">
            <div className="space-y-8">
                {/* Input 1: Admin Username */}
                <div className="relative">
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-orange-500 transition-colors pb-1">
                        <input type="text" placeholder="๊Username" value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full outline-none bg-transparent text-gray-700" />
                    </div>
                    {/* เว้นพื้นที่ว่างไว้เพื่อให้ความสูงเท่ากับฝั่ง User ที่มีตัวนับ */}
                    <div className="h-4 mt-1"></div> 
                </div>

                {/* Input 2: Admin Password */}
                <div className="relative">
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-orange-500 transition-colors pb-1">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full outline-none bg-transparent text-gray-700 pr-10" />
                        {adminPassword.length > 0 && (
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 text-gray-400 hover:text-orange-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        )}
                    </div>
                    {/* เว้นพื้นที่ว่างไว้เพื่อให้ความสูงเท่ากับฝั่ง User ที่มีข้อความรหัสผ่านเริ่มต้น */}
                    <div className="mt-2 text-[10px] text-transparent leading-tight select-none">
                        Space Holder
                    </div>
                </div>
            </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
                >
                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
        </div>
    </div>
    </form>
    
    {/* --- FOOTER SECTION (ย้ายมาอยู่นอก Slider เพื่อให้อยู่คงที่และระดับเดียวกัน) --- */}
<div className="px-8 pb-8">
    <div className="flex items-center justify-between mb-6">
        {/* ฝั่งซ้าย: ลงทะเบียน (แสดงเฉพาะ USER) */}
        <div className="flex-1">
                <p className="text-sm text-gray-600 animate__animated animate__fadeIn">
                    <Link href="/register" className="text-blue-600 font-bold hover:underline">
                        ลงทะเบียน
                    </Link>
                </p>
        </div>

        {/* ฝั่งขวา: ลืมรหัสผ่าน (แสดงทั้งคู่) */}
        <div className="flex-1 text-right">
            <button 
                type="button" 
                onClick={() => setIsForgetPasswordOpen(true)}
                className={`text-sm font-medium transition-colors ${
                    activeTab === 'USER' ? 'text-red-500 hover:text-orange-600' : 'text-red-500 hover:text-orange-600'
                }`}>
                ลืมรหัสผ่าน
            </button>
        </div>
    </div>

    {/* Privacy Notice: อยู่กึ่งกลางด้านล่างสุดเสมอ */}
    <div className="flex justify-center border-t border-gray-100 pt-4">
        <Link 
            href="/data_privacynotice.pdf" 
            className="text-[13px] text-gray-600 hover:text-gray-600 transition-colors flex items-center uppercase tracking-widest font-semibold"
        >
            <ShieldAlert size={12} className="mr-1.5" />
            Privacy Notice
        </Link>
    </div>
</div>
</div>
        </div>
            
            
            {/* Modal ลืมรหัสผ่าน */}
                        {/* ✅ Forget Password Modal Component */}
            {isForgetPasswordOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">ลืมรหัสผ่าน</h3>
                            <p className="text-sm text-gray-500">(บุคลากรสำนักงานอัยการสูงสุด)</p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4">
                            <h4 className="font-medium text-gray-700">ขั้นตอน</h4>
                            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                                <li>ระบุหมายเลขบัตรประชาชน</li>
                                <li>กดปุ่ม `ลืมรหัสผ่าน` ระบบจะส่งข้อมูลไปให้ที่อีเมลที่ได้ลงทะเบียนไว้</li>
                            </ol>
                            
                            {/* Input Field (หมายเลขบัตรประชาชน) */}
                            <div className="relative pt-4 pb-2">
<label htmlFor="modal-idcard" className="block text-sm font-medium text-gray-700 mb-1">
            หมายเลขบัตรประชาชน
        </label>

        <input
            type="text"
            id="modal-idcard"
            // ใช้ State idCard และ Setter ที่มีอยู่แล้ว
            value={idCard}
            onChange={(e) => {
                // อนุญาตให้กรอกเฉพาะตัวเลข และจำกัดความยาว
                const value = e.target.value.replace(/\D/g, '').slice(0, 13);
                setIdCard(value);
            }}
            maxLength={13}
            placeholder="ระบุหมายเลขบัตรประชาชน 13 หลัก"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-blue-200 text-sm"/>
        </div>

                            {/* ตัวนับ 0 / 13 ด้านล่าง Input Field ของ Modal */}
<div className="text-right text-xs pr-1 mt-1 text-gray-400">
            {idCard.length} / 13
        </div>
                        </div>
                        {/* Modal Footer (Buttons) */}
                        <div className="p-5 flex justify-end space-x-3 bg-gray-50 border-t border-gray-200">
                            <button 
                                onClick={() => {
                                    setIsForgetPasswordOpen(false);
                                     // ปิด Modal หลังจากส่งข้อมูล
                                }}
                                className="px-4 py-2 text-sm font-medium rounded shadow-sm transition bg-gray-300 text-gray-700 hover:bg-gray-400"
                            >
                                ลืมรหัสผ่าน
                            </button>
                            <button 
                                onClick={() => setIsForgetPasswordOpen(false)}
                                className="px-4 py-2 text-sm font-medium rounded shadow-sm transition bg-red-500 text-white hover:bg-red-600"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}