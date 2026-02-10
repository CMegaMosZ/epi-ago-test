'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import 'animate.css';
import { useRouter } from 'next/navigation'
import { 
    Search, Building, CheckCircle, ChevronDown, Building2, 
    Phone, Mail, MapPin, User, ArrowLeft, X, FileSearchCorner, UserSearch
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2'

// --- Type Definitions ---
interface OfficeDetail {
    id: number;
    office: string;      // ชื่อสำนักงาน
    initial: string;   // ชื่อย่อ
    phone: string;     // เบอร์โทรศัพท์กลาง
    fax: string;       // เบอร์แฟกซ์
    email: string;     // อีเมลกลาง
    addr: string;      // ที่อยู่สำนักงาน
    division: string;  // สังกัดหน่วยงาน (Division)
    contact?: OfficeContact;
}

interface OfficeContact {
    name: string;
    position: string;
    phone: string;
}

// --- Mock Data (มีการกำหนด Division ที่ชัดเจน) ---
const officeData: OfficeDetail[] = [
    {
        id: 1,
        office: 'สำนักงานเลขานุการผู้บริหาร',
        initial: 'สลบ.',
        phone: '0-2142-1701',
        fax: '0-2142-1799',
        email: 'cesd@ago.go.th',
        addr: 'อาคารราชบุรีดิเรกฤทธิ์ ชั้น 4',
        division: 'สำนักงานเลขาธิการ',
        contact: {
            name: 'นายสมชาย ใจดี',
            position: 'หัวหน้างานธุรการ',
            phone: '0-2142-1702',
        }
    },
    {
        id: 2,
        office: 'สำนักบริหารกลาง',
        initial: 'สบก.',
        phone: '0-2142-1552',
        fax: '0-2143-9546',
        email: 'gad@ago.go.th',
        addr: 'อาคารราชบุรีดิเรกฤทธิ์ ชั้น 3',
        division: 'สำนักงานบริหารกลาง',
        contact: {
            name: 'นางสาวกานดา อุ่นใจ',
            position: 'เจ้าหน้าที่ธุรการ',
            phone: '0-2142-1553',
        }
    },
    {
        id: 3,
        office: 'สำนักงานอัยการจังหวัดนนทบุรี',
        initial: 'สอจ.นนทบุรี',
        phone: '0-2968-3000',
        fax: '0-2968-3001',
        email: 'nontburi@ago.go.th',
        addr: 'ศาลากลางจังหวัดนนทบุรี',
        division: 'สำนักงานอัยการภาค 1',
        contact: {
            name: 'นายปรีชา สุขสันต์',
            position: 'อัยการจังหวัด',
            phone: '0-2968-3000#101',
        }
    },
    {
        id: 4,
        office: 'สำนักงานการสอบสวน',
        initial: 'สกส.',
        phone: '0-2434-8323#7',
        fax: '0-2434-8328',
        email: 'doi@ago.go.th',
        addr: 'อาคารถนนบรมราชชนนี เลขที่ 73/1 ถนนบรมราชชนนี แขวงฉิมพลี เขตตลิ่งชัน กรุงเทพมหานคร',
        division: 'สำนักงานการสอบสวน',
        contact: {
            name: 'นายโสภล สวนแตง',
            position: 'อัยการจังหวัด',
            phone: '0-2123-1000#1',
        }
    },
    {
        id: 5,
        office: 'สำนักงานอัยการจังหวัดตรัง',
        initial: 'สอจ.ตรัง',
        phone: '0-7521-1233',
        fax: '0-7521-1233',
        email: 'trang@ago.go.th',
        addr: 'สำนักงานอัยการจังหวัดตรัง 19/2 ถนนวิเศษกุล  ตำบลทับเที่ยง อำเภอเมืองตรัง จังหวัดตรัง',
        division: 'สำนักงานอัยการภาค 9',
        contact: {
            name: 'นายชายชาญ ขันละมัย',
            position: 'Admin',
            phone: '08-9651-4866',
        }
    },
    {
        id: 6,
        office: 'สำนักงานอัยการจังหวัดสงขลา',
        initial: 'สอจ.สงขลา',
        phone: '0-7431-3722',
        fax: '0-7431-3742',
        email: 'sk@ago.go.th',
        addr: 'สำนักงานอัยการจังหวัดสงขลา อาคารสำนักงานอัยการภาค 9 ชั้น 2 ถนนแหลมสนอ่อน ตำบลบ่อยาง อำเภอเมือง จังหวัดสงขลา',
        division: 'สำนักงานอัยการภาค 9',
        contact: {
            name: 'นายสาม สมิหลา',
            position: 'Admin',
            phone: '08-9156-1010',
        }
    },
    {
        id: 7,
        office: 'ห้องรองอัยการสูงสุด (นายปรีชา สุดสงวน)',
        initial: 'รอส.ปรีชา',
        phone: '0-2142-1584',
        fax: ' ',
        email: 'dag5@ago.go.th',
        addr: 'ศูนย์ราชการเฉลิมพระเกียรติ 80 พรรษา 5 ธันวาคม 2550 อาคารราชบุรีดิเรกฤทธิ์ ชั้น 9 เลขที่ 120 หมู่ที่ 3 ถ.แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร',
        division: 'สำนักงานอัยการสูงสุด',
        contact: {
            name: 'นายปรีโป้ สุดอร่อย',
            position: 'Admin',
            phone: '09-8877-5555',
        }
    },
    {
        id: 8,
        office: 'สำนักงานอัยการจังหวัดเชียงใหม่',
        initial: 'สอจ.เชียงใหม่',
        phone: '0-5311-2559',
        fax: '0-5311-2550',
        email: 'cm@ago.go.th',
        addr: 'ถ.โชตนา ต.ช้างเผือก อ.เมือง จ.เชียงใหม่',
        division: 'สำนักงานอัยการภาค 5',
        contact: {
            name: 'นายเหนือดาว สว่างวงศ์',
            position: 'admin',
            phone: '09-9541-1459',
        }
    },
    {
        id: 9,
        office: 'สำนักงานอัยการจังหวัดนครราชสีมา',
        initial: 'สอจ.โคราช',
        phone: '0-4424-8158',
        fax: '0-4424-8160',
        email: 'korat@ago.go.th',
        addr: 'อาคารสำนักงานอัยการภาค 3 ชั้น 2 ถนนราชดำเนิน ตำบลในเมือง อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา',
        division: 'สำนักงานอัยการภาค 3',
        contact: {
            name: 'นายยุทธนา บุญตรง',
            position: 'admin',
            phone: '08-8125-4843',
        }
    },
    {
        id: 10,
        office: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร (อาคารรัชดาภิเษก)',
        initial: 'สอจ.นนทบุรี',
        phone: '0-2515-4182',
        fax: '0-2515-4189',
        email: 'ictc@ago.go.th',
        addr: '51 สำนักงานอัยการสูงสุด อาคารถนนรัชดาภิเษก ถนนรัชดาภิเษก แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร',
        division: 'สำนักงานเลขาธิการ สำนักงานอัยการสูงสุด',
        contact: {
            name: 'นางอรทัย มุสิกะ',
            position: 'หัวหน้ากลุ่มบริหารทั่วไป',
            phone: '0-2515-4182',
        }
    },
    {
        id: 11,
        office: 'สำนักงานอัยการจังหวัดนนทบุรี',
        initial: 'สอจ.นนทบุรี',
        phone: '0-2968-3000',
        fax: '0-2968-3001',
        email: 'nontburi@ago.go.th',
        addr: 'ศาลากลางจังหวัดนนทบุรี',
        division: 'สำนักงานอัยการภาค 1',
        contact: {
            name: 'นายปรีชา สุขสันต์',
            position: 'อัยการจังหวัด',
            phone: '0-2968-3000#101',
        }
    },
];

// --- OfficeProfileCard Component (Modal แสดงรายละเอียด) ---
const OfficeProfileCard = ({ office, onClose }: { office: OfficeDetail, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 animate__animated animate__fadeIn animate__faster">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform overflow-hidden animate__animated animate__zoomIn animate__faster">
                
                {/* Modal Header */}
                <div className="p-4 border-b flex justify-between items-center bg-orange-600 text-white">
                    <h3 className="text-xl font-bold flex items-center">
                        <Building2 size={24} className="mr-2" />
                        รายละเอียดสำนักงาน
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4">
                    
                    {/* Office Header */}
                    <div className="border-b pb-4">
                        <p className="text-xl font-extrabold text-gray-900">{office.office}</p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                            <span className="font-bold">({office.initial})</span> - สังกัด: {office.division}
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-700 flex items-center"><Phone size={18} className="mr-2"/>ข้อมูลติดต่อ</h4>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">โทรศัพท์:</span>
                            <span className="font-medium text-blue-600">{office.phone}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">โทรสาร (Fax):</span>
                            <span className="font-medium text-gray-800">{office.fax}</span>
                        </div>
                        <div className="flex items-center text-sm space-x-2 pt-2">
                            <Mail size={16} className="text-gray-500 flex-shrink-0"/>
                            <span className="text-gray-600 truncate">{office.email}</span>
                        </div>
                    </div>

                    {/* Contact Person */}
                    {office.contact && (
                        <div className="pt-4 border-t space-y-2">
                            <h4 className="font-bold text-gray-700 flex items-center"><User size={18} className="mr-2"/>ผู้ประสานงานหลัก</h4>
                            <div className="text-sm">
                                <span className="font-medium text-gray-800">{office.contact.name}</span>
                                <span className="text-gray-500 block">({office.contact.position})</span>
                                <div className="flex items-center space-x-1 mt-1">
                                    <Phone size={14} className="text-blue-500"/>
                                    <span className="text-blue-600">{office.contact.phone}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Location Details */}
                    <div className="pt-4 border-t space-y-2">
                        <h4 className="font-bold text-gray-700 flex items-center"><MapPin size={18} className="mr-2"/>ที่อยู่สำนักงาน</h4>
                        <p className="text-sm text-gray-600">{office.addr}</p>
                    </div>

                </div>
                
                {/* Modal Footer */}
                <div className="bg-gray-50 p-4 border-t flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded shadow-sm transition bg-gray-300 text-gray-700 hover:bg-gray-400"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component: Office Search Page ---

const OfficeSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isSearchAlertOpen, setIsSearchAlertOpen] = useState(false);
    const [isSearchSuccessOpen, setIsSearchSuccessOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        office: '',       // ชื่อ
        division: '',     // สำนักงาน
    });
    const [selectedOffice, setSelectedOffice] = useState<OfficeDetail | null>(null);
    const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<OfficeDetail[]>([]); // สำหรับเก็บผลลัพธ์ที่ค้นหาได้จริง
    const [searchResultsCount, setSearchResultsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0, currentPage: 1 });

    // Filter Logic: กรองจาก ชื่อสำนักงาน, ชื่อย่อ, เบอร์โทรศัพท์, หรืออีเมล
    const filteredResults = useMemo(() => {
        if (!searchTerm) {
            return [];
        }

        const lowerSearchTerm = searchTerm.toLowerCase();

        return officeData.filter(office => {
            const matchesTerm = office.office.toLowerCase().includes(lowerSearchTerm) ||
                                office.initial.toLowerCase().includes(lowerSearchTerm.replace('.', '')) || // ค้นหาชื่อย่อ
                                office.phone.includes(lowerSearchTerm) ||
                                office.email.toLowerCase().includes(lowerSearchTerm);
            
            return matchesTerm;
        });
    }, [searchTerm]);

const handleSearch = async (e?: React.FormEvent, page = 1, isPagination = false) => {
    if (e) e.preventDefault();
    const isSearchEmpty = !searchQuery.office.trim();
    
    if (isSearchEmpty) {
        Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูล',
            text: 'กรุณาพิมพ์ชื่อสำนักงานที่ต้องการค้นหา',
            confirmButtonColor: '#ea580c', // สีส้มตามธีม
        });
        return; // หยุดการทำงาน ไม่ส่งไป Backend
    }
    setIsLoading(true);
    // if (page === 1) setShowResults(false);

    try {
        const params = new URLSearchParams({
            office: searchQuery.office.trim(),
            page: page.toString()
        });

        const response = await fetch(`/api/auth/department?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
            setSearchResults(result.data);
            setPagination(result.pagination); // เก็บข้อมูลแบ่งหน้า
            setShowResults(true);
            
            if (page === 1 && !isPagination && result.data.length > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'ค้นหาสำเร็จ',
                    text: `พบข้อมูลสำนักงาน ${result.pagination.total} รายการ`,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        }
    } catch (error) {
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้', 'error');
    } finally {
        setIsLoading(false);
    }
};

    const handleViewProfile = (office: OfficeDetail) => {
        setSelectedOffice(office);
        setIsProfileCardOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-4 sm:p-6 lg:p-8">
                
                {/* --- Page Title --- */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Building2 size={30} className="mr-3 text-orange-600" />
                        ระบบค้นหาข้อมูลสำนักงาน
                    </h1>
                    <p className="text-gray-500 mt-1">ระบุชื่อสำนักงาน, ชื่อย่อ, เบอร์โทรศัพท์, หรืออีเมล เพื่อค้นหา</p>
                </div>

                {/* --- Search Form (เหลือแค่ช่องค้นหาหลัก) --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">ค้นหา</h2>
                    <div className="grid grid-cols-1 gap-6">
                        
                        {/* 1. ค้นหาสำนักงาน */}
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-1">ชื่อสำนักงาน, สังกัดหน่วยงาน</label>
                            <Search className="absolute left-3 top-[48px] transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="ระบุชื่อสำนักงานที่ต้องการค้นหา..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery.office} // <--- ต้องเป็นตัวนี้
                                onChange={(e) => setSearchQuery({ ...searchQuery, office: e.target.value })} // <--- ต้องเป็นตัวนี้
                            />
                        </div>

                    </div>

                    {/* Search Button */}
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full md:w-auto flex items-center justify-center px-10 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01]">
                            <Search size={20} className="mr-2" />
                            ค้นหาสำนักงาน
                            </button>
                    </div>
                </div>

                {/* --- Search Results Table (คงรายละเอียดของสำนักงาน) --- */}
{/* ส่วนแสดงผลลัพธ์ (Table) */}
{showResults && !isLoading && (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate__animated animate__fadeIn">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">หน่วยงาน/สำนักงาน</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">ข้อมูลติดต่อ</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">ที่อยู่</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {searchResults.map((item, index) => (
                        <tr key={item.id} className="hover:bg-orange-50/50 transition-colors">
                            {/* <td className="px-6 py-4 text-sm text-gray-500">
                                {/* คำนวณลำดับตามหน้าปัจจุบัน */}
                                {/* {(pagination.currentPage - 1) * 10 + (index + 1)}
                            </td> */}
                            <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">{item.office}</div>
                                <div className="text-xs text-orange-600 font-medium uppercase">{item.initial || '-'}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex flex-col space-y-1">
                                    <span className="flex items-center gap-2">
                                        <Phone size={14} className="text-blue-500" /> {item.phone || '-'}
                                    </span>
                                    <span className="flex items-center gap-2 text-xs text-gray-400">
                                        <Mail size={12} /> {item.email || '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                <p className="truncate" title={item.addr}>{item.addr || '-'}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => handleViewProfile(item)}
                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-full transition-all group"
                                    title="ดูรายละเอียด"
                                >
                                    <FileSearchCorner size={20} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* --- ส่วนควบคุมการแบ่งหน้า (Pagination Controls) --- */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
                แสดงผล <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> ถึง <span className="font-medium">{Math.min(pagination.currentPage * 10, pagination.total)}</span> จากทั้งหมด <span className="font-bold text-orange-600">{pagination.total}</span> รายการ
            </div>
            
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => handleSearch(undefined, pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronDown size={18} className="rotate-90" />
                </button>
                
                <div className="flex space-x-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handleSearch(undefined, i + 1)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                pagination.currentPage === i + 1 
                                ? 'bg-orange-500 text-white shadow-md' 
                                : 'bg-white border text-gray-600 hover:bg-orange-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    )).slice(Math.max(0, pagination.currentPage - 3), Math.min(pagination.totalPages, pagination.currentPage + 2))}
                </div>

                <button 
                    onClick={() => handleSearch(undefined, pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronDown size={18} className="-rotate-90" />
                </button>
            </div>
        </div>
    </div>
)}
                
                {/* --- Modals --- */}
                
                {/* Modal แจ้งเตือนการค้นหา */}
                {/* {isSearchAlertOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
                            <p className="mb-6 text-lg text-gray-700">กรุณากรอกข้อมูลในช่องค้นหา</p>
                            <button onClick={() => setIsSearchAlertOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium">ตกลง</button>
                        </div>
                    </div>
                )} */}
                
                {/* Modal ค้นหาสำเร็จ */}
                {/* {isSearchSuccessOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
                            <div className="mb-4 flex justify-center"><CheckCircle size={48} className="text-green-500" /></div>
                            <p className="mb-6 text-lg text-gray-700">พบข้อมูล <span className="font-bold text-green-600">{searchResultsCount}</span> รายการ</p>
                            <button 
                                onClick={() => { 
                                    setIsSearchSuccessOpen(false); 
                                    setShowResults(true); 
                                }} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                )} */}

                {/* Office Profile Card Modal */}
                {isProfileCardOpen && selectedOffice && (
                    <OfficeProfileCard 
                        office={selectedOffice} 
                        onClose={() => setIsProfileCardOpen(false)} 
                    />
                )}

            </main>
        </div>
    )
}

export default OfficeSearchPage