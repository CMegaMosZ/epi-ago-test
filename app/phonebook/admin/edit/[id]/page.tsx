'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    User, Mail, Building, Briefcase, 
    ChevronLeft, Save, Shield, UserCircle, Key, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';

const EditUserPage = () => {
    const router = useRouter();
    const params = useParams(); // รับ ID จาก URL เช่น /users/edit/101
    const userId = params.id;

    // 1. State สำหรับฟอร์ม (จำลองว่าดึงข้อมูลมาแล้ว)
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        office: '',
        position: '',
        email: '',
        phone: '',
        role: 'USER',
        status: 'ACTIVE'
    });

    // 2. useEffect สำหรับดึงข้อมูลเดิมจาก API/Mock Data
    useEffect(() => {
        // ในสถานการณ์จริง คุณจะ fetch(api/users/${userId})
        // นี่คือการจำลองข้อมูลเดิม (Mock Initial Data)
        setFormData({
            fullName: 'นายประเสริฐ สุขสวัสดิ์',
            username: 'prasert_s',
            office: 'สำนักงานเลขาธิการ',
            position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
            email: 'prasert.s@agency.go.th',
            phone: '02-142-1705',
            role: 'ADMIN',
            status: 'ACTIVE'
        });
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. ฟังก์ชันบันทึกการแก้ไข
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        Swal.fire({
            title: 'ยืนยันการแก้ไข?',
            text: "คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลใช่หรือไม่",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563EB',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'ยืนยันบันทึก',
            cancelButtonText: 'ยกเลิก',
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
        }).then(async (result) => {
            if (result.isConfirmed) {
                // จำลองการส่งข้อมูลไป API
                Swal.fire({ title: 'กำลังอัปเดต...', didOpen: () => Swal.showLoading() });
                
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'อัปเดตสำเร็จ',
                        text: 'ข้อมูลผู้ใช้งานได้รับการแก้ไขแล้ว',
                        confirmButtonColor: '#2563EB',
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
                    }).then(() => router.back());
                }, 1000);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">แก้ไขข้อมูลบัญชีผู้ใช้</h1>
                        <p className="text-sm text-gray-500">ID ผู้ใช้งาน: {userId}</p>
                    </div>
                </div>
                
                {/* ปุ่มรีเซ็ตรหัสผ่านแยกต่างหาก (Security Best Practice) */}
                <button 
                    type="button"
                    onClick={() => Swal.fire('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลเรียบร้อยแล้ว')}
                    className="flex items-center space-x-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200"
                >
                    <RefreshCw size={16} />
                    <span>รีเซ็ตรหัสผ่าน</span>
                </button>
            </div>

            <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-8">
                    
                    {/* ข้อมูลทั่วไป */}
                    <section>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                            <UserCircle className="mr-2" size={20} /> ข้อมูลส่วนตัวและตำแหน่ง
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider">บัญชีนี้ผูกกับ Username: <span className="text-gray-900">{formData.username}</span></div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                                <input required name="fullName" value={formData.fullName} onChange={handleChange}
                                    type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">สถานะบัญชี</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                    <option value="ACTIVE">ปกติ (Active)</option>
                                    <option value="INACTIVE">ปิดใช้งาน (Inactive)</option>
                                    <option value="BLOCKED">ระงับการใช้งาน (Blocked)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">สังกัด/หน่วยงาน</label>
                                <input required name="office" value={formData.office} onChange={handleChange}
                                    type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                                <input required name="position" value={formData.position} onChange={handleChange}
                                    type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">บทบาทสิทธิ์การใช้งาน</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <select name="role" value={formData.role} onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white font-medium text-blue-700">
                                        <option value="USER">User (ผู้ใช้งานทั่วไป)</option>
                                        <option value="UNIT_ADMIN">Unit Admin (ดูแลเฉพาะหน่วยงาน)</option>
                                        <option value="ADMIN">Super Admin (ดูแลทั้งระบบ)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                                <input name="phone" value={formData.phone} onChange={handleChange}
                                    type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-3 border-t">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                        ยกเลิก
                    </button>
                    <button type="submit" className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm">
                        <Save size={18} />
                        <span>บันทึกการเปลี่ยนแปลง</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserPage;