import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCreateCourse, useUpdateCourse } from '../../hooks/useCourses';
import { type Course } from '../../types/course.types';
import { toast } from 'sonner'; // Import toast

const courseSchema = z.object({
  description: z.string().min(1, 'Description is required'), // Thêm validation
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
}

export const CourseDialog = ({ open, onOpenChange, course }: CourseDialogProps) => {
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      description: '',
      thumbnail: '',
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        description: course.description || '',
        thumbnail: course.thumbnail || '',
      });
    } else {
      form.reset({
        description: '',
        thumbnail: '',
      });
    }
  }, [course, form]);

  const onSubmit = async (data: CourseFormValues) => {
    try {
      if (course) {
        await updateMutation.mutateAsync({ id: course._id, data });
        toast('Course updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast('Course created successfully');
      }
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      // Hiển thị lỗi chi tiết
      toast(error?.response?.data?.message || error?.message || 'Something went wrong');
      console.error('Course operation error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Create Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Course description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                {createMutation.isPending || updateMutation.isPending 
                  ? 'Loading...' 
                  : course ? 'Update' : 'Create'
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
