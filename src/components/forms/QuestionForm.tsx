import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCreateQuestion, useUpdateQuestion } from '../../hooks/useQuestions';
import { useLessons } from '../../hooks/useLessons';
import { type Question, QuestionType } from '../../types/question.types';
import { QUESTION_TYPES } from '../../utils/constants';

import { X, Plus } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useUnits } from '@/hooks/useUnits';

const baseSchema = z.object({
  lessonId: z.string(),
  typeQuestion: z.nativeEnum(QuestionType),
  displayOrder: z.number().optional(),
});

const matchingSchema = baseSchema.extend({
  typeQuestion: z.literal(QuestionType.MATCHING),
  leftText: z.array(z.object({ value: z.string() })).min(1),
  rightText: z.array(z.object({ value: z.string() })).min(1),
});

const orderingSchema = baseSchema.extend({
  typeQuestion: z.literal(QuestionType.ORDERING),
  fragmentText: z.array(z.string().min(1)).min(1),
  exactFragmentText: z.string().min(1),
});

const gapSchema = baseSchema.extend({
  typeQuestion: z.literal(QuestionType.GAP),
  correctAnswer: z.string().min(1),
  mediaUrl: z.string().url().optional().or(z.literal('')),
});

const multipleChoiceSchema = baseSchema.extend({
  typeQuestion: z.literal(QuestionType.MULTIPLE_CHOICE),
  title: z.string().min(1),
  correctAnswer: z.string().min(1),
  answers: z.array(z.string().min(1)).min(2),
  mediaUrl: z.string().url().optional().or(z.literal('')),
});

export const QuestionSchema = z.discriminatedUnion('typeQuestion', [
  matchingSchema,
  orderingSchema,
  gapSchema,
  multipleChoiceSchema,
]);

export type QuestionFormValues = z.infer<typeof QuestionSchema>;



interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: Question | null;
  courseId: string;
  unitId: string;
  lessonId?: string;
}


export const QuestionDialog = ({ open, onOpenChange, question, unitId, courseId }: QuestionDialogProps) => {
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();

  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const { data: unitsData } = useUnits(selectedCourse);
  const { data: lessonsData } = useLessons(selectedUnit);
  


  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      lessonId: '',
      typeQuestion: QuestionType.MULTIPLE_CHOICE,
    },
  });

  const { fields: leftFields, append: appendLeft, remove: removeLeft } = useFieldArray({
    control: form.control,
    name: 'leftText' as never,
  });

  const { fields: rightFields, append: appendRight, remove: removeRight } = useFieldArray({
    control: form.control,
    name: 'rightText' as never,
  });

  const { fields: fragmentFields, append: appendFragment, remove: removeFragment } = useFieldArray({
    control: form.control,
    name: 'fragmentText' as never,
  });

  const { fields: answerFields, append: appendAnswer, remove: removeAnswer } = useFieldArray({
    control: form.control,
    name: 'answers' as never,
  });

  useEffect(() => {
    if (question) {
      setSelectedType(question.typeQuestion);
      const lessonId =  question.lessonId

      // Tìm course và unit của lesson này
      const lesson = lessonsData?.data.find(l => l._id === lessonId);
      if (lesson) {

        setSelectedCourse(courseId);
        setSelectedUnit(unitId);
      }

      const formData: Record<string, unknown> = {
        lessonId:  question.lessonId ,
        typeQuestion: question.typeQuestion,
        displayOrder: question.displayOrder,
      };

      if (question.typeQuestion === QuestionType.MATCHING) {
        formData.leftText = question.leftText || [];
        formData.rightText = question.rightText || [];
      } else if (question.typeQuestion === QuestionType.ORDERING) {
        formData.fragmentText = question.fragmentText || [];
        formData.exactFragmentText = question.exactFragmentText || '';
      } else if (question.typeQuestion === QuestionType.GAP) {
        formData.correctAnswer = question.correctAnswer || '';
        formData.mediaUrl = question.mediaUrl || '';
      } else if (question.typeQuestion === QuestionType.MULTIPLE_CHOICE) {
        formData.correctAnswer = question.correctAnswer || '';
        formData.answers = question.answers || [];
        formData.mediaUrl = question.mediaUrl || '';
      }

      form.reset(formData as QuestionFormValues);
    } else {
      form.reset({
        lessonId: '',
        typeQuestion: QuestionType.MULTIPLE_CHOICE,
      });
    }
  }, [question, form]);

  const onSubmit = async (data: QuestionFormValues) => {

      if (question) {
        await updateMutation.mutateAsync({ id: question._id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();

      // Error handled by mutation

  };

  const renderFormFields = () => {
    switch (selectedType) {
      case QuestionType.MATCHING:
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Left Text</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendLeft({ value: '' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {leftFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <Input
                    {...form.register(`leftText.${index}.value` as const)}
                    placeholder={`Left item ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeLeft(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Right Text</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendRight({ value: '' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {rightFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <Input
                    {...form.register(`rightText.${index}.value` as const)}
                    placeholder={`Right item ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeRight(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case QuestionType.ORDERING:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="exactFragmentText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exact Fragment Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Complete sentence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Fragments</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendFragment('')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Fragment
                </Button>
              </div>
              {fragmentFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <Input
                    {...form.register(`fragmentText.${index}` as const)}
                    placeholder={`Fragment ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFragment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case QuestionType.GAP:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-4">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung câu hỏi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nội dung câu hỏi(nếu không có ảnh hay audio)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Correct answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Answer Options</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendAnswer('')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              {answerFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <Input
                    {...form.register(`answers.${index}` as const)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAnswer(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit Question' : 'Create Question'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Course Select */}
            <div>
              <FormLabel>Course</FormLabel>
              <Select
                value={selectedCourse}
                onValueChange={(value) => {
                  setSelectedCourse(value);
                  setSelectedUnit('');
                  form.setValue('lessonId', '');
                }}
                disabled={!!question}
              >
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

            {/* Unit Select */}
            {selectedCourse && (
              <div>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={selectedUnit}
                  onValueChange={(value) => {
                    setSelectedUnit(value);
                    form.setValue('lessonId', '');
                  }}
                  disabled={!!question}
                >
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
            )}

            {/* Lesson Select */}
            <FormField
              control={form.control}
              name="lessonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!!question || !selectedUnit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a lesson" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessonsData?.data
                        .filter(lesson => {
                          const lessonUnitId =  lesson.unitId
                          return lessonUnitId === selectedUnit;
                        })
                        .map((lesson) => (
                          <SelectItem key={lesson._id} value={lesson._id}>
                            {lesson.title || `Lesson ${lesson.displayOrder}`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question Type */}
            <FormField
              control={form.control}
              name="typeQuestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value as QuestionType);
                    }}
                    value={field.value}
                    disabled={!!question}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QUESTION_TYPES.map((type) => (
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
                {question ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
