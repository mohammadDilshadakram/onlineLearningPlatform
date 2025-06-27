import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Clock, Loader2Icon, PlayCircle, Sparkle, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { toast } from 'sonner';

function CourseInfo({ course,viewCourse }) {


  // ✅ Correctly access course data
  const courseLayout = course?.courseJson?.course;
const [loading, setLoading] =useState(false);
const router=useRouter();


  const GenerateCourseContent=async() => {

    setLoading(true);
    try {
      const result = await axios.post('/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: courseLayout?.name,

        courseId: course?.cid,
      })
      console.log(result.data)
      setLoading(false)
      router.replace('/workspace')
      toast.success("Course content generated successfully!");
    } catch (e) {
      console.error("Error generating course content:", e);
      setLoading(false);
      toast.error("Failed to generate course content. Please try again.");

    }

  }

  // ✅ Function to calculate total duration
  const getTotalDuration = () => {
    if (!courseLayout?.chapters) return '0 hours';

    const totalHours = courseLayout.chapters.reduce((acc, chapter) => {
      // Match numbers like 2, 2.5, 3.0 etc. before "hour"/"Hours"
      const match = chapter.duration.match(/([\d.]+)\s*hours?/i);
      const hours = match ? parseFloat(match[1]) : 0;
      return acc + hours;
    }, 0);

    return `${totalHours} hours`;
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 p-5 rounded-2xl shadow bg-white dark:bg-gray-900">
  {/* LEFT SECTION: Course Info */}
  <div className="flex flex-col gap-6 flex-1">
    <div className="space-y-2">
      <h2 className="font-bold text-2xl sm:text-3xl">{courseLayout?.name}</h2>
      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm sm:text-base">
        {courseLayout?.description}
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md">
        <Clock className="text-blue-500 w-5 h-5" />
        <div>
          <h4 className="text-sm font-medium">Duration</h4>
          <p className="text-md font-semibold">{getTotalDuration()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md">
        <Book className="text-green-500 w-5 h-5" />
        <div>
          <h4 className="text-sm font-medium">Chapters</h4>
          <p className="text-md font-semibold">{courseLayout?.chapters?.length || 0}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md">
        <TrendingUp className="text-red-500 w-5 h-5" />
        <div>
          <h4 className="text-sm font-medium">Difficulty</h4>
          <p className="text-md font-semibold">{course?.level}</p>
        </div>
      </div>
    </div>

    {/* Button */}
    <div>
      {!viewCourse ? (
        <Button
          className="w-full sm:w-auto max-w-sm"
          onClick={GenerateCourseContent}
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkle className="mr-2 h-4 w-4" />
          )}
          Generate Content
        </Button>
      ) : (
        <Link href={`/course/${course?.cid}`}>
          <Button className="w-full sm:w-auto max-w-sm">
            <PlayCircle className="mr-2 h-4 w-4" />
            Continue Learning
          </Button>
        </Link>
      )}
    </div>
  </div>

  {/* RIGHT SECTION: Banner Image */}
  {course?.bannerImageUrl && (
    <div className="w-full md:w-[350px] flex-shrink-0">
      <Image
        src={course.bannerImageUrl}
        alt="Course Banner"
        width={400}
        height={300}
        className="w-full h-auto rounded-xl shadow-lg object-cover"
      />
    </div>
  )}
</div>

  );
}

export default CourseInfo;
