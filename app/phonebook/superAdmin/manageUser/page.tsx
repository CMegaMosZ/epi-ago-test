'use client'

import { useState, useMemo } from 'react';
import { 
    Search, User, CheckCircle, XCircle, Edit, Trash2, PlusCircle, 
    ChevronDown, Lock, Unlock, Phone, Mail, Shield, Building, Save, Key, RefreshCw
} from 'lucide-react';
import Link from 'next/link'
import Swal from 'sweetalert2';

// --- Type Definitions ---
interface UserEntry {
    id: number;
    fullName: string;           // ชื่อ-นามสกุล
    username: string;           // Username
    office: string;             // สังกัด/หน่วยงาน
    position: string;           // ตำแหน่ง
    email: string;              // อีเมล
    phone: string;              // เบอร์ติดต่อ
    status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // สถานะบัญชี
    role: 'USER' | 'ADMIN' | 'UNIT_ADMIN' | 'SUPER_ADMIN' ; // บทบาทผู้ใช้งาน
    lastActivity: string;       // วันที่ทำกิจกรรม/เข้าระบบล่าสุด (ISO String)
}

// --- Mock Data ---
const mockUserData: UserEntry[] = [
    {
        id: 101,
        fullName: 'นายประเสริฐ สุขสวัสดิ์',
        username: 'prasert_s',
        office: 'สำนักงานเลขาธิการ',
        position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
        email: 'prasert.s@agency.go.th',
        phone: '02-142-1705',
        status: 'ACTIVE',
        role: 'USER',
        lastActivity: '2025-12-11T10:00:00Z',
    },
    {
        id: 102,
        fullName: 'นางสาวกานดา อุ่นใจ',
        username: 'kanda_a',
        office: 'สำนักบริหารกลาง',
        position: 'เจ้าหน้าที่ธุรการ',
        email: 'kanda.a@agency.go.th',
        phone: '02-142-1558',
        status: 'INACTIVE',
        role: 'USER',
        lastActivity: '2025-09-01T15:00:00Z',
    },
    {
        id: 103,
        fullName: 'น.ส.ดวงใจ งามยิ่ง',
        username: 'duangjai_admin',
        office: 'กองการเงินและบัญชี',
        position: 'หัวหน้างานการเงิน',
        email: 'duangjai.n@agency.go.th',
        phone: '02-456-7890',
        status: 'ACTIVE',
        role: 'UNIT_ADMIN',
        lastActivity: '2025-12-11T11:30:00Z',
    },
    {
        id: 104,
        fullName: 'นายมานะ เลิศฤทธิ์',
        username: 'super_admin',
        office: 'สำนักงานเลขาธิการ',
        position: 'ผู้ดูแลระบบสูงสุด',
        email: 'mana.l@agency.go.th',
        phone: '02-123-4567',
        status: 'ACTIVE',
        role: 'ADMIN',
        lastActivity: '2025-12-11T14:00:00Z',
    },
    {
        id: 105,
        fullName: 'นายวสันต์ ลำบาก',
        username: 'wasan_l',
        office: 'สำนักนโยบายและแผน',
        position: 'นิติกรปฏิบัติการ',
        email: 'wasan.l@agency.go.th',
        phone: '02-777-8888',
        status: 'BLOCKED',
        role: 'USER',
        lastActivity: '2025-12-05T09:00:00Z',
    },
        {
        id: 106,
        fullName: 'นายวิน แบล็คสมิธ',
        username: 'admin_winbs',
        office: 'กองการเงินและบัญชี',
        position: 'Admin ประจำหน่วยงาน',
        email: 'win.bsth@ago.go.th',
        phone: '02-4563-3130',
        status: 'ACTIVE',
        role: 'ADMIN',
        lastActivity: '2024-12-31T11:30:00Z',
    },
    {
        id: 200,
        fullName: 'นายเจ้าพ่อแอดมิน ทุกสถาบัน',
        username: 'jaoporr_admin',
        office: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร',
        position: 'นักวิชาการคอมพิวเตอร์เชี่ยวชาญ',
        email: 'dadadmin@ago.go.th',
        phone: '02x-xxx-xxxx',
        status: 'ACTIVE',
        role: 'SUPER_ADMIN',
        lastActivity: '2025-12-11T11:30:00Z',
    },
];

const EditUserModal = ({ user, onClose, onSave }: { user: UserEntry, onClose: () => void, onSave: (data: any) => void }) => {
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 animate__animated animate__fadeIn animate__faster">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate__animated animate__zoomIn animate__faster">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <Edit className="mr-2 text-blue-600" size={20} /> แก้ไขข้อมูลบัญชีผู้ใช้
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
                            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 font-mono">{user.username}</div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                            <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="ACTIVE">เปิดการใช้งาน (Active)</option>
                                <option value="INACTIVE">ปิดการใช้งาน (Inactive)</option>
                                <option value="BLOCKED">ยกเลิกผู้ใช้งาน (Cancelled)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สังกัด/หน่วยงาน</label>
                            <input name="office" value={formData.office} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                            <input name="position" value={formData.position} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">บทบาทสิทธิ์</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="USER">User</option>
                                <option value="UNIT_ADMIN">Unit Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์ติดต่อ</label>
                            <input name="phone" value={formData.phone} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">ยกเลิก</button>
                    <button 
                        onClick={() => onSave(formData)}
                        className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm flex items-center space-x-2 transition-colors"
                    >
                        <Save size={18} />
                        <span>บันทึกการเปลี่ยนแปลง</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ResetPasswordModal = ({ user, onClose, onSave }: { user: UserEntry, onClose: () => void, onSave: (userId: number, newPass: string) => void }) => {
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });

    // ฟังก์ชันสุ่มรหัสผ่านอัตโนมัติ
    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let result = "";
        for (let i = 0; i < 10; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPasswords({ new: result, confirm: result });
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate__animated animate__zoomIn animate__faster">
                <div className="px-6 py-4 border-b bg-orange-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-orange-700 flex items-center">
                        <Key className="mr-2" size={20} /> รีเซ็ตรหัสผ่าน
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500">บัญชีผู้ใช้: <span className="font-bold text-gray-800">{user.fullName}</span></p>
                        <p className="text-xs text-gray-400">({user.username})</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                        <input 
                            type="text" // ใช้ text เพื่อให้เห็นรหัสที่ตั้งหรือสุ่มมา
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            placeholder="อย่างน้อย 8 ตัวอักษร"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                        <input 
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={generateRandomPassword}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                        <RefreshCw size={14} />
                        <span>สุ่มรหัสผ่าน</span>
                    </button>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">ยกเลิก</button>
                    <button 
                        onClick={() => {
                            if (passwords.new.length < 6) {
                                Swal.fire('ผิดพลาด', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
                                return;
                            }
                            if (passwords.new !== passwords.confirm) {
                                Swal.fire('ผิดพลาด', 'รหัสผ่านไม่ตรงกัน', 'error');
                                return;
                            }
                            onSave(user.id, passwords.new);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg shadow-sm"
                    >
                        ยืนยันเปลี่ยนรหัสผ่าน
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserAccountsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE', 'BLOCKED'
    const [filterRole, setFilterRole] = useState<string>('ALL'); // 'ALL', 'USER', 'ADMIN', 'UNIT_ADMIN'
    const checkInactivity = (lastActivityDate: string) => {
    const lastDate = new Date(lastActivityDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
        isOverdue: diffDays > 30, // เกิน 30 วัน
        days: diffDays
    };
};
    // --- Logic การกรองและค้นหา ---
    const filteredUsers = useMemo(() => {
        let items = [...mockUserData];

        // A. กรองตามสถานะ
        if (filterStatus !== 'ALL') {
            items = items.filter(item => item.status === filterStatus);
        }

        // B. กรองตามบทบาท (Role)
        if (filterRole !== 'ALL') {
            items = items.filter(item => item.role === filterRole);
        }

        // C. ค้นหา (Search): ค้นหาในชื่อ-นามสกุล, Username, หน่วยงาน, และตำแหน่ง
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            items = items.filter(item => 
                item.fullName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.username.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.office.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.position.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        return items;
    }, [filterStatus, filterRole, searchTerm]);

    // --- Helper Functions สำหรับ UI ---
    
    const getStatusStyles = (status: UserEntry['status']) => {
        switch (status) {
            case 'ACTIVE':
                return { text: 'เปิดการใช้งาน', className: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle };
            case 'INACTIVE':
                return { text: 'ปิดการใช้งาน', className: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: XCircle };
            case 'BLOCKED':
                return { text: 'ยกเลิกผู้ใช้งาน', className: 'bg-red-100 text-red-800 border-red-300', icon: Lock };
            default:
                return { text: status, className: 'bg-gray-100 text-gray-800 border-gray-300', icon: User };
        }
    };

    const getRoleStyles = (role: UserEntry['role']) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return { text: 'Super Admin', className: 'bg-red-600 text-white', icon: Shield };
            case 'ADMIN':
                return { text: 'Admin', className: 'bg-orange-400 text-white', icon: Shield };
            case 'UNIT_ADMIN':
                return { text: 'ผู้ดูแลหน่วยงาน (Admin)', className: 'bg-green-600 text-white', icon: Building };
            case 'USER':
            default:
                return { text: 'ผู้ใช้ทั่วไป (User)', className: 'bg-blue-500 text-white', icon: User };
        }
    };
    
    const formatDateTime = (isoString: string) => {
        // จัดรูปแบบวันที่ให้เป็นมิตรกับผู้ใช้
        const date = new Date(isoString);
        return date.toLocaleDateString('th-TH', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };
    // --- Placeholder Handlers (ต้องนำไปเชื่อมต่อ API จริง) ---
    const handleAddUser = () => alert("เปิด Modal/Page สำหรับเพิ่มบัญชีผู้ใช้ใหม่");
    const handleEdit = (id: number) => alert(`แก้ไขข้อมูลผู้ใช้ ID: ${id}`);
    const handleDelete = (id: number) => {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบบัญชีผู้ใช้ ID: ${id}?`)) {
            alert(`บัญชีผู้ใช้ ID: ${id} ถูกลบแล้ว (Mock)`);
            // โค้ดจริง: เรียก API สำหรับลบ และรีเฟรชข้อมูล
        }
    };
    const handleResetPassword = (id: number) => alert(`รีเซ็ตรหัสผ่านผู้ใช้ ID: ${id}`);
    const handleToggleBlock = (id: number, status: UserEntry['status']) => {
        const newStatus = status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
        alert(`เปลี่ยนสถานะผู้ใช้ ID: ${id} เป็น: ${newStatus} (Mock)`);
        // โค้ดจริง: เรียก API สำหรับเปลี่ยนสถานะ
    };
    // เพิ่ม State ใหม่
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserEntry | null>(null);

    // ฟังก์ชันเปิด Modal
    const handleEditClick = (user: UserEntry) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    // ฟังก์ชันบันทึกข้อมูล
    const handleSaveEdit = (updatedData: UserEntry) => {
        // ในสถานการณ์จริง: ส่ง updatedData ไป API
        Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: `แก้ไขข้อมูลของ ${updatedData.fullName} เรียบร้อยแล้ว`,
            confirmButtonColor: '#2563EB',
        });
        setIsEditModalOpen(false);
    };

    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
const [resetTargetUser, setResetTargetUser] = useState<UserEntry | null>(null);

// ฟังก์ชันเมื่อกดปุ่ม Reset (จากตาราง)
const handleResetPasswordClick = (user: UserEntry) => {
    setResetTargetUser(user);
    setIsResetModalOpen(true);
};

// ฟังก์ชันบันทึกรหัสผ่านใหม่
const handleSaveNewPassword = (userId: number, newPass: string) => {
    // ส่งข้อมูลไป API...
    Swal.fire({
        icon: 'success',
        title: 'รีเซ็ตรหัสผ่านสำเร็จ',
        text: 'รหัสผ่านใหม่พร้อมใช้งานแล้ว',
        confirmButtonColor: '#EA580C'
    });
    setIsResetModalOpen(false);
};


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                <Shield size={28} className="mr-3 text-red-600" />
                บริหารจัดการบัญชีผู้ใช้งาน
            </h1>

            {/* --- Control Bar: Search, Filter Status, Filter Role, Add --- */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 justify-between items-center">
                
                {/* Search Input */}
                <div className="relative flex-grow min-w-[200px] sm:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, Username, หน่วยงาน, หรือตำแหน่ง"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Status Dropdown */}
                <div className="relative w-full sm:w-40">
                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">สถานะทั้งหมด</option>
                        <option value="ACTIVE">ใช้งาน</option>
                        <option value="INACTIVE">ไม่ได้ใช้งาน</option>
                        <option value="BLOCKED">ยกเลิกผู้ใช้งาน</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
                
                {/* Filter Role Dropdown */}
                <div className="relative w-full sm:w-40">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="ALL">บทบาททั้งหมด</option>
                        <option value="USER">ผู้ใช้ทั่วไป (User)</option>
                        <option value="UNIT_ADMIN">ผู้ดูแลหน่วยงาน (Admin)</option>
                        <option value="ADMIN">Super Admin</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>

                {/* Add New Button */}
                <Link 
                        href="/phonebook/superAdmin/manageUser/addUser" // ระบุ Path ของหน้าที่สร้างใหม่
                        className="bg-red-600 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <PlusCircle size={20} />
                        <span>เพิ่มผู้ใช้</span>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
        <p className="text-sm text-gray-500">แอดมินทั้งหมด</p>
        <p className="text-2xl font-bold">{mockUserData.filter(u => u.role !== 'USER').length} บัญชี</p>
    </div>
    <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
        <p className="text-sm text-gray-500">ขาดการอัปเดต (&gt; 1 เดือน)</p>
        <p className="text-2xl font-bold text-red-600">
            {mockUserData.filter(u => u.role !== 'USER' && checkInactivity(u.lastActivity).isOverdue).length} บัญชี
        </p>
    </div>
</div>

            {/* --- User Accounts Table --- */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้งาน</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">หน่วยงาน/ตำแหน่ง</th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">กิจกรรมล่าสุด</th>
                            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((item) => {
                                const statusInfo = getStatusStyles(item.status);
                                const roleInfo = getRoleStyles(item.role);
                                const isBlocked = item.status === 'BLOCKED';
                                const inactivity = checkInactivity(item.lastActivity);
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Full Name / Username */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-gray-900">{item.fullName}</p>
                                            <p className="text-xs text-gray-500 font-mono">@{item.username}</p>
                                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                                <Mail size={14} className="text-yellow-500"/>
                                                <span className="truncate">{item.email}</span>
                                            </div>
                                        </td>
                                        {/* Office / Position */}
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <p className="font-medium text-gray-800">{item.office}</p>
                                            <p className="text-xs text-gray-600">{item.position}</p>
                                        </td>
                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${roleInfo.className}`}>
                                                <roleInfo.icon size={14} className="mr-1"/>
                                                {roleInfo.text}
                                            </span>
                                        </td>
                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${statusInfo.className}`}>
                                                <statusInfo.icon size={14} className="mr-1"/>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        {/* Last Activity */}
                                        <td className="px-6 py-4">
    <div className="flex flex-col">
        <span className={`text-sm font-medium ${inactivity.isOverdue && item.role !== 'USER' ? 'text-red-600' : 'text-gray-900'}`}>
            {new Date(item.lastActivity).toLocaleDateString('th-TH')}
        </span>
        
        {/* แสดง Badge เตือนเฉพาะแอดมินที่ไม่ได้อัปเดตเกิน 30 วัน */}
        {item.role !== 'USER' && inactivity.isOverdue && (
            <div className="flex items-center text-[10px] text-red-500 font-bold mt-1 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                <RefreshCw size={10} className="mr-1 animate-spin-slow" />
                ไม่ได้อัปเดต {inactivity.days} วัน
            </div>
        )}
    </div>
</td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
    <div className="flex space-x-2">
        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50" title="แก้ไข">
            <Edit size={18} />
        </button>
        <button onClick={() => handleResetPassword(item)} className="text-purple-600 hover:text-purple-800 p-1 rounded-full hover:bg-orange-50" title="รีเซ็ตรหัสผ่าน">
            <Key size={18} />
        </button>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50" title="ลบ">
            <Trash2 size={18} />
        </button>
                {/* ✅ เพิ่มปุ่ม Mail สำหรับติดตามงาน (โชว์เฉพาะแอดมินที่ Overdue) */}
        {item.role !== 'USER' && inactivity.isOverdue && (
            <button 
                onClick={() => Swal.fire('ติดตามงาน', `ส่งการแจ้งเตือนไปยัง ${item.fullName} เรียบร้อยแล้ว`, 'success')}
                className="p-1 text-orange-600 hover:bg-orange-50 rounded-full border border-orange-200"
                title="ติดตามการอัปเดตข้อมูล"
            >
                <Mail size={18} />
            </button>
        )}
    </div>
</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    ไม่พบข้อมูลบัญชีผู้ใช้งานตามเงื่อนไขที่กำหนด
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isEditModalOpen && editingUser && (
                <EditUserModal 
                    user={editingUser} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSaveEdit}
                />
            )}
            {isResetModalOpen && resetTargetUser && (
    <ResetPasswordModal 
        user={resetTargetUser} 
        onClose={() => setIsResetModalOpen(false)} 
        onSave={handleSaveNewPassword}
    />
            )}
        </div>
    );
};

export default UserAccountsPage;