import { Button } from '@/components/ui/button';
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
import axios from 'axios';
import { CheckCircle, Loader2Icon, X, Youtube } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import { toast } from 'sonner';

function ChapterContent({ courseInfo, refreshData }) {
  const {courseId} = useParams();
  const { courses, enrollCourse } = courseInfo ?? {};
  const courseContent = courseInfo?.courses?.courseContent;
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo || [];
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics || [];
  let completedChapter = enrollCourse?.completedChapters ?? [];

  const [loading, setLoading] = useState(false);

  const markChapterCompleted = async() => {
    setLoading(true);
    completedChapter.push(selectedChapterIndex);
    const result = await axios.put('/api/enroll-course', {
      courseId: courseId,
      completedChapter: completedChapter
    });
    refreshData();
    toast.success('Chapter Completed!!');
    setLoading(false);
  }

  const markInCompleteChapter = async() => {
    setLoading(true);
    const completeChap = completedChapter.filter(item => item != selectedChapterIndex);
    const result = await axios.put('/api/enroll-course', {
      courseId: courseId,
      completedChapter: completeChap
    });
    refreshData();
    toast.success('Chapter Mark InCompleted!!');
    setLoading(false);
  }

  return (
    <div className='p-4 md:p-10 flex-1 max-w-6xl mx-auto'>
      {/* Chapter Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <h2 className='font-bold text-xl md:text-2xl text-gray-900 dark:text-white'>
          <span className='bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded mr-2'>
            {selectedChapterIndex+1}
          </span>
          {courseContent?.[selectedChapterIndex]?.courseData?.chapterName || 'No chapter selected'}
        </h2>
        {!completedChapter?.includes(selectedChapterIndex) ? (
          <Button 
            onClick={() => markChapterCompleted()} 
            disabled={loading}
            className='min-w-[180px] bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black'
          >
            {loading ? <Loader2Icon className='animate-spin'/> : <CheckCircle className='mr-1'/>}
            Mark as completed
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={markInCompleteChapter}
            disabled={loading}
            className='min-w-[180px] border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800'
          >
            {loading ? <Loader2Icon className='animate-spin'/> : <X className='mr-1'/>}
            Mark InComplete
          </Button>
        )}
      </div>
      
      {/* Videos Section - Only show if there are videos */}
      {videoData?.length > 0 && (
        <div className='mb-8'>
          <h2 className='my-4 font-bold text-lg text-gray-900 dark:text-white flex items-center'>
            <span className='bg-gray-200 dark:bg-gray-700 p-2 rounded-full mr-2'>🎬</span>
            Related Videos
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {videoData.map((video, index) => index < 2 && (
              <div key={index} className='relative pt-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg'>
                <YouTube
                  videoId={video?.videoId}
                  opts={{
                    height: '100%',
                    width: '100%',
                    playerVars: {
                      modestbranding: 1,
                      rel: 0
                    }
                  }}
                  className='absolute top-0 left-0 w-full h-full'
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Section - Only show if there are topics */}
      {topics?.length > 0 ? (
        <div className='space-y-6'>
          {topics.map((topic, index) => (
            <div key={index} className='p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow'>
              <h2 className='font-bold text-lg text-black dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center'>
                <span className='w-3 h-3 bg-black dark:bg-white mr-2'></span>
                {topic?.topic || 'Untitled Topic'}
              </h2>
              {topic?.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: topic.content }}
                  className='prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300'
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-10 text-gray-500 dark:text-gray-400'>
          No topics available for this chapter
        </div>
      )}
    </div>
  );
}

export default ChapterContent;