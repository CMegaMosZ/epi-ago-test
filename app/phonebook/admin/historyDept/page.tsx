'use client'

import { useState, useMemo } from 'react';
import { History, Search, Filter, SortAsc, SortDesc, Trash2, Edit, PlusCircle, CheckCircle, ChevronDown } from 'lucide-react';

// interface สำหรับรายการประวัติการแก้ไข
interface EditHistoryEntry {
    id: number;
    officeName: string; // ชื่อสำนักงานที่ถูกแก้ไข
    editorName: string; // ชื่อผู้แก้ไข (Admin/User)
    editorID: string;   // รหัสพนักงานของผู้แก้ไข
    editDate: string;   // วันที่และเวลาที่แก้ไข (ISO String)
    fieldsChanged: string[]; // รายการฟิลด์ที่ถูกแก้ไข เช่น ['phone', 'email', 'address']
    actionType: 'CREATE' | 'UPDATE' | 'DELETE'; // ประเภทของการดำเนินการ
}

const mockHistoryData: EditHistoryEntry[] = [
    {
        id: 1,
        officeName: 'สำนักงานเลขาธิการ',
        editorName: 'นายสมบัติ พัฒนา',
        editorID: 'A001',
        editDate: '2025-12-09T10:30:00Z',
        fieldsChanged: ['phone', 'fax'],
        actionType: 'UPDATE',
    },
    {
        id: 2,
        officeName: 'สำนักบริหารกลาง',
        editorName: 'น.ส.ใจดี บริหาร',
        editorID: 'A005',
        editDate: '2025-12-08T15:45:00Z',
        fieldsChanged: ['name', 'address'],
        actionType: 'UPDATE',
    },
    {
        id: 3,
        officeName: 'สำนักเทคโนโลยีสารสนเทศ',
        editorName: 'นายสมบัติ พัฒนา',
        editorID: 'A001',
        editDate: '2025-12-07T09:00:00Z',
        fieldsChanged: ['department', 'division'],
        actionType: 'UPDATE',
    },
        {
        id: 4,
        officeName: 'สำนักงานเลขานุการผู้บริหาร',
        editorName: 'นายสมชาย ใจดี',
        editorID: 'A003',
        editDate: '2025-12-12T12:12:00Z',
        fieldsChanged: ['*All*'],
        actionType: 'CREATE',
    },
    {
        id: 5,
        officeName: 'สำนักงานอัยการจังหวัดเพชรบูรณ์',
        editorName: 'นายสมชาย ใจร้าย',
        editorID: 'A004',
        editDate: '2025-12-15T08:45:00Z',
        fieldsChanged: ['mail'],
        actionType: 'DELETE',
    },
        {
        id: 6,
        officeName: 'สำนักงานอัยการจังหวัดขอนแก่น',
        editorName: 'นายบัก ฮำน้อย',
        editorID: 'A5555',
        editDate: '2025-12-15T14:00:00Z',
        fieldsChanged: ['name','mail','tel','picture'],
        actionType: 'UPDATE',
    },
    // ... สามารถเพิ่มข้อมูลอื่น ๆ ได้
];

const OfficeEditHistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState<string>('ALL'); // 'ALL', 'CREATE', 'UPDATE', 'DELETE'
    const [sortConfig, setSortConfig] = useState<{ key: keyof EditHistoryEntry | null; direction: 'asc' | 'desc' }>({ key: 'editDate', direction: 'desc' });

    // 1. Logic การกรองและการค้นหา
    const filteredAndSortedData = useMemo(() => {
        let sortableItems = [...mockHistoryData];

        // A. กรองตามประเภทการดำเนินการ
        if (filterAction !== 'ALL') {
            sortableItems = sortableItems.filter(item => item.actionType === filterAction);
        }

        // B. ค้นหา (Search): ค้นหาในชื่อสำนักงานและชื่อผู้แก้ไข
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            sortableItems = sortableItems.filter(item => 
                item.officeName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.editorName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.editorID.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        // C. เรียงลำดับ (Sort)
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return sortableItems;
    }, [filterAction, searchTerm, sortConfig]);

    // 2. ฟังก์ชันจัดการการเรียงลำดับ
    const handleSort = (key: keyof EditHistoryEntry) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 3. ฟังก์ชันจัดรูปแบบวันที่
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('th-TH', { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    // 4. ฟังก์ชันแสดงไอคอนตาม Action Type
    const ActionIcon = ({ type }: { type: EditHistoryEntry['actionType'] }) => {
        if (type === 'CREATE') return <PlusCircle size={16} className="text-green-500 mr-1" />;
        if (type === 'UPDATE') return <Edit size={16} className="text-blue-500 mr-1" />;
        if (type === 'DELETE') return <Trash2 size={16} className="text-red-500 mr-1" />;
        return null;
    };
    
    // UI ส่วนที่เหลือ ...
    // 
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                <History className="mr-2 text-orange-600" size={28} />
                ประวัติการแก้ไขข้อมูลสำนักงาน
            </h1>

            {/* --- Filter and Search Bar --- */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                
                {/* Search Input */}
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อสำนักงาน/ผู้แก้ไข"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full appearance-none pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                    >
                        <option value="ALL">ทั้งหมด</option>
                        <option value="UPDATE">แก้ไข (UPDATE)</option>
                        <option value="CREATE">เพิ่ม (ADD)</option>
                        <option value="DELETE">ลบ (DELETE)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
            </div>
            
            {/* --- History Table --- */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Office Name (Sortable) */}
                            <th onClick={() => handleSort('officeName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                    ชื่อสำนักงาน
                                    {sortConfig.key === 'officeName' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>
                            {/* Action Type (Sortable) */}
                            <th onClick={() => handleSort('actionType')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                    การดำเนินการ
                                    {sortConfig.key === 'actionType' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>
                            {/* Editor Name (Sortable) */}
                            <th onClick={() => handleSort('editorName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                    ผู้แก้ไข (ID)
                                    {sortConfig.key === 'editorName' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>
                            {/* Date/Time (Sortable) */}
                            <th onClick={() => handleSort('editDate')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                <div className="flex items-center">
                                    วันที่/เวลา
                                    {sortConfig.key === 'editDate' && (sortConfig.direction === 'asc' ? <SortAsc size={14} className="ml-1" /> : <SortDesc size={14} className="ml-1" />)}
                                </div>
                            </th>
                            {/* Fields Changed */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ฟิลด์ที่แก้ไข
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.officeName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className={`flex items-center font-semibold 
                                            ${item.actionType === 'CREATE' ? 'text-green-600' : 
                                            item.actionType === 'UPDATE' ? 'text-blue-600' : 'text-red-600'}`}>
                                            <ActionIcon type={item.actionType} />
                                            {item.actionType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.editorName} ({item.editorID})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(item.editDate)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={item.fieldsChanged.join(', ')}>
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                            {item.fieldsChanged.length} field(s)
                                        </span>
                                        {item.fieldsChanged.slice(0, 3).join(', ')}{item.fieldsChanged.length > 3 ? '...' : ''}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    ไม่พบประวัติการแก้ไขข้อมูลตามเงื่อนไขที่กำหนด
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OfficeEditHistoryPage;