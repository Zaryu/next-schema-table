# Examples

Real-world examples showing different use cases and features.

---

## Table of Contents

- [Basic User Table](#basic-user-table)
- [Table with Filters](#table-with-filters)
- [Table with Sorting](#table-with-sorting)
- [Table with Bulk Actions](#table-with-bulk-actions)
- [Complete Admin Dashboard](#complete-admin-dashboard)
- [Fetching Data from API](#fetching-data-from-api)
- [Tips for All Examples](#tips-for-all-examples)

---

## Basic User Table

Simple table with name, email, and role columns.

```tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

type User = z.infer<typeof userSchema>;

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export default function UsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  ];

  const memoizedColumns = useMemo(() => columns, []);

  return (
    <DataTable schema={userSchema} data={users} columns={memoizedColumns} />
  );
}
```

---

## Table with Filters

Add custom filter components for each column.

```tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import type { FilterComponentProps } from "@/lib/table/types";
import { useMemo } from "react";

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  price: z.number(),
  inStock: z.boolean(),
});

type Product = z.infer<typeof productSchema>;

function getColumns(): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: "Product Name",
      meta: {
        label: "Product Name"
        FilterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => (
          <Input
            placeholder={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ),
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      meta: {
        label: "Category"
        FilterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => (
          <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? "" : val)}>
            <SelectTrigger>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="books">Books</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: "inStock",
      header: "In Stock",
      cell: ({ row }) => row.original.inStock ? "Yes" : "No",
    },
  ];
}

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Laptop", category: "electronics", price: 999.99, inStock: true },
    { id: 2, name: "T-Shirt", category: "clothing", price: 19.99, inStock: false },
    { id: 3, name: "Book", category: "books", price: 14.99, inStock: true },
  ];

  const columns = useMemo(() => getColumns(), []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <DataTable schema={productSchema} data={products} columns={columns} />
    </div>
  );
}
```

---

## Table with Sorting

Enable sorting on all columns.

```tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { SortableHeader } from "@/components/table/SortableHeader";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  department: z.string(),
  salary: z.number(),
  hireDate: z.string(),
});

type Employee = z.infer<typeof employeeSchema>;

function getColumns(): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Name
        </SortableHeader>
      ),
      enableSorting: true,
      meta: {
        label: "Name",
      },
    },
    {
      accessorKey: "department",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Department
        </SortableHeader>
      ),
      enableSorting: true,
      meta: {
        label: "Department",
      },
    },
    {
      accessorKey: "salary",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Salary
        </SortableHeader>
      ),
      cell: ({ row }) => `$${row.original.salary.toLocaleString()}`,
      enableSorting: true,
      meta: {
        label: "Salary",
      },
    },
    {
      accessorKey: "hireDate",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Hire Date
        </SortableHeader>
      ),
      cell: ({ row }) => new Date(row.original.hireDate).toLocaleDateString(),
      enableSorting: true,
      sortingFn: "datetime",
      meta: {
        label: "Hire Date",
      },
    },
  ];
}

export default function EmployeesPage() {
  const employees = [
    {
      id: 1,
      name: "Alice Johnson",
      department: "Engineering",
      salary: 95000,
      hireDate: "2020-03-15",
    },
    {
      id: 2,
      name: "Bob Smith",
      department: "Marketing",
      salary: 75000,
      hireDate: "2021-07-22",
    },
    {
      id: 3,
      name: "Carol Williams",
      department: "Engineering",
      salary: 110000,
      hireDate: "2019-01-10",
    },
  ];

  const columns = useMemo(() => getColumns(), []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Employees</h1>
      <DataTable schema={employeeSchema} data={employees} columns={columns} />
    </div>
  );
}
```

---

## Table with Bulk Actions

Select rows and perform bulk operations.

```tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { BulkAction } from "@/lib/table/types";
import { Trash2, Archive, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo } from "react";
import { toast } from "sonner";

const orderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  customer: z.string(),
  status: z.string(),
  total: z.number(),
});

type Order = z.infer<typeof orderSchema>;

function getColumns(): ColumnDef<Order>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: "Order #",
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
    },
  ];
}

function getBulkActions(): BulkAction<Order>[] {
  return [
    {
      label: "Send Receipt",
      variant: "default",
      icon: Mail,
      confirmMessage: "Send receipt to {count} customers?",
      confirmBtnLabel: "Send Receipt",
      action: async (rows) => {
        const orderIds = rows.map((r) => r.original.id);
        await sendReceipts(orderIds);
        toast.success(`Sent ${rows.length} receipts`);
      },
    },
    {
      label: "Archive Orders",
      variant: "default",
      icon: Archive,
      confirmMessage: "Archive {count} orders?",
      confirmBtnLabel: "Archive",
      action: async (rows) => {
        const orderIds = rows.map((r) => r.original.id);
        await archiveOrders(orderIds);
        toast.success(`Archived ${rows.length} orders`);
      },
    },
    {
      label: "Delete Orders",
      variant: "destructive",
      icon: Trash2,
      confirmMessage: "Permanently delete {count} orders?",
      confirmBtnLabel: "Delete",
      action: async (rows) => {
        const orderIds = rows.map((r) => r.original.id);
        await deleteOrders(orderIds);
        toast.success(`Deleted ${rows.length} orders`);
      },
    },
  ];
}

// Mock API functions
async function sendReceipts(ids: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function archiveOrders(ids: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function deleteOrders(ids: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export default function OrdersPage() {
  const orders = [
    {
      id: 1,
      orderNumber: "ORD-001",
      customer: "John Doe",
      status: "Completed",
      total: 299.99,
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      customer: "Jane Smith",
      status: "Pending",
      total: 149.5,
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      customer: "Bob Johnson",
      status: "Shipped",
      total: 499.99,
    },
  ];

  const columns = useMemo(() => getColumns(), []);
  const bulkActions = useMemo(() => getBulkActions(), []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <DataTable
        schema={orderSchema}
        data={orders}
        columns={columns}
        bulkActions={bulkActions}
      />
    </div>
  );
}
```

---

## Complete Admin Dashboard

Full-featured admin table with all features combined.

See the complete example in [src/example/](../src/example/):

- [columns.tsx](../src/example/columns.tsx) - Advanced column definitions
- [page.tsx](../src/example/page.tsx) - Complete implementation

This example includes:

- Custom Zod schema with validation
- Sortable columns with custom sort functions
- Custom filter components (text, select, date, boolean)
- Row actions (edit, delete, promote/demote)
- Bulk actions with confirmation dialogs
- Dynamic filter options from API
- Custom cell rendering with badges and icons
- Responsive design
- Complete TypeScript types

---

## Fetching Data from API

Integrate with API endpoints and handle loading states.

```tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  publishedAt: z.string(),
  status: z.string(),
});

type Post = z.infer<typeof postSchema>;

function getColumns(): ColumnDef<Post>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "publishedAt",
      header: "Published",
      cell: ({ row }) =>
        new Date(row.original.publishedAt).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];
}

export default function PostsPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts");
      return response.json();
    },
  });

  const columns = useMemo(() => getColumns(), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <DataTable schema={postSchema} data={posts} columns={columns} />
    </div>
  );
}
```

---

## Tips for All Examples

### Always Memoize Columns

Use `useMemo` to prevent recreation on every render:

```tsx
const columns = useMemo(() => getColumns(), []);
```

### Type Safety

Let Zod infer types with `z.infer<typeof schema>`:

```tsx
type User = z.infer<typeof userSchema>;
```

### Loading States

Show loading UI while fetching data to provide user feedback.

### Error Handling

Handle API errors gracefully with try-catch blocks and user-friendly error messages.

### Responsive Design

The table is mobile-friendly by default with responsive controls and layouts.

### URL Sync

All table state is preserved in URL for bookmarking and sharing.
