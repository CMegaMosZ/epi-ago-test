// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Building, User, LogOut, Menu, X } from 'lucide-react';
import React from 'react';

// โครงสร้างเมนูหลัก
const navItems = [
    {
        name: 'ค้นหาข้อมูลบุคลากร',
        href: '/auth/personal', // สมมติ Path สำหรับค้นหาบุคคล
        icon: User,
    },
    {
        name: 'ค้นหาข้อมูลสำนักงาน',
        href: '/auth/department', // สมมติ Path สำหรับค้นหาสำนักงาน (ตรงกับ page.tsx ที่คุณอัปโหลดมา)
        icon: Building,
    },
        {
        name: 'เปลี่ยนรหัสผ่าน',
        href: '/auth/changePassword', // สมมติ Path สำหรับค้นหาสำนักงาน (ตรงกับ page.tsx ที่คุณอัปโหลดมา)
        icon: Building,
    },
];

// โครงสร้างเมนูส่วนล่าง (เช่น ออกจากระบบ)
const bottomItems = [
    {
        name: 'ออกจากระบบ',
        href: '/logout', 
        icon: LogOut,
        className: 'text-red-500 hover:bg-red-50 hover:text-red-600',
    },
];

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
    const pathname = usePathname();

    const baseClass = "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 text-sm font-medium";
    const activeClass = "bg-blue-600 text-white shadow-md";
    const inactiveClass = "text-gray-600 hover:bg-gray-200";

    return (
        <>
            {/* Overlay สำหรับมือถือ เมื่อ Sidebar เปิดอยู่ */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar Container */}
            <div
                className={`fixed inset-y-0 left-0 z-30 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out 
                md:relative md:translate-x-0 md:flex-shrink-0 
                w-64 bg-white border-r border-gray-200 flex flex-col h-screen`}
            >
                {/* Logo / Title Area */}
                <div className="flex items-center justify-between p-4 h-16 border-b">
                    <h1 className="text-xl font-bold text-blue-700 flex items-center space-x-2">
                        <Menu className="w-6 h-6" />
                        <span>ระบบค้นหา</span>
                    </h1>
                    {/* ปุ่มปิดสำหรับมือถือ */}
                    <button
                        className="p-1 md:hidden text-gray-500 hover:text-gray-700"
                        onClick={toggleSidebar}
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" /> 
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
                                onClick={toggleSidebar} 
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Links (Logout) */}
                <div className="p-4 border-t border-gray-200">
                    {bottomItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            className={`${baseClass} ${inactiveClass} ${item.className || ''}`}
                            onClick={() => {
                                // TODO: เพิ่ม Logic การออกจากระบบจริงที่นี่
                                console.log('Logging out...');
                                toggleSidebar();
                            }}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}