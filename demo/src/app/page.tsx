"use client";

import { Suspense, useMemo, useCallback, useState, useEffect } from "react";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  FilterComponentProps,
  BulkAction,
  BulkActionConfirmProps,
  BulkActionDropdownItemProps,
} from "@/lib/table/types";
import {
  Shield,
  ShieldOff,
  Trash2,
  Mail,
  Calendar,
  GripVertical,
  Github,
  ExternalLink,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/table/SortableHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/DataTable";
import { useTheme } from "next-themes";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  provider: z.string(),
  is_admin: z.boolean(),
  created_at: z.string(),
});

type User = z.infer<typeof userSchema>;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const handleEdit = (user: User) => {
  console.log("Editing user:", user);
  alert(`Editing user: ${user.name}`);
};

const handleDelete = (user: User) => {
  console.log("Deleting user:", user);
  alert(`Deleting user: ${user.name}`);
};

const EXAMPLE_USERS: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    provider: "google",
    is_admin: true,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    provider: "github",
    is_admin: false,
    created_at: "2024-02-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    provider: "email",
    is_admin: false,
    created_at: "2024-03-10T09:45:00Z",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@example.com",
    provider: "google",
    is_admin: true,
    created_at: "2024-01-05T16:20:00Z",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    provider: "github",
    is_admin: false,
    created_at: "2024-04-12T11:30:00Z",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    provider: "google",
    is_admin: true,
    created_at: "2024-05-18T13:25:00Z",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    provider: "email",
    is_admin: false,
    created_at: "2024-06-22T08:50:00Z",
  },
  {
    id: 8,
    name: "Fiona Gallagher",
    email: "fiona.gallagher@example.com",
    provider: "github",
    is_admin: false,
    created_at: "2024-07-14T15:40:00Z",
  },
  {
    id: 9,
    name: "George Miller",
    email: "george.miller@example.com",
    provider: "google",
    is_admin: false,
    created_at: "2024-08-03T10:15:00Z",
  },
  {
    id: 10,
    name: "Hannah Montana",
    email: "hannah.montana@example.com",
    provider: "email",
    is_admin: true,
    created_at: "2024-09-11T14:30:00Z",
  },
  {
    id: 11,
    name: "Isaac Newton",
    email: "isaac.newton@example.com",
    provider: "github",
    is_admin: false,
    created_at: "2024-10-05T09:20:00Z",
  },
  {
    id: 12,
    name: "Julia Roberts",
    email: "julia.roberts@example.com",
    provider: "google",
    is_admin: false,
    created_at: "2024-11-18T16:45:00Z",
  },
  {
    id: 13,
    name: "Kevin Hart",
    email: "kevin.hart@example.com",
    provider: "email",
    is_admin: false,
    created_at: "2024-12-02T11:10:00Z",
  },
  {
    id: 14,
    name: "Laura Croft",
    email: "laura.croft@example.com",
    provider: "github",
    is_admin: true,
    created_at: "2024-01-22T13:55:00Z",
  },
  {
    id: 15,
    name: "Michael Scott",
    email: "michael.scott@example.com",
    provider: "google",
    is_admin: false,
    created_at: "2024-02-14T08:30:00Z",
  },
  {
    id: 16,
    name: "Nancy Drew",
    email: "nancy.drew@example.com",
    provider: "email",
    is_admin: false,
    created_at: "2024-03-25T15:20:00Z",
  },
  {
    id: 17,
    name: "Oscar Wilde",
    email: "oscar.wilde@example.com",
    provider: "github",
    is_admin: true,
    created_at: "2024-04-30T10:40:00Z",
  },
  {
    id: 18,
    name: "Pamela Anderson",
    email: "pamela.anderson@example.com",
    provider: "google",
    is_admin: false,
    created_at: "2024-05-12T14:15:00Z",
  },
  {
    id: 19,
    name: "Quentin Tarantino",
    email: "quentin.tarantino@example.com",
    provider: "email",
    is_admin: false,
    created_at: "2024-06-08T09:50:00Z",
  },
  {
    id: 20,
    name: "Rachel Green",
    email: "rachel.green@example.com",
    provider: "github",
    is_admin: false,
    created_at: "2024-07-19T16:25:00Z",
  },
  {
    id: 21,
    name: "Steven Universe",
    email: "steven.universe@example.com",
    provider: "google",
    is_admin: true,
    created_at: "2024-08-27T11:35:00Z",
  },
  {
    id: 22,
    name: "Tina Turner",
    email: "tina.turner@example.com",
    provider: "email",
    is_admin: false,
    created_at: "2024-09-15T13:10:00Z",
  },
  {
    id: 23,
    name: "Uma Thurman",
    email: "uma.thurman@example.com",
    provider: "github",
    is_admin: false,
    created_at: "2024-10-21T10:05:00Z",
  },
  {
    id: 24,
    name: "Victor Hugo",
    email: "victor.hugo@example.com",
    provider: "google",
    is_admin: false,
    created_at: "2024-11-09T15:45:00Z",
  },
  {
    id: 25,
    name: "Wendy Williams",
    email: "wendy.williams@example.com",
    provider: "email",
    is_admin: true,
    created_at: "2024-12-16T09:30:00Z",
  },
];

function getUserColumns(): ColumnDef<User>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: () => <GripVertical className="text-muted-foreground size-3" />,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
      meta: {
        excludeFromColumnOrder: true,
      },
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      enableColumnFilter: false,
      meta: {
        excludeFromColumnOrder: true,
      },
    },
    {
      accessorKey: "name",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Name
        </SortableHeader>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
      enableSorting: true,
      enableHiding: true,
      meta: {
        enableColumnOrdering: true,
        FilterComponent: ({
          value,
          onChange,
          label,
        }: FilterComponentProps<string>) => (
          <Input
            className="max-w-xs mr-4 w-20 md:w-54"
            placeholder={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ),
      },
    },
    {
      accessorKey: "email",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Email
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {row.original.email}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
      meta: {
        enableColumnOrdering: true,
        FilterComponent: ({
          value,
          onChange,
          label,
        }: FilterComponentProps<string>) => (
          <Input
            className="max-w-xs mr-4 w-20 md:w-54"
            placeholder={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        ),
      },
    },
    {
      accessorKey: "provider",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Provider
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.provider}</Badge>
      ),
      enableSorting: true,
      enableHiding: true,
      meta: {
        enableColumnOrdering: true,
        FilterComponent: ({
          value,
          onChange,
          label,
        }: FilterComponentProps<string>) => {
          const providers = ["google", "github", "email"];

          return (
            <Select
              value={value || "all"}
              onValueChange={(val) => onChange(val === "all" ? "" : val)}
            >
              <SelectTrigger className="max-w-xs mr-4 w-20 md:w-54">
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    <Badge variant="outline">
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
    },
    {
      accessorKey: "is_admin",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Role
        </SortableHeader>
      ),
      cell: ({ row }) =>
        row.original.is_admin ? (
          <Badge className="bg-red-600 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        ) : (
          <Badge variant="secondary">User</Badge>
        ),
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const cellValue = row.getValue(columnId) as boolean;
        return cellValue === (filterValue === "true");
      },
      meta: {
        label: "Role",
        enableColumnOrdering: true,
        FilterComponent: ({
          value,
          onChange,
          label,
        }: FilterComponentProps<boolean>) => (
          <Select
            value={value || "all"}
            onValueChange={(val) => onChange(val === "all" ? "" : val)}
          >
            <SelectTrigger className="max-w-xs mr-4 w-20 md:w-54">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">
                <Badge className="bg-red-600 text-white">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </SelectItem>
              <SelectItem value="false">
                <Badge variant="secondary">User</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Created At
        </SortableHeader>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDate(row.original.created_at)}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const cellValue = new Date(row.getValue(columnId) as string);
        const filterDate = new Date(filterValue);
        return (
          cellValue.getFullYear() === filterDate.getFullYear() &&
          cellValue.getMonth() === filterDate.getMonth() &&
          cellValue.getDate() === filterDate.getDate()
        );
      },
      meta: {
        enableColumnOrdering: true,
        FilterComponent: ({
          onChange,
          label,
          parsedValue,
        }: FilterComponentProps<Date>) => (
          <DatePicker
            date={parsedValue || undefined}
            onDateChange={(date) => {
              if (date) {
                onChange(date.toISOString());
              } else {
                onChange("");
              }
            }}
            placeholder={label}
            className="max-w-xs mr-4 w-20 md:w-54"
          />
        ),
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        excludeFromColumnOrder: true,
      },
    },
  ];
}

function CustomDeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  selectedRows,
}: BulkActionConfirmProps<User>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Danger Zone
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                You are about to permanently delete {selectedCount} user
                {selectedCount === 1 ? "" : "s"}:
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {selectedRows.slice(0, 3).map((row) => (
                  <li key={row.original.id} className="text-sm font-medium">
                    {row.original.name} ({row.original.email})
                  </li>
                ))}
                {selectedCount > 3 && (
                  <li className="text-sm">
                    ...and {selectedCount - 3} more user
                    {selectedCount - 3 === 1 ? "" : "s"}
                  </li>
                )}
              </ul>
              <p className="mt-3 text-destructive font-semibold">
                This action cannot be undone!
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Delete All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CustomDropdownItem({
  onClick,
  selectedCount,
}: BulkActionDropdownItemProps<User>) {
  return (
    <DropdownMenuItem onClick={onClick} className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      <div className="flex flex-col">
        <span>Send Email to All</span>
        <span className="text-xs text-muted-foreground">
          {selectedCount} recipient{selectedCount === 1 ? "" : "s"}
        </span>
      </div>
    </DropdownMenuItem>
  );
}

function getBulkActions(): BulkAction<User>[] {
  return [
    {
      label: "Make Admin",
      variant: "default",
      icon: <Shield />,
      confirmMessage:
        "Are you sure you want to promote {count} users to admin?",
      confirmBtnLabel: "Make Admin",
      action: async (rows) => {
        console.log(
          "Making admins:",
          rows.map((r) => r.original)
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(`Successfully promoted ${rows.length} users to admin!`);
      },
    },
    {
      label: "Remove Admin",
      variant: "default",
      icon: <ShieldOff />,
      confirmMessage:
        "Are you sure you want to remove admin rights from {count} users?",
      confirmBtnLabel: "Remove Admin",
      action: async (rows) => {
        console.log(
          "Removing admin rights:",
          rows.map((r) => r.original)
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
          `Successfully removed admin rights from ${rows.length} users!`
        );
      },
    },
    {
      label: "Send Email",
      variant: "default",
      customDropdownItem: CustomDropdownItem,
      confirmMessage: "Send email to {count} selected users?",
      confirmBtnLabel: "Send Email",
      action: async (rows) => {
        console.log(
          "Sending emails to:",
          rows.map((r) => r.original.email)
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(`Successfully sent email to ${rows.length} users!`);
      },
    },
    {
      label: "Delete Users",
      variant: "destructive",
      icon: <Trash2 />,
      confirmComponent: CustomDeleteConfirm,
      action: async (rows) => {
        console.log(
          "Deleting users:",
          rows.map((r) => r.original)
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(`Successfully deleted ${rows.length} users!`);
      },
    },
    {
      label: "Export to CSV",
      variant: "default",
      icon: <ExternalLink />,
      skipConfirm: true,
      action: async (rows) => {
        console.log(
          "Exporting users:",
          rows.map((r) => r.original)
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`Exported ${rows.length} users to CSV!`);
      },
    },
  ];
}

function DemoPageContent() {
  const columns = useMemo(() => getUserColumns(), []);
  const bulkActions = useMemo(() => getBulkActions(), []);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRowOrderChange = useCallback((newData: User[]) => {
    console.log("Row order changed:", newData);
  }, []);
  const handleColumnOrderChange = useCallback((newColumnOrder: string[]) => {
    console.log("Column order changed:", newColumnOrder);
  }, []);

  function toggleTheme() {
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      default:
        setTheme("light");
    }
  }
  return (
    <div className="min-h-screen w-full bg-linear-to-br">
      <div className="border-b backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Next Schema Table
                </h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Live Demo
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/Zaryu/next-schema-table"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </Button>
              <Button size="sm" asChild>
                <a
                  href="https://github.com/Zaryu/next-schema-table/blob/main/docs/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Documentation</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {!isMounted ? (
                  <Monitor className="h-5 w-5" />
                ) : theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Declarative, Type-Safe React Tables
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Built with TanStack Table, Zod, and Next.js. Drop-in solution with
            zero boilerplate.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary">Virtual Scrolling</Badge>
            <Badge variant="secondary">Sorting & Filtering</Badge>
            <Badge variant="secondary">Bulk Actions</Badge>
            <Badge variant="secondary">Column Reordering</Badge>
            <Badge variant="secondary">Row Reordering</Badge>
            <Badge variant="secondary">URL State Sync</Badge>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>User Management Demo</span>
              <Badge variant="outline" className="font-normal">
                {EXAMPLE_USERS.length} users
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Try sorting, filtering, dragging columns/rows, bulk actions, and
              more!
            </p>
          </CardHeader>
          <CardContent>
            <DataTable
              schema={userSchema}
              data={EXAMPLE_USERS}
              columns={columns}
              bulkActions={bulkActions}
              enableRowOrdering={true}
              onRowOrderChange={handleRowOrderChange}
              onColumnOrderChange={handleColumnOrderChange}
            />
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zero Config</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Just define your Zod schema and columns. Everything else works
                out of the box with sensible defaults.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">High Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Virtual scrolling handles 10,000+ rows smoothly. Only renders
                visible items for optimal performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Type-Safe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full TypeScript support with Zod schema validation. Catch errors
                at compile-time, not runtime.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built using Next.js, TanStack Table, Zod, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      }
    >
      <DemoPageContent />
    </Suspense>
  );
}
