    'use client'

    import { useState, useEffect} from 'react'
    import { 
    CheckCircle, XCircle, Search, Filter, Clock, 
    UserCheck, ShieldCheck, Phone, Building2, 
    ChevronRight, ArrowLeft, FileText, UserCircle2, Briefcase
    } from 'lucide-react'
    import Link from 'next/link'
    import Swal from 'sweetalert2'

    // เพิ่มข้อมูล Mockup ให้มีรายละเอียดมากขึ้น
    const initialRequests = [
    { id: 1, name: 'นายสมชาย ใจดี', idCard: '1100100223344', title: 'นาย' , firstName: 'สมชาย' , lastName: 'ใจดี', userType: 'USER', office: 'สำนักงานคดีอาญา', position: 'นิติกร',  phone: '081-234-5678', attached: 'click', status: 'PENDING' },
    { id: 2, name: 'นางสาวใฝ่เรียน รู้จริง', idCard: '3200500112233', title: 'นางสาว', firstName: 'ใฝ่เรียน', lastName: 'รู้จริง', userType: 'USER', office: 'สำนักงานคดีแพ่ง', position: 'นิติกร',  phone: '081-234-5678', attached: 'click', status: 'PENDING' },
    { id: 3, name: 'นายขยัน ทำงาน', idCard: '1104400556677', title: 'นาย', firstName: 'สมชาย', lastName: 'ใจดี', userType: 'UNIT_ADMIN', office: 'สำนักงานคดีอาญา', position: 'พนักงานขับรถยนต์',  phone: '081-234-5678', attached: 'click', status: 'PENDING' },
    { id: 4, name: 'นางมาร ร้าย', idCard: '1900100100234', title: 'นาง' , firstName: 'มาร' , lastName: 'ร้าย', userType: 'USER', office: 'สำนักเทคโนฯ', position: 'นักวิชาการคอมฯ', phone:'087-654-4561', attached: 'click', status: 'PENDING' },
    { id: 5, name: 'นายวิน แบล็คสมิธ', idCard: '1000011011005', title: 'นาย' , firstName: 'วิน' , lastName: 'แบล็คสมิธ', userType: 'ADMIN', office: 'สำนักเทคโนฯ', position: 'นักวิชาการคอมฯ', phone:'095-515-0011', attached: 'click', status: 'APPROVE' },
    { id: 6, name: 'นางสาวใหม่เอี่ยม อ่องอรทัย', idCard: '1900100100234', title: 'นางสาว' , firstName: 'ใหม่' , lastName: 'เอี่ยมอรทัย', userType: 'USER', office: 'สำนักงานอัยการจังหวัดไหน', position: 'นักบัญชี', phone:'084-1259231', attached: 'no', status: 'REJECT' },
    { id: 7, name: 'นางสาว ', idCard: '1234554321001', title: 'นางสาว' , firstName: 'ใหม่' , lastName: 'เอี่ยมอรทัย', userType: 'USER', office: 'สำนักงานอัยการจังหวัดอ่างทอง', position: 'นักจัดการงานทั่วไปปฏิบัติการ', phone:'083-3214884', attached: 'no', status: 'PENDING' }
    ]

    export default function UserApprovalPage() {
    const [requests, setRequests] = useState(initialRequests)
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('PENDING')

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/dashboard/request');
            const result = await res.json();
            if (result.success) {
                setRequests(result.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // --- 2. ฟังก์ชัน อนุมัติ/ปฏิเสธ ---
    const handleAction = async (id: number, status: 'APPROVE' | 'REJECT', name: string) => {
        const actionText = status === 'APPROVE' ? 'อนุมัติ' : 'ปฏิเสธ';
        const confirmResult = await Swal.fire({
            title: `ยืนยัน${actionText}?`,
            text: `คุณต้องการ${actionText}การลงทะเบียนของ ${name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'APPROVE' ? '#10b981' : '#ef4444',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        });

        if (confirmResult.isConfirmed) {
            try {
                const res = await fetch(`/api/admin/dashboard/request/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: status === 'APPROVE' ? 1 : 2 })
                });
                if (res.ok) {
                    Swal.fire('สำเร็จ', `ดำเนินการ${actionText}เรียบร้อยแล้ว`, 'success');
                    fetchRequests(); // โหลดข้อมูลใหม่
                }
            } catch (error) {
                Swal.fire('ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
            }
        }
    };

        const filteredRequests = requests.filter(req => 
            req.fname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            req.lname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            req.cid?.includes(searchTerm)
        );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            
            {/* Navigation & Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Link href="/phonebook/admin/dashboard" className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                <h1 className="text-2xl font-bold text-gray-900">ข้อมูลผู้ใช้งาน</h1>
                <p className="text-gray-500 text-sm italic">รายการลงทะเบียนที่รอการยืนยันตัวตน</p>
                </div>
            </div>
            </div>

            {/* Status Tab Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button 
                    onClick={() => setActiveFilter('PENDING')}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${activeFilter === 'PENDING' ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500/10' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Clock size={20} /></div>
                    <span className={`font-bold ${activeFilter === 'PENDING' ? 'text-orange-900' : 'text-gray-600'}`}>รอตรวจสอบ</span>
                    </div>
                    <span className="text-2xl font-black text-orange-600">{requests.length}</span>
                </button>
            
                <button 
                    onClick={() => setActiveFilter('APPROVE')}                
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${activeFilter === 'APPROVE' ? 'bg-orange-50 border-green-200 ring-2 ring-green-500/10' : 'bg-white border-green-100 hover:bg-gray-50'}`}
                >
                        <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                        <span className={`font-bold ${activeFilter === 'APPROVE' ? 'text-green-900' : 'text-gray-600'}`}>อนุมัติแล้ว</span>
                        </div>
                        <span className="text-2xl font-black text-green-600">{requests.length}</span>
                </button>

                <button 
                    onClick={() => setActiveFilter('REJECT')}                
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${activeFilter === 'REJECT' ? 'bg-red-50 border-red-200 ring-2 ring-red-500/10' : 'bg-white border-red-100 hover:bg-gray-50'}`}
                >
                        <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg"><XCircle size={20} /></div>
                        <span className="font-bold text-gray-600">ปฏิเสธ</span>
                        </div>
                        <span className="text-2xl font-black text-red-400">{requests.length}</span>
                </button>
            </div>
            

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="ค้นหาด้วยชื่อ, เลขบัตร หรือหน่วยงาน..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4 text-left">เลขบัตรประชาชน</th>
                                    <th className="px-6 py-4 text-left">ชื่อ-นามสกุล</th>
                                    <th className="px-6 py-4 text-center">ประเภทสมาชิก</th>
                                    <th className="px-6 py-4 text-left">สำนักงาน / ตำแหน่ง</th>
                                    <th className="px-6 py-4 text-left">เบอร์โทรศัพท์</th>
                                    <th className="px-6 py-4 text-center">เอกสาร</th>
                                    <th className="px-6 py-4 text-center">อนุมัติ</th>
                                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                                {requests.map((req, index) => (
                                    <tr key={req.id} className="hover:bg-blue-50/20 transition-colors">
                                        {/* <td className="px-6 py-4 text-center text-sm text-gray-500">{index + 1}</td> */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-gray-600 px-2 py-0.5">
                                                {req.idCard}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <UserCircle2 size={18} className="text-blue-500" />
                                                <span className="text-sm font-bold text-gray-800">{req.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">
                                                {req.userType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                    <Building2 size={14} className="text-gray-400" />
                                                    {req.office}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                                    <Briefcase size={12} />
                                                    {req.position}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <Phone size={14} className="text-gray-400" />
                                                {req.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-bold underline decoration-dotted">
                                                <FileText size={14} />
                                                ดูเอกสาร
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleAction(req.id, 'APPROVE', req.name)}
                                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                                                    title="อนุมัติ"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'REJECT', req.name)}
                                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                                    title="ปฏิเสธ"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    )
    }