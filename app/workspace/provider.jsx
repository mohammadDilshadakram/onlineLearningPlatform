import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSideBar from './_components/AppSideBar'
import AppHeader from './_components/AppHeader'

function WorkspaceProvider({children}) {
  return (

    <SidebarProvider>
        <AppSideBar/>
      

       
      <div className='w-full'>
        <AppHeader/>
        <div className='p-10'>
          {children}
        </div>
       </div>  
    </SidebarProvider>
    
  )
}

export default WorkspaceProvider