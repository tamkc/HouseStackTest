"use client"

import React, { useEffect, useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Trash2, Pencil, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getNotes, addNote, deleteNote, updateNote } from '@/lib/api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

export type Note = {
    id: string
    createdAt: Date | string
    title: string
    content: string
}

export function DataTable() {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: "", content: "" });

    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedNote, setEditedNote] = useState({ title: "", content: "" });


    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const data = await getNotes();
            const transformedNotes = data.map(note => ({
                id: note._id,
                title: note.title,
                content: note.content,
                createdAt: note.createdAt
            }));
            setNotes(transformedNotes);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notes');
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await addNote(newNote.title, newNote.content);
            if (result) {
                await fetchNotes();
                setNewNote({ title: "", content: "" });
                setIsAddDialogOpen(false);
                toast({
                    title: "Success",
                    description: "Note added successfully",
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add notes');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add note",
            });
        }
    };

    const handleViewNote = (note: Note) => {
        setSelectedNote(note);
        setEditedNote({ title: note.title, content: note.content });
        setIsEditMode(false);
        setIsViewDialogOpen(true);
    };

    const handleUpdateNote = async () => {
        if (!selectedNote) return;

        try {
            await updateNote(selectedNote.id, editedNote);
            await fetchNotes();
            setIsViewDialogOpen(false);
            setSelectedNote(null);
            setIsEditMode(false);
            toast({
                title: "Success",
                description: "Note updated successfully",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notes');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update note",
            });
        }
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await deleteNote(id);
            await fetchNotes();
            toast({
                title: "Success",
                description: "Note deleted successfully",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete notes');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete note",
            });
        }
    };

    const columns: ColumnDef<Note>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "Id",
            cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "content",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Content
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("content")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const datetime = new Date(row.getValue("createdAt")).toLocaleString().replace(/,/g, "")
                return <div className="text-left font-medium">{datetime}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const note = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewNote(note)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteNote(note.id)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: notes,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    if (loading) {
        return <div className="w-full text-center py-4">Loading notes...</div>;
    }

    if (error) {
        return <div className="w-full text-center py-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter notes..."
                    value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("content")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Note
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Note</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddNote} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={newNote.title}
                                        onChange={(e) =>
                                            setNewNote((prev) => ({ ...prev, title: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Input
                                        id="content"
                                        value={newNote.content}
                                        onChange={(e) =>
                                            setNewNote((prev) => ({ ...prev, content: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Add Note</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Edit Note" : "View Note"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            {isEditMode ? (
                                <Input
                                    id="title"
                                    value={editedNote.title}
                                    onChange={(e) =>
                                        setEditedNote((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                />
                            ) : (
                                <div className="rounded-md border p-2">
                                    {selectedNote?.title}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            {isEditMode ? (
                                <Textarea
                                    id="content"
                                    value={editedNote.content}
                                    onChange={(e) =>
                                        setEditedNote((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    className="h-32"
                                />
                            ) : (
                                <div className="rounded-md border p-2 min-h-[8rem] whitespace-pre-wrap">
                                    {selectedNote?.content}
                                </div>
                            )}
                        </div>
                        {selectedNote && (
                            <div className="text-sm text-muted-foreground">
                                Created: {new Date(selectedNote.createdAt).toLocaleString()}
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2">
                        {isEditMode ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditMode(false);
                                        setEditedNote({
                                            title: selectedNote?.title || "",
                                            content: selectedNote?.content || "",
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateNote}>
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditMode(true)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Note
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}