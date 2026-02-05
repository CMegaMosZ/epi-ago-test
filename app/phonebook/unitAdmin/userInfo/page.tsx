'use client'

import { useState, useEffect, useMemo } from 'react';
import { 
    Search, User, Edit, Trash2, PlusCircle, 
    Phone, Mail, Briefcase, MapPin, X, Save, 
    UserCircle, Smartphone, Building2, Loader
} from 'lucide-react';
import Link from 'next/link'
import Swal from 'sweetalert2';

// --- Types ---
interface Personnel {
    id: number;
    name: string;
    position: string;
    division: string; // ส่วนงาน/กลุ่มงาน
    officePhone: string;
    internalPhone: string;
    mobilePhone: string;
    email: string;
    imageUrl?: string;
}

// --- Mock Data (เฉพาะคนในหน่วยงานของ Unit Admin) ---
// const mockPersonnel: Personnel[] = [
//     { id: 1, name: 'นายวิชาญ ใจดี', position: 'นิติกรชำนาญการพิเศษ', division: 'กลุ่มงานคดีอาญา 1', officePhone: '0-2234-3101', internalPhone: '101', mobilePhone: '081-234-5678', email: 'wichan.j@agency.go.th' },
//     { id: 2, name: 'นางสาวนภา สุขสวัสดิ์', position: 'เจ้าพนักงานธุรการ', division: 'ส่วนสนับสนุนงานคดี', officePhone: '0-2011-0105', internalPhone: '105', mobilePhone: '089-876-5432', email: 'napa.s@agency.go.th' },
//     { id: 3, name: 'นายสมชาย รักชาติ', position: 'อัยการจังหวัดคดีเยาวชน', division: 'กลุ่มงานคดีครอบครัว', officePhone: '0-2222-9202', internalPhone: '202', mobilePhone: '086-555-4433', email: 'somchai.r@agency.go.th' },
// ];

export default function UnitPersonnelManagement() {
    const [personnelList, setPersonnelList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Personnel | null>(null);

useEffect(() => {
    const fetchPersonnel = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            const userData = storedUser ? JSON.parse(storedUser) : null;
            // 1. ตรวจสอบ Key ให้ตรงกับที่ Login เก็บไว้ (สมมติใช้ deptId)
            const deptId = userData?.deptId; 

        if (!deptId) {
                console.error("ไม่พบข้อมูลบุคลากรในหน่วยงานของท่าน");
                return;
            }

            // 2. ส่ง deptId ไปที่ API
            const response = await fetch(`/api/unitAdmin/userInfo?deptId=${deptId}`);
            const result = await response.json();

            if (result.success) {
                setPersonnelList(result.data); // เก็บข้อมูลจริงลง State
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchPersonnel();
}, []);

    // 1. Filter ข้อมูลตามการค้นหา
    // กรองข้อมูลจาก personnelList ที่ดึงมาจาก DB
const filteredList = useMemo(() => {
    // *** สำคัญมาก: ต้องเปลี่ยนจาก mockPersonnel เป็น personnelList ***
    return personnelList.filter(p => {
        const search = searchTerm.toLowerCase();
        return (
            (p.name || '').toLowerCase().includes(search) ||
            (p.position || '').toLowerCase().includes(search)
        );
    });
}, [searchTerm, personnelList]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader className="animate-spin text-blue-600 mb-2" size={40} />
                <p>กำลังดึงข้อมูลจากฐานข้อมูล...</p>
            </div>
        );
    }

    // 2. Handler สำหรับเปิด Modal แก้ไข
    const handleEditClick = (person: Personnel) => {
        setEditingPerson(person);
        setIsEditModalOpen(true);
    };

    // 3. Handler สำหรับบันทึกข้อมูล
    const handleSave = (updatedData: Personnel) => {
        // ในอนาคตเชื่อมต่อ API: await updatePersonnel(updatedData)
        Swal.fire({
            icon: 'success',
            title: 'ปรับปรุงข้อมูลสำเร็จ',
            text: `แก้ไขข้อมูลของ ${updatedData.name} เรียบร้อยแล้ว`,
            confirmButtonColor: '#2563EB',
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
        });
        setIsEditModalOpen(false);
    };

    // 4. Handler สำหรับลบ (เฉพาะในหน่วยงาน)
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลบุคลากรจะถูกลบออกจากรายชื่อหน่วยงาน",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'ใช่, ลบข้อมูล',
            cancelButtonText: 'ยกเลิก',
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('ลบข้อมูลเรียบร้อย', '', 'success')
            }
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8"> {/* เพิ่มระยะห่างด้านล่างจากช่องค้นหา */}
                <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-1">
                    <UserCircle size={28} className="mr-3 text-red-600" />
                        แก้ไขข้อมูลบุคลากร
                </h1>
                    <p className="text-gray-500 text-sm">
                        จัดการรายชื่อและข้อมูลติดต่อเจ้าหน้าที่ภายในหน่วยงาน
                    </p>
                </div>
            {/* Header Section */}
            {/* Search Bar */}
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
    {/* Search Bar - ขยายเต็มพื้นที่ที่เหลือ */}
        <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
            type="text" 
            placeholder="ค้นหาชื่อ หรือ ตำแหน่ง..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>

    {/* Add Button - ขนาดพอดีกับเนื้อหา */}
                    <Link 
                        href="/phonebook/unitAdmin/userInfo/addUser" // ระบุ Path ของหน้าที่สร้างใหม่
                        className="bg-red-600 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >        <PlusCircle size={20} />
        <span className="font-medium">เพิ่มบุคลากรใหม่</span></Link>
</div>

            {/* Personnel Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ชื่อ-นามสกุล / ตำแหน่ง</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ฝ่าย/กลุ่มงาน</th>                                
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">เบอร์โทรสำนักงาน</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">เบอร์ภายใน</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">เบอร์โทรศัพท์มือถือ</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredList.map((person) => (
                                <tr key={person.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{person.name}</p>
                                                <p className="text-xs text-gray-500">{person.position}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{person.division}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-blue-600">{person.officePhone}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-blue-600">{person.internalPhone}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{person.mobilePhone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleEditClick(person)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(person.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Personnel Modal */}
            {isEditModalOpen && editingPerson && (
                <EditPersonnelModal 
                    person={editingPerson} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={handleSave} 
                />
            )}
        </div>
    );
}

// --- Sub-Component: EditPersonnelModal ---
const EditPersonnelModal = ({ person, onClose, onSave }: { person: Personnel, onClose: () => void, onSave: (data: Personnel) => void }) => {
    const [formData, setFormData] = useState<Personnel>({ ...person });

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate__animated animate__zoomIn animate__faster">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-blue-600">
                        <UserCircle size={24} />
                        <h3 className="text-lg font-bold">แก้ไขข้อมูลบุคลากร</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ส่วนตัว */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ข้อมูลเบื้องต้น</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                                    <input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                                    <input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                        value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* การจัดแบ่งส่วนงานภายใน */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ส่วนงานและสถานที่</label>
                            <div>
                                <label className="text-sm font-medium text-gray-700 font-bold text-blue-600">กอง/กลุ่มงาน (Division)</label>
                                <input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg border-blue-200 bg-blue-50/30" 
                                    placeholder="ระบุส่วนงานย่อย"
                                    value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} />
                            </div>
                        </div>

                        {/* ข้อมูลติดต่อ */}
                        <div className="md:col-span-2 border-t pt-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ข้อมูลการติดต่อ</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center"><Phone size={14} className="mr-1" /> เบอร์โทรศัพท์ภายใน</label>
                                    <input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                        value={formData.internalPhone} onChange={e => setFormData({...formData, internalPhone: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center"><Smartphone size={14} className="mr-1" /> เบอร์มือถือ</label>
                                    <input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                        value={formData.mobilePhone} onChange={e => setFormData({...formData, mobilePhone: e.target.value})} />
                                </div>
                                {/* <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center"><Mail size={14} className="mr-1" /> อีเมล</label>
                                    <input type="email" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                                        value={formData.mail} onChange={e => setFormData({...formData, mail: e.target.value})} />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">ยกเลิก</button>
                    <button 
                        onClick={() => onSave(formData)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm"
                    >
                        <Save size={18} />
                        <span>บันทึกข้อมูล</span>
                    </button>
                </div>
            </div>
        </div>
    );
};