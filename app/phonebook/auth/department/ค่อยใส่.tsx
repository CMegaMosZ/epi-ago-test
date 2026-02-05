return (
        <div className="flex h-screen w-full bg-gray-100 font-sans text-sm relative overflow-hidden">
            
            {/* ✅ 1. Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 h-full">
                
                {/* ✅ 2. Header */}
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                {/* ✅ 3. Main Content Area (เนื้อหาเดิม) */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-0">
                    
                    {/* Search Form (เนื้อหาเดิม) */}
                    <div className="w-full max-w-7xl mx-auto bg-white shadow rounded-sm mb-8">
                        <div className="bg-[#0f3fa6] text-white p-4 flex items-center justify-center">
                            <h2 className="text-lg font-medium flex items-center gap-2">
                                <Building size={20} />
                                ข้อมูลสำนักงาน
                            </h2>
                        </div>
                        <form onSubmit={handleSearch} className="p-8 space-y-4">
                            {/* ... (เนื้อหา Form เดิม) ... */}
                        </form>
                    </div>

                    {/* Results Table (เนื้อหาเดิม) */}
                    {showResults && (
                        <div className="w-full max-w-7xl mx-auto bg-white shadow rounded-sm mb-10">
                            {/* ... (เนื้อหา Table เดิม) ... */}
                        </div>
                    )}
                    
                    {/* Modals (เนื้อหาเดิม) */}
                    {/* ... (Modal แจ้งเตือน, ค้นหาสำเร็จ, Profile Card) ... */}

                </main>
                
                {/* ✅ 4. Footer (ถ้ามี) */}
                {/* <Footer /> */}
            </div>
        </div>
    )
}