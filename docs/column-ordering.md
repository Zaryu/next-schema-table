# Column Reordering

Enable drag and drop column reordering to let users customize their table layout.

---

## Table of Contents

- [Overview](#overview)
- [Basic Setup](#basic-setup)
- [Enabling Column Reordering](#enabling-column-reordering)
- [Mixed Configuration](#mixed-configuration)
- [Implementation Details](#implementation-details)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

Column reordering allows users to drag and drop table columns to rearrange their order. This feature is opt-in per column using the `meta.enableColumnOrdering` property.

### Key Features

- Opt-in per column via `meta.enableColumnOrdering`
- Visual grip icon for draggable columns
- Smooth drag and drop animations
- Works with filtering, sorting, and pagination
- Keyboard and touch support
- Automatic state management

---

## Basic Setup

Column reordering is implemented using `@dnd-kit/core` and `@dnd-kit/sortable`. The required dependencies are included in the base installation:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Enabling Column Reordering

To enable column reordering, add `enableColumnOrdering: true` to the column's `meta` property and use the `SortableHeader` component:

```tsx
import { SortableHeader } from "@/components/table/SortableHeader";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Name
      </SortableHeader>
    ),
    enableSorting: true,
    meta: {
      enableColumnOrdering: true, // Enable drag & drop
    },
  },
  {
    accessorKey: "email",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Email
      </SortableHeader>
    ),
    enableSorting: true,
    meta: {
      enableColumnOrdering: true, // Enable drag & drop
    },
  },
];
```

---

## Mixed Configuration

You can mix draggable and fixed columns. Typically, action columns and select columns should remain fixed:

```tsx
const columns: ColumnDef<User>[] = [
  // Select column - fixed
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
    // No enableColumnOrdering - stays fixed
  },

  // Data columns - draggable
  {
    accessorKey: "name",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Name
      </SortableHeader>
    ),
    meta: {
      enableColumnOrdering: true, // Can be reordered
    },
  },
  {
    accessorKey: "email",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Email
      </SortableHeader>
    ),
    meta: {
      enableColumnOrdering: true, // Can be reordered
    },
  },

  // Actions column - fixed
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button onClick={() => editUser(row.original.id)}>Edit</Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    // No enableColumnOrdering - stays fixed
  },
];
```

---

## Implementation Details

### SortableHeader Component

The `SortableHeader` component automatically shows a grip icon when `enableColumnOrdering: true` is set:

```tsx
import { SortableHeader } from "@/components/table/SortableHeader";

{
  accessorKey: "name",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  meta: {
    enableColumnOrdering: true,
  },
}
```

The component handles:

- Displaying the grip icon for draggable columns
- Managing drag state and animations
- Sorting functionality (click to sort)
- Touch and keyboard accessibility

### Visual Feedback

When dragging:

- Grip icon is visible for draggable columns
- Column opacity reduces to 0.5 during drag
- Cursor changes to `grab` (hover) and `grabbing` (active)
- Smooth transitions for reordering

### Column Order State

Column order is managed internally by TanStack Table:

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(() =>
  columns.map((col) => col.accessorKey || col.id).filter(Boolean)
);
```

The order updates automatically when a drag operation completes.

### Column Order Change Callback

You can listen to column order changes using the `onColumnOrderChange` callback:

```tsx
export function UserTable() {
  const handleColumnOrderChange = useCallback((newColumnOrder: string[]) => {
    // Save to local storage
    localStorage.setItem("columnOrder", JSON.stringify(newColumnOrder));

    // Or persist to backend
    saveColumnPreferences({ columnOrder: newColumnOrder });
  }, []);

  return (
    <DataTable
      schema={userSchema}
      data={users}
      columns={columns}
      enableColumnOrdering={true}
      onColumnOrderChange={handleColumnOrderChange}
    />
  );
}
```

The callback receives an array of column IDs in the new order. Columns with `excludeFromColumnOrder: true` are automatically filtered out from this array.

**Important:** Wrap your callback with `useCallback` to ensure stable references and prevent unnecessary re-renders.

### Excluding Columns from Callback

Use `excludeFromColumnOrder` to exclude UI-only columns from the callback:

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox {...} />,
    meta: {
      excludeFromColumnOrder: true,  // Won't appear in callback
    },
  },
  {
    id: "drag",
    header: () => null,
    cell: () => <GripVertical />,
    meta: {
      excludeFromColumnOrder: true,  // Won't appear in callback
    },
  },
  {
    accessorKey: "name",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Name
      </SortableHeader>
    ),
    meta: { enableColumnOrdering: true },
  },
];

const handleColumnOrderChange = useCallback((columnOrder: string[]) => {
  // columnOrder will only contain: ["name", "email", "role", ...]
  // "select" and "drag" are excluded
  console.log(columnOrder);
}, []);
```

### Type Definitions

The `ColumnMeta` interface is extended to support `enableColumnOrdering`:

```tsx
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    FilterComponent?: React.ComponentType<FilterComponentProps<any>>;
    filterLabel?: string;
    enableColumnOrdering?: boolean;
  }
}
```

---

## Best Practices

### Keep Action Columns Fixed

Action columns (edit, delete, etc.) should typically remain in a fixed position:

```tsx
{
  id: "actions",
  header: "Actions",
  // Don't add enableColumnOrdering
  enableSorting: false,
  enableHiding: false,
}
```

### Keep Select Column Fixed

The checkbox select column should remain at the start:

```tsx
{
  id: "select",
  header: ({ table }) => <Checkbox {...} />,
  // Don't add enableColumnOrdering
  enableSorting: false,
  enableHiding: false,
}
```

### Make Data Columns Draggable

Regular data columns should be draggable to allow user customization:

```tsx
{
  accessorKey: "name",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  meta: {
    enableColumnOrdering: true,  // Allow reordering
  },
}
```

### Use SortableHeader

Always use `SortableHeader` for columns that can be sorted or reordered:

```tsx
import { SortableHeader } from "@/components/table/SortableHeader";

header: ({ column, table }) => (
  <SortableHeader column={column} table={table}>
    Column Title
  </SortableHeader>
);
```

---

## Examples

### All Data Columns Draggable

```tsx
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    // Fixed select column
  },
  {
    accessorKey: "name",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Name
      </SortableHeader>
    ),
    meta: { enableColumnOrdering: true },
  },
  {
    accessorKey: "email",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Email
      </SortableHeader>
    ),
    meta: { enableColumnOrdering: true },
  },
  {
    accessorKey: "role",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Role
      </SortableHeader>
    ),
    meta: { enableColumnOrdering: true },
  },
  {
    id: "actions",
    // Fixed actions column
  },
];
```

### Selective Reordering

Only allow certain columns to be reordered:

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    // Fixed - no enableColumnOrdering
  },
  {
    accessorKey: "name",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Name
      </SortableHeader>
    ),
    meta: { enableColumnOrdering: true }, // Draggable
  },
  {
    accessorKey: "email",
    header: ({ column, table }) => (
      <SortableHeader column={column} table={table}>
        Email
      </SortableHeader>
    ),
    meta: { enableColumnOrdering: true }, // Draggable
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    // Fixed - no enableColumnOrdering
  },
];
```

### With Filtering and Sorting

Column reordering works seamlessly with other features:

```tsx
{
  accessorKey: "status",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Status
    </SortableHeader>
  ),
  enableSorting: true,  // Sortable
  meta: {
    enableColumnOrdering: true,  // Reorderable
    FilterComponent: StatusFilter,  // Filterable
    filterLabel: "Filter by status",
  },
}
```

---

## Troubleshooting

### Grip Icon Not Showing

Ensure you have:

1. Added `meta: { enableColumnOrdering: true }` to the column
2. Used `SortableHeader` component for the header

```tsx
{
  accessorKey: "name",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  meta: { enableColumnOrdering: true },  // Required
}
```

### Columns Not Draggable

Check that `@dnd-kit` dependencies are installed:

```bash
npm ls @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Drag Not Working on Mobile

The library includes touch sensor support. Ensure you're not preventing touch events in CSS:

```css
/* Avoid this on table headers */
touch-action: none;
```

### Columns Jump Back After Drag

Ensure each column has a stable `id` or `accessorKey`:

```tsx
{
  accessorKey: "name",  // Unique identifier
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  meta: { enableColumnOrdering: true },
}
```

### Order Not Persisting

Column order is stored in component state. It persists during the session but resets on page refresh. For URL persistence, extend the implementation to sync with query parameters.

---

## Performance

Column reordering is highly performant:

- Works with virtual scrolling (thousands of rows)
- Works with filtering and sorting
- Works with column visibility toggles
- No re-renders of table data
- Only updates column order array

---

## Accessibility

The drag & drop implementation includes:

- Keyboard support for reordering columns
- Touch support for mobile devices
- Screen reader support with ARIA attributes
- Clear visual feedback during drag operations
