'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
    Menu, User, IdCard, Building, Search, 
    ShieldCheck, LogOut, ChevronDown, CheckCircle,
    ChevronLeft, ChevronRight, Lock, Icon
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Swal from 'sweetalert2'

    interface UserProfile {
    id: string;
    name: string;
    position: string;
    office: string;
    email: string;
    phone: string;
    internalPhone: string;
    address: string;
}

// Mock Data สำหรับ Dropdown
const positions = ['อัยการพิเศษฝ่าย', 'อัยการผู้เชี่ยวชาญ', 'เลขาธิการสำนักงานอัยการสูงสุด', 'นิติกรปฏิบัติการ', 'เจ้าหน้าที่ธุรการ' , 'แม่บ้าน'];
const offices = ['สำนักงานอัยการสูงสุด (สอ.)', 'สำนักงานอัยการภาค 1', 'สำนักงานอัยการจังหวัดนนทบุรี (สอจ.นนทบุรี)','สำนักงานเลขานุการผู้บริหาร'];
// --- SearchableDropdown Component ---
const SearchableDropdown = ({ label, icon: Icon, options, value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState(value); // ใช้เก็บค่าที่ผู้ใช้พิมพ์
    const [isListOpen, setIsListOpen] = useState(false); // ควบคุมการเปิด/ปิด List
    
    // กรองรายการตามคำค้นหา
    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // เมื่อเลือกรายการจาก List
    const handleSelect = (option) => {
        setSearchTerm(option);
        onChange(option); // ส่งค่าที่เลือกกลับไปที่ Parent State (formData)
        setIsListOpen(false); // ปิด List
    };

    // เมื่อมีการพิมพ์
    const handleInputChange = (e) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        onChange(newTerm); // ส่งค่าที่พิมพ์กลับไป Parent State
        setIsListOpen(true); // เปิด List ทุกครั้งที่มีการพิมพ์
    };

    return (
        <div className="relative w-full">
            <div className="flex items-end gap-3 w-full">
                {/* Icon */}
                <div className="pb-2 text-gray-500">
                    <Icon size={22} />
                </div>
                {/* เส้นแบ่งแนวตั้ง */}
                <div className="h-6 w-px bg-gray-300 mb-2"></div>
                
                {/* Input Field */}
                <div className="flex-1 border-b border-gray-300 pb-1 focus-within:border-blue-500 transition-colors relative">
                    <input
                        type="text"
                        placeholder={label}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsListOpen(true)}
                        onBlur={() => {
                            // หน่วงเวลาเล็กน้อยก่อนปิด list เพื่อให้ทันคลิก
                            setTimeout(() => setIsListOpen(false), 200);
                        }}
                        className="w-full outline-none text-gray-700 placeholder-gray-400"
                        autoComplete="off"
                    />
                    {/* Arrow Icon */}
                    <div className="absolute right-0 bottom-2 pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Dropdown List */}
            {isListOpen && (searchTerm.length > 0 || filteredOptions.length > 0) && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                    {/* เพิ่ม "ทั้งหมด" เป็นตัวเลือกแรกเสมอ */}
                    <div 
                        className="p-3 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium border-b border-gray-100"
                        onMouseDown={() => handleSelect('')} // ใช้ onMouseDown แทน onClick เพื่อแก้ปัญหา onBlur
                    >
                        {label} ทั้งหมด
                    </div>
                    
                    {/* รายการที่ถูกกรอง */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => handleSelect(option)} // ใช้ onMouseDown
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-gray-500">
                            ไม่พบรายการ
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};



const mockSearchResultsData = [
{
    id: 1,
    name: 'นางสาววริศรา บัวสมบูรณ์',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานเลขานุการผู้บริหาร',
    division: 'เจ้าหน้าที่ประจำห้องผู้ตรวจการอัยการ (นายปรีชา สุดสงวน)',
    officePhone: '0-2142-1767',
    internalPhone: '21767',
    mobilePhone: '08-5967-6315',
    imageUrl: 'https://via.placeholder.com/50x50/3498db/ffffff?text=W'},
{
    id: 2,
    name: 'นายปฐวี วันดี',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานเลขานุการผู้บริหาร',
    division: 'เจ้าหน้าที่ประจำห้องผู้ตรวจการอัยการ (นายพงษ์ศักดิ์ รัตนะพิสิฐ)',
    officePhone: '0-2142-3866',
    internalPhone: '23866',
    mobilePhone: '08-0593-7725',
    imageUrl: 'https://via.placeholder.com/50x50/f1c40f/333333?text=P'},

{
    id: 3,
    name: 'นายเทพจุติ พรหมเทศน์',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานอัยการพิเศษฝ่ายคณะกรรมการ 1',
    division: '',
    officePhone: '0-2142-1830',
    internalPhone: '21830',
    mobilePhone: '09-1698-9546',
    imageUrl: 'https://via.placeholder.com/50x50/2ecc71/ffffff?text=T'},
{
    id: 4,
    name: 'นางสาวชลิตา คงประเสริฐ',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานอัยการพิเศษฝ่ายคณะกรรมการ 1',
    division: '',
    officePhone: '0-2142-2166',
    internalPhone: '22166',
    mobilePhone: '08-9643-5369',
    imageUrl: 'https://via.placeholder.com/50x50/e74c3c/ffffff?text=C'},
{
    id: 5,
    name: 'นางสาวอรวรรยา ปัทมพันธุ์',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานอัยการพิเศษฝ่ายคณะกรรมการ 2',
    division: 'งานสรรหา บรรจุ และแต่งตั้ง',
    officePhone: '0-2141-2207',
    internalPhone: '12207',
    mobilePhone: '06-2541-4932',
    imageUrl: 'https://via.placeholder.com/50x50/9b59b6/ffffff?text=A'},
{
    id: 6,
    name: 'นางสาวปาลิตา โซวเซ็ง',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานอัยการพิเศษฝ่ายคณะกรรมการ 2',
    division: 'งานสรรหา บรรจุ และแต่งตั้ง',
    officePhone: '0-2141-2207',
    internalPhone: '12207',
    mobilePhone: '09-3791-8799',
    imageUrl: 'https://via.placeholder.com/50x50/f1c40f/333333?text=P'},
{
    id: 7,
    name: 'นายรักดี ไม่รักเดียว',
    position: 'นิติกรปฏิบัติการ',
    office: 'สำนักงานอัยการพิเศษฝ่ายคณะกรรมการ 2',
    division: '',
    officePhone: '0-2141-2207',
    internalPhone: '12207',
    mobilePhone: '09-3791-8799',
    imageUrl: 'https://via.placeholder.com/50x50/f1c40f/333333?text=R'},
    {
    id: 8,
    name: 'นางสาวฮยอง เซ็งจุง',
    position: 'นักจัดการงานทั่วไปชำนาญการ',
    office: 'สำนักงานคดีศาลแขวง',
    division: '',
    officePhone: '0-2111-2223',
    internalPhone: '12223',
    mobilePhone: '09-3791-8799',
    imageUrl: 'https://via.placeholder.com/50x50/f1c40f/333333?text=H'},
    {
    id: 9,
    name: 'นางอมร ออนมะ',
    position: 'เจ้าหน้าที่บริหารงานทั่วไป',
    office: 'สำนักงานอัยการพิเศษฝ่ายคดียาเสพติด',
    division: '',
    officePhone: '0-2100-1234',
    internalPhone: '1234',
    mobilePhone: '08-3444-3333',
    imageUrl: 'https://via.placeholder.com/50x50/f1c40f/333333?text=A'},
    {
    id: 10,
    name: 'นายวิศวะ เวรกรรม',
    position: 'นักวิชาการคอมพิวเตอร์ปฏิบัติการ',
    office: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร (สทส.)',
    division: 'กลุ่มพัฒนาระบบเทคโนโลยีสารสนเทศและนวัตกรรม',
    officePhone: '0-2515-4178',
    internalPhone: '4178',
    mobilePhone: '09-9881-8288',
    imageUrl: 'https://via.placeholder.com/50x50/f1c40f/333333?text=V'},
];

export default function SearchPage() {
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const pathname = usePathname();
const menuItems = [
    { name: "ค้นหาบุคลากร", icon: User, href: "/phonebook/auth/personal" },
    { name: "ค้นหาสำนักงาน", icon: Building, href: "/phonebook/auth/department" }, // ตรวจสอบ path นี้ให้ตรงกับที่คุณสร้าง
    { name: "เปลี่ยนรหัสผ่าน", icon: Lock, href: "/phonebook/auth/changePassword" },
];
const [isSearchAlertOpen, setIsSearchAlertOpen] = useState(false);
const [isSearchSuccessOpen, setIsSearchSuccessOpen] = useState(false);
const [searchResultsCount, setSearchResultsCount] = useState(0); // เก็บจำนวนผลลัพธ์;
const [showResults, setShowResults] = useState(false);
const [isOfficeDetailOpen, setIsOfficeDetailOpen] = useState(false);
const [selectedOffice, setSelectedOffice] = useState(null); // เก็บข้อมูลสำนักงานที่เลือก
const [filteredData, setFilteredData] = useState(mockSearchResultsData);

  // State สำหรับฟอร์มค้นหา
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
});

const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
const isEmpty = !formData.firstName.trim() && !formData.lastName.trim();
    if (isEmpty) {
        setIsSearchAlertOpen(true);
        return;
    }

// 2. LOGIC การกรองข้อมูล (Filtering)
    const results = mockSearchResultsData.filter((item) => {
        // เตรียมคำค้นหา (แปลงเป็น lowercase และตัดช่องว่าง)
        const searchFirst = formData.firstName.trim().toLowerCase();
        const searchLast = formData.lastName.trim().toLowerCase();

        // รวมชื่อเต็มของรายการใน mock data และแปลงเป็น lowercase
        const itemNameLower = item.name.toLowerCase();

        // ตรวจสอบ: ถ้ามีคำค้นหาชื่อ (searchFirst) ต้องมีคำนั้นอยู่ใน itemNameLower
        const matchFirstName = searchFirst 
            ? itemNameLower.includes(searchFirst) 
            : true;

        // ตรวจสอบ: ถ้ามีคำค้นหานามสกุล (searchLast) ต้องมีคำนั้นอยู่ใน itemNameLower
        const matchLastName = searchLast 
            ? itemNameLower.includes(searchLast) 
            : true;

        // ต้องตรงตามเงื่อนไขการค้นหาทั้งชื่อและนามสกุล (ถ้ามีการกรอก)
        // เช่น กรอก ชื่อ: 'วริศ', นามสกุล: 'บัว' จะพบ 'นางสาววริศรา บัวสมบูรณ์'
        return matchFirstName && matchLastName;
    });
    // 3. อัปเดต State
    setFilteredData(results); // อัปเดตข้อมูลที่ใช้แสดงในตาราง
    setSearchResultsCount(results.length); // อัปเดตจำนวนผลลัพธ์
    
    // 4. แสดง Success Modal
    setShowResults(false); // ตั้งค่าให้ซ่อนตารางก่อน (เพื่อให้ Modal ทำงาน)
    setIsSearchSuccessOpen(true);


    // Actual search logic (ถ้ามีข้อมูลให้ค้นหา)
const count = Math.floor(Math.random() * 500) + 1; 
    setSearchResultsCount(count);
    
    // 2. แสดง Success Modal
    setIsSearchSuccessOpen(true);

    // --- SearchableDropdown Component ---
const SearchableDropdown = ({ label, icon: Icon, options, value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState(value); // ใช้เก็บค่าที่ผู้ใช้พิมพ์
    const [isListOpen, setIsListOpen] = useState(false); // ควบคุมการเปิด/ปิด List
    
    // กรองรายการตามคำค้นหา
    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // เมื่อเลือกรายการจาก List
    const handleSelect = (option) => {
        setSearchTerm(option);
        onChange(option); // ส่งค่าที่เลือกกลับไปที่ Parent State (formData)
        setIsListOpen(false); // ปิด List
    };

    // เมื่อมีการพิมพ์
    const handleInputChange = (e) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        onChange(newTerm); // ส่งค่าที่พิมพ์กลับไป Parent State
        setIsListOpen(true); // เปิด List ทุกครั้งที่มีการพิมพ์
    };
};

const handleOfficeClick = (officeName: string) => {
    // ป้องกัน undefined error โดยกำหนดค่าเริ่มต้น
    const details = officeDetails[officeName as keyof typeof officeDetails] || { 
        phone: 'ไม่ระบุ', 
        fax: 'ไม่ระบุ', 
        address: 'ไม่พบข้อมูลที่อยู่',
        email: 'ไม่ระบุ',
        web: 'ไม่ระบุ'
    };
    setSelectedOffice({ name: officeName, ...details });
    setIsOfficeDetailOpen(true);
};

return (
        <div className="relative w-full">
            <div className="flex items-end gap-3 w-full">
                {/* Icon */}
                <div className="pb-2 text-gray-500">
                    <Icon size={22} />
                </div>
                {/* เส้นแบ่งแนวตั้ง */}
                <div className="h-6 w-px bg-gray-300 mb-2"></div>
                
                {/* Input Field */}
                <div className="flex-1 border-b border-gray-300 pb-1 focus-within:border-blue-500 transition-colors relative">
                    <input
                        type="text"
                        placeholder={label}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsListOpen(true)}
                        onBlur={() => {
                            // หน่วงเวลาเล็กน้อยก่อนปิด list เพื่อให้ทันคลิก
                            setTimeout(() => setIsListOpen(false), 200);
                        }}
                        className="w-full outline-none text-gray-700 placeholder-gray-400"
                        autoComplete="off"
                    />
                    {/* Arrow Icon */}
                    <div className="absolute right-0 bottom-2 pointer-events-none text-gray-400">
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Dropdown List */}
            {isListOpen && (searchTerm.length > 0 || filteredOptions.length > 0) && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                    {/* เพิ่ม "ทั้งหมด" เป็นตัวเลือกแรกเสมอ */}
                    <div 
                        className="p-3 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium border-b border-gray-100"
                        onMouseDown={() => handleSelect('')} // ใช้ onMouseDown แทน onClick เพื่อแก้ปัญหา onBlur
                    >
                        {label} ทั้งหมด
                    </div>
                    
                    {/* รายการที่ถูกกรอง */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => handleSelect(option)} // ใช้ onMouseDown
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-gray-500">
                            ไม่พบรายการ
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

return (
    <div className="flex h-screen w-full bg-gray-100 font-sans text-sm">
      {/* --- A. Sidebar (แบบย่อ/ขยายได้) --- */}
{/* --- A. Sidebar (วางทับของเดิม) --- */}
      <aside 
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out hidden md:flex
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-gray-100 flex items-center justify-center h-20 overflow-hidden`}>
           <h1 className={`font-bold text-gray-700 transition-all duration-300 ${isSidebarOpen ? 'text-2xl' : 'text-sm'}`}>
             {isSidebarOpen ? 'OAG' : 'OAG'}
           </h1>
        </div>
        
        {/* Menu Items */}
        <nav className="flex-1 py-4 space-y-1">
           {menuItems.map((item) => {
               // ตรวจสอบว่าหน้านี้คือหน้าปัจจุบันหรือไม่
               const isActive = pathname === item.href;
               
               return (
                   <Link 
                       key={item.href}
                       href={item.href}
                       className={`
                           flex items-center gap-3 px-4 py-3 transition-colors relative group
                           ${isActive 
                               ? 'bg-gray-200 text-gray-900 border-l-4 border-gray-600' // สไตล์เมื่อ Active (ตามภาพ)
                               : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent' // สไตล์ปกติ
                           }
                       `}
                   >
                      <div className={`${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                          <item.icon size={20} />
                      </div>
                      
                      <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'w-0 opacity-0'}`}>
                          {item.name}
                      </span>
                      
                      {/* Tooltip ตอนพับจอ */}
                      {!isSidebarOpen && (
                          <div className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                              {item.name}
                          </div>
                      )}
                   </Link>
               )
           })}
        </nav>
        
        {/* Footer Version */}
        <div className="p-4 border-t text-center text-xs text-gray-400">
           v.5.4.0
        </div>
      </aside>

      {/* --- B. Main Content --- */}
      <main className="flex-1 flex flex-col min-w-0">
         
         {/* Header */}
         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:bg-gray-100 p-2 rounded">
                    <Menu size={20} />
                </button>
                <h1 className="text-gray-700 font-medium text-lg">สมุดโทรศัพท์ สำนักงานอัยการสูงสุด</h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">ชื่อจริง นามสกุล</span>
                <Link href="/" className="text-red-500 text-xs hover:underline flex items-center gap-1">
                    <LogOut size={12} /> Logout
                </Link>
            </div>
         </header>

         {/* Content Area */}
         <div className="flex-1 p-6 md:p-10 overflow-auto">
            
 {/* Card Search Form */}
            <div className="w-full max-w-7xl mx-auto bg-white shadow rounded-sm overflow-hidden mb-8">
                <div className="bg-[#0f3fa6] text-white p-4 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    <h2 className="text-lg font-medium">ข้อมูลบุคลากร</h2>
                </div>
                <form onSubmit={handleSearch} className="p-8 space-y-8">
                    {/* ... (Search Fields code เดิม) ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex items-end gap-3 w-full">
                            <div className="pb-2 text-gray-500"><User size={22} /></div>
                            <div className="h-6 w-px bg-gray-300 mb-2"></div> 
                            <div className="flex-1 border-b border-gray-300 pb-1 focus-within:border-blue-500 transition-colors">
                                <input type="text" placeholder="ชื่อ" className="w-full outline-none text-gray-700 placeholder-gray-400" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex items-end gap-3 w-full">
                            <div className="pb-2 text-transparent"><User size={22} /></div> 
                            <div className="h-6 w-px bg-gray-300 mb-2 opacity-0 md:opacity-100"></div>
                            <div className="flex-1 border-b border-gray-300 pb-1 focus-within:border-blue-500 transition-colors">
                                <input type="text" placeholder="นามสกุล" className="w-full outline-none text-gray-700 placeholder-gray-400" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    {/* ✅ Row 2: ตำแหน่ง (ใช้ SearchableDropdown แทน select) */}
                            {/* <SearchableDropdown
                                label="ตำแหน่ง"
                                icon={IdCard}
                                options={positions}
                                value={formData.position}
                                onChange={(value) => setFormData({...formData, position: value})}
                            /> */}

                            {/* ✅ Row 3: สำนักงาน (ใช้ SearchableDropdown แทน select) */}
                            {/* <SearchableDropdown
                                label="สำนักงาน"
                                icon={Building}
                                options={offices}
                                value={formData.office}
                                onChange={(value) => setFormData({...formData, office: value})}
                            /> */}
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-[#ff9800] hover:bg-[#f57c00] text-white font-medium py-3 rounded shadow-sm flex items-center justify-center gap-2 transition-colors text-lg">
                            <Search size={22} /> ค้นหา
                        </button>
                    </div>
                </form>
            </div>

            {/* ✅ 3. Results Table (แสดงเมื่อ showResults เป็น True) */}
            {showResults && (
                <div className="w-full max-w-7xl mx-auto bg-white shadow rounded-sm overflow-hidden mb-10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
<thead>
    <tr className="bg-gray-50 border-b border-gray-200">
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap">รูปภาพ</th> {/* ✅ เพิ่มคอลัมน์รูปภาพ */}
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap">ชื่อ-นามสกุล</th>
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap">ตำแหน่ง</th>
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap">สำนักงาน</th>
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap">กลุ่มงาน/ฝ่าย</th>
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap text-center">เบอร์โทรสำนักงาน</th>
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap text-center">เบอร์โทรภายใน</th>
        <th className="p-4 font-semibold text-gray-600 text-xs md:text-sm whitespace-nowrap text-center">เบอร์โทรศัพท์มือถือ</th>
    </tr>
</thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            {/* ... โค้ดแสดงผลลัพธ์ของแต่ละแถว ... */}
                                            <td className="p-2 w-16">
                                                <img 
                                                    src={item.imageUrl}
                                                    alt={`รูปภาพของ ${item.name}`} 
                                                    className="w-10 h-10 object-cover rounded-full shadow-md border-2 border-gray-200"
                                                    width={40} // กำหนดขนาดสำหรับ Performance
                                                    height={40}
                                                />
                                            </td>
                                            <td className="p-4 font-bold text-gray-800 whitespace-nowrap">{item.name}</td>
                                            <td className="p-4 font-bold text-gray-800 whitespace-nowrap">{item.name}</td>
                                            <td className="p-4 text-gray-700 whitespace-nowrap">{item.position}</td>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => handleOfficeClick(item.office)} 
                                                    className="text-blue-500 hover:underline cursor-pointer min-w-[200px] text-left"
                                                >
                                                    {item.office}
                                                </button>
                                            </td>
                                            <td className="p-4 text-gray-600 min-w-[150px]">{item.division}</td>
                                            
                                            {/* Phone Columns with Badges */}
                                            <td className="p-4 text-center">
                                                {item.officePhone && (
                                                    <span className="inline-block bg-[#eeeeee] text-gray-800 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                        {item.officePhone}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {item.internalPhone && (
                                                    <span className="inline-block bg-[#eeeeee] text-gray-800 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                        {item.internalPhone}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {item.mobilePhone && (
                                                    <span className="inline-block bg-[#eeeeee] text-gray-800 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                        {item.mobilePhone}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // ✅ เพิ่ม: แสดงเมื่อไม่พบข้อมูล
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500">
                                            ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ 4. Pagination (ด้านล่างตาราง) */}
                    <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-white gap-4 text-gray-600 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <div className="relative">
                                <select className="appearance-none bg-gray-50 border border-gray-200 rounded py-1 pl-2 pr-6 focus:outline-none focus:border-blue-500 cursor-pointer">
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"/>
                            </div>
                        </div>
                        
                        <span>1-50 of 100</span>
                        
                        <div className="flex items-center gap-2">
                            <button className="p-1 rounded hover:bg-gray-100 disabled:opacity-50">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

         </div>
      </main>

{isOfficeDetailOpen && selectedOffice && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"> {/* z-index สูงสุด */}
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                          <Building size={24} className="text-gray-500" />
                          ข้อมูลสำนักงาน
                      </h3>
                      <button onClick={() => setIsOfficeDetailOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-4">
                      
                      {/* ชื่อสำนักงาน */}
                      <div className="pb-2 border-b border-gray-100">
                          <p className="text-sm text-gray-500 mb-1">ชื่อสำนักงาน</p>
                          <p className="text-lg font-medium text-gray-800">{selectedOffice.name}</p>
                      </div>

                      {/* รายละเอียด */}
                      <div className="space-y-3 text-sm md:text-base text-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                              <span className="font-semibold text-gray-900">อีเมล :</span>
                              <span className="text-blue-600 hover:underline cursor-pointer">{selectedOffice.email}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                              <span className="font-semibold text-gray-900">เบอร์โทรสำนักงาน :</span>
                              <span>{selectedOffice.phone}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                              <span className="font-semibold text-gray-900">แฟกซ์ :</span>
                              <span>{selectedOffice.fax}</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2">
                              <span className="font-semibold text-gray-900">ที่อยู่หน่วยงาน :</span>
                              <span className="text-blue-600 hover:underline cursor-pointer leading-relaxed">{selectedOffice.web || selectedOffice.address}</span>
                          </div>
                      </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
                      <button
                          type="button"
                          onClick={() => setIsOfficeDetailOpen(false)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm transition-colors"
                      >
                          ปิด
                      </button>
                  </div>
              </div>
          </div>
      )}

{isSearchAlertOpen && (
<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40 p-4">
                  <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden text-center transform transition-all">
                  
                  {/* Modal Header/Icon Area */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex flex-col items-center">
                          {/* Icon Area: Yellow/Orange Warning Circle */}
                          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                              {/* Icon (Simulating Exclamation Mark) */}
                              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                          </div>
                          {/* Content */}
                          <div className="mt-3 text-center w-full">
                              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                                  แจ้งเตือน
                              </h3>
                              <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                      กรุณากรอกข้อมูลการค้นหา
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Modal Footer (Button) */}
                  <div className="bg-gray-50 px-4 py-3 flex justify-center border-t">
                      <button
                          type="button"
                          onClick={() => setIsSearchAlertOpen(false)}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                      >
                          ตกลง
                      </button>
                  </div>
              </div>
          </div>
      )}

      {isSearchSuccessOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden text-center transform transition-all">
                  
                  {/* Modal Header/Icon Area (สีเขียว) */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex flex-col items-center">
                          {/* Icon Area: Green Success Circle */}
                          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                              <CheckCircle size={28} className="text-green-600" />
                          </div>
                          {/* Content */}
                          <div className="mt-3 text-center w-full">
                              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">ข้อมูลที่ค้นหา</h3>
                              <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                      {/* แสดงจำนวนผลลัพธ์ */}
                                    พบข้อมูล <span className="text-green-600 font-bold text-base">{searchResultsCount}</span> รายการ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                  {/* Modal Footer (Button) */}
                <div className="bg-gray-50 px-4 py-3 flex justify-center border-t">
<button
                          type="button"
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
        </div>
    )}
    </div>
)}