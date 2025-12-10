import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../../hooks/useLessons';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useState } from 'react';
import { LessonDialog } from '@/components/forms/LessonForm';

export const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lesson, isLoading } = useLesson(id!);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Lesson not found</h2>
        <Button onClick={() => navigate('/lessons')} className="mt-4">
          Back to Lessons
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/lessons')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lesson.title || `Lesson ${lesson.displayOrder}`}</h1>
            <p className="text-gray-500">View and manage lesson information</p>
          </div>
        </div>
        <Button onClick={() => setIsEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Lesson
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Display Order</label>
              <div className="mt-1">
                <Badge variant="outline">{lesson.displayOrder}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="mt-1">{lesson.title || 'No title'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Objectives</label>
              <p className="mt-1">{lesson.objectives || 'No objectives'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            {lesson.thumbnail ? (
              <img
                src={lesson.thumbnail}
                alt="Lesson thumbnail"
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No thumbnail</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LessonDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        lesson={lesson}
      />
    </div>
  );
};
