'use client'

import { useState, useMemo, useCallback } from 'react'

import { 
    Search, Building, CheckCircle, ChevronDown, Building2, 
    Phone, Mail, MapPin, User, ArrowLeft, X 
} from 'lucide-react'
import Swal from 'sweetalert2'
import Link from 'next/link'

// --- Type Definitions ---
interface OfficeDetail {
    id: number;
    name: string;      // ชื่อสำนักงาน
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
        name: 'สำนักงานเลขานุการผู้บริหาร',
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
        name: 'สำนักบริหารกลาง',
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
        name: 'สำนักงานอัยการจังหวัดนนทบุรี',
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
        name: 'สำนักงานการสอบสวน',
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
        name: 'สำนักงานอัยการจังหวัดตรัง',
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
        id: 5,
        name: 'สำนักงานอัยการจังหวัดสงขลา',
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
        id: 6,
        name: 'ห้องรองอัยการสูงสุด (นายปรีชา สุดสงวน)',
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
        id: 7,
        name: 'สำนักงานอัยการจังหวัดเชียงใหม่',
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
        id: 8,
        name: 'สำนักงานอัยการจังหวัดนครราชสีมา',
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
        id: 9,
        name: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร (อาคารรัชดาภิเษก)',
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
        id: 10,
        name: 'สำนักงานอัยการจังหวัดนนทบุรี',
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform overflow-hidden">
                
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
                        <p className="text-xl font-extrabold text-gray-900">{office.name}</p>
                        <p className="text-sm text-blue-600 font-medium mt-1">
                            <span className="font-bold">({office.initial})</span> - สังกัด: {office.division}
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-700 flex items-center"><Phone size={18} className="mr-2"/>ข้อมูลติดต่อ</h4>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">เบอร์โทรศัพท์กลาง:</span>
                            <span className="font-medium text-blue-600">{office.phone}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">เบอร์โทรสาร (Fax):</span>
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
                                    <Phone size={14} className="text-orange-500"/>
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

    const [selectedOffice, setSelectedOffice] = useState<OfficeDetail | null>(null);
    const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);

    // Filter Logic: กรองจาก ชื่อสำนักงาน, ชื่อย่อ, เบอร์โทรศัพท์, หรืออีเมล
    const filteredResults = useMemo(() => {
        if (!searchTerm) {
            return [];
        }

        const lowerSearchTerm = searchTerm.toLowerCase();

        return officeData.filter(office => {
            const matchesTerm = office.name.toLowerCase().includes(lowerSearchTerm) ||
                                office.initial.toLowerCase().includes(lowerSearchTerm.replace('.', '')) || // ค้นหาชื่อย่อ
                                office.phone.includes(lowerSearchTerm) ||
                                office.email.toLowerCase().includes(lowerSearchTerm);
            
            return matchesTerm;
        });
    }, [searchTerm]);

    const handleSearch = () => {
        // ตรวจสอบว่ามีการกรอกข้อมูลในช่องค้นหา
        if (!searchTerm.trim()) {
            setIsSearchAlertOpen(true);
            setShowResults(false);
                        Swal.fire({
                                        icon: 'warning',
                                        title: 'แจ้งเตือน',
                                        text: 'กรุณากรอกข้อมูลในช่องค้นหา',
                                        confirmButtonText: 'ตกลง',
                                        confirmButtonColor: '#2563EB',
                                        customClass: {
                                            container: 'z-[9999]'
                                        },
                                        showClass: {
                                            popup: `animate__animated
                                            animate__bounceIn
                                            animate__faster`},
                                        hideClass: {
                                            popup: `animate__animated
                                            animate__fadeOut
                                            animate__faster`}
                                    });
            return;
        }

        setShowResults(false); // ซ่อนผลลัพธ์เก่า
        
        const results = filteredResults.length;

        if (results > 0) {
            setIsSearchSuccessOpen(true);
	Swal.fire({
            icon: 'success',
            title: 'ค้นหาสำเร็จ',
            html: `พบข้อมูล <span class="font-bold text-green-600">${results}</span> รายการ`,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#2563EB',
            customClass: {
                container: 'z-[9999]',
            },
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
        }).then((result) => {
            // ✅ เมื่อผู้ใช้กด 'ตกลง' (หรือปิด pop-up) ให้แสดงตารางผลลัพธ์
            if (result.isConfirmed || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.close) {
                setShowResults(true); 
            }
        });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่พบข้อมูล',
                text: 'ไม่พบข้อมูลสำนักงานที่ตรงกับเงื่อนไขที่ระบุ',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3085d6',
                showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
            });
            setShowResults(true); // แสดงตารางเปล่า
        }
    };

    const handleViewProfile = (office: OfficeDetail) => {
        setSelectedOffice(office);
        setIsProfileCardOpen(true);
    };

    const searchResultsCount = filteredResults.length;

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
                                placeholder="สามารถค้นหาชื่อย่อของสำนักงานได้"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mt-1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => { // เพิ่มการค้นหาเมื่อกด Enter
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>

                    </div>

                    {/* Search Button */}
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={handleSearch}
                            className="w-full md:w-auto flex items-center justify-center px-10 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01]"
                        >
                            <Search size={20} className="mr-2" />
                            ค้นหาสำนักงาน
                        </button>
                    </div>
                </div>

                {/* --- Search Results Table (คงรายละเอียดของสำนักงาน) --- */}
                {showResults && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                             ผลการค้นหา{/* ({searchResultsCount} รายการ) */}
                        </h2>
                        
                        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ชื่อสำนักงาน / ชื่อย่อ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">สังกัดหน่วยงาน</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">เบอร์โทรศัพท์ / อีเมล</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">รายละเอียด</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((office) => (
                                            <tr key={office.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <p className="text-sm font-medium text-gray-900">{office.name}</p>
                                                    <p className="text-xs text-blue-600 font-semibold">({office.initial})</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {office.division}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <p className="flex items-center"><Phone size={14} className="mr-1 text-green-600"/> {office.phone}</p>
                                                    <p className="text-sm text-gray-500 truncate flex items-center"><Mail size={12} className="mr-1"/> {office.email}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleViewProfile(office)}
                                                        className="text-blue-600 hover:text-blue-900 font-semibold p-2 rounded-lg transition hover:bg-blue-50"
                                                    >
                                                        ดูรายละเอียด
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                                ไม่พบข้อมูลสำนักงานที่ตรงกับเงื่อนไขการค้นหา
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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