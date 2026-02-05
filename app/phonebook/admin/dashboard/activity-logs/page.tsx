'use client'

import React, { useState } from 'react';
import { 
    Clock, Search, Calendar, Filter, 
    ArrowLeft, Download, User, Info 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockLogs } from '@/data/mockData';

// --- Mock Data สำหรับประวัติกิจกรรม ---
// const mockLogs = [
//     { id: 1, admin: 'สมชาย แอดมินส่วนกลาง', action: 'แก้ไขข้อมูลบุคลากร', target: 'นายวิชาญ ใจดี', date: '2024-05-20 14:30', type: 'UPDATE' },
//     { id: 2, admin: 'ผู้ดูแลระบบสูงสุด', action: 'เพิ่มบัญชีผู้ใช้ใหม่', target: 'นางสาวนภา สุขสวัสดิ์', date: '2024-05-20 11:15', type: 'INSERT' },
//     { id: 3, admin: 'แอดมินสำนักงานคดีอาญา', action: 'ลบข้อมูลบุคลากร', target: 'นายสมพงษ์ ใจดี', date: '2024-05-19 16:45', type: 'DELETE' },
//     { id: 4, admin: 'สมชาย แอดมินส่วนกลาง', action: 'เปลี่ยนรหัสผ่านแอดมิน', target: 'office01', date: '2024-05-19 09:20', type: 'SECURITY' },
//     { id: 5, admin: 'ผู้ดูแลระบบสูงสุด', action: 'ส่งออกรายงานประจำเดือน', target: 'ระบบรายงาน', date: '2024-05-18 13:00', type: 'EXPORT' },
// ];

const ActivityLogsPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    // ฟังก์ชันช่วยกำหนดสีตามประเภทกิจกรรม
    const getTagStyle = (type: string) => {
        switch (type) {
            case 'INSERT': return 'bg-green-100 text-green-700 border-green-200';
            case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
            case 'SECURITY': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <ArrowLeft size={16} className="mr-1" /> ย้อนกลับ
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Clock size={24} className="mr-2 text-blue-600" />
                        ประวัติกิจกรรมทั้งหมด
                    </h1>
                </div>

                <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                    <Download size={18} className="mr-2 text-green-600" />
                    ส่งออก CSV
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="ค้นหาชื่อแอดมิน หรือกิจกรรม..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Calendar size={18} className="mr-2" /> วันที่
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <Filter size={18} className="mr-2" /> ตัวกรอง
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="px-6 py-4 font-semibold">วัน-เวลา</th>
                                <th className="px-6 py-4 font-semibold">ผู้ดำเนินการ</th>
                                <th className="px-6 py-4 font-semibold">กิจกรรม</th>
                                <th className="px-6 py-4 font-semibold">เป้าหมาย</th>
                                <th className="px-6 py-4 font-semibold text-center">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xs font-bold">
                                                {log.admin.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{log.admin}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getTagStyle(log.type)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {log.target}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                            <Info size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <p className="text-xs text-gray-500">แสดง 5 จาก 124 รายการ</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border rounded text-xs disabled:opacity-50" disabled>ก่อนหน้า</button>
                        <button className="px-3 py-1 bg-white border rounded text-xs hover:bg-gray-50">ถัดไป</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogsPage;