import * as React from 'react';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { type Account } from '@/types/account';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHead,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';

interface AccountsTableProps {
    data: Account[];
    onEdit: (account: Account) => void;
    onDelete: (id: string) => void;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
    data,
    onEdit,
    onDelete,
}) => {
    const [deleteTarget, setDeleteTarget] = React.useState<Account | null>(null);

    const columns = React.useMemo<ColumnDef<Account>[]>(
        () => [
            {
                id: 'user',
                header: 'User',
                cell: ({ row }) => {
                    const account = row.original;
                    const initials =
                        account.fullName
                            ?.split(' ')
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase() || '?';

                    return (
                        <div className="flex items-center gap-3">

                            <img className="h-9 w-9" src={account.avatarImage} alt={account.fullName} />

                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{account.fullName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {account.email}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'role',
                header: 'Role',
                cell: ({ row }) => {
                    const role = row.original.roleId;
                    return (
                        <Badge variant="outline" className="text-xs">
                            {role?.name || 'N/A'}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'isActive',
                header: 'Trạng thái',
                cell: ({ row }) => {
                    const isActive = row.original.isActive;
                    return (
                        <Badge
                            variant={isActive ? 'success' : 'secondary'}
                            className="text-xs"
                        >
                            {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                        </Badge>
                    );
                },
            },
            {
                id: 'lastActiveAt',
                header: 'Hoạt động cuối',
                cell: ({ row }) => {
                    const last = row.original.lastActiveAt;
                    if (!last) {
                        return (
                            <span className="text-xs text-muted-foreground">
                                Chưa có dữ liệu
                            </span>
                        );
                    }
                    const date = new Date(last);
                    return (
                        <span className="text-xs">
                            {date.toLocaleString(undefined, {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const account = row.original;
                    return (
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(account)}>
                                        Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setDeleteTarget(account)}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        Xóa
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
            },
        ],
        [onEdit]
    );

    const table = useReactTable({
        data,
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
                                    <TableHead
                                        key={header.id}
                                        className={header.id === 'actions' ? 'w-[80px] text-right' : ''}
                                    >
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
                                        <TableCell
                                            key={cell.id}
                                            className={cell.column.id === 'actions' ? 'text-right' : ''}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    Không có tài khoản nào.
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
                        <AlertDialogTitle>Xóa tài khoản?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn sắp xóa tài khoản{' '}
                            <span className="font-semibold">{deleteTarget?.email}</span>.
                            Không có nút hoàn tác, nên đừng lỡ tay khi đang buồn đời.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    onDelete(deleteTarget._id);
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
