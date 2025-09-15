import React, { useState } from 'react'
import Header from '../component/Header'
import LeftPanel from '../component/LeftPanel'
import Content from '../component/Content'

function DefaultLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FBFBFB] p-3 space-x-2">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'md:w-48 lg:w-64'} transition-all duration-300 z-20`}>
        <LeftPanel isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 z-10">
          <Header isCollapsed={isSidebarCollapsed} />
        </div>

        <div className="flex-1 overflow-auto bg-gray-50">
          <Content />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
