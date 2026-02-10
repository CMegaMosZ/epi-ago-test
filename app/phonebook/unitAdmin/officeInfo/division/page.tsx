'use client'

import { useState } from 'react';
import { 
    Building2, Plus, Trash2, Save, ArrowLeft, 
    Info, Phone, Hash, Layers 
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface SubDepartment {
    id: number;
    name: string;
    initial: string;
    phone: string;
}

export default function ManageSubDepartments() {
    // 1. เริ่มต้นด้วย 1 กลุ่มงานเสมอ
    const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([
        { id: Date.now(), name: '', initial: '', phone: '' }
    ]);

    // ฟังก์ชันเพิ่มกลุ่มงานใหม่ (ปุ่มสีน้ำเงิน)
    const handleAddGroup = () => {
        const newNode = {
            id: Date.now(),
            name: '',
            initials: '',
            phone: ''
        };
        setSubDepartments([...subDepartments, newNode]);
    };

    // ฟังก์ชันลบกลุ่มงาน
    const handleRemoveGroup = (id: number) => {
        if (subDepartments.length > 1) {
            setSubDepartments(subDepartments.filter(item => item.id !== id));
        } else {
            Swal.fire('แจ้งเตือน', 'ต้องมีอย่างน้อย 1 กลุ่มงาน/ฝ่าย', 'warning');
        }
    };

    // ฟังก์ชันอัปเดตข้อมูลในแต่ละช่อง
    const handleInputChange = (id: number, field: keyof SubDepartment, value: string) => {
        setSubDepartments(subDepartments.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleSave = () => {
        console.log("Saving Data:", subDepartments);
        Swal.fire('บันทึกสำเร็จ', 'ข้อมูลกลุ่มงาน/ฝ่ายได้รับการอัปเดตแล้ว', 'success');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sarabun">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/phonebook/unitAdmin/officeInfo" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-all">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">ข้อมูลกลุ่มงาน/ฝ่าย</h1>
                            <p className="text-md text-gray-600 font-medium mt-1">
                                <Building2 size={14} className="inline mr-1" /> 
                                สังกัด: สำนักงานเทคโนโลยีสารสนเทศและการสื่อสาร
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description Box */}
                <div className="bg-orange-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-sm">
                    <div className="flex">
                        <Info className="text-orange-500 mr-3 shrink-0" size={20} />
                        <div>
                            <h2 className="text-sm text-orange-500 font-bold mb-1">คำอธิบาย :</h2>
                            <p className="text-xs text-orange-700 leading-relaxed">
                                - ระบุกลุ่มงาน/ฝ่าย ในสำนักงาน เพื่อใช้เป็นข้อมูลในขั้นตอนถัดไป </p> 
                            <p className="text-xs text-orange-700 leading-relaxed">
                                - กรณี<span className="underline">ไม่มี</span>กลุ่มงาน/ฝ่าย ไม่ต้องกรอกข้อมูล
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Form List */}
                <div className="space-y-4">
                    {subDepartments.map((dept, index) => (
                        <div key={dept.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative animate__animated animate__fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-bold text-gray-700 text-sm uppercase">รายละเอียดกลุ่มงาน</h3>
                                </div>
                                {subDepartments.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveGroup(dept.id)}
                                        className="text-red-400 hover:text-red-600 p-1 transition-colors"
                                        title="ลบกลุ่มงานนี้">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-6">
                                    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">ชื่อกลุ่มงาน/ฝ่าย (เต็ม)</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-2.5 text-gray-300" size={16} />
                                        <input 
                                            type="text" 
                                            value={dept.name}
                                            onChange={(e) => handleInputChange(dept.id, 'name', e.target.value)}
                                            placeholder="เช่น ฝ่ายบริหารงานทั่วไป"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Button (ปุ่มสีน้ำเงิน) */}
                <button 
                    onClick={handleAddGroup}
                    className="w-full mt-6 py-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-bold flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all group"
                >
                    <div className="bg-blue-600 text-white rounded-full p-1 mr-2 group-hover:scale-110 transition-transform shadow-md shadow-blue-200">
                        <Plus size={18} />
                    </div>
                    เพิ่มกลุ่มงาน/ฝ่ายใหม่
                </button>

                {/* Footer Actions */}
                <div className="mt-12 flex justify-end space-x-3">
                    <button className="px-8 py-2.5 text-gray-500 font-bold hover:bg-gray-200 rounded-xl transition-all">
                        ยกเลิก
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-8 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 flex items-center transition-all"
                    >
                        <Save size={18} className="mr-2" />
                        บันทึกข้อมูลทั้งหมด
                    </button>
                </div>
            </div>
        </div>
    );
}