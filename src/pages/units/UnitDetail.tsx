import { useParams, useNavigate } from 'react-router-dom';
import { useUnit } from '../../hooks/useUnits';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useState } from 'react';
import { UnitDialog } from '@/components/forms/UnitForm';

export const UnitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: unit, isLoading } = useUnit(id!);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Unit not found</h2>
        <Button onClick={() => navigate('/units')} className="mt-4">
          Back to Units
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/units')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{unit.title || `Unit ${unit.displayOrder}`}</h1>
            <p className="text-gray-500">View and manage unit information</p>
          </div>
        </div>
        <Button onClick={() => setIsEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Unit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Unit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Display Order</label>
              <div className="mt-1">
                <Badge variant="outline">{unit.displayOrder}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="mt-1">{unit.title || 'No title'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1">{unit.description || 'No description'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            {unit.thumbnail ? (
              <img
                src={unit.thumbnail}
                alt="Unit thumbnail"
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

      <Card>
        <CardHeader>
          <CardTitle>Lessons ({unit.lessons?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {unit.lessons && unit.lessons.length > 0 ? (
            <div className="space-y-2">
              {unit.lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/lessons/${lesson._id}`)}
                >
                  <div>
                    <div className="font-medium">{lesson.title || `Lesson ${lesson.displayOrder}`}</div>
                    <div className="text-sm text-gray-500">{lesson.objectives}</div>
                  </div>
                  <Badge variant="outline">Order: {lesson.displayOrder}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No lessons yet</p>
          )}
        </CardContent>
      </Card>

      <UnitDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        unit={unit}
      />
    </div>
  );
};
