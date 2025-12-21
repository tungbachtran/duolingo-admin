import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/common/DataTable';
import { useQuestions } from '../../hooks/useQuestions';
import { useCourses } from '../../hooks/useCourses';
import { useUnits } from '../../hooks/useUnits';
import { useLessons } from '../../hooks/useLessons';
import { type Question, QuestionType } from '../../types/question.types';
import { Plus, Pencil, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuestionDialog } from '@/components/forms/QuestionForm';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

const getQuestionTypeLabel = (type: QuestionType) => {
  const labels = {
    [QuestionType.MATCHING]: 'Matching',
    [QuestionType.ORDERING]: 'Ordering',
    [QuestionType.GAP]: 'Fill Gap',
    [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  };
  return labels[type];
};

export const QuestionList = () => {
  const navigate = useNavigate();


  const [search, setSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { data: user } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile, gcTime: 0 })
  // Fetch courses for filter
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });

  // Fetch units based on selected course
  const { data: unitsData } = useUnits(selectedCourseId);

  // Fetch lessons based on selected unit
  const { data: lessonsData } = useLessons(selectedUnitId);

  // Set default course on load
  useEffect(() => {
    if (coursesData?.data && coursesData.data.length > 0 && !selectedCourseId) {
      setSelectedCourseId(coursesData.data[0]._id);
    }
  }, [coursesData, selectedCourseId]);

  // Set default unit when course changes
  useEffect(() => {
    if (unitsData?.data && unitsData.data.length > 0) {
      setSelectedUnitId(unitsData.data[0]._id);
    } else {
      setSelectedUnitId('');
    }
  }, [unitsData]);

  // Set default lesson when unit changes
  useEffect(() => {
    if (lessonsData?.data && lessonsData.data.length > 0) {
      setSelectedLessonId(lessonsData.data[0]._id);
    } else {
      setSelectedLessonId('');
    }
  }, [lessonsData]);

  const { data, isLoading } = useQuestions(selectedLessonId);

  const columns: ColumnDef<Question>[] = [
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.displayOrder}</Badge>
      ),
    },
    {
      accessorKey: 'typeQuestion',
      header: 'Type',
      cell: ({ row }) => (
        <Badge>{getQuestionTypeLabel(row.original.typeQuestion)}</Badge>
      ),
    },
    {
      id: 'content',
      header: 'Content Preview',
      cell: ({ row }) => {
        const question = row.original;
        let preview = '';

        if (question.typeQuestion === QuestionType.MULTIPLE_CHOICE) {
          preview = question.correctAnswer || 'N/A';
        } else if (question.typeQuestion === QuestionType.GAP) {
          preview = question.correctAnswer || 'N/A';
        } else if (question.typeQuestion === QuestionType.ORDERING) {
          preview = question.exactFragmentText || 'N/A';
        } else if (question.typeQuestion === QuestionType.MATCHING) {
          preview = `${question.leftText?.length || 0} pairs`;
        }

        return <div className="max-w-xs truncate">{preview}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/questions/${row.original._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {user?.roleId.permissions.includes('question.edit') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedQuestion(row.original);
                setIsDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Questions</h1>
        <Button className='text-black' onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {coursesData?.data.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {unitsData?.data.map((unit) => (
              <SelectItem key={unit._id} value={unit._id}>
                {unit.title || `Unit ${unit.displayOrder}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select lesson" />
          </SelectTrigger>
          <SelectContent>
            {lessonsData?.data.map((lesson) => (
              <SelectItem key={lesson._id} value={lesson._id}>
                {lesson.title || `Lesson ${lesson.displayOrder}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={data?.pagination}

        isLoading={isLoading}
      />

      <QuestionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        unitId={selectedUnitId}
        lessonId={selectedLessonId}
        courseId={selectedCourseId}
      />
    </div>
  );
};
