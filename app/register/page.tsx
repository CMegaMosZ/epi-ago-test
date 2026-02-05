'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UserPlus, Upload, Phone, IdCard } from 'lucide-react' 
import Swal from 'sweetalert2'
import 'animate.css';

// Mock data สำหรับ Dropdowns
const mockTitles = ['นาย', 'นาง', 'นางสาว'];
const mockMemberTypes = ['ข้าราชการ', 'ลูกจ้างประจำ', 'พนักงานราชการ'];
const mockPositions = ['อัยการจังหวัด', 'อัยการผู้เชี่ยวชาญ', 'เจ้าหน้าที่ธุรการ'];
const mockDivisions = ['กองนโยบายและแผน', 'สำนักงานอัยการจังหวัด' , 'สำนักเทคโนฯ (สทส.)'];

// ✅ NEW: ฟังก์ชันสำหรับแปลงขนาดไบต์ (Bytes) ให้เป็นหน่วยที่อ่านง่าย (KB, MB, GB)
const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


// Floating Label Input Component (เพื่อความสะอาดของโค้ด)
const FloatingInput = ({ label, id, value, onChange, type = "text", maxLength = 255, error = '', isRequired = false, isError = false }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, maxLength?: number, error?: string, isRequired?: boolean, isError?: boolean }) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || value.length > 0;
    
    return (
        <div className="relative pt-4">
            <label 
                htmlFor={id}
                className={`
                    absolute left-3 px-1 bg-white pointer-events-none transition-all duration-200 ease-in-out whitespace-nowrap
                    ${isActive ? '-top-[2px] text-xs bg-white' : 'top-[28px] text-base'}
                    ${isError ? 'text-red-500' : (isActive ? 'text-blue-500' : 'text-gray-500')}
                `}
            >
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>

            <input 
                id={id}
                type={type} 
                maxLength={maxLength}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                    w-full py-3 px-3 border rounded focus:outline-none placeholder-transparent
                    transition-all duration-200
                    ${isError ? 'border-red-500 ring-1 ring-red-500' : (isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300')}
                `}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    )
}

// Select Dropdown Component
const SelectDropdown = ({ label, id, value, onChange, options, isRequired = false }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], isRequired?: boolean }) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || value !== '';
    
    return (
        <div className="relative pt-4">
            <label 
                htmlFor={id}
                className={`
                    absolute left-3 px-1 bg-white pointer-events-none transition-all duration-200 ease-in-out whitespace-nowrap
                    ${isActive ? '-top-[2px] text-xs bg-white text-blue-500' : 'top-[28px] text-base text-gray-500'}
                `}
            >
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full py-3 px-3 border rounded focus:outline-none appearance-none bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                <option value="" disabled hidden>{label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 mt-2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};


export default function RegisterPage() {
    const router = useRouter();
    // --- Register States ---
    const [idCard, setIdCard] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [memberType, setMemberType] = useState('');
    const [position, setPosition] = useState('');
    const [division, setDivision] = useState('');
    const [subDivision, setSubDivision] = useState('');
    const [officePhone, setOfficePhone] = useState('');
    const [internalPhone, setInternalPhone] = useState('');
    const [email, setEmail] = useState('');
    // ✅ State สำหรับจัดการไฟล์และ URL แสดงตัวอย่าง
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    // ✅ NEW: State สำหรับขนาดไฟล์ที่แปลงแล้ว
    const [formattedFileSize, setFormattedFileSize] = useState<string>('0 B'); 

    // ✅ Handler สำหรับการอัปโหลดไฟล์ (รวม Logic สร้าง URL และคำนวณขนาดไฟล์)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (uploadedImageUrl) {
            // ล้าง URL ชั่วคราวเก่า เพื่อป้องกัน Memory Leak
            URL.revokeObjectURL(uploadedImageUrl); 
        }

        setUploadedFile(file);

        if (file) {
            // ✅ 1. ตั้งค่าขนาดไฟล์ที่แปลงแล้ว
            setFormattedFileSize(formatBytes(file.size)); 

            if (file.type.startsWith('image/')) {
                // สร้าง URL ชั่วคราวจาก File Object
                const url = URL.createObjectURL(file);
                setUploadedImageUrl(url);
            } else {
                setUploadedImageUrl(null);
            }
        } else {
            setUploadedImageUrl(null);
            // ✅ 2. รีเซ็ตขนาดไฟล์เมื่อไม่มีไฟล์
            setFormattedFileSize('0 B');
        }
    };


const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. ตรวจสอบข้อมูลที่จำเป็น (Validation)
        if (
            !idCard || idCard.length < 13 ||
            !birthDate ||
            !title ||
            !firstName ||
            !lastName ||
            !memberType ||
            !position ||
            !division ||
            !subDivision ||
            !officePhone ||
            !uploadedFile // ตรวจสอบว่าแนบไฟล์หลักฐานหรือยัง
        ) {
            // ❌ แจ้งเตือนเมื่อข้อมูลไม่ครบ
            Swal.fire({
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                text: 'โปรดตรวจสอบฟิลด์ที่มีเครื่องหมาย * และแนบหลักฐานการสมัคร',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#3b82f6', // สีน้ำเงิน
            });
            return;
        }

        // 2. หากข้อมูลครบถ้วน (Simulated Success)
        Swal.fire({
            title: 'ลงทะเบียนสำเร็จ!',
            text: 'ส่งคำขอลงทะเบียนของคุณเข้าสู่ระบบเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#10b981', // สีเขียว
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/'); // ไปหน้า Login หลังจากกดตกลง
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffa657] p-4">
            
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#fd7e0eff]">
                    <h2 className="text-xl font-bold text-gray-700 flex items-center">
                        <UserPlus size={24} className="text-blue-500 mr-2" />
                        ลงทะเบียนเข้าใช้งานระบบสมุดโทรศัพท์
                    </h2>
                    <Link href="/" className="text-sm text-white-500 hover:text-white-700 flex items-center">
                        <ArrowLeft size={16} className="mr-1" /> กลับหน้า Login
                    </Link>
                </div>
                
                <form className="p-6 space-y-6" onSubmit={handleRegister}>

                    {/* Section: บุคลากรสำนักงานอัยการสูงสุด */}
                    <div className="text-red-500 font-medium">
                        (เฉพาะบุคลากรสำนักงานอัยการสูงสุด)
                    </div>
                    
                    {/* Row 1: หมายเลขบัตรประชาชน / วันเกิด */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FloatingInput 
                                label="หมายเลขบัตรประชาชน" 
                                id="regIdCard"
                                value={idCard} 
                                onChange={(e) => setIdCard(e.target.value.replace(/\D/g, ''))}
                                maxLength={13}
                                isRequired={true}
                            />
                            <div className="text-right text-xs pr-1 mt-1 text-gray-400">
                                {idCard.length} / 13
                            </div>
                        </div>
                        <FloatingInput 
                            label="วัน/เดือน/ปีเกิด (DD/MM/YYYY)" 
                            id="regBirthDate"
                            value={birthDate} 
                            onChange={(e) => setBirthDate(e.target.value)}
                            isRequired={true}
                            type="date"
                        />
                    </div>

                    {/* Row 2: คำนำหน้า / ชื่อ / นามสกุล */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectDropdown 
                            label="คำนำหน้า" 
                            id="regTitle" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            options={mockTitles}
                            isRequired={true}
                        />
                        <FloatingInput 
                            label="ชื่อ" 
                            id="regFirstName"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            isRequired={true}
                        />
                        <FloatingInput 
                            label="นามสกุล" 
                            id="regLastName"
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            isRequired={true}
                        />
                    </div>

                    {/* Row 3: ประเภทสมาชิก / ตำแหน่ง */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectDropdown 
                            label="ประเภทสมาชิก" 
                            id="regMemberType" 
                            value={memberType} 
                            onChange={(e) => setMemberType(e.target.value)}
                            options={mockMemberTypes}
                            isRequired={true}
                        />
                        <SelectDropdown 
                            label="ตำแหน่ง" 
                            id="regPosition" 
                            value={position} 
                            onChange={(e) => setPosition(e.target.value)}
                            options={mockPositions}
                            isRequired={true}
                        />
                    </div>

                    {/* Row 4: สำนักงาน / กลุ่มงาน */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectDropdown 
                            label="สำนักงาน" 
                            id="regDivision" 
                            value={division} 
                            onChange={(e) => setDivision(e.target.value)}
                            options={mockDivisions}
                            isRequired={true}
                        />
                         <SelectDropdown 
                            label="กลุ่มงาน" 
                            id="regSubDivision" 
                            value={subDivision} 
                            onChange={(e) => setSubDivision(e.target.value)}
                            options={mockDivisions} // ใช้ Mock data ชุดเดิม
                            isRequired={true}
                        />
                    </div>

                    {/* Row 5: เบอร์โทรศัพท์สำนักงาน / เบอร์โทรศัพท์ภายใน */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FloatingInput 
                                label="เบอร์โทรศัพท์สำนักงาน" 
                                id="regOfficePhone"
                                value={officePhone} 
                                onChange={(e) => setOfficePhone(e.target.value.replace(/\D/g, ''))}
                                maxLength={10}
                                isRequired={true}
                            />
                            <div className="text-right text-xs pr-1 mt-1 text-gray-400">
                                {officePhone.length} / 10
                            </div>
                        </div>
                        <div className="relative">
                             <FloatingInput 
                                label="เบอร์โทรศัพท์ภายใน" 
                                id="regInternalPhone"
                                value={internalPhone} 
                                onChange={(e) => setInternalPhone(e.target.value.replace(/\D/g, ''))}
                                maxLength={9}
                                isRequired={true}
                            />
                            <div className="text-right text-xs pr-1 mt-1 text-gray-400">
                                {internalPhone.length} / 9
                            </div>
                        </div>
                    </div>

                    {/* Row 6: อีเมล */}
                    <FloatingInput 
                        label="E-mail" 
                        id="regEmail"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />

                    {/* Section: หลักฐานการสมัคร */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                            <Upload size={18} className="mr-1 text-red-500" />
                            หลักฐานการสมัคร
                        </h3>
                        
                        {/* File Upload (แนบรูปภาพ) */}
                        <div className="relative border-2 border-dashed border-gray-300 p-6 mt-3 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
                            <input 
                                type="file" 
                                id="fileUpload" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                            
                            <div className="flex flex-col items-center justify-center space-y-2">
                                {uploadedImageUrl ? (
                                    <img 
                                        src={uploadedImageUrl} 
                                        alt="เอกสารแนบ" 
                                        className="w-24 h-24 object-cover rounded-md border-2 border-green-500 shadow-md"
                                        onLoad={() => URL.revokeObjectURL(uploadedImageUrl!)} 
                                    />
                                ) : (
                                    <IdCard size={24} className="text-gray-400" />
                                )}
                                
                                <p className="text-sm text-gray-600">
                                    {uploadedFile ? `Upload: ${uploadedFile.name}` : 'แนบรูปเอกสารการบรรจุ หรือบัตรข้าราชการ'}
                                </p>
                                
                                {/* ✅ โค้ดที่แก้ไข: แสดงขนาดไฟล์จริง */}
                                <p className="text-[10px] text-gray-400">
                                    {uploadedFile 
                                        ? `1 files (${formattedFileSize} in total)`
                                        : '0 files (0 B in total)'
                                    }
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-red-500 mt-2">
                            - แนบรูปเอกสารการบรรจุ หรือบัตรข้าราชการ
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button 
                            type="submit" 
                            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg shadow-md hover:bg-green-700 transition flex items-center justify-center"
                        >
                            <UserPlus size={20} className="mr-2" /> 
                            บันทึกข้อมูล
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
    )
}