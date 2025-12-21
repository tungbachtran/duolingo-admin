import { useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/common/DataTable';
import { useCourses } from '../../hooks/useCourses';
import { type Course } from '../../types/course.types';
import { Plus, Pencil, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CourseDialog } from '@/components/forms/CourseDialog';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

export const CourseList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data, isLoading } = useCourses({ page, pageSize, search });

  const { data: user } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile, gcTime: 0 })
  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.displayOrder}</Badge>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.original.description}</div>
      ),
    },
    {
      accessorKey: 'thumbnail',
      header: 'Thumbnail',
      cell: ({ row }) =>
        row.original.thumbnail ? (
          <img
            src={row.original.thumbnail}
            alt="thumbnail"
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-gray-200" />
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/courses/${row.original._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {user?.roleId.permissions.includes('course.edit') && (<Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCourse(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>)}
        </div>
      ),
    },
  ];

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold ">Courses</h1>
        {user?.roleId.permissions.includes('course.create') && (<Button className='text-black' onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4 " />
          Add Course
        </Button>)}
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={data?.pagination}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
      />

      <CourseDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedCourse(null);
        }}
        course={selectedCourse}
      />
    </div>
  );
};
