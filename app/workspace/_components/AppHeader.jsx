import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader({hideSidebar = false }) {
  return (
    <div className='p-5 flex justify-between items-center bg-white shadow-md'>
      {!hideSidebar && <SidebarTrigger/>}
          
          <UserButton/>
    </div>
  )
}

export default AppHeader