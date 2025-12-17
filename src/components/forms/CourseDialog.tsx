import { useEffect, useState } from 'react';
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
import { uploadImageAndGetUrl } from '@/api/upload.api';

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  useEffect(() => {
    // preview theo url cũ khi edit
    setThumbnailPreview(course?.thumbnail || '');
    setThumbnailFile(null);
  }, [course, open]);

  useEffect(() => {
    return () => {
      // cleanup objectURL nếu có
      if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);
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
      const payload = { ...data };

      if (thumbnailFile) {
        const url = await uploadImageAndGetUrl(thumbnailFile);
        payload.thumbnail = url;
      }
      console.log(payload)
      if (course) {
        await updateMutation.mutateAsync({ id: course._id, data: payload });
        toast('Course updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        toast('Course created successfully');
      }
      onOpenChange(false);
      form.reset();
      setThumbnailFile(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              render={() => (
                <FormItem>
                  <FormLabel>Thumbnail File</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setThumbnailFile(f);

                          if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
                          setThumbnailPreview(f ? URL.createObjectURL(f) : (course?.thumbnail || ''));
                        }}
                      />
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="thumbnail preview"
                          className="w-full max-w-[280px] rounded border"
                        />
                      ) : null}</>
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
