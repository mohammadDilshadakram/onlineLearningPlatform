"use client"
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Book, Compass, LayoutDashboard, PencilRulerIcon, UserCircle2Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import AddNewCourseDialog from './AddNewCourseDialog'

const SideBarOptions = [
    {
        title: 'Dashboard',
        icon:LayoutDashboard,
        path:'/workspace'
    },
    {
        title: 'My Learning',
        icon:Book,
        path:'/workspace/my-learning'
    },
    {
        title: 'Explore Courses',
        icon:Compass,
        path:'/workspace/explore'
    },
   
    // {
    //     title: 'Ai Tools',
    //     icon:PencilRulerIcon,
    //     path:'/workspace/ai-tools'
    // },
     {
        title: 'Billing',
        icon:LayoutDashboard,
        path:'/workspace/billing'
    },
    {
        title:'Profile',
        icon:UserCircle2Icon,
        path:'/workspace/profile'
    }
]

function AppSideBar() {

    const path=usePathname();

  return (
   <Sidebar>
      <SidebarHeader>
        <Image src={'/logo.svg'} alt="Logo" width={50} height={70} />
        </SidebarHeader> 

      <SidebarContent>
        <SidebarGroup >
            <AddNewCourseDialog>
                 <Button>Create New Course</Button>
            </AddNewCourseDialog>
           
        </SidebarGroup>

        <SidebarGroup >
            <SidebarGroupContent>
                <SidebarMenu>
                    {SideBarOptions.map((item, index) => (
                        <SidebarMenuItem key={index}>

                       
                           <SidebarMenuButton asChild className={'p-5'}>
                                <Link href={item.path} className={`text-[17px]
                                    ${path.includes(item.path)&& 'text-primary bg-gray-300'}`} >
                                        <item.icon className='h-7 w-7'/>
                                        <span>{item.title}</span>
                                </Link>
                           
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSideBar