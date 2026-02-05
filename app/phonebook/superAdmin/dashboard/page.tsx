'use client'

import React from 'react';
import { 
    Users, ShieldAlert, FileText, CheckCircle, 
    TrendingUp, Clock, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

// --- Sub-component สำหรับ Summary Card ---
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {trendValue}
            </div>
        </div>
        <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    </div>
);

const superAdminDashboard = () => {
    return (
        <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">ภาพรวมระบบ (Dashboard)</h1>
                <p className="text-gray-500">ยินดีต้อนรับกลับมา, ผู้ดูแลระบบสูงสุด</p>
            </div>

            {/* ✅ ส่วนที่ 1: Summary Cards (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="ผู้ใช้งานทั้งหมด" 
                    value="1,284" 
                    icon={Users} 
                    trend="up" 
                    trendValue="+12%" 
                    color="bg-blue-600" 
                />
                <StatCard 
                    title="หน่วยงานที่ขาดการ Update" 
                    value="12" 
                    icon={ShieldAlert} 
                    trend="down" 
                    trendValue="+2" 
                    color="bg-orange-500" 
                />
                <StatCard 
                    title="จำนวนหน่วยงาน" 
                    value="48" 
                    icon={FileText} 
                    trend="up" 
                    trendValue="คงที่" 
                    color="bg-purple-600" 
                />
                <StatCard 
                    title="ความสมบูรณ์ข้อมูล" 
                    value="94.2%" 
                    icon={CheckCircle} 
                    trend="up" 
                    trendValue="+0.5%" 
                    color="bg-green-600" 
                />
            </div>

            {/* ส่วนที่ 2: Content Grid (Charts & Activities) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* ฝั่งซ้าย: กราฟหรือตารางย่อ (ใช้พื้นที่ 2 ส่วน) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-gray-800 flex items-center">
                                <TrendingUp size={20} className="mr-2 text-blue-600" />
                                สถิติการอัปเดตข้อมูลรายเดือน
                            </h2>
                            <select className="text-sm border-none bg-gray-50 rounded-lg p-2 outline-none">
                                <option>ปี 2569</option>
                                <option>ปี 2568</option>
                            </select>
                        </div>
                        {/* Placeholder สำหรับ Chart (แนะนำใช้ Recharts หรือ Chart.js) */}
                        <div className="h-[300px] w-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed">
                            [ พื้นที่แสดงกราฟสถิติการใช้งาน ]
                        </div>
                    </div>
                </div>

                {/* ฝั่งขวา: รายการกิจกรรมล่าสุด (Recent Activities) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-6 flex items-center">
                        <Clock size={20} className="mr-2 text-blue-600" />
                        กิจกรรมล่าสุด
                    </h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-start space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">แอดมินสำนักงานคดีอาญา</p>
                                    <p className="text-xs text-gray-500">อัปเดตข้อมูลบุคลากรใหม่ 5 รายชื่อ</p>
                                    <p className="text-[10px] text-gray-400 mt-1">10 นาทีที่แล้ว</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                        ดูประวัติทั้งหมด
                    </button>
                </div>

            </div>
        </div>
    );
};

export default superAdminDashboard;