'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    User, Mail, Phone, Building, Briefcase, 
    ChevronLeft, Save, Shield, UserCircle, Key
} from 'lucide-react';
import Swal from 'sweetalert2';

const AddUserPage = () => {
    const router = useRouter();
    
    // 1. State สำหรับเก็บข้อมูลฟอร์ม
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        office: '',
        position: '',
        email: '',
        phone: '',
        role: 'USER' as 'USER' | 'ADMIN' | 'UNIT_ADMIN',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. ฟังก์ชันบันทึกข้อมูล
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ตรวจสอบรหัสผ่านเบื้องต้น
        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'รหัสผ่านไม่ตรงกัน',
                text: 'กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง',
                confirmButtonColor: '#EF4444',
            });
            return;
        }

        // จำลองการบันทึกข้อมูล
        Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'บัญชีผู้ใช้งานถูกสร้างเรียบร้อยแล้ว',
                confirmButtonColor: '#2563EB',
            }).then(() => {
                router.back(); // กลับไปยังหน้าจัดการผู้ใช้
            });
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">เพิ่มบัญชีผู้ใช้งานใหม่</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8 space-y-8">
                    
                    {/* ส่วนที่ 1: ข้อมูลพื้นฐาน */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                            <UserCircle className="mr-2" size={20} /> ข้อมูลส่วนตัวและตำแหน่ง
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="fullName" value={formData.fullName} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น นายสมชาย ใจดี" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมลหน่วยงาน</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="email" value={formData.email} onChange={handleChange}
                                        type="email" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="example@agency.go.th" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">สังกัด/หน่วยงาน</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="office" value={formData.office} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุสำนักงาน" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="position" value={formData.position} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ระบุตำแหน่ง" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr />

                    {/* ส่วนที่ 2: ข้อมูลการเข้าระบบ */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                            <Key className="mr-2" size={20} /> ข้อมูลบัญชีผู้ใช้
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input required name="username" value={formData.username} onChange={handleChange}
                                    type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ภาษาอังกฤษเท่านั้น" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">บทบาทผู้ใช้งาน</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select name="role" value={formData.role} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white">
                                        <option value="USER">User (ผู้ใช้งานทั่วไป)</option>
                                        <option value="UNIT_ADMIN">Unit Admin (ดูแลเฉพาะหน่วยงาน)</option>
                                        <option value="ADMIN">Super Admin (ดูแลทั้งระบบ)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
                                <input required name="password" value={formData.password} onChange={handleChange}
                                    type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="อย่างน้อย 8 ตัวอักษร" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
                                <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                    type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="กรอกรหัสผ่านอีกครั้ง" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Buttons */}
                <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3">
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        type="submit"
                        className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Save size={18} />
                        <span>สร้างบัญชีผู้ใช้งาน</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUserPage;