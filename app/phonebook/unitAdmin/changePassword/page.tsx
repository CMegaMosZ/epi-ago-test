'use client'

import { useState } from 'react';
import Link from 'next/link';
import { 
    Lock, CheckCircle, UserCircle, ArrowLeft
} from 'lucide-react';
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2'
import 'animate.css';

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        email: '' 
    });
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);

    const isPasswordMatch = formData.newPassword === formData.confirmNewPassword && formData.confirmNewPassword !== '';
    const isPasswordValid = formData.newPassword.length >= 8 && /[a-zA-Z]/.test(formData.newPassword) && /[0-9]/.test(formData.newPassword);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ... (Logic Validation คงเดิมตามที่คุณเขียนไว้) ...
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword || !formData.email) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                confirmButtonColor: '#3b82f6',
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
            });
            return;
        }
        setIsPasswordChanged(true);
    };

    return (
        // ✅ เปลี่ยนพื้นหลังเป็นเทาอ่อนโทนเดียวกับหน้าจัดการบุคลากร
        <div className="min-h-screen bg-gray-50">
            <main className="p-4 sm:p-6 lg:p-8">
                        
                        {/* ✅ Header Section ขยับขึ้นและจัดระยะห่างใหม่ */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                                <Lock size={28} className="mr-3 text-orange-600" />
                                กำหนดรหัสผ่านใหม่
                            </h1>
                            <p className="text-gray-500 text-sm pl-10">
                                เพื่อความปลอดภัย โปรดกำหนดรหัสผ่านที่คาดเดาได้ยาก
                            </p>
                        </div>
                        
                        {/* ✅ Card Container ปรับให้ขอบมนและสะอาดตาขึ้น */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <form onSubmit={handleSubmit} className="divide-y divide-gray-50">
                                
                                {/* Section 1: รหัสผ่านปัจจุบัน */}
                                <div className="p-8 space-y-3">
                                    <label className="block text-[15px] font-semibold text-gray-700">
                                        * ระบุรหัสผ่านปัจจุบัน
                                    </label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        placeholder="ระบุรหัสผ่านปัจจุบัน"
                                        value={formData.oldPassword}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                {/* Section 2: รหัสผ่านใหม่ */}
                                <div className="p-8 space-y-4">
                                    <label className="block text-[15px] font-semibold text-gray-700 leading-relaxed">
                                        * กำหนดรหัสผ่านใหม่ 
                                        <span className="block font-normal text-gray-400 text-xs mt-1">
                                            รหัสผ่านต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร ประกอบด้วย ตัวอักษรภาษาอังกฤษ และ ตัวเลข
                                        </span>
                                    </label>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="password"
                                            name="newPassword"
                                            placeholder="aabbcc"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                        />
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="confirmNewPassword"
                                                placeholder="ยืนยันรหัสผ่านใหม่"
                                                value={formData.confirmNewPassword}
                                                onChange={handleChange}
                                                className={`w-full p-3 bg-gray-50 border rounded-xl focus:ring-2 outline-none transition-all ${
                                                    formData.confirmNewPassword && !isPasswordMatch 
                                                    ? 'border-red-400 focus:ring-red-200' 
                                                    : 'border-gray-200 focus:ring-blue-500 focus:bg-white'
                                                }`}
                                            />
                                            {formData.confirmNewPassword && !isPasswordMatch && (
                                                <p className="absolute -bottom-5 left-1 text-[11px] text-red-500 animate-pulse">รหัสผ่านไม่ตรงกัน</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: อีเมล */}
                                <div className="p-8 space-y-3">
                                    <label className="block text-[15px] font-semibold text-gray-700">
                                        * ระบุอีเมลเพื่อใช้ในการกู้คืนบัญชี
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="example@oag.go.th"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>

                                {/* ✅ Footer Button ปรับให้เด่นชัดขึ้น */}
                                <div className="p-6 bg-gray-50/50 flex justify-end items-center px-8">
                                    <button 
                                        type="submit" 
                                        className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                    >
                                        ยืนยันการเปลี่ยนรหัสผ่าน
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Back Link */}
                        <div className="mt-8">
                            <Link href="/phonebook/auth/personal" className="inline-flex items-center text-gray-400 hover:text-red-500 transition-colors font-medium">
                                <ArrowLeft size={18} className="mr-2" />
                                กลับหน้าหลัก
                            </Link>
                        </div>
            </main>
        </div>
    );
}