"use client";

import * as React from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import type { FilterComponentProps, BulkAction } from "@/lib/table/types";
import {
  Shield,
  ShieldOff,
  Trash2,
  Mail,
  Calendar,
  GripVertical,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/table/SortableHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/DataTable";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  provider: z.string(),
  is_admin: z.boolean(),
  created_at: z.string(),
});

export type User = z.infer<typeof userSchema>;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Example action handlers - replace with your own API calls
const handleEdit = (user: User) => {
  console.log("Editing user:", user);
  // In a real app: navigate to edit page or open edit modal
};

const handleDelete = (user: User) => {
  console.log("Deleting user:", user);
  // In a real app: show confirmation dialog and call delete API
};

// Example dummy data - replace with your own data source
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
];

export default function UsersPage() {
  // In a real app, you would fetch data from an API:
  // const { data: users = [], isLoading } = useQuery(...);
  const users = EXAMPLE_USERS;

  // Memoize columns to prevent recreation on every render
  const columns = React.useMemo(() => getUserColumns(), []);
  const bulkActions = React.useMemo(() => getBulkActions(), []);

  return (
    <div className="min-h-screen w-full bg-background flex flex-row gap-6 p-6 justify-center items-center">
      <Card className="w-300">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            schema={userSchema}
            data={users}
            columns={columns}
            bulkActions={bulkActions}
            enableRowOrdering={true}
            labels={{
              table: {
                noData: "Keine Benutzer gefunden",
              },
              columnVisibility: { title: "Spalten anpassen" },
              settings: {
                title: "Einstellungen",
                autoScroll: "Automatisch scrollen bei Seitenwechsel",
              },
              pagination: {
                rowsPerPage: "Zeilen pro Seite",
                selectedRows: {
                  singular: "Benutzer ausgewählt",
                  plural: "Benutzer ausgewählt",
                },
                pageInfo: {
                  page: "Seite",
                  of: "von",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function getUserColumns(): ColumnDef<User>[] {
  return [
    {
      id: "drag",
      header: () => null,
      cell: () => <GripVertical className="text-muted-foreground size-3" />,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
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
        filterLabel: "Name",
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
        filterLabel: "Email",
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
          // Dummy providers - in a real app, fetch from API
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
        filterLabel: "Provider",
      },
    },
    {
      accessorKey: "is_admin",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Status
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
                {" "}
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
        filterLabel: "Status",
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
        filterLabel: "Created At",
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
    },
  ];
}

export function getBulkActions(): BulkAction<User>[] {
  return [
    {
      label: "Zum Admin machen",
      variant: "default",
      icon: Shield,
      confirmMessage:
        "Sind Sie sicher, dass Sie {count} Benutzer zu Admins machen möchten?",
      action: async (rows) => {
        console.log(
          "Benutzer zu Admins machen:",
          rows.map((r) => r.original)
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Benutzer erfolgreich zu Admins gemacht");
      },
    },
    {
      label: "Admin-Rechte entziehen",
      variant: "default",
      icon: ShieldOff,
      confirmMessage:
        "Sind Sie sicher, dass Sie {count} Benutzern die Admin-Rechte entziehen möchten?",
      action: async (rows) => {
        console.log(
          "Admin-Rechte entziehen:",
          rows.map((r) => r.original)
        );
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Admin-Rechte erfolgreich entzogen");
      },
    },
    {
      label: "Benutzer löschen",
      variant: "destructive",
      icon: Trash2,
      confirmMessage:
        "Sind Sie sicher, dass Sie {count} Benutzer dauerhaft löschen möchten?",
      action: async (rows) => {
        console.log(
          "Benutzer löschen:",
          rows.map((r) => r.original)
        );
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Benutzer erfolgreich gelöscht");
      },
    },
  ];
}
