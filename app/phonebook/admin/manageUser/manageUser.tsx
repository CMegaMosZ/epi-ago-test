'use client'

import { useState, useMemo } from 'react';
import { 
    Search, User, CheckCircle, XCircle, Edit, Trash2, PlusCircle, SortAsc, SortDesc,
    ChevronDown, Lock, Unlock, Phone, Mail, Shield, Building, Save, Key, RefreshCw, UserSearch
} from 'lucide-react';
import Link from 'next/link'
import Swal from 'sweetalert2';
import 'animate.css';
import { mockUserData } from '@/data/mockData';

// --- Type Definitions ---
interface UserEntry {
    id: number;
    name: string; // ชื่อ-นามสกุล
    username?: string;     // ใส่ ? ไว้เผื่อบางรายการในหน้าค้นหาไม่มีค่านี้
    position: string; // ตำแหน่ง
    office: string; // สังกัด/หน่วยงานหลัก
    division: string; // กอง/ส่วน
    officePhone: string; // เบอร์โทรศัพท์สำนักงาน
    internalPhone: string; // เบอร์โทรศัพท์ภายใน
    mobilePhone?: string; // เบอร์โทรศัพท์มือถือ
    email: string;
    address?: string;      // ที่อยู่สำนักงาน (สำหรับหน้าค้นหา)
    imageUrl?: string;     // URL รูปภาพ (สำหรับหน้าค้นหา)
    status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
    role?: 'USER' | 'ADMIN' | 'UNIT_ADMIN';
    lastActivity?: string;
}

// --- Mock Data ---
// const mockUserData: UserEntry[] = [
//     {
//         id: 101,
//         fullName: 'นายประเสริฐ สุขสวัสดิ์',
//         username: 'prasert_s',
//         office: 'สำนักงานเลขาธิการ',
//         position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
//         email: 'prasert.s@agency.go.th',
//         phone: '02-142-1705',
//         status: 'ACTIVE',
//         role: 'USER',
//         lastActivity: '2025-12-11T10:00:00Z',
//     },
//     {
//         id: 102,
//         fullName: 'นางสาวกานดา อุ่นใจ',
//         username: 'kanda_a',
//         office: 'สำนักบริหารกลาง',
//         position: 'เจ้าหน้าที่ธุรการ',
//         email: 'kanda.a@agency.go.th',
//         phone: '02-142-1558',
//         status: 'INACTIVE',
//         role: 'USER',
//         lastActivity: '2025-09-01T15:00:00Z',
//     },
//     {
//         id: 103,
//         fullName: 'น.ส.ดวงใจ งามยิ่ง',
//         username: 'duangjai_admin',
//         office: 'กองการเงินและบัญชี',
//         position: 'หัวหน้างานการเงิน',
//         email: 'duangjai.n@agency.go.th',
//         phone: '02-456-7890',
//         status: 'ACTIVE',
//         role: 'UNIT_ADMIN',
//         lastActivity: '2025-12-11T11:30:00Z',
//     },
//     {
//         id: 104,
//         fullName: 'นายมานะ เลิศฤทธิ์',
//         username: 'super_admin',
//         office: 'สำนักงานเลขาธิการ',
//         position: 'ผู้ดูแลระบบสูงสุด',
//         email: 'mana.l@agency.go.th',
//         phone: '02-123-4567',
//         status: 'ACTIVE',
//         role: 'UNIT_ADMIN',
//         lastActivity: '2025-12-11T14:00:00Z',
//     },
//     {
//         id: 105,
//         fullName: 'นายวสันต์ ลำบาก',
//         username: 'wasan_l',
//         office: 'สำนักนโยบายและแผน',
//         position: 'นิติกรปฏิบัติการ',
//         email: 'wasan.l@ago.go.th',
//         phone: '02-777-8888',
//         status: 'BLOCKED',
//         role: 'USER',
//         lastActivity: '2025-12-05T09:00:00Z',
//     },
//     {
//         id: 106,
//         fullName: 'นายวิน แบล็คสมิธ',
//         username: 'winbs_admin',
//         office: 'กองการเงินและบัญชี',
//         position: 'Admin ประจำหน่วยงาน',
//         email: 'win.bsth@ago.go.th',
//         phone: '02-4563-3130',
//         status: 'ACTIVE',
//         role: 'UNIT_ADMIN',
//         lastActivity: '2024-12-31T11:30:00Z',
//     },
//     {
//         id: 107,
//         fullName: 'นายกาย หยาบละเอียด',
//         username: 'guy_yl',
//         office: 'สำนักงานคดีอาญา',
//         position: 'นักจัดการงานทั่วไปปฏิบัติการ',
//         email: 'guy_yl@ago.go.th',
//         phone: '02-818-0001',
//         status: 'ACTIVE',
//         role: 'USER',
//         lastActivity: '2026-01-06T10:00:00Z',
//     },
//     {
//         id: 108,
//         fullName: 'นางสาวผ่องนุช วรศรี',
//         username: 'phongnuch_w',
//         office: 'สำนักงานคดีอาญากรุงเทพใต้',
//         position: 'อัยการ',
//         email: 'phongnuch_w@ago.go.th',
//         phone: '02-818-0071',
//         status: 'ACTIVE',
//         role: 'USER',
//         lastActivity: '2026-01-07T08:30:00Z',
//     },
//     {
//         id: 109,
//         fullName: 'นางสาวหทัยรัตน์ รัตน์หทัย',
//         username: '้hatairat_r',
//         office: 'สำนักงานคดีศาลสูงภาค 2',
//         position: 'เจ้าพนักงานธุรการชำนาญงาน',
//         email: '้hatairat_r@ago.go.th',
//         phone: '015-510-3342',
//         status: 'ACTIVE',
//         role: 'USER',
//         lastActivity: '2026-01-07T08:50:00Z',
//     },
//     {
//         id: 110,
//         fullName: 'นางโลกี ไม่สนหยก',
//         username: 'loki_m',
//         office: 'สำนักงานคดีศาลเตี้ยภาค 6',
//         position: 'อัยการอาวุโส',
//         email: 'loki_m@ago.go.th',
//         phone: '046-875-342',
//         status: 'ACTIVE',
//         role: 'USER',
//         lastActivity: '2026-01-07T08:50:00Z',
//     },
//     {
//         id: 200,
//         fullName: 'นายเจ้าพ่อแอดมิน ทุกสถาบัน',
//         username: 'jaoporr_admin',
//         office: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร',
//         position: 'นักวิชาการคอมพิวเตอร์เชี่ยวชาญ',
//         email: 'dadadmin@ago.go.th',
//         phone: '02x-xxx-xxxx',
//         status: 'ACTIVE',
//         role: 'ADMIN',
//         lastActivity: '2025-12-11T11:30:00Z',
//     },
//         {
//         id: 201,
//         fullName: 'นายบอน บางบอน',
//         username: 'bonbangbon_admin',
//         office: 'สำนักงานอัยการภาค 2',
//         position: 'Admin ประจำหน่วยงาน',
//         email: 'bonbangbon.b@ago.go.th',
//         phone: '014-493-3345',
//         status: 'ACTIVE',
//         role: 'UNIT_ADMIN',
//         lastActivity: '2024-01-05T13:30:00Z',
//     },
// ];

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
                            <input name="name" value={formData.name} onChange={handleChange}
                                type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">สิทธิ์ผู้ใช้งาน</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="USER">User</option>
                                <option value="UNIT_ADMIN">Unit Admin</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์ติดต่อ</label>
                            <input name="phone" value={formData.officePhone} onChange={handleChange}
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

const ResetPasswordModal = ({
    user,
    onClose,
    onSave
}: {
    user: UserEntry;
    onClose: () => void;
    onSave: (userId: number, newPass: string) => void;
}) => {
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
                        <p className="text-sm text-gray-500">บัญชีผู้ใช้: <span className="font-bold text-gray-800">{user.name}</span></p>
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
    const [sortConfig, setSortConfig] = useState<{ 
    key: keyof UserEntry | null; 
    direction: 'asc' | 'desc' 
    }>({ key: 'lastActivity', direction: 'desc' }); // ค่าเริ่มต้นเรียงตามกิจกรรมล่าสุด

    const [users, setUsers] = useState<UserEntry[]>(mockUserData);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL'); // 'ALL', 'ACTIVE', 'INACTIVE', 'BLOCKED'
    const [filterRole, setFilterRole] = useState<string>('ALL'); // 'ALL', 'USER', 'ADMIN', 'UNIT_ADMIN'
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState<number | 'All'>(10);
    // ฟังก์ชันจัดการการคลิกที่หัวตาราง
    const handleSort = (key: keyof UserEntry) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
    };

    // --- Logic การกรองและค้นหา ---
    const filteredUsers = useMemo(() => {
    let items = [...users];

    if (filterStatus !== 'ALL') {
        items = items.filter(item => item.status === filterStatus);
    }

    if (filterRole !== 'ALL') {
        items = items.filter(item => item.role === filterRole);
    }

    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        items = items.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.username?.toLowerCase().includes(q) ||
            item.office.toLowerCase().includes(q) ||
            item.position.toLowerCase().includes(q)
        );
    }

    if (sortConfig.key) {
        items.sort((a, b) => {
            const aVal = a[sortConfig.key!];
            const bVal = b[sortConfig.key!];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return items;
}, [
    users,          // ✅ ต้องมีตัวนี้
    filterStatus,
    filterRole,
    searchTerm,
    sortConfig
]);

    const { paginatedUsers, totalPages } = useMemo(() => {
        const total = filteredUsers.length;
        if (rowsPerPage === 'All') {
            return { paginatedUsers: filteredUsers, totalPages: 1 };
        }
        
        const lastIndex = currentPage * rowsPerPage;
        const firstIndex = lastIndex - rowsPerPage;
        const sliced = filteredUsers.slice(firstIndex, lastIndex);
        const pages = Math.ceil(total / rowsPerPage);
        
        return { paginatedUsers: sliced, totalPages: pages };
    }, [filteredUsers, currentPage, rowsPerPage]);

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
    const handleEdit = (user: UserEntry) => {
    // ลบ Swal.fire อันเก่าออก
    setEditingUser(user);      // ส่งข้อมูล user ที่เลือกเข้าไปใน state
    setIsEditModalOpen(true);  // สั่งเปิด Modal แก้ไข
    };
    const handleDelete = (id: number) => {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบบัญชีผู้ใช้ ID: ${id}?`)) {
            alert(`บัญชีผู้ใช้ ID: ${id} ถูกลบแล้ว (Mock)`);
            // โค้ดจริง: เรียก API สำหรับลบ และรีเฟรชข้อมูล
        }
    };
    const handleResetPassword = (user: UserEntry) => {
    // ลบ Swal.fire อันเก่าออก
    setResetTargetUser(user);  // ส่งข้อมูล user ที่เลือกเข้าไปใน state
    setIsResetModalOpen(true); // สั่งเปิด Modal รีเซ็ต
    };
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
    const handleSaveEdit = (updatedUser: UserEntry) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === updatedUser.id
                    ? { ...user, ...updatedUser } // 👈 อัปเดต status, role ฯลฯ
                    : user
            )
        );

        Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: 'ข้อมูลผู้ใช้ได้รับการอัปเดตแล้ว',
            timer: 1500,
            showConfirmButton: false
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
// ฟังก์ชันบันทึกรหัสผ่านใหม่
const handleSaveNewPassword = (userId: number, newPassword: string) => {
    console.log("Reset password for user ID:", userId);
    console.log("New password:", newPassword);

    // 🔥 ตรงนี้เอาไปต่อ API จริงได้เลย
    // await fetch('/api/reset-password', { ... })

    Swal.fire({
        icon: 'success',
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
        text: 'รหัสผ่านใหม่ถูกตั้งค่าเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
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
                        {/* <option value="ADMIN">Super Admin</option> */}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>

                {/* Add New Button */}
                {/* <Link 
                        href="/phonebook/admin/manageUser/addUser" // ระบุ Path ของหน้าที่สร้างใหม่
                        className="bg-red-600 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <PlusCircle size={20} />
                        <span>เพิ่มผู้ใช้</span>
                </Link> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">แอดมินทั้งหมด</p>
                    <p className="text-2xl font-bold">{users.filter(u => u.role !== 'USER').length} บัญชี</p>
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
            <table className="w-full table-fixed divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* ชื่อผู้ใช้งาน */}
                            <th onClick={() => handleSort('name')} className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                <div className="flex items-center">
                                    ผู้ใช้งาน
                                    {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>

                            {/* หน่วยงาน */}
                            <th onClick={() => handleSort('office')} className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                <div className="flex items-center">
                                    หน่วยงาน/ตำแหน่ง
                                    {sortConfig.key === 'office' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>

                            {/* บทบาท */}
                            <th onClick={() => handleSort('role')} className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                <div className="flex items-center justify-center">
                                    บทบาท
                                    {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>

                            {/* สถานะ */}
                            <th onClick={() => handleSort('status')} className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                <div className="flex items-center justify-center">
                                    สถานะ
                                    {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>

                            {/* กิจกรรมล่าสุด */}
                            <th onClick={() => handleSort('lastActivity')} className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                <div className="flex items-center">
                                    กิจกรรมล่าสุด
                                    {sortConfig.key === 'lastActivity' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>
                            <th className="w-[80px] px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((item) => {
                                const statusInfo = getStatusStyles(item.status);
                                const roleInfo = getRoleStyles(item.role);
                                const isBlocked = item.status === 'BLOCKED';
                                const inactivity = checkInactivity(item.lastActivity);
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Full Name / Username */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
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
                ขาดการ Update {inactivity.days} วัน
            </div>
        )}
    </div>
</td>
                                        {/* Actions */}
<td className="px-6 py-4">
    <div className="flex space-x-2">
        <button
            onClick={() => handleEdit(item)}   // ✅ ใช้ item
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="แก้ไขข้อมูล"
        >
            <Edit size={18} />
        </button>
        <button 
            onClick={() => handleResetPassword(item)} // ต้องส่งก้อน user เข้าไปด้วย
            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="รีเซ็ตรหัสผ่าน"
        >
            <Key size={18} />
        </button>
        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50" title="ลบ">
            <Trash2 size={18} />
        </button>
                {/* ✅ เพิ่มปุ่ม Mail สำหรับติดตามงาน (โชว์เฉพาะแอดมินที่ Overdue) */}
        {item.role !== 'USER' && inactivity.isOverdue && (
            <button 
                onClick={() => Swal.fire('ติดตามงาน', `ส่งการแจ้งเตือนไปยัง ${item.name} เรียบร้อยแล้ว`, 'success')}
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
<div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* 1. ส่วนเลือกจำนวนแถว (Rows per Page) */}
                <div className="flex items-center text-sm text-gray-600">
                    <span>แสดง</span>
                    <select 
                        value={rowsPerPage}
                        onChange={(e) => {
                            const val = e.target.value;
                            setRowsPerPage(val === 'All' ? 'All' : parseInt(val));
                            setCurrentPage(1); // รีเซ็ตไปหน้าแรกเสมอเมื่อเปลี่ยนจำนวนแถว
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

                {/* 2. ส่วนปุ่มเปลี่ยนหน้า (Pagination Buttons) */}
                {rowsPerPage !== 'All' && (
                    <div className="flex items-center space-x-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronDown size={16} className="rotate-90" /> {/* ใช้ ChevronDown หมุนเอาเพื่อเป็นลูกศรซ้าย */}
                        </button>
                        
                        <div className="flex space-x-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-orange-500 text-white shadow-sm' 
                                        : 'bg-white border text-gray-600 hover:bg-gray-50'
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
                            <ChevronDown size={16} className="-rotate-90" /> {/* ใช้ ChevronDown หมุนเอาเพื่อเป็นลูกศรขวา */}
                        </button>
                    </div>
                )}

                {/* 3. ส่วนสรุปจำนวนข้อมูล */}
                <div className="text-xs text-gray-500 font-medium">
                    ทั้งหมด {filteredUsers.length} รายการ
                </div>
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