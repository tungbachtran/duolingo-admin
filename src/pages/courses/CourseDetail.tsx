import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../../hooks/useCourses';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Pencil } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useState } from 'react';
import { CourseDialog } from '../../components/forms/CourseDialog';

export const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(id!);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <Button onClick={() => navigate('/courses')} className="mt-4">
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Course Details</h1>
            <p className="text-gray-500">View and manage course information</p>
          </div>
        </div>
        <Button onClick={() => setIsEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Course
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Display Order</label>
              <div className="mt-1">
                <Badge variant="outline">{course.displayOrder}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1">{course.description || 'No description'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1">
                {course.createdAt
                  ? new Date(course.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Updated At</label>
              <p className="mt-1">
                {course.updatedAt
                  ? new Date(course.updatedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt="Course thumbnail"
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
          <CardTitle>Units ({course.units?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {course.units && course.units.length > 0 ? (
            <div className="space-y-2">
              {course.units.map((unit) => (
                <div
                  key={unit._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/units/${unit._id}`)}
                >
                  <div>
                    <div className="font-medium">{unit.title || `Unit ${unit.displayOrder}`}</div>
                    <div className="text-sm text-gray-500">{unit.description}</div>
                  </div>
                  <Badge variant="outline">Order: {unit.displayOrder}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No units yet</p>
          )}
        </CardContent>
      </Card>

      <CourseDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        course={course}
      />
    </div>
  );
};
