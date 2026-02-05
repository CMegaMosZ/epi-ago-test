'use client'

import { useState, useMemo } from 'react';
import { 
    Search, User, CheckCircle, XCircle, Edit, Trash2, PlusCircle, 
    ChevronDown, Lock, Unlock, Phone, Mail, Building, ShieldCheck, Save
} from 'lucide-react';
import Link from 'next/link'

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
        lastLogin: '2025-12-119T08:50:00Z',
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE', 'PENDING'
    
    // --- Logic การกรองและค้นหา ---
    const filteredAccounts = useMemo(() => {
        let items = [...mockAccountData];

        // A. กรองตามสถานะ
        if (filterStatus !== 'ALL') {
            items = items.filter(item => item.status === filterStatus);
        }

        // B. ค้นหา (Search): ค้นหาในชื่อหน่วยงาน, ชื่อย่อ, Username, และชื่อผู้ดูแล
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            items = items.filter(item => 
                item.officeName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.initials.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.adminUsername.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.adminName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        return items;
    }, [filterStatus, searchTerm]);

    // --- Helper Functions สำหรับ UI ---
    
    const getStatusStyles = (status: AccountEntry['status']) => {
        switch (status) {
            case 'ACTIVE':
                return { text: 'ใช้งาน', className: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle };
            case 'INACTIVE':
                return { text: 'ยกเลิก', className: 'bg-red-100 text-red-800 border-red-300', icon: XCircle };
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
                        href="/phonebook/superAdmin/manageDepartment/addDepartment" // ระบุ Path ของหน้าที่สร้างใหม่
                        className="bg-red-600 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <PlusCircle size={20} />
                        <span>เพิ่มสำนักงาน</span>
                </Link>
            </div>
            
            {/* --- Accounts Table --- */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">สำนักงาน</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ผู้ดูแล/ผู้ติดต่อ</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">เบอร์โทร/อีเมล</th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">เข้าสู่ระบบล่าสุด</th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAccounts.length > 0 ? (
                            filteredAccounts.map((item) => {
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.lastLogin)}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => handleEditClick(item)} // เปลี่ยนจาก Link เป็น onClick
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50" 
                                                        title="แก้ไข">
                                                        <Edit size={18} />
                                                </button>
                                                {/* <button onClick={() => handleEdit(item.id)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50" title="แก้ไข">
                                                    <Edit size={18} />
                                                </button> */}
                                                {/* <button onClick={() => handleResetPassword(item.id)} className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-orange-50" title="รีเซ็ตรหัสผ่าน">
                                                    <Unlock size={18} />
                                                </button> */}
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