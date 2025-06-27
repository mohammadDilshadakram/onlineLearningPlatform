"use client"

import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useEffect, useState } from 'react'
import ChapterContent from '../_components/ChapterContent'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import { useParams } from 'next/navigation';
import axios from 'axios'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Course() {
  const {courseId}=useParams();
  const [courseInfo,setCourseInfo]=useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    GetEnrolledCourseById();
  }, [])

  const GetEnrolledCourseById = async () => {
    const result = await axios.get('/api/enroll-course?courseId='+courseId);
    setCourseInfo(result.data);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader hideSidebar={true}/>
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <ChapterListSidebar courseInfo={courseInfo} onSelect={() => setSidebarOpen(false)}/>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar (always visible) */}
        <div className="hidden lg:block">
          <ChapterListSidebar courseInfo={courseInfo}/>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrolledCourseById()}/>
        </div>
      </div>
    </div>
  )
}

export default Course