# Next Schema Table

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://next-schema-table.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

A fully declarative, type-safe React table component built with **TanStack Table**, **Zod**, and **Next.js**. Create powerful, feature-rich data tables with minimal code.

## [Live Demo](https://next-schema-table.vercel.app)

See it in action with all features enabled!

## Features

### Core Features

- **100% Declarative API** - Define your table with just a Zod schema and column definitions

  ```tsx
  <DataTable schema={userSchema} data={users} columns={columns} />
  ```

  That's it! No complex setup or boilerplate needed.

- **Type-Safe with Zod** - Full TypeScript support with runtime validation

  - Runtime validation ensures data integrity
  - Compile-time type safety catches errors early
  - Filter values automatically parsed based on schema types

- **URL Query Parameter Sync** - Every aspect of table state is synchronized to the URL

  ```
  /users?page=2&pageSize=50&filter=admin&filterColumn=role&sortBy=createdAt&sortOrder=desc
  ```

  - Bookmarkable table states
  - Shareable links with filters/sorts applied
  - Browser back/forward navigation works
  - Deep linking to specific views

- **Virtual Scrolling** - Handle massive datasets with ease via `@tanstack/react-virtual`

  - Render only visible rows (not all 10,000+)
  - Smooth scrolling performance
  - Minimal DOM nodes
  - Auto-measured row heights

- **Advanced Filtering** - Custom filter components per column with automatic type parsing

  - `z.string()` → Text input
  - `z.number()` → Number validation
  - `z.boolean()` → Boolean select
  - `z.date()` → Date picker with proper parsing
  - Custom filter functions for complex logic

- **Three-State Sorting** - Click column headers to cycle through:

  1. **None** → No sorting
  2. **Ascending** → A-Z, 0-9, oldest-newest
  3. **Descending** → Z-A, 9-0, newest-oldest
  4. **Back to None**

- **Bulk Actions** - Select multiple rows and perform batch operations

  - Row selection with checkboxes
  - Select all on current page
  - Confirmation dialogs for destructive actions
  - Async action support with loading states
  - Custom icons and styling

- **Column Visibility** - Show/hide columns dynamically

  - Persists in URL query params
  - Checkbox list of all columns
  - Quick show/hide toggle
  - Some columns can be locked (always visible)

- **Column Reordering** - Drag & drop columns to reorder (opt-in per column via `meta.enableColumnOrdering`)

  - Visual grip icon for draggable columns
  - Smooth drag & drop animations
  - Works with filtering, sorting, and pagination
  - Keyboard and touch support

- **Row Reordering** - Drag & drop rows to change order (opt-in via `enableRowOrdering` prop)

  - Visual grip icon on each row
  - Smooth drag & drop animations
  - Works with virtual scrolling
  - Perfect for task lists, playlists, menus

- **Responsive Design** - Automatically adapts to mobile devices

  - Desktop: Full toolbar with all controls
  - Mobile: Dropdown menus for actions and settings
  - Touch-friendly tap targets
  - Virtual scrolling works on mobile

- **Pagination** - Built-in pagination with customizable page sizes

  - Customizable page sizes (default: 15, 50, 100, 250, 500)
  - Page number input with validation
  - First/previous/next/last navigation
  - Total row count display
  - Selected row count

- **Auto-scroll** - Optional auto-scroll to top when changing pages

  - Enabled by default
  - Toggle in settings menu
  - Smooth scroll animation
  - Persists preference in URL

- **Zero Config** - Works out of the box with sensible defaults
  - Only configure what you need to customize

### Developer Experience

- **TypeScript First** - Fully typed with TypeScript 5+

  - Generic type parameters
  - Inferred types from Zod schemas
  - Type-safe column definitions
  - No `any` types in public APIs

- **Performance Optimized**

  - Virtual scrolling for large datasets
  - Memoized column definitions
  - Efficient filtering/sorting algorithms
  - Minimal re-renders

- **Extensible**

  - Custom filter components
  - Custom sort functions
  - Custom cell renderers
  - Custom bulk actions
  - Custom header components

- **Well Documented**
  - Comprehensive README
  - API reference
  - Multiple examples
  - Inline code comments

### Performance Benchmarks

Tested with:

- **10 rows**: Instant
- **100 rows**: < 50ms render
- **1,000 rows**: < 100ms render
- **10,000 rows**: < 200ms render (virtual scrolling)
- **100,000 rows**: < 500ms render (virtual scrolling)

Filtering and sorting remain fast even with large datasets.

## Quick Start

### Installation

```bash
# Core dependencies
npm install zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react

# shadcn/ui components (required)
npx shadcn@latest init
npx shadcn@latest add button input label select table tabs dropdown-menu switch skeleton

# Or using pnpm
pnpm add zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react

# Or using yarn
yarn add zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

See [INSTALL.md](./docs/install.md) for complete installation instructions.

### Basic Example

```tsx
import { DataTable } from "@/components/table/DataTable";
import { ColumnConfig } from "@/lib/table/columnConfig";
import { z } from "zod";

// 1. Define your schema
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string(),
});

// 2. Define your columns using ColumnConfig
const columns =
  ColumnConfig <
  userSchema >
  []([
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
]);

// 3. Use the table
export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      createdAt: "2024-01-02",
    },
  ];

  return <DataTable schema={userSchema} data={users} columns={columns} />;
}
```

That's it! You now have a fully functional table with filtering, sorting, and pagination.

## Advanced Usage

### Custom Filter Components

Add custom filter UI for each column via the `meta` property:

```tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterComponentProps } from "@/lib/table/types";
import { ColumnConfig } from "@/lib/table/columnConfig";

const columns =
  ColumnConfig <
  userSchema >
  []([
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      FilterComponent: ({
        value,
        onChange,
        label,
      }: FilterComponentProps<string>) => (
        <Input
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
      filterLabel: "Search by name",
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: {
      FilterComponent: ({
        value,
        onChange,
        label,
      }: FilterComponentProps<string>) => (
        <Select
          value={value || "all"}
          onValueChange={(val) => onChange(val === "all" ? "" : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      ),
      filterLabel: "Filter by role",
    },
  },
]);
```

### Bulk Actions

Enable row selection and batch operations:

```tsx
import { BulkAction } from "@/lib/table/types";
import { Trash2, Shield } from "lucide-react";

const bulkActions: BulkAction<User>[] = [
  {
    label: "Delete Users",
    variant: "destructive",
    icon: Trash2,
    confirmMessage: "Are you sure you want to delete {count} users?",
    action: async (rows) => {
      const userIds = rows.map((r) => r.original.id);
      await deleteUsers(userIds);
    },
  },
  {
    label: "Make Admin",
    variant: "default",
    icon: Shield,
    confirmMessage: "Promote {count} users to admin?",
    action: async (rows) => {
      const userIds = rows.map((r) => r.original.id);
      await promoteToAdmin(userIds);
    },
  },
];

const columns = CreateColumnConfig(userSchema, [
  // ...column definitions
]);

<DataTable
  schema={userSchema}
  data={users}
  columns={columns}
  bulkActions={bulkActions}
/>;
```

### Sortable Headers

Use the `SortableHeader` component for sortable columns:

```tsx
import { SortableHeader } from "@/components/table/SortableHeader";
import { ColumnConfig } from "@/lib/table/columnConfig";

const columns =
  ColumnConfig <
  schema >
  []([
  {
    key: "name",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Name
      </SortableHeader>
    ),
    enableSorting: true,
  },
  // ...other columns
]);
```

### Custom Row Actions

Add action buttons to each row:

```tsx
import { ColumnConfig } from "@/lib/table/columnConfig";

const columns =
  ColumnConfig <
  schema >
  []([
  // ... other columns
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button onClick={() => editUser(row.original.id)}>Edit</Button>
        <Button
          variant="destructive"
          onClick={() => deleteUser(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]);
```

### Date Filtering

The library automatically parses date values from the schema:

```tsx
import { DatePicker } from "@/components/ui/date-picker";
import { ColumnConfig } from "@/lib/table/columnConfig";

const userSchema = z.object({
  createdAt: z.string(), // or z.date()
  // ... other fields
});

const columns =
  ColumnConfig <
  userSchema >
  []([
  {
    key: "createdAt",
    header: "Created At",
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
    filterComponent: ({
      parsedValue,
      onChange,
      label,
    }: FilterComponentProps<Date>) => (
      <DatePicker
        date={parsedValue || undefined}
        onDateChange={(date) => onChange(date ? date.toISOString() : "")}
        placeholder={label}
      />
    ),
  },
]);
```

### Custom Pagination Limits

```tsx
<DataTable
  schema={userSchema}
  data={users}
  columns={columns}
  limits={[10, 25, 50, 100]}
/>
```

### Disable Filtering

```tsx
<DataTable
  schema={userSchema}
  data={users}
  columns={columns}
  enableFilter={false}
/>
```

## API Reference

### DataTable Props

| Prop           | Type                            | Required | Default                   | Description                                       |
| -------------- | ------------------------------- | -------- | ------------------------- | ------------------------------------------------- |
| `schema`       | `z.ZodObject<any>`              | Yes      | -                         | Zod schema for data validation and type inference |
| `data`         | `z.infer<Schema>[]`             | Yes      | -                         | Array of data to display                          |
| `columns`      | `<typeof ColumnConfig>`         | Yes      | -                         | Column definitions generated by ColumnConfig      |
| `bulkActions`  | `BulkAction<z.infer<Schema>>[]` | No       | `undefined`               | Bulk actions for selected rows                    |
| `limits`       | `number[]`                      | No       | `[15, 50, 100, 250, 500]` | Available page size options                       |
| `enableFilter` | `boolean`                       | No       | `true`                    | Enable/disable column filtering                   |
| `TableActions` | `(table) => ReactNode`          | No       | `undefined`               | Custom actions component                          |

### BulkAction Interface

```tsx
interface BulkAction<TData> {
  label: string;
  action: (rows: Row<TData>[]) => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmMessage?: string; // Use {count} placeholder for number of selected rows
  icon?: React.ComponentType<{ className?: string }>;
}
```

### FilterComponentProps

```tsx
interface FilterComponentProps<T = unknown> {
  value: string; // Current filter value (from URL)
  onChange: (value: string) => void; // Update filter value
  label: string; // Filter label from column meta
  parsedValue: T | null; // Parsed value based on schema type
  schemaType: "string" | "boolean" | "number" | "date" | "unknown";
}
```

## Automatic Select & Drag Columns

When you define `bulkActions` in the DataTable component, you can set `withBulkActions` to true in the CreateColumnConfig function. A select (checkbox) column is automatically inserted as the first column, even if you do not explicitly define it. If you want to override the default select column (e.g., to customize its header, cell, or behavior), simply define a column with `id: "select"` in your column config—your definition will take precedence.

Similarly, when you enable row ordering (by setting `enableRowOrdering`), a drag handle column is automatically inserted as the first column (before select, if present). You can override the default drag column by defining a column with `id: "drag"`.

**Example:**

```tsx
const columnsConfig =
  ColumnConfig <
  schema >
  []([
  {
    id: "drag", // Custom drag column (overrides default)
    // ...custom config
  },
  {
    id: "select", // Custom select column (overrides default)
    // ...custom config
  },
  // ...other columns
]);

  const columns = useMemo(
    () =>
      CreateColumnConfig<schema>(columnsConfig, {
        withBulkActions: !!bulkActions,
        enableRowOrdering: false,
      }),
    [bulkActions]
  );

```

If you do not define these columns, the defaults will be inserted automatically when the relevant features are enabled.

## Query Parameters

The table automatically syncs state to URL query parameters:

- `page` - Current page number
- `pageSize` - Number of rows per page
- `filter` - Current filter value
- `filterColumn` - Column being filtered
- `sortBy` - Column being sorted
- `sortOrder` - Sort direction (`asc` or `desc`)
- `autoScroll` - Auto-scroll to top on page change (`true` or `false`)

Example URL:

```
/users?page=2&pageSize=50&filter=admin&filterColumn=role&sortBy=name&sortOrder=asc
```

## Architecture

### Core Components

- **DataTable** - Main table component that orchestrates all features
- **VirtualTable** - Virtual scrolling implementation
- **TablePagination** - Pagination controls
- **TableFilter** - Column filtering UI
- **BulkActions** - Bulk action buttons
- **SortableHeader** - Sortable column headers
- **ColumnVisibilityDropdown** - Show/hide columns
- **TableSettings** - Additional table settings

### Hooks

- **useDataTable** - Main hook managing table state and URL sync

### Type System

The library uses Zod schemas to:

- Validate data structure
- Infer TypeScript types
- Parse filter values based on field types
- Provide type-safe column definitions

## Requirements

- React 18+
- Next.js 13+ (App Router)
- TypeScript 5+

### Peer Dependencies

```json
{
  "zod": "^3.x",
  "@tanstack/react-table": "^8.x",
  "@tanstack/react-virtual": "^3.x",
  "nuqs": "^1.x"
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Examples

Check out the [example](./demo/) directory for a complete implementation:

- [page.tsx](./demo/page.tsx) - Complete page example with columns definition and custom filtering components

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built with:

- [TanStack Table](https://tanstack.com/table) - Headless table library
- [TanStack Virtual](https://tanstack.com/virtual) - Virtual scrolling
- [TanStack Pacer](https://tanstack.com/pacer) - Debounced URL Syncing
- [Zod](https://zod.dev) - Schema validation
- [nuqs](https://nuqs.47ng.com/) - Type-safe query string state

## Troubleshooting

### Filters not working

Make sure:

1. Your column has `enableColumnFilter` set to `true` (or not set to `false`)
2. Column has a valid `accessorKey` or `id`
3. Filter value matches the schema type

### Sorting not working

Ensure:

1. Column has `enableSorting: true`
2. You're using the `SortableHeader` component
3. Column has a valid `accessorKey`

### TypeScript errors

Verify:

1. Your data matches the Zod schema
2. Column definitions use `z.infer<typeof schema>` as the generic type
3. All dependencies are up to date

## Use Cases

Perfect for:

- Admin dashboards
- User management interfaces
- Product catalogs
- Order management systems
- Analytics dashboards
- Content management systems
- Any data-heavy application

## What's Not Included

This library focuses on client-side table features. It does NOT include:

- Server-side pagination/filtering/sorting
- Data fetching/caching
- Form editing / Inline row editing
- Tree/hierarchical data
- Column resizing
- Row grouping
- Excel/PDF export

Many of these can be added on top of the library if needed.

Made for the Next.js community
