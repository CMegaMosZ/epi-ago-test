'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Building, User, Mail, Phone, ChevronLeft, 
    Save, Hash, Info, ShieldCheck, Globe
} from 'lucide-react';
import Swal from 'sweetalert2';

const AddDepartment = () => {
    const router = useRouter();
    
    // 1. State สำหรับข้อมูลหน่วยงาน
    const [formData, setFormData] = useState({
        officeName: '',
        initials: '',
        adminUsername: '',
        adminName: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. ฟังก์ชันบันทึก
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        // จำลองการเชื่อมต่อ API
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'เพิ่มหน่วยงานสำเร็จ',
                text: `หน่วยงาน ${formData.officeName} ถูกเพิ่มเข้าสู่ระบบแล้ว`,
                confirmButtonColor: '#2563EB',
            }).then(() => {
                router.back();
            });
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">เพิ่มข้อมูลหน่วยงาน/สำนักงาน</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-8">
                    
                    {/* ส่วนที่ 1: ข้อมูลหน่วยงาน */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center border-b pb-2">
                            <Building className="mr-2" size={20} /> ข้อมูลพื้นฐานหน่วยงาน
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหน่วยงาน (เต็ม)</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="officeName" value={formData.officeName} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น สำนักงานอัยการพิเศษฝ่ายคดีอาญา 1" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อย่อหน่วยงาน</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="initials" value={formData.initials} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น สอฝ.คดีอาญา 1" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะการใช้งาน</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="ACTIVE">เปิดใช้งาน (Active)</option>
                                    <option value="INACTIVE">ปิดใช้งาน (Inactive)</option>
                                    <option value="PENDING">รอตรวจสอบ (Pending)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* ส่วนที่ 2: ข้อมูลผู้ดูแล (Admin หน่วยงาน) */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center border-b pb-2">
                            <ShieldCheck className="mr-2" size={20} /> ข้อมูลผู้ดูแลหน่วยงาน
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username (สำหรับ Admin หน่วยงาน)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="adminUsername" value={formData.adminUsername} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น admin_branch1" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ติดต่อประสานงาน</label>
                                <input required name="adminName" value={formData.adminName} onChange={handleChange}
                                    type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ชื่อ-นามสกุล" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมลติดต่อ</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="email" value={formData.email} onChange={handleChange}
                                        type="email" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="example@agency.go.th" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input required name="phone" value={formData.phone} onChange={handleChange}
                                        type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="02-XXX-XXXX" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Buttons */}
                <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3 border-t">
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        type="submit"
                        className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                        <Save size={18} />
                        <span>บันทึกหน่วยงาน</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDepartment;