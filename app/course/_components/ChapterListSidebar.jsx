import React, { useContext } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import { CheckCircle } from 'lucide-react';

function ChapterListSidebar({ courseInfo, onSelect }) {
    const course = courseInfo?.courses;
    const enrollCourse = courseInfo?.enrollCourse;
    const courseContent = courseInfo?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
    let completedChapter = enrollCourse?.completedChapters ?? [];

    const handleChapterSelect = (index) => {
        setSelectedChapterIndex(index);
        if (onSelect) onSelect();
    }

    return (
        <div className='w-[280px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto'>
            <div className='p-4 sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10'>
                <h2 className='font-bold text-lg text-black dark:text-white'>Chapters</h2>
            </div>
            <Accordion type="single" collapsible className="p-2">
                {courseContent?.map((chapter, index) => (
                    <AccordionItem 
                        value={chapter?.courseData?.chapterName} 
                        key={index}
                        className="border-0"
                    >
                        <AccordionTrigger 
                            className={`text-sm p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedChapterIndex === index ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            onClick={() => handleChapterSelect(index)}
                        >
                            <div className="flex items-center space-x-2">
                                {!completedChapter.includes(index) ? (
                                    <span className="w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
                                        {index+1}
                                    </span>
                                ) : (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                <span className="text-left">{chapter?.courseData?.chapterName}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent asChild>
                            <div className="pl-8 pt-1 space-y-1">
                                {chapter?.courseData?.topics.map((topic, index_) => (
                                    <div 
                                        key={index_} 
                                        className={`p-2 rounded-md text-sm ${
                                            completedChapter.includes(index) 
                                                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {topic?.topic}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default ChapterListSidebar