'use client'

import { useState, useMemo, useEffect } from 'react';
import { 
    Search, User, CheckCircle, XCircle, Edit, Trash2, PlusCircle, Key, SortAsc, SortDesc,
    ChevronDown, Lock, Unlock, Phone, Mail, Building, ShieldCheck, Save
} from 'lucide-react';
import Link from 'next/link'
import Swal from 'sweetalert2';

// --- Type Definitions ---
interface AccountEntry {
    id: number;
    officeName: string;         // ชื่อหน่วยงานที่ดูแล
    initials: string;           // ชื่อย่อหน่วยงาน
    adminUsername: string;      // Username ผู้ดูแลหน่วยงาน
    adminName: string;          // ชื่อผู้ติดต่อ
    email: string;              // อีเมล
    phone: string;              // เบอร์ติดต่อ
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING'; // สถานะบัญชี
    lastLogin: string;          // วันที่เข้าระบบล่าสุด (ISO String)
}

// --- Mock Data ---
const mockAccountData: AccountEntry[] = [
    {
        id: 1,
        officeName: 'สำนักงานเลขาธิการ',
        initials: 'สลธ.',
        adminUsername: 'admin_slth',
        adminName: 'นายมานะ เลิศฤทธิ์',
        email: 'mana.l@ago.go.th',
        phone: '02-123-4567',
        status: 'ACTIVE',
        lastLogin: '2025-12-10T09:30:00Z',
    },
    {
        id: 2,
        officeName: 'สำนักบริหารกลาง',
        initials: 'สบก.',
        adminUsername: 'admin_sbk',
        adminName: 'น.ส.ดวงใจ งามยิ่ง',
        email: 'duangjai.n@ago.go.th',
        phone: '02-789-0123',
        status: 'INACTIVE',
        lastLogin: '2025-11-20T14:15:00Z',
    },
    {
        id: 3,
        officeName: 'กองการเงินและบัญชี',
        initials: 'กงบ.',
        adminUsername: 'admin_gongbor',
        adminName: 'นายศักดิ์สิทธิ์ มั่นคง',
        email: 'saksit.m@ago.go.th',
        phone: '02-456-7890',
        status: 'PENDING',
        lastLogin: '2025-12-11T13:00:00Z',
    },
        {
        id: 4,
        officeName: 'สำนักงานคดีศาลแขวง 1',
        initials: 'สงข.1',
        adminUsername: 'admin_kwaang',
        adminName: 'นายปฏิภาณ ฐานะดี',
        email: 'patiphan.t@ago.go.th',
        phone: '02-123-0005',
        status: 'ACTIVE',
        lastLogin: '2025-12-19T08:50:00Z',
    },
    {
        id: 5,
        officeName: 'กองการเงินและบัญชี',
        initials: 'สงข.1',
        adminUsername: 'admin_winbs',
        adminName: 'นายวิน แบล็คสมิธ',
        email: 'win.bsth@ago.go.th',
        phone: '02-4563-3130',
        status: 'ACTIVE',
        lastLogin: '2025-02-28T12:00:00Z',
    },
    {
        id: 6,
        officeName: 'สำนักงานคดีศาลสูงภาค 4',
        initials: 'สงส.4',
        adminUsername: 'admin_haha',
        adminName: 'นายฮารู ฮาราฟรึ่บ',
        email: 'haha.rrf@ago.go.th',
        phone: '044-218-800',
        status: 'ACTIVE',
        lastLogin: '2026-01-30T25:50:00Z',
    },
        {
        id: 7,
        officeName: 'สำนักงานการสอบสวน',
        initials: 'สกส.',
        adminUsername: 'admin_green',
        adminName: 'นายเขียว สวนแตง',
        email: 'green.tanggarden@ago.go.th',
        phone: '02-575-5111',
        status: 'ACTIVE',
        lastLogin: '2026-01-05T14:00:00Z',
    },
        {
        id: 8,
        officeName: 'สำนักงานคดีศาลสูงภาค 6',
        initials: 'สงส.6',
        adminUsername: 'admin_haha',
        adminName: 'นายฮารู ฮาราฟรึ่บ',
        email: 'haha.rrf@ago.go.th',
        phone: '044-218-800',
        status: 'ACTIVE',
        lastLogin: '2025-12-30T10:00:00Z',
    },
            {
        id: 9,
        officeName: 'สำนักงานคดีศาลสูงภาค 7',
        initials: 'สงส.6',
        adminUsername: 'admin_haha',
        adminName: 'นายฮารู ฮาราฟรึ่บ',
        email: 'haha.rrf@ago.go.th',
        phone: '044-218-800',
        status: 'ACTIVE',
        lastLogin: '2025-12-30T10:00:00Z',
    },
    {
        id: 10,
        officeName: 'สำนักงานอัยการจังหวัดลำปาง',
        initials: 'สอจ.ลำปาง',
        adminUsername: 'admin_lampang',
        adminName: 'นายศุภวิทย์ หนาวมาก',
        email: 'supawit.n@ago.go.th',
        phone: '064-267-762',
        status: 'ACTIVE',
        lastLogin: '2025-12-25T14:30:00Z',
    },
    {
        id: 11,
        officeName: 'สำนักงานอัยการจังหวัดลำพูน',
        initials: 'สอจ.ลำพูน',
        adminUsername: 'admin_amphoon',
        adminName: 'นายอำพูน ลำพล',
        email: 'amphoon.l@ago.go.th',
        phone: '065-560-920',
        status: 'INACTIVE',
        lastLogin: '2025-08-25T12:00:00Z',
    },
    // ... เพิ่มข้อมูลอื่น ๆ ตามต้องการ
];

const EditDepartmentModal = ({ office, onClose, onSave }: { office: AccountEntry, onClose: () => void, onSave: (data: AccountEntry) => void }) => {
    const [formData, setFormData] = useState({ ...office });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 animate__animated animate__fadeIn animate__faster">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate__animated animate__zoomIn animate__faster">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <Building className="mr-2 text-blue-600" size={20} /> แก้ไขข้อมูลหน่วยงาน
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหน่วยงาน (เต็ม)</label>
                            <input name="officeName" value={formData.officeName} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อย่อ</label>
                            <input name="initials" value={formData.initials} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                            <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="ACTIVE">ปกติ (Active)</option>
                                <option value="INACTIVE">ปิดใช้งาน (Inactive)</option>
                                <option value="PENDING">รอตรวจสอบ (Pending)</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 border-t pt-4 mt-2">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-3">ข้อมูลผู้ดูแล/ผู้ประสานงาน</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ประสานงาน</label>
                            <input name="adminName" value={formData.adminName} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมลติดต่อ</label>
                            <input name="email" value={formData.email} onChange={handleChange}
                                type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                            <input name="phone" value={formData.phone} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">ยกเลิก</button>
                    <button 
                        onClick={() => onSave(formData)}
                        className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center space-x-2 shadow-sm"
                    >
                        <Save size={18} />
                        <span>บันทึกการแก้ไข</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ManageDepartment = () => {
    const [sortConfig, setSortConfig] = useState<{ 
    key: keyof AccountEntry | null; 
    direction: 'asc' | 'desc' 
    }>({ key: 'officeName', direction: 'asc' });

    const handleSort = (key: keyof AccountEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE', 'PENDING'
    
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState<number | 'All'>(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);
    
    // --- Logic การกรองและค้นหา ---
    const filteredAccounts = useMemo(() => {
    // เริ่มจากสำเนาของข้อมูล (จะไม่ไปแก้ mockAccountData ต้นฉบับ)
    let items = [...mockAccountData];

    // 1) กรองตามสถานะ
    if (filterStatus !== 'ALL') {
        items = items.filter(item => item.status === filterStatus);
    }

    // 2) ค้นหา (search)
    if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        items = items.filter(account => {
            return (
                account.officeName.toLowerCase().includes(q) ||
                account.adminUsername.toLowerCase().includes(q) ||
                account.adminName.toLowerCase().includes(q)
            );
        });
    }
    // 3) เรียงตาม sortConfig (ถ้ามี)
    if (sortConfig.key) {
        const key = sortConfig.key;
        const direction = sortConfig.direction === 'asc' ? 1 : -1;

        items.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];

            // ถ้าเป็นวันที่ (lastLogin) ให้เปรียบเทียบเป็น timestamp
            if (key === 'lastLogin') {
                const aTime = Date.parse(String(aVal)) || 0;
                const bTime = Date.parse(String(bVal)) || 0;
                return (aTime - bTime) * direction;
            }

            // ถ้าเป็นสถานะ อาจอยากเรียงเป็นลำดับเฉพาะ -> แต่ที่นี่ treat as string
            // ใช้ localeCompare เพื่อรองรับภาษาไทย
            return String(aVal).localeCompare(String(bVal), 'th') * direction;
        });
    }

    return items;
}, [filterStatus, searchTerm, sortConfig]);

    // ✅ 2. เพิ่ม Logic สำหรับแบ่งหน้า (Pagination Logic)
    const { paginatedAccounts, totalPages } = useMemo(() => {
        const total = filteredAccounts.length;
        if (rowsPerPage === 'All') {
            return { paginatedAccounts: filteredAccounts, totalPages: 1 };
        }
        
        const lastIndex = currentPage * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const sliced = filteredAccounts.slice(firstIndex, lastIndex);
        const pages = Math.ceil(total / rowsPerPage);
        
        return { paginatedAccounts: sliced, totalPages: pages };
    }, [filteredAccounts, currentPage, rowsPerPage]);

    // --- Helper Functions สำหรับ UI ---
    
    const getStatusStyles = (status: AccountEntry['status']) => {
        switch (status) {
            case 'ACTIVE':
                return { text: 'ใช้งาน', className: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle };
            case 'INACTIVE':
                return { text: 'ไม่ใช้งาน', className: 'bg-red-100 text-red-800 border-red-300', icon: XCircle };
            case 'PENDING':
                return { text: 'รออนุมัติ', className: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Lock };
            default:
                return { text: status, className: 'bg-gray-100 text-gray-800 border-gray-300', icon: Lock };
        }
    };
    
    const formatDate = (isoString: string) => {
        // จัดรูปแบบวันที่ให้เป็นมิตรกับผู้ใช้
        const date = new Date(isoString);
        return date.toLocaleDateString('th-TH', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };


    // --- Placeholder Handlers (ต้องนำไปเชื่อมต่อ API จริง) ---
    const handleAddAccount = () => alert("เปิด Modal/Page สำหรับเพิ่มบัญชีใหม่");
    const handleEdit = (id: number) => alert(`แก้ไขบัญชี ID: ${id}`);
    const handleDelete = (id: number) => {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบบัญชี ID: ${id}?`)) {
            alert(`บัญชี ID: ${id} ถูกลบแล้ว (Mock)`);
            // โค้ดจริง: เรียก API สำหรับลบ และรีเฟรชข้อมูล
        }
    };
    const handleResetPassword = (id: number) => alert(`รีเซ็ตรหัสผ่านบัญชี ID: ${id}`);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingOffice, setEditingOffice] = useState<AccountEntry | null>(null);

// ฟังก์ชันเปิด Modal เมื่อกดปุ่มแก้ไข
const handleEditClick = (office: AccountEntry) => {
    setEditingOffice(office);
    setIsEditModalOpen(true);
};

// ฟังก์ชันบันทึกข้อมูลที่แก้ไข
const handleSaveEdit = (updatedData: AccountEntry) => {
    // ในที่นี้คือ Mock-up การบันทึก
    Swal.fire({
        icon: 'success',
        title: 'แก้ไขข้อมูลสำเร็จ',
        text: `อัปเดตข้อมูลหน่วยงาน ${updatedData.officeName} เรียบร้อยแล้ว`,
        confirmButtonColor: '#2563EB',
    });
    setIsEditModalOpen(false);
};

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                <ShieldCheck className="mr-3 text-red-600" size={28} />
                บริหารจัดการบัญชีหน่วยงาน
            </h1>

            {/* --- Control Bar: Search, Filter, Add --- */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-between items-center">
                
                {/* Search Input */}
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อหน่วยงาน, Username, หรือชื่อผู้ดูแล"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Status Dropdown */}
                <div className="relative w-full md:w-48">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">สถานะทั้งหมด</option>
                        <option value="ACTIVE">ใช้งาน</option>
                        <option value="INACTIVE">ไม่ใช้งาน</option>
                        <option value="PENDING">รออนุมัติ</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>

                {/* Add New Button */}
                <Link 
                        href="/phonebook/admin/manageDepartment/addDepartment" // ระบุ Path ของหน้าที่สร้างใหม่
                        className="bg-red-600 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <PlusCircle size={20} />
                        <span>เพิ่มสำนักงาน</span>
                </Link>
            </div>
            
            {/* --- Accounts Table --- */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full table-fixed divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('officeName')} className="px-6 py-3 text-left text-sm font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>สำนักงาน</span>
                                    {sortConfig.key === 'officeName' && (
                                        sortConfig.direction === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    )}
                                </div>
                            </th>
                            <th onClick={() => handleSort('adminName')} className="px-6 py-3 text-left text-sm font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>ผู้ดูแลระบบ</span>
                                    {sortConfig.key === 'adminName' && (
                                        sortConfig.direction === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร/อีเมล</th>
                            <th onClick={() => handleSort('status')} className="px-6 py-3 text-center text-sm font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center justify-center space-x-1">
                                    <span>สถานะ</span>
                                    {sortConfig.key === 'status' && (
                                        sortConfig.direction === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    )}
                                </div>
                            </th>
                            {/* <th onClick={() => handleSort('lastLogin')} className="px-6 py-3 text-left text-sm font-medium text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center space-x-1">
                                    <span>เข้าระบบล่าสุด</span>
                                    {sortConfig.key === 'lastLogin' && (
                                        sortConfig.direction === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    )}
                                </div>
                            </th> */}
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAccounts.length > 0 ? (
                            paginatedAccounts.map((item) => {
                                const statusInfo = getStatusStyles(item.status);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        {/* Office Name / Username */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-gray-900">{item.officeName} ({item.initials})</p>
                                            <p className="text-xs text-gray-500 font-mono">@{item.adminUsername}</p>
                                        </td>
                                        {/* Admin Name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            <div className="flex items-center">
                                                <User size={16} className="mr-2 text-gray-400"/>
                                                {item.adminName}
                                            </div>
                                        </td>
                                        {/* Contact */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center space-x-2">
                                                <Phone size={14} className="text-blue-500"/>
                                                <span className="text-gray-600">{item.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail size={14} className="text-yellow-500"/>
                                                <span className="text-gray-600 truncate">{item.email}</span>
                                            </div>
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.className}`}>
                                                <statusInfo.icon size={14} className="mr-1"/>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        {/* Last Login */}
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.lastLogin)}
                                        </td> */}
                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                <Link href="/phonebook/admin/manageDepartment/editDepartment"><button // เปลี่ยนจาก Link เป็น onClick
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50" 
                                                        title="แก้ไข">
                                                        <Edit size={18} />
                                                </button></Link>
                                                {/* <button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50" title="แก้ไข">
                                                    <Edit size={18} />
                                                </button> */}
                                                <button onClick={() => handleResetPassword(item.id)} className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-orange-50" title="รีเซ็ตรหัสผ่าน">
                                                    <Key size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50" title="ลบ">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    ไม่พบข้อมูลบัญชีหน่วยงานตามเงื่อนไขที่กำหนด
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* เลือกจำนวนรายการต่อหน้า */}
                <div className="flex items-center text-sm text-gray-600 font-medium">
                    <span>แสดง</span>
                    <select 
                        value={rowsPerPage}
                        onChange={(e) => {
                            const val = e.target.value;
                            setRowsPerPage(val === 'All' ? 'All' : parseInt(val));
                            setCurrentPage(1);
                        }}
                        className="mx-2 px-2 py-1 border rounded-md outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                        {[10, 20, 50, 100].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                        <option value="All">ทั้งหมด</option>
                    </select>
                    <span>รายการต่อหน้า</span>
                </div>

                {/* ปุ่มเปลี่ยนหน้า */}
                {rowsPerPage !== 'All' && (
                    <div className="flex items-center space-x-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronDown size={16} className="rotate-90" />
                        </button>
                        
                        <div className="flex space-x-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-orange-500 text-white shadow-sm' 
                                        : 'bg-white border text-gray-600 hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronDown size={16} className="-rotate-90" />
                        </button>
                    </div>
                )}

                <div className="text-xs text-gray-500 font-medium">
                    ทั้งหมด {filteredAccounts.length} รายการ
                </div>
            </div>

            {isEditModalOpen && editingOffice && (
                <EditDepartmentModal 
                    office={editingOffice} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveEdit}/>
            )}
        </div>
    );
};

export default ManageDepartment;