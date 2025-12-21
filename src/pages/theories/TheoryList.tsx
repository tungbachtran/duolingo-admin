import { useState, useEffect } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/common/DataTable';
import { useTheories, useDeleteTheory } from '../../hooks/useTheories';
import { useCourses } from '../../hooks/useCourses';
import { useUnits } from '../../hooks/useUnits';
import { type Theory, TheoryType } from '../../types/theory.types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TheoryDialog } from '@/components/forms/TheoryForm';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

const getTheoryTypeLabel = (type: TheoryType) => {
  const labels = {
    [TheoryType.GRAMMAR]: 'Grammar',
    [TheoryType.PHRASE]: 'Phrase',
    [TheoryType.FLASHCARD]: 'Flashcard',
  };
  return labels[type];
};

export const TheoryList = () => {

  const [search, setSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTheory, setSelectedTheory] = useState<Theory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch courses for filter
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });

  // Fetch units based on selected course
  const { data: unitsData } = useUnits(selectedCourseId);
  const { data: user } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile, gcTime: 0 })
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

  const { data, isLoading } = useTheories(selectedUnitId);

  const deleteMutation = useDeleteTheory();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Theory>[] = [
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.displayOrder}</Badge>
      ),
    },
    {
      accessorKey: 'typeTheory',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary">{getTheoryTypeLabel(row.original.typeTheory)}</Badge>
      ),
    },
    {
      id: 'content',
      header: 'Content',
      cell: ({ row }) => {
        const theory = row.original;
        let content = '';

        if (theory.typeTheory === TheoryType.GRAMMAR) {
          content = theory.title || 'N/A';
        } else if (theory.typeTheory === TheoryType.PHRASE) {
          content = theory.phraseText || 'N/A';
        } else if (theory.typeTheory === TheoryType.FLASHCARD) {
          content = theory.term || 'N/A';
        }

        return <div className="max-w-md truncate">{content}</div>;
      },
    },
    {
      accessorKey: 'translation',
      header: 'Translation',
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.original.translation || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {user?.roleId.permissions.includes('theory.edit') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTheory(row.original);
                setIsDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {user?.roleId.permissions.includes('theory.delete') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteId(row.original._id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];



  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theories</h1>
        <Button className='text-black' onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Theory
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-[200px]">
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
          <SelectTrigger className="w-[200px]">
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

        <Input
          placeholder="Search theories..."
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

      <TheoryDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedTheory(null);
        }}
        theory={selectedTheory}
        courseId={selectedCourseId}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Theory"
        description="Are you sure you want to delete this theory? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};
