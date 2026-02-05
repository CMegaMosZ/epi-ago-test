// src/components/Header.tsx
'use client';

import { Menu, User, ShieldCheck, ChevronDown, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const pathname = usePathname();

    // กำหนดชื่อ Title ตาม Path
    const getPageTitle = (path: string) => {
        if (path.includes('/phonebook/auth/personal')) return 'ค้นหาข้อมูลบุคลากร';
        if (path.includes('/phonebook/auth/department')) return 'ค้นหาข้อมูลสำนักงาน';
        if (path.includes('/phonebook/auth/changePassword')) return 'เปลี่ยนรหัสผ่าน';
        return 'ค้นหาข้อมูลบุคลากร';
    };

    return (
        <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6 sticky top-0 z-10 w-full">
            
            {/* 1. Menu Button (Mobile Only) and Page Title */}
            <div className="flex items-center">
                <button
                    className="p-2 mr-4 text-gray-600 hover:text-gray-800 md:hidden"
                    onClick={toggleSidebar}
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                    {getPageTitle(pathname)}
                </h2>
            </div>
            

            {/* 2. User/Profile Section (Right side) */}
            <div className="flex items-center space-x-4">
                
                {/* Security Status (Mock) */}
                <div className="hidden lg:flex items-center space-x-1 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-medium">Secure Access</span>
                </div>

                {/* User Dropdown (Mock) */}
                <div className="relative group">
                    <button 
                        className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-100"
                        aria-expanded="false" 
                        aria-controls="user-menu-dropdown"
                    >
                        <User className="w-6 h-6 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                            ชื่อผู้ใช้งาน
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    <div 
                        id="user-menu-dropdown"
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 origin-top-right"
                    >
                        <Link 
                            href="/profile" 
                            className="flex items-center space-x-2 p-3 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                        >
                            <User className="w-4 h-4" />
                            <span>โปรไฟล์</span>
                        </Link>
                        <Link 
                            href="/logout"
                            className="flex items-center space-x-2 p-3 text-sm text-red-500 hover:bg-red-50 w-full text-left rounded-b-lg"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>ออกจากระบบ</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}