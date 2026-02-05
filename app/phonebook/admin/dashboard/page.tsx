'use client'

import React, { useMemo } from 'react';
import { 
    Users, ShieldAlert, FileText, CheckCircle, 
    TrendingUp, Clock, ArrowUpRight, ArrowDownRight , UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockUserData, mockOfficeData , mockLogs } from '@/data/mockData';

// --- Sub-component สำหรับ Summary Card ---
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => {
    // กำหนดสีตามเงื่อนไข (ตัวอย่าง: ถ้าค่ามากกว่า 0 ให้เป็นสีแดง)
    const valueColor = value > 0 && title === "ขาดการ Update จำนวน" 
        ? "text-red-600" : "text-gray-900";

    return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            {/* <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {trendValue}
            </div> */}
        </div>
        <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold mt-1 text-gray-600">{value}</p>
        </div>
    </div>
);
};

const getTagStyle = (type: string) => {
    switch (type) {
        case 'INSERT': return 'bg-green-100 text-green-700 border-green-200';
        case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
        case 'SECURITY': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const AdminDashboard = () => {
    const router = useRouter();

    // ✅ คำนวณจำนวนผู้ใช้งานทั้งหมด
    const totalUsers = mockUserData.length;

    const totalOffices = mockOfficeData.length;


    // ✅ คำนวณจำนวน Admin ที่หยุดนิ่ง (Inactive)
    const inactiveAdminCount = useMemo(() => {
        return mockUserData.filter(user => {
            // 1. เช็คว่าเป็น Admin หรือ Unit Admin
            const isAdminRole = user.role === 'ADMIN' || user.role === 'UNIT_ADMIN';
            
            // 2. เช็คสถานะ Inactive จากวันที่ (Logic เดียวกับหน้า manageUser)
            const lastActiveDate = new Date(user.lastActivity);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // ถือว่าเป็น Inactive ถ้า Status เป็น INACTIVE หรือไม่ได้ login เกิน 30 วัน
            return isAdminRole && (user.status === 'INACTIVE' || diffDays > 30);
        }).length;
    }, []);

    const handleViewLogs = () => {
        // สามารถเพิ่ม Logic ตรงนี้ได้ เช่น บันทึกว่า Admin คนนี้กดเข้ามาดู
        router.push('/phonebook/super-admin/activity-logs');
    };

    const recentActivities = useMemo(() => {
        return [...mockLogs] // คัดลอก Array ออกมาเพื่อไม่ให้กระทบค่าต้นฉบับ
            .sort((a, b) => {
                // เปลี่ยน String วันที่ให้เป็น Date Object เพื่อเปรียบเทียบ
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 5); // เลือกมาเฉพาะ 5 รายการล่าสุด
    }, []);
    
    return (
        <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800">ภาพรวมของระบบ e-phonebook</h1>
                {/* <p className="text-gray-500"> ผู้ดูแลระบบสูงสุด</p> */}
            </div>

            {/* ✅ ส่วนที่ 1: Summary Cards (KPIs) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
        title="จำนวนผู้ใช้งานทั้งหมด" 
        value={totalUsers.toLocaleString()} // แสดงจำนวน User จริง
        icon={Users} 
        // trend="up" 
        // trendValue={totalUsers} 
        color="bg-blue-600" 
    />
    <StatCard 
        title="Admin ขาดการ Update เกินกำหนด" 
        value={inactiveAdminCount} // แสดงจำนวน Admin ที่ Inactive จริง
        icon={ShieldAlert} 
        // trend="down" 
        // trendValue={inactiveAdminCount > 5 ? "ควรตรวจสอบ" : "ปกติ"} 
        // vColor={inactiveAdminCount > 0 ? "text-red-500" : "text-green-500"}
        color="bg-orange-500" 
    />
                <StatCard 
                    title="จำนวนหน่วยงาน" 
                    value={totalOffices.toLocaleString()} 
                    icon={FileText} 
                    // trend="up" 
                    // trendValue="คงที่" 
                    color="bg-purple-600" 
                />
                {/* <StatCard 
                    title="ความสมบูรณ์ข้อมูล" 
                    value="94.2%" 
                    icon={CheckCircle} 
                    // trend="up" 
                    // trendValue="+0.5%" 
                    color="bg-green-600" 
                /> */}
            </div>

            {/* 2. New Location: Quick Access Banner  */}
            <div className="mb-8">
                <Link href="/phonebook/admin/dashboard/request">
                    <div className="bg-white border-l-4 border-orange-500 p-5 rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <UserPlus size={28} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-800 text-lg">คำขอลงทะเบียนใหม่</h3>
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">555</span>
                                </div>
                                <p className="text-gray-500 text-sm">มีผู้ใช้งานขอสิทธิ์เข้าใช้งานระบบ จำนวน -ตัวเลข- ท่าน</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg font-bold group-hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                            <span>ข้อมูลผู้ใช้งาน</span>
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                </Link>
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
                            [ พื้นที่แสดงภาพรวมการใช้งาน ]
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
                    {recentActivities.map((log) => (
                        <div key={log.id} className="relative pl-6 pb-5 border-l-2 border-gray-100 last:border-0 last:pb-0">
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                                log.type === 'DELETE' ? 'bg-red-500' : 
                                log.type === 'INSERT' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-800">{log.admin}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTagStyle(log.type)}`}>
                                {log.action}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            ดำเนินการกับ: <span className="font-medium text-gray-700">{log.target}</span>
                        </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                        {log.date}
                    </span>
                </div>
            </div>
        ))}
    </div>
    <Link href="/phonebook/admin/dashboard/activity-logs" className="block w-full">
        <button 
            onClick={handleViewLogs}
            className="w-full mt-8 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
            ดูประวัติทั้งหมด
        </button>
    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;