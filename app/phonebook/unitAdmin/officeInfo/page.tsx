'use client'

import { useState, useEffect } from 'react';
import { Building, Phone, MapPin, Save, Info, Mail, Printer, Loader2, Building2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';


export default function OfficeSettingsPage() {
    // จำลองการดึงข้อมูลเฉพาะหน่วยงานที่ Admin คนนี้ดูแลอยู่
    // const [officeData, setOfficeData] = useState({
    //     office: 'สำนักเทคโนโลยีสารสนเทศและการสื่อสาร (อาคารถนนรัชดาภิเษก)',
    //     initial: 'สทส.',
    //     address: 'เลขที่ 51 สำนักงานอัยการสูงสุด อาคารถนนรัชดาภิเษก ชั้น 3 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
    //     building: 'ถนนรัชดาภิเษก',
    //     floor: '3',
    //     officeNo: '51',
    //     village: '-',
    //     road: 'รัชดาภิเษก',
    //     province: 'กรุงเทพมหานคร',
    //     district: 'จตุจักร',
    //     subDistrict: 'จอมพล',
    //     zipcode: '10900',
    //     phone: '02-515-4176#88',
    //     fax: '02-515-4177',
    //     email: 'ictc@ago.go.th',
    //     website: 'www3.ago.go.th/ictc',
    // });
    const [isLoading, setIsLoading] = useState(true);
    const [officeData, setOfficeData] = useState<any>({}); // เปลี่ยนจาก null เป็น {}    const [editOfficeName, setEditOfficeName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [displayTitle, setDisplayTitle] = useState('');
    // --- เพิ่มตัวแปรนี้เพื่อล็อกชื่อหัวข้อให้นิ่ง ---
    const [displayName, setDisplayName] = useState('');

    // เพิ่ม State สำหรับเก็บรายการที่จะแสดงใน Drop-down
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [tambons, setTambons] = useState([]);

    // 1. ดึงจังหวัดมาตอนโหลดหน้าแรก
useEffect(() => {
    fetch('/api/unitAdmin/locations?type=provinces')
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(err => console.error("Load provinces error:", err));
}, []);

// 2. เฝ้าติดตาม officeData เพื่อโหลด อำเภอ/ตำบล มารองรับค่า ID ที่มีอยู่
useEffect(() => {
    const syncLocations = async () => {
        // ถ้ามี id จังหวัดในข้อมูลหน่วยงาน ให้โหลดอำเภอของจังหวัดนั้น
        if (officeData.gov_changwat_id) {
            try {
                const res = await fetch(`/api/unitAdmin/locations?type=amphures&parentId=${officeData.gov_changwat_id}`);
                const data = await res.json();
                setAmphures(data);
            } catch (err) { console.error("Load amphures error:", err); }
        }

        // ถ้ามี id อำเภอในข้อมูลหน่วยงาน ให้โหลดตำบลของอำเภอนั้น
        if (officeData.gov_ampur_id) {
            try {
                const res = await fetch(`/api/unitAdmin/locations?type=tambons&parentId=${officeData.gov_ampur_id}`);
                const data = await res.json();
                setTambons(data);
            } catch (err) { console.error("Load tambons error:", err); }
        }
    };

    syncLocations();
}, [officeData.gov_changwat_id, officeData.gov_ampur_id]); 
// ทำงานเมื่อข้อมูลหน่วยงานถูกโหลด (Initial) หรือเมื่อผู้ใช้เลือกเปลี่ยนค่าเอง
    // ทำงานทุกครั้งที่ ID จังหวัดหรืออำเภอเปลี่ยน (รวมถึงตอน fetch ข้อมูลใหม่หลังบันทึกด้วย)

    // 2. เมื่อจังหวัดเปลี่ยน ให้ดึงอำเภอ
    const handleProvinceChange = async (provinceId: string) => {
        setOfficeData({ ...officeData, gov_changwat_id: provinceId, gov_ampur_id: '', gov_tambon_id: '' });
        const res = await fetch(`/api/unitAdmin/locations?type=amphures&parentId=${provinceId}`);
        const data = await res.json();
        setAmphures(data);
        setTambons([]); // ล้างตำบลเก่า
    };

    // 3. เมื่ออำเภอเปลี่ยน ให้ดึงตำบล
    const handleAmpurChange = async (amphurId: string) => {
        setOfficeData({ ...officeData, gov_ampur_id: amphurId, gov_tambon_id: '' });
        const res = await fetch(`/api/unitAdmin/locations?type=tambons&parentId=${amphurId}`);
        const data = await res.json();
        setTambons(data);
    };

    useEffect(() => {
    if (officeData.gov_changwat_id) {
        fetch(`/api/locations?type=amphures&parentId=${officeData.gov_changwat_id}`)
            .then(res => res.json())
            .then(data => setAmphures(data));
    }
    if (officeData.gov_ampur_id) {
        fetch(`/api/locations?type=tambons&parentId=${officeData.gov_ampur_id}`)
            .then(res => res.json())
            .then(data => setTambons(data));
    }
    }, [officeData.gov_changwat_id, officeData.gov_ampur_id]);

    // useEffect(() => {
    //     if (officeData) {
    //         setEditOfficeName(officeData.officeName);
    //     }
    // }, [officeData]);

    //     name: 'สำนักงานอัยการพิเศษฝ่ายคดีอาญา 1',
    //     initials: 'สอฝ.คดีอาญา 1',
    //     phone: '02-142-1700',
    //     fax: '02-142-1701',
    //     address: 'ถ.แจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพฯ 10210',
    //     email: 'criminal1@agency.go.th'

    // const handleSave = () => {
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'บันทึกสำเร็จ',
    //         text: 'ปรับปรุงข้อมูลสำนักงานเรียบร้อยแล้ว',
    //         confirmButtonColor: '#2563EB',
    //                         showClass: {
    //                             popup: `animate__animated
    //                             animate__bounceIn
    //                             animate__faster`},
    //                         hideClass: {
    //                             popup: `animate__animated
    //                             animate__fadeOut
    //                             animate__faster`}
    //     });
    // };

   useEffect(() => {
        fetchOfficeData();
    }, []);

    const fetchOfficeData = async () => {
    try {
        setIsLoading(true); // เริ่มการโหลด
        const officeId = localStorage.getItem('officeInfo_id');
        
        if (!officeId || officeId === 'undefined') {
            console.error("Missing officeId in localStorage");
            setIsLoading(false); // ปิดการโหลดหากไม่มี ID
            return;
        }

        const res = await fetch(`/api/unitAdmin/officeInfo?id=${officeId}`);
        const result = await res.json();

        if (result.success) {
            setOfficeData(result.data);
            // ตั้งค่าชื่อที่จะแสดงบนหัวข้อให้นิ่ง (จากคอลัมน์ remark1 ในฐานข้อมูล)
            setDisplayName(result.data.remark1); 
        }
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        // *** สำคัญมาก: ต้องปิดการโหลดตรงนี้เพื่อให้ UI แสดงผลเนื้อหา ***
        setIsLoading(false); 
    }
};

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <span className="ml-2 text-lg">กำลังโหลดข้อมูล...</span>
            </div>
        );
    }

    if (!officeData) return <div className="p-10 text-center">ไม่พบข้อมูลหน่วยงาน</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOfficeData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

const handleSave = async () => {
    if (!officeData?.id) {
        Swal.fire('ผิดพลาด', 'ไม่พบรหัสหน่วยงาน', 'error');
        return;
    }

    setIsSaving(true);
    try {
        const res = await fetch('/api/unitAdmin/officeInfo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(officeData) // ตรวจสอบว่า officeData มีค่า id และค่าที่แก้ครบ
        });

        const result = await res.json();
        if (result.success) {
            await Swal.fire({
            icon: 'success',
            title: 'Update ข้อมูลเรียบร้อยแล้ว',
            showConfirmButton: false,
            timer: 1500
            });
            // โหลดข้อมูลใหม่เพื่อให้หน้าจอแสดงค่าล่าสุดจาก DB
            fetchOfficeData(); 

        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
    } finally {
        setIsSaving(false);
    }
};

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    const formatValue = (value: any) => {
    if (value === null || value === undefined || String(value).trim() === '' || value === 'null') {
        return '-';
    }
    return value;
};


return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8 mx-auto space-y-8">                
                {/* 1. Header Card */}
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-1r">
                            <Building size={28} className="mr-3 text-orange-600" /> ข้อมูลหน่วยงาน
                    </h1>
                    {/* ตกแต่งพื้นหลังด้วยวงกลมจางๆ
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div> */}

{/* --- ส่วนหัว (Header) - ใช้ displayName ทำให้ชื่อตรงนี้นิ่ง ไม่เปลี่ยนตามตอนพิมพ์ --- */}
                    <div className="relative z-10 flex items-center gap-6">
                        <div>
                            <p className="text-2xl md:text-2xl text-center font-bold">
                                {displayName} {/* <--- หัวข้อจะนิ่งสนิท ไม่เปลี่ยนตาม Input */}
                            </p>
                        </div>
                    </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {/* ส่วนข้อมูลทั่วไป */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="md:col-span-2 space-y-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Building size={16} className="text-red-500" />ชื่อหน่วยงาน
                                </label>
                                <input 
                                    type="text" 
                                    value={officeData.remark1}
                                    onChange={(e) => setOfficeData({...officeData, remark1: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <MapPin size={16} className="text-red-500" /> ที่อยู่สำนักงาน
                                </label>
                                <textarea 
                                    rows={3}
                                    value={officeData.addr}
                                    onChange={(e) => setOfficeData({...officeData, addr: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                           <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">อาคาร</label>
                                 <input
                                     value={formatValue(officeData.building)}
                                     onChange={(e) => setOfficeData({ ...officeData, building: e.target.value })}
                                     className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         </div>
                         <div>
                             <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">ชั้น</label>
                                 <input
                                     value={formatValue(officeData.floor)}
                                     onChange={(e) => setOfficeData({ ...officeData, floor: e.target.value })}
                                     className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         </div>
                         <div>
                             <label className="text-sm font-medium text-gray-700">บ้านเลขที่</label>
                             <input
                                    value={formatValue(officeData.addr_no)}
                                    onChange={(e) => setOfficeData({ ...officeData, addr_no: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         </div>

                         <div>
                            <label className="text-sm font-medium text-gray-700">หมู่</label>
                            <input
                                value={formatValue(officeData.moo)}
                                onChange={(e) => setOfficeData({ ...officeData, moo: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                        </div>

                         <div>
                         <label className="text-sm font-medium text-gray-700">ถนน</label>
                         <input
                             value={formatValue(officeData.road)}
                             onChange={(e) => setOfficeData({ ...officeData, road: e.target.value })}
                             className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">จังหวัด</label>
                            <select 
                                value={officeData.gov_changwat_id}
                                onChange={(e) => handleProvinceChange(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">-- เลือกจังหวัด --</option>
                                {provinces.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                         {/* อำเภอ (จะแสดงข้อมูลได้ต่อเมื่อเลือกจังหวัดแล้ว) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">อำเภอ</label>
                            <select 
                                value={officeData.gov_ampur_id}
                                onChange={(e) => handleAmpurChange(e.target.value)}
                                disabled={!officeData.gov_changwat_id}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">-- เลือกอำเภอ --</option>
                                {amphures.map((a: any) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                         {/* ตำบล (จะแสดงข้อมูลได้ต่อเมื่อเลือกอำเภอแล้ว) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ตำบล</label>
                            <select 
                                value={officeData.gov_tambon_id || ''}
                                onChange={(e) => setOfficeData({ ...officeData, gov_tambon_id: e.target.value })}
                                disabled={!officeData.gov_ampur_id}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">-- เลือกตำบล --</option>
                                {tambons.map((t: any) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                         <div>
                             <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                             <input
                                 value={officeData.gov_postcode}
                                 onChange={(e) => setOfficeData({ ...officeData, gov_postcode: e.target.value })}
                                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         </div>

                         <div>
                             <label className="text-sm font-medium text-gray-700">เว็บไซต์หน่วยงาน</label>
                             <input
                                 value={formatValue(officeData.website)}
                                 onChange={(e) => setOfficeData({ ...officeData, website: e.target.value })}
                                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"/>
                         </div>
                        </div>
                    </div>

                    {/* ส่วนข้อมูลการติดต่อ */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                            <Phone className="text-green-600" size={24} /> ช่องทางการติดต่อ
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Phone size={14} /> เบอร์โทรศัพท์กลาง
                                </label>
                                <input 
                                    type="text" 
                                    value={officeData.tel}
                                    onChange={(e) => setOfficeData({...officeData, tel: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Printer size={14} /> โทรสาร (Fax)
                                </label>
                                <input 
                                    type="text" 
                                    value={formatValue(officeData.fax || '')}
                                    onChange={(e) => setOfficeData({...officeData, fax: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <Mail size={14} /> อีเมลหน่วยงาน
                                </label>
                                <input 
                                    type="email" 
                                    value={formatValue(officeData.email)}
                                    onChange={(e) => setOfficeData({...officeData, email: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <Link href="/phonebook/unitAdmin/officeInfo/division">
                        <button className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-6 py-3 rounded-xl transition-all">
                            จัดการข้อมูลกลุ่มงาน/ฝ่าย
                        </button>
                    </Link>
                    
                    <button 
                        onClick={handleSave}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
                    >
                        <Save size={20} /> บันทึก
                    </button>
                </div>

                </div>
            </div>
        </div>
    );
}



//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="mb-8 mx-auto space-y-8">
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-1r">
//                 <Building size={28} className="mr-3 text-orange-600" /> ข้อมูลหน่วยงาน
//             </h1>
//             <div className="md:col-span-2">
//                 <h1 className="text-base font-semibold text-gray-800 leading-tight">
//                     ชื่อหน่วยงาน : {officeData.office}
//                 </h1>
//             </div>
//             <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//                 <div className="p-8 space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อหน่วยงาน</label>
//                             <div className="relative">
//                             <Building className="absolute left-3 top-3 text-gray-400" size={18} />
//                                 <textarea
//                                     value={editName}
//                                     onChange={(e) => setEditName(e.target.value)}
//                                     className="w-full pl-10 pr-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
//                         </div>
//                         </div>
//                         <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ (คำอธิบาย)</label>
//                             <div className="relative">
//                             <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
//                                 <textarea
//                                     rows={3}
//                                     value={officeData.address}
//                                     onChange={(e) =>
//                                     setOfficeData({ ...officeData, address: e.target.value })
//                                     }
//                                     className="w-full pl-10 pr-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"/>
//                         </div>
//                         </div>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">อาคาร</label>
//                                 <input
//                                     value={officeData.building}
//                                     onChange={(e) => setOfficeData({ ...officeData, building: e.target.value })}
//                                     className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">ชั้น</label>
//                                 <input
//                                     value={officeData.floor}
//                                     onChange={(e) => setOfficeData({ ...officeData, floor: e.target.value })}
//                                     className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">บ้านเลขที่</label>
//                             <input
//                                 value={officeData.officeNo}
//                                 onChange={(e) => setOfficeData({ ...officeData, officeNo: e.target.value })}
//                                 className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>

//                         <div>
//                         <label className="text-sm font-medium text-gray-700">หมู่</label>
//                         <input
//                             value={officeData.village}
//                             onChange={(e) => setOfficeData({ ...officeData, village: e.target.value })}
//                             className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>

//                         <div>
//                         <label className="text-sm font-medium text-gray-700">ถนน</label>
//                         <input
//                             value={officeData.road}
//                             onChange={(e) => setOfficeData({ ...officeData, road: e.target.value })}
//                             className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>
//                         <div>
//                             <label className="text-sm font-medium text-gray-700">จังหวัด</label>
//                             <select
//                                 value={officeData.province}
//                                 className="w-full px-4 py-2 border rounded-lg">
//                                 <option>กรุงเทพมหานคร</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium text-gray-700">อำเภอ/เขต</label>
//                             <select
//                                 value={officeData.district}
//                                 className="w-full px-4 py-2 border rounded-lg">
//                                 <option>จตุจักร</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium text-gray-700">ตำบล/แขวง</label>
//                             <select
//                                 value={officeData.subDistrict}
//                                 className="w-full px-4 py-2 border rounded-lg">
//                                 <option>จอมพล</option>
//                             </select>
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
//                             <input
//                                 value={officeData.zipcode}
//                                 onChange={(e) => setOfficeData({ ...officeData, zipcode: e.target.value })}
//                                 className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>

//                         <div className="md:col-span-2">
//                             <label className="text-sm font-medium text-gray-700">เว็บไซต์หน่วยงาน</label>
//                             <input
//                                 value={officeData.website}
//                                 onChange={(e) => setOfficeData({ ...officeData, website: e.target.value })}
//                                 className="w-full px-4 py-2 border rounded-lg"/>
//                         </div>


//                         {/* <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสำนักงาน, หน่วยงาน</label>
//                             <input type="text" value={officeData.name} className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500" disabled />
//                             <p className="text-xs text-gray-400 mt-1">* หากต้องการเปลี่ยนชื่อเต็ม กรุณาติดต่อ Super Admin</p>
//                         </div>
                        
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อย่อ</label>
//                             <div className="relative">
//                                 <input type="text" value={officeData.initials} onChange={(e) => setOfficeData({...officeData, initials: e.target.value})}
//                                     className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500 outline-none" disabled />
//                                     <p className="text-xs text-gray-400 mt-1">* หากต้องการเปลี่ยนชื่อเต็ม กรุณาติดต่อ Super Admin</p>
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์กลาง</label>
//                             <div className="relative">
//                                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                 <input type="text" value={officeData.phone} onChange={(e) => setOfficeData({...officeData, phone: e.target.value})}
//                                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
//                             </div>
//                         </div> */}

//                         {/* อีเมลหน่วยงาน (เพิ่มใหม่) */}
//                             {/* <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">อีเมลติดต่อ (E-mail)</label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                     <input type="email" value={officeData.email} onChange={(e) => setOfficeData({...officeData, email: e.target.value})}
//                                         className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
//                                 </div>
//                             </div> */}

//                             {/* โทรสาร (เพิ่มใหม่) */}
//                             {/* <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">โทรสาร (Fax)</label>
//                                 <div className="relative">
//                                     <Printer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                                     <input type="text" value={officeData.fax} onChange={(e) => setOfficeData({...officeData, fax: e.target.value})}
//                                         className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
//                                 </div>
//                             </div> */}

//                         {/* <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่สำนักงาน</label>
//                             <div className="relative">
//                                 <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
//                                 <textarea rows={3} value={officeData.address} onChange={(e) => setOfficeData({...officeData, address: e.target.value})}
//                                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
//                             </div>
//                         </div>
//                     </div>
//                 </div> */}
//                 </div>

//                 <div className=" px-8 py-4 flex justify-end">
//                     <Link href="/phonebook/unitAdmin/officeInfo/division" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-all">
//                         <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                                 <Save size={18} />
//                                 <span>ข้อมูลกลุ่มงาน/ฝ่าย</span>
//                         </button>  
//                     </Link>
//                 </div>
//             </div>
//         </div>
//         </div>
//         </div>
//     );
// }

