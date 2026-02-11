'use client'

import { useState, useEffect } from 'react'
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

    const [formData, setFormData] = useState({
            title: '',      // l_prename
            fname: '',
            lname: '',
            idCard: '',
            memberType: '', // position_type
            position: '',   // ago_position
            office: '',     // dept_dtl (remark1)
            division: '',   // กลุ่มงาน (พิมพ์เอง)
            officePhone: '',
            internalPhone: '',
            email: '',
        });
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
    const [options, setOptions] = useState({
        prenames: [] as any[],
        memberTypes: [] as any[],
        positions: [] as any[],
        offices: [] as any[]
    });

    useEffect(() => {
    const fetchOptions = async () => {
        try {
            const res = await fetch('/api/register'); // สันนิษฐานว่าเป็น path นี้ตามไฟล์ route.ts ที่ส่งมา
            const result = await res.json();
            if (result.success) {
                setOptions(result.data);
            }
        } catch (error) {
            console.error("Fetch options error:", error);
        }
    };
        fetchOptions();
    }, []);

    const inputStyle = "w-full mt-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all";
    const labelStyle = "text-sm font-bold text-gray-700 ml-1";
    const counterStyle = "text-right text-[10px] pr-1 mt-1 text-gray-400 font-medium";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'idCard') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            if (onlyNums.length <= 13) setFormData(prev => ({ ...prev, [name]: onlyNums }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

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

    const [isLoading, setIsLoading] = useState(false);

    // --- 2. วางฟังก์ชัน handleSubmit ตรงนี้ครับ ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.idCard || formData.idCard.length !== 13 || !uploadedFile) {
            Swal.fire('คำเตือน', 'กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก และแนบรูปหลักฐาน', 'warning');
            return;
        }

        setIsLoading(true);
        const data = new FormData();

        // แมปค่าให้ตรงกับที่ Backend (route.ts) รอรับ
        data.append('title', formData.title);
        data.append('fname', formData.fname);
        data.append('lname', formData.lname);
        data.append('idCard', formData.idCard); // 👈 สำคัญ: Backend ใช้ idCard
        data.append('file', uploadedFile);   // 👈 สำคัญ: Backend ใช้ file

        // แถม: ส่งค่าอื่นๆ ไปด้วยถ้า Database รองรับ
        data.append('position', formData.position);
        data.append('officePhone', formData.officePhone);

        try {
            const response = await fetch('/api/register', { method: 'POST', body: data });
            const result = await response.json();
            if (result.success) {
                Swal.fire('สำเร็จ', 'ส่งคำขอลงทะเบียนเรียบร้อย', 'success').then(() => router.push('/login'));
            } else {
                Swal.fire('ผิดพลาด', result.message, 'error');
            }
        } catch (err) {
            Swal.fire('ผิดพลาด', 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
        } finally {
            setIsLoading(false);
        }
    };

const SearchableSelect = ({ label, name, value, optionsList, onChange, placeholder, counter }: any) => {
    return (
        <div className="relative">
            <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
            <input
                list={`list-${name}`}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full mt-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
            <datalist id={`list-${name}`}>
                {optionsList.map((item: any, index: number) => (
                    <option key={index} value={item.name || item.prename || item.position_th || item.position_type_name} />
                ))}
            </datalist>
            {counter && (
                <div className="text-right text-[10px] text-gray-400 mt-1 font-medium">
                    {value?.length || 0} / {counter}
                </div>
            )}
        </div>
    );
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
            {/* ขยายความกว้างตรง max-w-4xl (เท่ากับรูปที่ 1) */}
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden animate__animated animate__fadeIn">
                
                <div className="bg-green-600 p-8 text-white text-center">
                    <h1 className="text-3xl font-bold">ลงทะเบียนเข้าใช้งานระบบ</h1>
                    <p className="mt-2 text-green-100 opacity-90">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อประสิทธิภาพในการตรวจสอบ</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                    
                    {/* แถวที่ 1: คำนำหน้า และ เลขบัตรประชาชน */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                                <SearchableSelect 
                                    label="คำนำหน้า" 
                                    name="title" 
                                    value={formData.title} 
                                    optionsList={options.prenames} 
                                    onChange={handleChange} 
                                />
                        </div>
                        <div className="md:col-span-2">
                            <div>
                                <label className={labelStyle}>เลขประจำตัวประชาชน</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="idCard" 
                                        maxLength={13}
                                        value={formData.idCard} 
                                        onChange={handleChange} 
                                        className={inputStyle} 
                                        placeholder="กรอกเลข 13 หลัก"
                                    />
                                    <div className={counterStyle}>
                                        {formData.idCard?.length || 0} / 13
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* แถวที่ 2: ชื่อ และ นามสกุล */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>ชื่อ (ภาษาไทย)</label>
                            <input type="text" name="fname" value={formData.fname} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label className={labelStyle}>นามสกุล (ภาษาไทย)</label>
                            <input type="text" name="lname" value={formData.lname} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>

                    {/* แถวที่ 3: ประเภทสมาชิก และ ตำแหน่ง */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <SearchableSelect 
                                    label="ประเภทสมาชิก" 
                                    name="memberType" 
                                    value={formData.memberType} 
                                    optionsList={options.memberTypes} 
                                    onChange={handleChange} 
                        />
                        </div>
                        <div>
                        <SearchableSelect 
                                    label="ตำแหน่ง" 
                                    name="position" 
                                    value={formData.position} 
                                    optionsList={options.positions} 
                                    onChange={handleChange} 
                                />
                        </div>
                    </div>

                    {/* แถวที่ 4: สำนักงาน (Dropdown ดึงจาก Remark1) */}
                    <div>
                        <SearchableSelect 
                                label="สำนักงาน" 
                                name="division" 
                                value={formData.division} 
                                optionsList={options.offices} 
                                onChange={handleChange} 
                            />
                    </div>

                    {/* แถวที่ 5: กลุ่มงาน (ช่องพิมพ์เอง) */}
                    <div>
                        <label className={labelStyle}>กลุ่มงาน</label>
                        <input 
                            type="text" name="division" value={formData.division} onChange={handleChange} 
                            placeholder="พิมพ์ระบุกลุ่มงานของคุณ" className={inputStyle} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>เบอร์โทรศัพท์มือถือ</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="officePhone" 
                                    maxLength={10}
                                    value={formData.officePhone} 
                                    onChange={handleChange} 
                                    className={inputStyle} 
                                />
                                <div className={counterStyle}>
                                    {formData.officePhone?.length || 0} / 10
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelStyle}>เบอร์โทรสำนักงาน)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    name="internalPhone" 
                                    maxLength={9}
                                    value={formData.internalPhone} 
                                    onChange={handleChange} 
                                    className={inputStyle} 
                                />
                                <div className={counterStyle}>
                                    {formData.internalPhone?.length || 0} / 9
                                </div>
                            </div>
                        </div>
                    </div>

                        <div>
                            <label className={labelStyle}>E-Mail</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} className={inputStyle} />
                        </div>

                    {/* ส่วนการอัปโหลดไฟล์ (ขยายให้กว้าง) */}
                        <div className="mt-8 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                            <input type="file" id="file-upload" className="hidden" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-600">{uploadedFile ? uploadedFile.name : "คลิกเพื่อแนบรูปภาพหลักฐาน"}</p>
                            </label>
                        </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.99]">
                        บันทึกข้อมูลลงทะเบียน
                    </button>
                </form>

                </div>
            </div>
        );
}