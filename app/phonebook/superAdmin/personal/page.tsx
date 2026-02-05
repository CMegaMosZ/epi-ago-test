'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import 'animate.css';
import { useRouter } from 'next/navigation'
import { 
    // ลบ icon ที่ไม่ใช้แล้วออก (Building, ChevronDown, IdCard, Lock, ShieldCheck, LogOut, ChevronLeft, ChevronRight)
    User, Search, CheckCircle, Building,
    Phone, Mail, MapPin, Briefcase, X, UserSearch
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2'

// --- Type Definitions ---
interface UserProfile {
    id: number;
    name: string; // ชื่อ-นามสกุล
    position: string; // ตำแหน่ง
    office: string; // สังกัด/หน่วยงานหลัก
    division: string; // กอง/ส่วน
    officePhone: string; // เบอร์โทรศัพท์สำนักงาน
    internalPhone: string; // เบอร์โทรศัพท์ภายใน
    mobilePhone: string; // เบอร์โทรศัพท์มือถือ
    email: string;
    address: string; // ที่อยู่สำนักงาน
    imageUrl: string; // URL รูปภาพ
}

// --- Mock Data ---
// Mock Data สำหรับ Dropdown ไม่จำเป็นต้องใช้แล้ว แต่คงไว้เผื่อการใช้งานในอนาคต
// const positions = ['อัยการพิเศษฝ่าย', 'อัยการผู้เชี่ยวชาญ', 'เลขาธิการสำนักงานอัยการสูงสุด', 'นิติกรปฏิบัติการ', 'เจ้าหน้าที่ธุรการ' , 'แม่บ้าน'];
// const offices = ['สำนักงานอัยการสูงสุด (สอ.)', 'สำนักงานอัยการภาค 1', 'สำนักงานอัยการจังหวัดนนทบุรี (สอจ.นนทบุรี)','สำนักงานเลขานุการผู้บริหาร'];

const mockUserProfiles: UserProfile[] = [
    {
        id: 1,
        name: 'นายสมชาย ใจดี',
        position: 'อัยการผู้เชี่ยวชาญ',
        office: 'สำนักงานอัยการสูงสุด (สอ.)',
        division: 'กองคดีอาญา',
        officePhone: '02-123-4567',
        internalPhone: '1201',
        mobilePhone: '098-765-4321',
        email: 'somchai.j@ago.go.th',
        address: 'อาคารราชบุรีดิเรกฤทธิ์ ชั้น 10',
        imageUrl: '/images/user1.jpg',
    },
    {
        id: 2,
        name: 'นางสาวกานดา อุ่นใจ',
        position: 'นิติกรปฏิบัติการ',
        office: 'สำนักงานอัยการจังหวัดนนทบุรี (สอจ.นนทบุรี)',
        division: 'ส่วนคดีแพ่ง',
        officePhone: '02-555-8888',
        internalPhone: '2501',
        mobilePhone: '081-234-5678',
        email: 'kanda.u@ago.go.th',
        address: 'ศาลากลางจังหวัดนนทบุรี',
        imageUrl: '/images/user2.jpg',
    },
    {
        id: 3,
        name: 'นายปรีชา สุขสันต์',
        position: 'เลขาธิการสำนักงานอัยการสูงสุด',
        office: 'สำนักงานอัยการสูงสุด (สอ.)',
        division: 'สำนักงานเลขาธิการ',
        officePhone: '02-111-2222',
        internalPhone: '1000',
        mobilePhone: '089-000-1111',
        email: 'preecha.s@ago.go.th',
        address: 'อาคารราชบุรีดิเรกฤทธิ์ ชั้น 4',
        imageUrl: '/images/user3.jpg',
    },
    { 
        id: 4, 
        name: 'ชาญชัย แกล้วกล้า', 
        position: 'รองอัยการสูงสุด', 
        office: 'สำนักงานอัยการสูงสุด', 
        division: 'คณะทำงานพิเศษ', 
        officePhone: '02-987-6543', 
        internalPhone: '3003', 
        mobilePhone: '083-555-6666', 
        email: 'chanchai@ago.go.th', 
        address: 'ศูนย์ราชการฯ อาคาร A', 
        imageUrl: '/images/user4.jpg' 
    },
        { 
        id: 5, 
        name: 'นางสาวเล็ก เบาจัง', 
        position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ', 
        office: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร', 
        division: 'สำนักงานเลขาธิการ', 
        officePhone: '02-987-6533', 
        internalPhone: '533', 
        mobilePhone: '083-525-1246', 
        email: 'lek@ago.go.th', 
        address: 'ศูนย์ราชการฯ อาคาร B', 
        imageUrl: '/images/user5.jpg' 
    },
    { 
        id: 6, 
        name: 'นายกฤติธี ทองดี', 
        position: 'นิติกรปฏิบัติการ', 
        office: 'สำนักงานอัยการพิเศษฝ่ายคดีอาญากรุงเทพใต้ 4', 
        division: 'สำนักงานเลขาธิการ', 
        officePhone: '0-2211-0311', 
        internalPhone: '212', 
        mobilePhone: '08-9782-9532', 
        email: 'kritithee@ago.go.th', 
        address: 'สำนักงานอัยการสูงสุด อาคารกรุงเทพใต้ ชั้น 2 ถ.เจริญกรุง 53 แขวงยานนาวา เขตสาทร กรุงเทพมหานคร', 
        imageUrl: '/images/user6.jpg' 
    },
        { 
        id: 7, 
        name: 'นายอับดุลฟาตะห์ หะยีแวสะมะแอ', 
        position: 'พนักงานขับรถยนต์ (จ้างเหมาบริการ)', 
        office: 'สำนักงานอัยการจังหวัดนราธิวาส', 
        division: 'สำนักอำนวยการ', 
        officePhone: '0-7353-2032', 
        internalPhone: '032', 
        mobilePhone: '08-0246-4387', 
        email: 'abdulfatah@ago.go.th', 
        address: 'สำนักงานอัยการจังหวัดนราธิวาส', 
        imageUrl: '/images/user7.jpg' 
    },
];


// --- SearchableDropdown Component (ถูกลบออกไป) ---
// const SearchableDropdown = ...


// --- UserProfileCard Component (คงไว้เหมือนเดิม) ---
const UserProfileCard = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform overflow-hidden">
                
                {/* Modal Header */}
                <div className="p-4 border-b flex justify-between items-center bg-orange-600 text-white">
                    <h3 className="text-xl font-bold flex items-center">
                        <User size={24} className="mr-2" />
                        ข้อมูลบุคลากร
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4">
                    
                    {/* Profile Header */}
                    <div className="flex items-start space-x-4 border-b pb-4">
                        {/* <img 
                            src={user.imageUrl || '/images/default-user.jpg'} 
                            alt={user.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 flex-shrink-0"
                        /> */}
                        <div>
                            <p className="text-xl font-extrabold text-gray-900">{user.name}</p>
                            <p className="text-sm text-blue-600 font-medium flex items-center mt-1">
                                <Briefcase size={14} className="mr-1"/>{user.position}
                            </p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-gray-700 flex items-center"><Phone size={18} className="mr-2"/>ข้อมูลติดต่อ</h4>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">เบอร์โทรศัพท์สำนักงาน:</span>
                            <span className="font-medium text-blue-600">{user.officePhone}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">เบอร์โทรศัพท์ภายใน:</span>
                            <span className="font-medium text-blue-600">{user.internalPhone}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">เบอร์โทรศัพท์มือถือ:</span>
                            <span className="font-medium text-blue-600">{user.mobilePhone}</span>
                        </div>
                        <div className="flex items-center text-sm space-x-2 pt-2">
                            <Mail size={16} className="text-gray-500 flex-shrink-0"/>
                            <span className="text-gray-600 truncate">{user.email}</span>
                        </div>
                    </div>

                    {/* Office Details */}
                    <div className="pt-4 border-t space-y-2">
                        <h4 className="font-bold text-gray-700 flex items-center"><Briefcase size={18} className="mr-2"/>หน่วยงาน</h4>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">สังกัดหลัก:</span>
                            <span className="font-medium text-gray-800">{user.office}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">กอง/ส่วน:</span>
                            <span className="font-medium text-gray-800">{user.division}</span>
                        </div>
                        <div className="flex items-start text-sm space-x-2 pt-2">
                            <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-1"/>
                            <p className="text-sm text-gray-600">{user.address}</p>
                        </div>
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


// --- Main Component: Personnel Search Page ---

const PersonnelSearchPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState({
    name: '',       // ชื่อ
    position: '',   // ตำแหน่ง
    office: '',     // สำนักงาน
    });
    // const [searchPosition, setSearchPosition] = useState('');
    // const [searchOffice, setSearchOffice] = useState('');
const [searchResultsCount, setSearchResultsCount] = useState(0);
    const [showResults, setShowResults] = useState(false);
    // const [isSearchSuccessOpen, setIsSearchSuccessOpen] = useState(false);
    const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name' | 'position' | 'office') => {
    setSearchQuery(prev => ({
        ...prev,
        [field]: e.target.value,
        }));
    };
    const filteredUsers = useMemo(() => {
        const nameQuery = searchQuery.name.toLowerCase().trim();
        const positionQuery = searchQuery.position.toLowerCase().trim();
        const officeQuery = searchQuery.office.toLowerCase().trim();

        return mockUserProfiles.filter(user => {
            // 1. เงื่อนไข Name (รวม Name, Email, MobilePhone)
            // ถ้า nameQuery ว่าง ให้ถือว่าเงื่อนไขนี้ผ่าน
            const nameMatch = !nameQuery || (
                user.name.toLowerCase().includes(nameQuery) ||
                user.email.toLowerCase().includes(nameQuery) ||
                user.mobilePhone.includes(nameQuery)
            );

            // 2. เงื่อนไข Position
            const positionMatch = !positionQuery || user.position.toLowerCase().includes(positionQuery);

            // 3. เงื่อนไข Office
            const officeMatch = !officeQuery || user.office.toLowerCase().includes(officeQuery);
            
            // AND Logic: ต้องตรงทุกเงื่อนไขที่ถูกกรอก
            return nameMatch && positionMatch && officeMatch;
        });

    }, [searchQuery]); // Dependency คือ searchQuery object
    
    // ----------------------------------------------------
    // ✅ 4. Handler สำหรับการค้นหา (ใช้ Swal แทน Modal เก่า)
    // ----------------------------------------------------
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();

        const isAllFieldsEmpty = 
            !searchQuery.name.trim() && 
            !searchQuery.position.trim() && 
            !searchQuery.office.trim();

        if (isAllFieldsEmpty) {
            // ✅ ใช้ SweetAlert2 แจ้งเตือนเมื่อไม่กรอกข้อมูล
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
        
        // ดำเนินการค้นหา
        const results = filteredUsers;
        const count = results.length;
        setSearchResultsCount(count);
        // setShowResults(false);
        // setIsSearchSuccessOpen(true);
        // ✅ ใช้ SweetAlert2 แจ้งเตือนความสำเร็จ
if (count > 0) {
            // ✅ กรณีที่ 1: พบข้อมูล
            Swal.fire({
                icon: 'success',
                title: 'ค้นหาสำเร็จ',
                html: `พบข้อมูลบุคลากรจำนวน <span class="font-bold text-green-600 text-xl">${count}</span> รายการ`,
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#2563EB',
                customClass: { container: 'z-[9999]' },
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    setShowResults(true); // แสดงตารางผลลัพธ์
                }
            });
        } else {
            // ❌ กรณีที่ 2: ไม่พบข้อมูล
            setShowResults(false); // ซ่อนตารางผลลัพธ์เก่า (ถ้ามี)
            Swal.fire({
                icon: 'error',
                title: 'ไม่พบข้อมูล',
                text: 'ไม่พบข้อมูลบุคลากรที่ตรงตามเงื่อนไขที่คุณระบุ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#EF4444',
                customClass: { container: 'z-[9999]' },
                            showClass: {
                                popup: `animate__animated
                                animate__bounceIn
                                animate__faster`},
                            hideClass: {
                                popup: `animate__animated
                                animate__fadeOut
                                animate__faster`}
            });
        }
    };

    // ----------------------------------------------------
    // 5. Handler สำหรับการล้างข้อมูล
    // ----------------------------------------------------
    const handleClear = () => {
        setSearchQuery({ name: '', position: '', office: '' }); // รีเซ็ตทุกช่อง
        setShowResults(false);
        setSearchResultsCount(0);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-4 sm:p-6 lg:p-8">
                
                {/* --- Page Title --- */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Search size={30} className="mr-3 text-orange-600" />
                        ระบบค้นหาข้อมูลบุคลากร
                    </h1>
                    <p className="text-gray-500 mt-1">ระบุชื่อ-นามสกุล เพื่อค้นหาบุคลากร</p>
                </div>

                {/* Search Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    
                    {/* Input Fields (3 Columns) */}
                    <div className="space-y-4">
                        
                        {/* 1. ช่องค้นหาชื่อ/บุคคล */}
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-1">ชื่อ-นามสกุล</label>
                            <div className="relative">
                                <UserSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="ชื่อ นามสกุล"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery.name} // ✅ ใช้ searchQuery.name
                                    onChange={(e) => handleSearchInputChange(e, 'name')} // ✅ ใช้ handler ใหม่
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* 2. ช่องค้นหาตำแหน่ง */}
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-1">ตำแหน่ง</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="ตำแหน่ง"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery.position} // ✅ ใช้ searchQuery.position
                                    onChange={(e) => handleSearchInputChange(e, 'position')} // ✅ ใช้ handler ใหม่
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* 3. ช่องค้นหาสำนักงาน */}
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700 block mb-1">สำนักงาน</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="สำนักงาน"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery.office} // ✅ ใช้ searchQuery.office
                                    onChange={(e) => handleSearchInputChange(e, 'office')} // ✅ ใช้ handler ใหม่
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                    
                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button 
                            type="button" 
                            onClick={handleClear} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            ล้างข้อมูล
                        </button>
                        <button 
                            type="submit" 
                            className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            <Search size={20} />
                            <span>ค้นหา</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* ❌ Modal แจ้งเตือนการค้นหา (ถูกลบออกไปแล้ว เพราะเปลี่ยนไปใช้ Swal) */}
            
            {/* Search Results Table */}
            {showResults && (
                <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        ผลการค้นหา{/*  ({searchResultsCount} รายการ) */}
                    </h2>
                    
                    {searchResultsCount === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            ไม่พบข้อมูลบุคลากรที่ตรงกับเงื่อนไขการค้นหา
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สำนักงาน</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.office}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsProfileCardOpen(true);
                                                }}
                                                className="text-orange-600 hover:text-orange-900 transition-colors"
                                            >
                                                ดูข้อมูล
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modal ค้นหาสำเร็จ (ใช้ Modal JSX ตัวเดิม) */}
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

            {/* User Profile Card Modal */}
            {isProfileCardOpen && selectedUser && (
                <UserProfileCard 
                    user={selectedUser} 
                    onClose={() => setIsProfileCardOpen(false)} 
                />
            )}
            </main>
        </div>
    )
}

export default PersonnelSearchPage