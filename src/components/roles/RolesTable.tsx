import React, {useState} from 'react';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';


import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Role } from '@/types/role';

interface RolesTableProps {
  roles: Role[];
  onChangeRoleName: (id: string, name: string) => void;
  onDeleteRole: (id: string) => void;
  onOpenEditPermissions: (role: Role) => void;
}

export const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  onChangeRoleName,
  onDeleteRole,
  onOpenEditPermissions,
}) => {
  // state confirm delete
  const [deleteTarget, setDeleteTarget] = React.useState<Role | null>(null);

  const columns = React.useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Role',
        cell: ({ row }) => {
          const role = row.original;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [value, setValue] = useState(role.name);
          const isAdmin = role.name === 'Admin';

          const handleBlur = () => {
            const trimmed = value.trim();
            if (!trimmed || trimmed === role.name) return;
            if (isAdmin) {
              setValue(role.name);
              return;
            }
            onChangeRoleName(role._id, trimmed);
          };

          return (
            <div className="flex items-center gap-2">
              <Input
                className="h-8 w-40"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                disabled={isAdmin}
              />
              {isAdmin && (
                <Badge variant="outline" className="text-xs">
                  System
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
          const role = row.original;
          const count = role.permissions?.length ?? 0;
          const preview = role.permissions?.slice(0, 3) ?? [];
          const extra = count - preview.length;

          return (
            <div className="flex flex-wrap items-center gap-1">
              {preview.map((p) => (
                <Badge key={p} variant="secondary" className="font-mono text-[10px]">
                  {p}
                </Badge>
              ))}
              {extra > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  +{extra} nữa
                </Badge>
              )}
              {count === 0 && (
                <span className="text-xs text-muted-foreground">Không có permission</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const role = row.original;
          const isAdmin = role.name === 'Admin';

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onOpenEditPermissions(role)}>
                    Chỉnh sửa permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isAdmin}
                    className={isAdmin ? 'cursor-not-allowed opacity-60' : ''}
                    onClick={() => {
                      if (isAdmin) return;
                      setDeleteTarget(role);
                    }}
                  >
                    Xóa role
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onChangeRoleName, onOpenEditPermissions]
  );

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.id === 'actions' ? 'w-[80px]' : ''}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.id === 'actions' ? 'text-right' : ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                  Không có role nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa role?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xóa role <span className="font-semibold">{deleteTarget?.name}</span>. 
              Hành động này không thể hoàn tác, nên suy nghĩ cho kỹ (ít nhất là 0.5 giây).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  onDeleteRole(deleteTarget._id);
                }
                setDeleteTarget(null);
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
