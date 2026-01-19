# Getting Started

This guide will help you get up and running with Next Schema Table in minutes.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Copy the Components](#copy-the-components)
- [Your First Table](#your-first-table)
- [Next Steps](#next-steps)
- [Common Issues](#common-issues)
- [Need Help](#need-help)

---

## Prerequisites

Before getting started, ensure you have:

- Node.js 18+ installed
- Next.js 13+ project with App Router
- Basic knowledge of React, TypeScript, and Zod

---

## Installation

Install the required dependencies:

### Using npm

```bash
npm install zod @tanstack/react-table @tanstack/react-virtual nuqs
```

### Using pnpm

```bash
pnpm add zod @tanstack/react-table @tanstack/react-virtual nuqs
```

### Using yarn

```bash
yarn add zod @tanstack/react-table @tanstack/react-virtual nuqs
```

---

## Copy the Components

Copy the necessary files to your project:

### 1. Copy the table components

Copy the `src/components/table` directory to your project.

### 2. Copy the hook

Copy the `src/hooks/useDataTable.ts` file to your hooks directory.

### 3. Copy the types

Copy the `src/lib/table` directory to your lib directory.

Your structure should look like:

```
your-project/
├── src/
│   ├── components/
│   │   └── table/
│   ├── hooks/
│   │   └── useDataTable.ts
│   └── lib/
│       └── table/
│           └── types.ts
```

---

## Your First Table

Let's create a simple user table.

### Step 1: Define Your Schema

Create a file `app/users/schema.ts`:

```tsx
import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["admin", "user", "guest"]),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
```

### Step 2: Define Your Columns

Create `app/users/columns.tsx`:

```tsx
"use client";

import { ColumnConfig } from "@/lib/table/columnConfig";
import { User } from "./schema";

const columns = ColumnConfig<schema>[]([
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "createdAt",
      label: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ]);
}
```

### Step 3: Use the Table

Create your page `app/users/page.tsx`:

```tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { userSchema } from "./schema";
import { getColumns } from "./columns";
import { useMemo } from "react";

export default function UsersPage() {
  // Your data (could be from API, database, etc.)
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      createdAt: "2024-02-20T14:15:00Z",
    },
  ];

  const columns = useMemo(() => getColumns(), []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <DataTable schema={userSchema} data={users} columns={columns} />
    </div>
  );
}
```

### Step 4: Run Your App

```bash
npm run dev
```

Visit `http://localhost:3000/users` and you should see your table with:

- Pagination
- Column visibility controls
- Built-in filtering
- Responsive design

---

## Next Steps

Now that you have a basic table, you can:

1. [Add Filtering](./filtering.md) - Custom filter components per column
2. [Add Sorting](./sorting.md) - Enable sortable columns
3. [Add Bulk Actions](./bulk-actions.md) - Batch operations on selected rows
4. [Customize Styling](./styling.md) - Make it match your design

---

## Common Issues

### "Cannot find module" errors

Make sure all component paths are correct. You may need to adjust import paths based on your project structure.

### UI components not found

This library assumes you have shadcn/ui components. Install them:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select checkbox badge card
```

Or create your own implementations of these components.

### Type errors with Zod

Ensure your data matches your schema exactly. Zod will validate at runtime and TypeScript at compile time.

### Query parameters not syncing

Make sure you're using Next.js 13+ with App Router and that your component is marked as `"use client"`.

---

## Need Help

- Check the [API Reference](./api-reference.md)
- Look at the [example implementation](../src/example)
- Open an issue on GitHub
