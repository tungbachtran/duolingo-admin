import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/common/DataTable";
import { useLessons } from "../../hooks/useLessons";
import { useCourses } from "../../hooks/useCourses";
import { useUnits } from "../../hooks/useUnits";
import { type Lesson } from "../../types/course.types";
import { Plus, Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LessonDialog } from "@/components/forms/LessonForm";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export const LessonList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Fetch courses for filter
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });

  // Fetch units based on selected course
  const { data: unitsData } = useUnits(selectedCourseId);

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
      setSelectedUnitId("");
    }
  }, [unitsData]);

  const { data, isLoading } = useLessons(selectedUnitId);

  const columns: ColumnDef<Lesson>[] = [
    {
      accessorKey: "displayOrder",
      header: "Order",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.displayOrder}</Badge>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "objectives",
      header: "Objectives",
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.original.objectives}</div>
      ),
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/lessons/${row.original._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLesson(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
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
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Button className="text-black" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson
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
          placeholder="Search lessons..."
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

      <LessonDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        courseId={selectedCourseId}
      
      />
    </div>
  );
};
