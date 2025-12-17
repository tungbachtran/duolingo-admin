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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateUnit, useUpdateUnit } from '../../hooks/useUnits';
import { useCourses } from '../../hooks/useCourses';
import { type Unit } from '../../api/unit.api';
import { uploadImageAndGetUrl } from '@/api/upload.api';

const unitSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit?: Unit | null;
  onSuccess?: (courseId: string) => void; // Thêm callback
}

export const UnitDialog = ({ open, onOpenChange, unit, onSuccess }: UnitDialogProps) => {
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  useEffect(() => {
    setThumbnailPreview(unit?.thumbnail || '');
    setThumbnailFile(null);
  }, [unit, open]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview?.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      courseId: '',
      title: '',
      description: '',
      thumbnail: '',
    },
  });

  useEffect(() => {
    if (unit) {
      form.reset({
        courseId: unit.courseId,
        title: unit.title || '',
        description: unit.description || '',
        thumbnail: unit.thumbnail || '',
      });
    } else {
      form.reset({
        courseId: '',
        title: '',
        description: '',
        thumbnail: '',
      });
    }
  }, [unit, form]);

  const onSubmit = async (data: UnitFormValues) => {
    const payload = { ...data };

    if (thumbnailFile) {
      const url = await uploadImageAndGetUrl(thumbnailFile);
      payload.thumbnail = url;
    }
    if (unit) {

      await updateMutation.mutateAsync({ id: unit._id, data: payload });
      onSuccess?.(data.courseId); // Gọi callback với courseId
    } else {
      const response = await createMutation.mutateAsync(payload);
      // Lấy courseId từ response hoặc từ data
      const courseId = response?.value?.courseId || data.courseId;
      onSuccess?.(courseId); // Gọi callback với courseId
    }
    onOpenChange(false);
    form.reset();
    setThumbnailFile(null);

  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{unit ? 'Edit Unit' : 'Create Unit'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value} // Đổi từ defaultValue sang value
                    disabled={!!unit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {coursesData?.data.map((course) => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.description || `Course ${course.displayOrder}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Unit title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Unit description" {...field} />
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
                          setThumbnailPreview(f ? URL.createObjectURL(f) : (unit?.thumbnail || ''));
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
                {unit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
