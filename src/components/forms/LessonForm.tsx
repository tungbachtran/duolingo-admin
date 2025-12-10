import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateLesson, useUpdateLesson } from '../../hooks/useLessons';
import { useUnits } from '../../hooks/useUnits';
import { type Lesson } from '../../types/course.types';
import { useCourses } from '@/hooks/useCourses';

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson | null;
  courseId:string
}

interface FormData {
  courseId: string;
  unitId: string;
  title: string;
  experiencePoint: number;
  objectives: string;
  thumbnail: string;
}

export const LessonDialog = ({ open, onOpenChange, lesson,courseId }: LessonDialogProps) => {
  const createMutation = useCreateLesson();
  const updateMutation = useUpdateLesson();
  
  const [formData, setFormData] = useState<FormData>({
    courseId: '',
    unitId: '',
    title: '',
    experiencePoint: 0,
    objectives: '',
    thumbnail: '',
  });

  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const { data: unitsData } = useUnits(formData.courseId);

  useEffect(() => {
    if (lesson) {
      setFormData({
        courseId: courseId,
        unitId: typeof lesson.unitId === 'string' ? lesson.unitId : lesson.unitId._id,
        title: lesson.title || '',
        experiencePoint: lesson.experiencePoint || 0,
        objectives: lesson.objectives || '',
        thumbnail: lesson.thumbnail || '',
      });
    } else {
      setFormData({
        courseId: '',
        unitId: '',
        title: '',
        experiencePoint: 0,
        objectives: '',
        thumbnail: '',
      });
    }
  }, [lesson, open]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    if (field === 'experiencePoint') {
      setFormData(prev => ({
        ...prev,
        [field]: value ? parseInt(value, 10) : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCourseChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      courseId: value,
      unitId: '' // Reset unit khi thay course
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.unitId) {
      alert('Please select a unit');
      return;
    }

    try {
      if (lesson) {
        const { courseId, ...updateData } = formData;
        await updateMutation.mutateAsync({ id: lesson._id, data: updateData });
      } else {
        const { courseId, ...createData } = formData;
        await createMutation.mutateAsync(createData);
      }
      onOpenChange(false);
      setFormData({
        courseId: '',
        unitId: '',
        title: '',
        experiencePoint: 0,
        objectives: '',
        thumbnail: '',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lesson ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Course</label>
            <Select value={formData.courseId} onValueChange={handleCourseChange} disabled={!!lesson}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {coursesData?.data.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.description || `Course ${course.displayOrder}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Unit</label>
            <Select value={formData.unitId} onValueChange={(value) => handleInputChange('unitId', value)} disabled={!formData.courseId || !!lesson}>
              <SelectTrigger>
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {unitsData?.data.map((unit) => (
                  <SelectItem key={unit._id} value={unit._id}>
                    {unit.title || `Unit ${unit.displayOrder}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Title</label>
            <Input 
              placeholder="Lesson title" 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Experience Point</label>
            <Input
              type='number'
              min={0}
              placeholder="Experience point"
              value={formData.experiencePoint || ''}
              onChange={(e) => handleInputChange('experiencePoint', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Objectives</label>
            <Textarea 
              placeholder="Lesson objectives" 
              value={formData.objectives}
              onChange={(e) => handleInputChange('objectives', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Thumbnail URL</label>
            <Input 
              placeholder="https://..." 
              value={formData.thumbnail}
              onChange={(e) => handleInputChange('thumbnail', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className='text-black'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {lesson ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};