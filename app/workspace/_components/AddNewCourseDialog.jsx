import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Loader2Icon, Sparkle } from 'lucide-react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'

// Utility to calculate completion percent
const getCompletionPercent = (formData) => {
  const totalFields = 5; // includeVideo not counted, it's boolean toggle
  const fields = ['name', 'description', 'noOfChapters', 'level', 'category'];
  const filled = fields.filter(field => {
    const val = formData[field];
    return val !== undefined && val !== null && val !== '';
  }).length;
  return Math.round((filled / totalFields) * 100);
}

// Emoji mood based on percentage
const getDogMood = (percent) => {
  if (percent < 20) return "😐";
  if (percent < 40) return "🙂";
  if (percent < 60) return "😊";
  if (percent < 100) return "😁";
  return "👍";
}

function AddNewCourseDialog({ children }) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    noOfChapters: 1,
    includeVideo: false,
    level: '',
    category: ''
  });

  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const onGenerate = async() => {
    console.log(formData)
    const courseId=uuidv4();
    try {
        setLoading(true);
      const result=await axios.post('/api/generate-course-layout', {
        ...formData,
        courseId:courseId
      });
      console.log(result.data)
      setLoading(false);
      router.push('/workspace/edit-course/'+result.data?.courseId);
    }catch (e) {
      setLoading(false)
      console.log(e)
    }
  }
    

  const completionPercent = useMemo(() => getCompletionPercent(formData), [formData]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Details To Create Course</DialogTitle>

          {/* DOG EMOJI FEEDBACK */}
          <div className="flex flex-col items-center mt-4 transition-all duration-500 ease-in-out">
            <div className="text-6xl">{getDogMood(completionPercent)}</div>
            <p className="text-gray-600 mt-1 text-sm">{completionPercent}% completed</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
          </div>

          <DialogDescription asChild>
            <div className='flex flex-col gap-4 mt-6'>

              <div className="transition-all duration-300 ease-in-out">
                <label>Course Name</label>
                <Input placeholder="Course Name" onChange={(event) => onHandleInputChange('name', event?.target.value)} />
              </div>

              <div className="transition-all duration-300 ease-in-out">
                <label>Course Description (optional)</label>
                <Input placeholder="Course Description" onChange={(event) => onHandleInputChange('description', event?.target.value)} />
              </div>

              <div className="transition-all duration-300 ease-in-out">
                <label>No. of chapters</label>
                <Input placeholder="No of chapters" type='number' onChange={(event) => onHandleInputChange('noOfChapters', event?.target.value)} />
              </div>

              <div className='flex items-center gap-3 transition-all duration-300 ease-in-out'>
                <label>Include Video</label>
                <Switch
                  onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)} />
              </div>

              <div className="transition-all duration-300 ease-in-out">
                <label>Difficulty Level</label>
                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="transition-all duration-300 ease-in-out">
                <label>Category</label>
                <Input placeholder="Category (Separated by Commas)" onChange={(event) => onHandleInputChange('category', event?.target.value)} />
              </div>

              <div className='mt-5'>
                <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                {loading?<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />:
                  <Sparkle/>}
                  Generate Course
                </Button>
              </div>

            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewCourseDialog;
