'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import 'animate.css';
import { useRouter } from 'next/navigation'
import { 
    Search, Building, CheckCircle, ChevronDown, Building2, 
    Phone, Mail, MapPin, User, ArrowLeft, X, FileSearchCorner
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
    address: string;
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
        address: 'อาคารราชบุรีดิเรกฤทธิ์ ชั้น 4',
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
        address: 'อาคารราชบุรีดิเรกฤทธิ์ ชั้น 3',
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
        address: 'ศาลากลางจังหวัดนนทบุรี',
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
        address: 'อาคารถนนบรมราชชนนี เลขที่ 73/1 ถนนบรมราชชนนี แขวงฉิมพลี เขตตลิ่งชัน กรุงเทพมหานคร',
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
        address: 'สำนักงานอัยการจังหวัดตรัง 19/2 ถนนวิเศษกุล  ตำบลทับเที่ยง อำเภอเมืองตรัง จังหวัดตรัง',
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
        address: 'สำนักงานอัยการจังหวัดสงขลา อาคารสำนักงานอัยการภาค 9 ชั้น 2 ถนนแหลมสนอ่อน ตำบลบ่อยาง อำเภอเมือง จังหวัดสงขลา',
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
        address: 'ศูนย์ราชการเฉลิมพระเกียรติ 80 พรรษา 5 ธันวาคม 2550 อาคารราชบุรีดิเรกฤทธิ์ ชั้น 9 เลขที่ 120 หมู่ที่ 3 ถ.แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร',
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
        address: 'ถ.โชตนา ต.ช้างเผือก อ.เมือง จ.เชียงใหม่',
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
        address: 'อาคารสำนักงานอัยการภาค 3 ชั้น 2 ถนนราชดำเนิน ตำบลในเมือง อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา',
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
        address: '51 สำนักงานอัยการสูงสุด อาคารถนนรัชดาภิเษก ถนนรัชดาภิเษก แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร',
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
        address: 'ศาลากลางจังหวัดนนทบุรี',
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
                        <p className="text-sm text-gray-600">{office.address}</p>
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

    const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // 1. เช็คค่าจาก searchQuery ที่ผู้ใช้พิมพ์จริง (ลบ searchTerm ออก)
    if (!searchQuery.office.trim() && !searchQuery.division.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'แจ้งเตือน',
            text: 'กรุณากรอกชื่อหน่วยงานหรือเลือกสังกัดที่ต้องการค้นหา',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#ea580c',
            customClass: { container: 'z-[9999]' }
        });
        return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
        // 2. ดึงค่าจาก searchQuery ไปใส่ใน Params
        const params = new URLSearchParams({
            office: searchQuery.office.trim(),
            division: searchQuery.division.trim(),
        });

        // ตรวจสอบว่า fetch ไปที่ path นี้จริง (เช็คชื่อโฟลเดอร์ในโปรเจกต์คุณด้วย)
        const response = await fetch(`/api/auth/department?${params.toString()}`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            const mappedData = result.data.map((item: any) => ({
                id: item.id,
                office: item.office || 'ไม่ระบุชื่อสำนักงาน',
                initial: item.initial || '',
                phone: item.phone || '',
                fax: item.fax || '',
                email: item.email || '',
                address: item.address || '',
                division: item.division || ''
            }));

            setSearchResults(mappedData);
            setSearchResultsCount(mappedData.length);

            // 3. แสดงผล (ลดเวลาลงเพื่อให้ดูเร็วขึ้น)
            setTimeout(() => {
                setIsLoading(false);
                if (mappedData.length > 0) {
                    setShowResults(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'ค้นหาสำเร็จ',
                        text: `พบข้อมูล ${mappedData.length} รายการ`,
                        confirmButtonColor: '#ea580c'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่พบข้อมูล',
                        text: 'ไม่พบข้อมูลสำนักงานที่ตรงกับคำค้นหา',
                        confirmButtonColor: '#EF4444'
                    });
                }
            }, 2000);
        } else {
            throw new Error(result.message || 'โครงสร้างข้อมูลผิดพลาด');
        }
    } catch (error: any) {
        setIsLoading(false);
        Swal.fire({
            icon: 'error',
            title: 'ผิดพลาด',
            text: error.message || 'เชื่อมต่อฐานข้อมูลล้มเหลว'
        });
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
                                className="w-full pl-10 pr-4 py-3 ..."
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
<div className="mt-8">
    {isLoading ? (
        // --- ส่วนที่ 1: Skeleton ขณะโหลด ---
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="space-y-2 w-full">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-50 rounded-xl w-full animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    ) : showResults && (
        // --- ส่วนที่ 2: ตารางผลลัพธ์ ---
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate__animated animate__fadeIn">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    ผลการค้นหาหน่วยงาน
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 text-gray-600">
                        <tr>
                            {/* <th className="px-6 py-4 font-bold text-sm">#</th> */}
                            <th className="px-6 py-4 font-bold text-sm">ชื่อหน่วยงาน</th>
                            <th className="px-6 py-4 font-bold text-sm">สังกัด</th>
                            <th className="px-6 py-4 font-bold text-sm">เบอร์โทรศัพท์/E-mail</th>
                            <th className="px-6 py-4 font-bold text-sm text-center">รายละเอียด</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {/* เปลี่ยนจาก officeData.map เป็น searchResults.map */}
                        {searchResults.map((office, index) => (
                            <tr key={office.id || index} className="hover:bg-gray-50 border-b transition-colors animate__animated animate__fadeIn">
                                {/* <td className="px-4 py-3 text-center text-sm text-gray-600">{index + 1}</td> */}
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{office.office}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{office.division}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    <p className="flex items-center"><Phone size={14} className="mr-1 text-green-600"/> {office.phone}</p>
                                    <p className="text-sm text-gray-500 truncate flex items-center"><Mail size={12} className="mr-1"/> {office.email}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        onClick={() => handleViewProfile(office)}
                                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
                                    >
                                        ดูข้อมูล
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )}
</div>
                
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