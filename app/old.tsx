// 'use client'

// import { useState } from 'react'
// import { FileText, Menu, Fingerprint, ChevronLeft, ChevronRight} from 'lucide-react' // ไอคอนตัวอย่าง
// import { useRouter } from 'next/navigation'

// const OAG_COLOR = 'orange-500';

// export default function LoginPage() {
//   // State สำหรับสลับ Tab: 'USER' หรือ 'ADMIN'
//   const [activeTab, setActiveTab] = useState<'USER' | 'ADMIN'>('USER')
//   // State สำหรับนับจำนวนตัวอักษรเลขบัตรประชาชน
//   const [idCard, setIdCard] = useState('')
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isIdFocused, setIsIdFocused] = useState(false)
//   const [idError, setIdError] = useState('')
//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//   const [passwordValue, setPasswordValue] = useState('');
//     const [isPasswordFocused, setIsPasswordFocused] = useState(false);
// const isActive = isIdFocused || idCard.length > 0
// const isIdActive = isIdFocused || idCard.length > 0
// const isIdError = idError.length > 0;
// const isPasswordActive = isPasswordFocused || passwordValue.length > 0;
// const handleLoginBypass = (e: React.FormEvent) => {
//         e.preventDefault();

//         // **จำลองการตรวจสอบข้อมูล:**
//         if (idCard.length === 0 && idCard.length < 13) 
//           {
//             setIdError('กรุณากรอกข้อมูลให้ครบ 13 หลัก');
//             return;
//         }
        
//         // ถ้าผ่าน: ล้าง error และนำทาง
//         setIdError('');
//         router.push('/search'); 
//     }

//   return (
//     <div className="flex h-screen w-full bg-gray-50 text-sm font-prompt">
      
//       {/* --- 1. Sidebar (ด้านซ้าย) --- */}
//       <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative hidden md:flex`}>
// <div className={`
//            p-3 border-b border-gray-100 flex items-center justify-center overflow-hidden
//            ${isSidebarOpen ? 'h-32' : 'h-16'}
//         `}>
//            {/* แสดง Logo เต็มเมื่อกางออก / ซ่อนเมื่อพับ */}
//            {isSidebarOpen ? (
//                <div className="space-y-1 text-center transition-opacity duration-300">
//                    <h1 className="text-3xl font-bold text-gray-700">OAG</h1>
//                    <p className="text-xs text-gray-500">สำนักงานอัยการสูงสุด</p>
//                    <p className="text-[10px] text-gray-400">OFFICE OF THE ATTORNEY GENERAL</p>
//                </div>
//            ) : (
//                <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center text-lg font-bold text-gray-700"></div> // Logo ย่อ
//            )}
//         </div>
        
//         <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
//           <div className={`
//              px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider 
//              transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 h-0'}
//           `}>
//             Menu
//           </div>
//         </nav>
        
//         {/* 3. ✅ Footer Sidebar (E-PHONEBOOK v.5.4.0 หรือ 'N' Icon) */}
//         <div className="p-4 border-t overflow-hidden flex justify-center items-center h-16">
//             {isSidebarOpen ? (
//                 <div className="text-xs text-gray-400 text-center whitespace-nowrap transition-opacity duration-300">
//                     E-PHONEBOOK v.5.4.0
//                 </div>
//             ) : (
//                 // แสดง 'N' Icon หรือตัวย่อเมื่อพับ
//                 <div className="w-8 h-8 rounded-full bg-gray-700 text-white text-lg font-bold flex items-center justify-center transition-opacity duration-300">
//                 N
//                 </div>
//             )}
//         </div>
//       </aside>

//       {/* --- 2. Main Content (ด้านขวา) --- */}
//       <main className="flex-1 flex flex-col">
        
//         {/* Top Bar */}
// <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
//             {/* ปุ่ม Hamburger (ควบคุม Sidebar) */}
//             <button 
//               onClick={toggleSidebar}
//               className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
//             >
//                 <Menu size={24} />
//             </button>
//           <h1 className="text-gray-700 font-medium text-lg ml-4">e-Phonebook - สมุดโทรศัพท์ สำนักงานอัยการสูงสุด</h1>
//         </header>

//         {/* Login Container */}
//         <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          
//           {/* Tabs (USER / ADMIN) */}
//           <div className="w-full max-w-md flex justify-end mb-2 gap-6 text-sm font-medium uppercase tracking-wide">
//             <button 
//               onClick={() => setActiveTab('USER')}
//               className={`pb-1 transition-colors ${activeTab === 'USER' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
//             >
//               User
//             </button>
//             <button 
//               onClick={() => setActiveTab('ADMIN')}
//               className={`pb-1 transition-colors ${activeTab === 'ADMIN' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
//             >
//               Admin
//             </button>
//           </div>

//           {/* Card */}
//           <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            
//             {/* Banner Image Header */}
//             <div className="h-40 bg-gradient-to-br from-gray-400 to-gray-600 relative flex flex-col items-center justify-center text-white">
//                {/* ตกแต่งพื้นหลังให้เหมือนรูป (ใส่ Image จริงแทนได้เลย) */}
//                <div className="absolute inset-0 bg-black/20"></div>
//                <div className="relative z-10 text-center space-y-1">
//                  <h2 className="text-2xl font-bold tracking-wide">E-PHONEBOOK</h2>
//                  <p className="text-lg font-light">สำนักงานอัยการสูงสุด</p>
//                </div>
//                <div className="absolute bottom-4 left-4 text-white/90 font-medium text-lg">
//                  {activeTab === 'USER' ? 'เข้าสู่ระบบ' : 'ผู้ดูแลระบบ'}
//                </div>
//             </div>

//             {/* Form Area */}
//             <div className="p-8 space-y-6">
              
//               {activeTab === 'USER' ? (
//                 /* --- USER FORM --- */
//                 <form className="space-y-5">
//                   <div className="relative">
//                     <label 
//                   htmlFor="idCardInput"
//                   className={`
//                     absolute left-4 px-1 bg-white text-gray-400 pointer-events-none 
//     transition-all duration-200 ease-in-out
                    
//                     ${isActive 
//                         ? '-top-3 text-xs bg-white text-blue-500' // สถานะ ACTIVE: ลอยขึ้น + สีน้ำเงิน
//                         : 'top-1/3 -translate-y-1/3 text-base' // สถานะ DEFAULT: อยู่ตรงกลาง
//                     }
//                         ${isIdError ? 'text-red-500' : (isIdActive ? 'text-blue-500' : 'text-gray-400')}
//                   `}
                  
//                 >
//                   หมายเลขบัตรประชาชน
//                 </label>
//                 <input 
//                   id="idCardInput"
//                   type="text" 
//                   maxLength={13}
//                   value={idCard}
//                   onChange={(e) => {
//                       setIdCard(e.target.value.replace(/\D/g, ''))
//                       // ล้าง error ทันทีเมื่อเริ่มพิมพ์ใหม่
//                       if (idError) setIdError('') 
//                   }}
//                   onFocus={() => setIsIdFocused(true)}
//                   onBlur={() => setIsIdFocused(false)}
                  
//                   // ✅ 6. กำหนดสี Border ตามสถานะ Error
//                   className={`
//                     w-full py-3 px-3 border rounded focus:outline-none placeholder-transparent
//                     transition-all duration-200
//                     ${isIdError ? 'border-red-500 ring-1 ring-red-500' : (isIdActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300')}
//                   `}
//                 />
//                 {isIdError && (
//                     <p className="text-red-500 text-sm mt-1">
//                         {idError}
//                     </p>
//                 )}
//                     <div className={`text-right text-xs pr-1 absolute right-0 top-3 mr-3 ${isIdError ? 'text-red-500' : 'text-gray-400'}`}>
//                       {idCard.length} / 13
//                     </div>
//                   </div>

//                   <div className="relative">
//           <label 
//     htmlFor="passwordInput"
//     className={`
//       absolute left-4 px-1 text-gray-400 pointer-events-none 
//       transition-all duration-200 ease-in-out
      
//       ${isPasswordActive 
//           // ✅ ปรับตำแหน่งให้แม่นยำ: -top-[12px]
//           ? '-top-3 text-xs bg-white text-blue-500' 
//           : 'top-1/4 -translate-y-1/3 text-base' 
//       }
//     `}>
//     รหัสผ่าน
// </label>
//   <input 
//         id="passwordInput"
//         type="password" 
//         value={passwordValue}
//         onChange={(e) => setPasswordValue(e.target.value)}
//         onFocus={() => setIsPasswordFocused(true)}
//         onBlur={() => setIsPasswordFocused(false)}
        
//         // ✅ เปลี่ยนเป็น py-3 px-3 (หรือ p-3) เพื่อความสมดุล
//         className={`
//           w-full py-3 px-3 border rounded focus:outline-none placeholder-transparent
//           transition-all duration-200
//           ${isPasswordActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
//         `}
//     />
// <div className="space-y-1 pt-1">
//         <p className="text-[10px] text-gray-500 leading-tight">
//             รหัสผ่านเริ่มต้น = วันเดือนปีเกิด เช่น เกิดวันที่ 1 มิถุนายน 2537 รหัสผ่านคือ 01062537
//         </p>
//         <div className="text-right">
//             <a href="#" className="text-xs text-blue-500 underline hover:text-blue-700">ลงทะเบียน</a>
//         </div>
//     </div>
//                   </div>
//                 </form>
//               ) : (
//                 /* --- ADMIN FORM --- */
//                 <form className="space-y-5">
//                   <input 
//                     type="text" 
//                     placeholder="Username" 
//                     className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
//                   />
//                   <input 
//                     type="password" 
//                     placeholder="Password" 
//                     className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
//                   />
//                 </form>
//               )}

//               {/* Login Button */}
//               <div className="pt-2">
//                 <button type="submit"
//                         className="w-full bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-white font-medium py-2 rounded transition-colors shadow-sm">
//                   LOGIN
//                 </button>
//               </div>

//               {/* Footer Links */}
//               <div className="flex flex-col items-end gap-2 pt-2">
//                 <a href="#" className="text-xs text-red-500 hover:text-red-600 font-medium">ลืมรหัสผ่าน</a>
//                 <a href="#" className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium">
//                   <FileText size={14} />
//                   PRIVACY NOTICE
//                 </a>
//               </div>

//             </div>
//           </div>
          
//           {/* Mock Cloudflare Widget */}
//           <div className="mt-6 w-full max-w-xs border border-gray-300 bg-gray-50 p-3 rounded flex items-center justify-between shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
//                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span className="text-sm text-gray-700">Success!</span>
//             </div>
//             <div className="text-[10px] text-gray-400 flex flex-col items-end leading-tight">
//               <span className="font-bold text-orange-500">CLOUDFLARE</span>
//               <span>Privacy • Terms</span>
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   )
// }