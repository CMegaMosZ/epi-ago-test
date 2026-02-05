// /layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Search, Building, Building2, User, LogOut, Menu, X, 
    ShieldCheck, ChevronDown, CheckCircle, UserPen, History, PhoneCall, Lock, LayoutDashboard
} from 'lucide-react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'

// --- Configuration Data ---
const navItems = [
    {
        name: 'Dashboard',
        href: '/phonebook/superAdmin/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'ค้นหาบุคลากร',
        href: '/phonebook/superAdmin/personal',
        icon: User,
    },
    {
        name: 'ค้นหาสำนักงาน',
        href: '/phonebook/superAdmin/department',
        icon: Building,
    },
    {
        name: 'จัดการบุคลากร',
        href: '/phonebook/superAdmin/manageUser',
        icon: UserPen,
    },
    {
        name: 'จัดการสำนักงาน',
        href: '/phonebook/superAdmin/manageDepartment',
        icon: Building2 ,
    },
        {
        name: 'ประวัติแก้ไขสำนักงาน',
        href: '/phonebook/superAdmin/history',
        icon: History,
    },
    {
        name: 'เปลี่ยนรหัสผ่าน',
        href: '/phonebook/superAdmin/changePassword',
        icon: Lock,
    },
];

const bottomItems = [
    {
        name: 'ออกจากระบบ',
        href: '/',
        icon: LogOut,
        className: 'text-red-500 hover:bg-red-50 hover:text-red-600',
    },
];

// ------------------------------------------------------------------
// 1. Sidebar Component (ถูกรวมเข้ามาในไฟล์ layout.tsx)
// ------------------------------------------------------------------
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const pathname = usePathname();
    const router = useRouter(); 
    const baseClass = "flex items-center space-x-3 p-3 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClass = "bg-orange-600 text-white shadow-md hover:bg-orange-700";
    const inactiveClass = "text-gray-700 hover:bg-gray-200";
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault(); // ป้องกันการเปลี่ยนหน้าทันที
        
        Swal.fire({
            title: 'ยืนยันการออกจากระบบ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c', // orange-600
            cancelButtonColor: '#d1d5db',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true); // แสดงหน้า Loading ของ Layout
                
                // ล้างข้อมูล User
                localStorage.removeItem('user');
    
                // หน่วงเวลา 1.5 วินาทีเพื่อให้เห็น Animation Loading
                setTimeout(() => {
                    router.push('/'); // กลับไปหน้า Login
                }, 1000);
            }
        });
    };

    return (
        // ✅ 1.1 ปรับความกว้างตาม isSidebarOpen (w-64 เมื่อเปิด, w-20 เมื่อย่อ)
        <div className={`
            fixed top-0 left-0 h-screen z-40 bg-white shadow-xl 
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-20'} 
            hidden lg:block
        `}>
            {/* Sidebar Header (e-Phonebook / Logo) */}
            <div className="flex items-center justify-between h-16 p-4">
 <Link href="/phonebook/superAdmin/personal" className="flex items-center">
        {/* ใช้ flex และ items-center เพื่อให้ไอคอนและข้อความอยู่บรรทัดเดียวกัน */}
            <div className={`flex items-center space-x-2 text-orange-600 ${isSidebarOpen ? 'block' : 'hidden'}`}>
                <div className="relative w-10 h-10 shrink-0">
                        <Image 
                            src="/OAG_logo.png" // 👈 เปลี่ยนชื่อไฟล์ให้ตรงกับใน public
                            alt="Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <PhoneCall size={24} />
                <span className="text-lm font-bold">e-phonebook</span>
            </div>
        
        {/* แสดงเฉพาะไอคอนเมื่อ Sidebar ย่อ */}
            <div className={`${isSidebarOpen ? 'hidden' : 'block'} text-orange-600`}>
                                <div className="relative w-10 h-10 shrink-0">
                        <Image 
                            src="/OAG_logo.png" // 👈 เปลี่ยนชื่อไฟล์ให้ตรงกับใน public
                            alt="Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
            </div>
        </Link>
                {/* ปุ่มปิด (X) หรือเมนู (Menu) ในโหมดมือถือ (ยังคงซ่อนใน Desktop) */}
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 lg:hidden text-gray-500 hover:text-gray-900"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`${baseClass} ${
                            pathname === item.href ? activeClass : inactiveClass
                        }`}
                        title={item.name} // เพิ่ม title สำหรับแสดงชื่อเต็มเมื่อ hover ตอนย่อ
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {/* ✅ 1.4 ซ่อนข้อความเมื่อ Sidebar ย่อ */}
                        <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
                    </Link>
                ))}
            </nav>
            {/* Logout/Bottom Items - ปรับให้ซ่อนข้อความ */}
            <div className="absolute bottom-0 w-full p-4 border-t">
                {bottomItems.map((item) => (
                    <button // เปลี่ยนจาก Link เป็น button เพื่อใช้ onClick
                        key={item.name}
                        onClick={item.name === 'ออกจากระบบ' ? handleLogout : undefined}
                        className={`
                            flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                            ${item.className || 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'}
                        `}
                    >
                        <item.icon className="w-5 h-5 mr-3 shrink-0" />
                        {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
                            <span>{item.name}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// 2. Header Component (ถูกแก้ไข)
// ------------------------------------------------------------------
const Header = ({ toggleSidebar, isSidebarOpen }) => { // ✅ รับ isSidebarOpen มาเพื่อปรับไอคอน
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 flex-shrink-0 h-16 bg-white shadow-md border-b fixed">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                
                {/* 2.1 ปุ่มสำหรับเปิด-ปิด Sidebar / Menu Icon */}
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 text-gray-500 hover:text-gray-900 rounded-lg transition-colors duration-150"
                        // ✅ ใน Desktop (lg) ใช้ไอคอน Menu เสมอ แต่จะเปลี่ยนตำแหน่งเมื่อ Sidebar เปิด/ปิด
                        // ❌ (ยกเลิกการใช้ X) เปลี่ยนเป็นใช้ Menu icon ตลอด แต่ปรับแค่ตำแหน่ง (margin) แทน
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-lg font-semibold text-gray-800 hidden sm:block">
                        <Link href="/phonebook/superAdmin/personal">
                            สมุดโทรศัพท์ สำนักงานอัยการสูงสุด
                        </Link>
                    </div>
                </div>

                {/* ... (ส่วน Profile Dropdown - ไม่ได้แสดงเพราะความยาว) */}
                {/* ... (ยังคงเดิม) */}
            <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                    <User size={20} />
                </div>
            </div>
            </div>
        </header>
    );
};


// ------------------------------------------------------------------
// 3. Main Layout Component (ถูกแก้ไข)
// ------------------------------------------------------------------
export default function SearchLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            
            {/* Sidebar Router */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
            />

            {/* Content Area (Header + Main) */}
            {/* ✅ 3.1 ปรับ Margin-left ของ Content Area ใน Desktop ตามสถานะ Sidebar */}
            <div 
                className={`
                    flex-1 flex flex-col overflow-hidden 
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
                `}
            >
                
                {/* Header Router (ส่ง isSidebarOpen ลงไปเผื่อการปรับตำแหน่งในอนาคต) */}
                <Header 
                    toggleSidebar={toggleSidebar} 
                    isSidebarOpen={isSidebarOpen}
                />

                {/* Page Content (children: page.tsx) */}
                <main className="flex-1 overflow-y-auto bg-gray-100 p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
                
            </div>
        </div>
    );
}