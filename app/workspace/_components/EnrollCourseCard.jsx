import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { PlayCircle } from "lucide-react";

import Image from 'next/image';
import Link from "next/link";
import React from 'react'

function EnrollCourseCard({ course,enrollCourse }) {
     const courseJson = course?.courseJson?.course;

  const CalculatePerProgress = () => {
  const completedCount = enrollCourse?.completedChapters?.length ?? 0;
  const totalCount = course?.courseContent?.length ?? 1; // Avoid division by zero
  return Math.round((completedCount / totalCount) * 100);
}

  return (
  <div className='shadow rounded-xl'>
    <Image 
      src={course?.bannerImageUrl}
      alt={course?.name}
      width={400}
      height={300}
      className='w-full aspect-video rounded-t-xl object-cover'
    />
    <div className='p-3 flex flex-col gap-3'>
      <h2 className='font-bold text-lg'>{courseJson?.name}</h2>
      <p className='line-clamp-3 text-gray-400 text-sm'>{courseJson?.description}</p>
      <div className=''>
        <h2 className="flex justify-between text-sm text-primary">Progress<span>{CalculatePerProgress()}%</span></h2>
        <Progress value={CalculatePerProgress()} />
      
        <div className="flex items-center gap-2 mt-3">
          <Link href={'/workspace/view-course/'+course?.cid} className="w-full">
            <Button className={'w-full'}><PlayCircle/>Continue Learning</Button>
          </Link>
          {CalculatePerProgress() === 100 &&
            <Link href={`/course/${course?.cid}/quiz`}>
              <Button variant="outline">Quiz</Button>
            </Link>
          }
        </div>
        
      </div>
    </div>
  </div>
)

}

export default EnrollCourseCard