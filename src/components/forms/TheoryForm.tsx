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
import { useCreateTheory, useUpdateTheory } from '../../hooks/useTheories';
import { useUnits } from '../../hooks/useUnits';
import { type Theory, TheoryType } from '../../types/theory.types';
import { THEORY_TYPES } from '../../utils/constants';
import { useCourses } from '@/hooks/useCourses';

const baseSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  unitId: z.string().min(1, 'Unit is required'),
  typeTheory: z.nativeEnum(TheoryType),
  displayOrder: z.number().optional(),
});

const grammarSchema = baseSchema.extend({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  example: z.string().optional(),
});

const phraseSchema = baseSchema.extend({
  phraseText: z.string().min(1, 'Phrase text is required'),
  translation: z.string().optional(),
  audio: z.string().url().optional().or(z.literal('')),
});

const flashcardSchema = baseSchema.extend({
  term: z.string().min(1, 'Term is required'),
  translation: z.string().optional(),
  ipa: z.string().optional(),
  partOfSpeech: z.string().optional(),
  audio: z.string().url().optional().or(z.literal('')),
  image: z.string().url().optional().or(z.literal('')),
});

type TheoryFormValues = z.infer<typeof grammarSchema> | 
  z.infer<typeof phraseSchema> | 
  z.infer<typeof flashcardSchema>;

interface TheoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theory?: Theory | null;
  courseId:string
}

export const TheoryDialog = ({ open, onOpenChange, theory,courseId }: TheoryDialogProps) => {
  const createMutation = useCreateTheory();
  const updateMutation = useUpdateTheory();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const { data: unitsData } = useUnits(selectedCourseId);
  const [selectedType, setSelectedType] = useState<TheoryType>(TheoryType.GRAMMAR);

  const getSchema = (type: TheoryType) => {
    switch (type) {
      case TheoryType.GRAMMAR:
        return grammarSchema;
      case TheoryType.PHRASE:
        return phraseSchema;
      case TheoryType.FLASHCARD:
        return flashcardSchema;
      default:
        return baseSchema;
    }
  };

  const form = useForm<TheoryFormValues>({
    resolver: zodResolver(getSchema(selectedType)),
    defaultValues: {
      courseId: '',
      unitId: '',
      typeTheory: TheoryType.GRAMMAR,
    },
  });

  useEffect(() => {
    if (theory) {
      setSelectedType(theory.typeTheory);
      
      setSelectedCourseId(courseId);
      
      const formData: Record<string, unknown> = {
        courseId: courseId|| '',
        unitId: typeof theory.unitId === 'string' ? theory.unitId : theory.unitId._id,
        typeTheory: theory.typeTheory,
        displayOrder: theory.displayOrder,
      };

      if (theory.typeTheory === TheoryType.GRAMMAR) {
        formData.title = theory.title || '';
        formData.content = theory.content || '';
        formData.example = theory.example || '';
      } else if (theory.typeTheory === TheoryType.PHRASE) {
        formData.phraseText = theory.phraseText || '';
        formData.translation = theory.translation || '';
        formData.audio = theory.audio || '';
      } else if (theory.typeTheory === TheoryType.FLASHCARD) {
        formData.term = theory.term || '';
        formData.translation = theory.translation || '';
        formData.ipa = theory.ipa || '';
        formData.partOfSpeech = theory.partOfSpeech || '';
        formData.audio = theory.audio || '';
        formData.image = theory.image || '';
      }

      form.reset(formData as TheoryFormValues);
    } else {
      setSelectedCourseId('');
      form.reset({
        courseId: '',
        unitId: '',
        typeTheory: TheoryType.GRAMMAR,
      });
    }
  }, [theory, form, open]);

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    form.setValue('courseId', value);
    form.setValue('unitId', ''); // Reset unit when changing course
  };

  const onSubmit = async (data: TheoryFormValues) => {
    try {
      if (theory) {
        await updateMutation.mutateAsync({ id: theory._id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const renderFormFields = () => {
    switch (selectedType) {
      case TheoryType.GRAMMAR:
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Grammar title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Grammar explanation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Usage example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case TheoryType.PHRASE:
        return (
          <>
            <FormField
              control={form.control}
              name="phraseText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phrase Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phrase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="translation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation</FormLabel>
                  <FormControl>
                    <Input placeholder="Vietnamese translation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case TheoryType.FLASHCARD:
        return (
          <>
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term</FormLabel>
                  <FormControl>
                    <Input placeholder="Vocabulary term" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="translation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Translation</FormLabel>
                  <FormControl>
                    <Input placeholder="Vietnamese meaning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ipa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPA (Pronunciation)</FormLabel>
                  <FormControl>
                    <Input placeholder="/ˈvəʊkæbjʊləri/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partOfSpeech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part of Speech</FormLabel>
                  <FormControl>
                    <Input placeholder="noun, verb, adjective..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{theory ? 'Edit Theory' : 'Create Theory'}</DialogTitle>
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
                    onValueChange={handleCourseChange}
                    defaultValue={field.value}
                    disabled={!!theory}
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
              name="unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!selectedCourseId || !!theory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitsData?.data.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>
                          {unit.title || `Unit ${unit.displayOrder}`}
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
              name="typeTheory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theory Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value as TheoryType);
                    }}
                    defaultValue={field.value}
                    disabled={!!theory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theory type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {THEORY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Auto-generated if not provided"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderFormFields()}

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
                {theory ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};