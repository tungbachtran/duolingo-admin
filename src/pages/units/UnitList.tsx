import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/common/DataTable";
import { useCourseUnits } from "../../hooks/useUnits";
import { useCourses } from "../../hooks/useCourses";
import { type Unit } from "../../api/unit.api";
import { Plus, Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UnitDialog } from "@/components/forms/UnitForm";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";

export const UnitList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Fetch courses for filter
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const { data: user } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile, gcTime: 0 })
  // Set default course on load
  useEffect(() => {
    if (coursesData?.data && coursesData.data.length > 0 && !selectedCourseId) {
      setSelectedCourseId(coursesData.data[0]._id);
    }
  }, [coursesData, selectedCourseId]);

  const { data, isLoading } = useCourseUnits(selectedCourseId);

  const columns: ColumnDef<Unit>[] = [
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.original.description}</div>
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
            onClick={() => navigate(`/units/${row.original._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {user?.roleId.permissions.includes('unit.edit') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedUnit(row.original);
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


  // Callback khi tạo/update unit thành công
  const handleUnitSuccess = (courseId: string) => {
    // Chuyển về course vừa tạo/update unit
    setSelectedCourseId(courseId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Units</h1>
        {user?.roleId.permissions.includes('unit.create') && (
          <Button className="text-black" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-[250px]">
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

        <Input
          placeholder="Search units..."
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

      <UnitDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedUnit(null);
        }}
        unit={selectedUnit}
        onSuccess={handleUnitSuccess} // Truyền callback
      />
    </div>
  );
};
