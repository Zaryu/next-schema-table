# Row Reordering

Enable drag and drop row reordering to let users manually arrange data order.

---

## Table of Contents

- [Overview](#overview)
- [Basic Setup](#basic-setup)
- [Enabling Row Reordering](#enabling-row-reordering)
- [Implementation Details](#implementation-details)
- [Use Cases](#use-cases)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Overview

Row reordering allows users to drag and drop table rows to change their order. This feature is opt-in at the table level using the `enableRowOrdering` prop.

### Key Features

- Opt-in via `enableRowOrdering` prop on DataTable
- Visual grip icon on each draggable row
- Smooth drag and drop animations
- Works with virtual scrolling
- Works with pagination (reorders within current page)
- Keyboard and touch support
- Perfect for task lists, playlists, priority queues

---

## Basic Setup

Row reordering is implemented using `@dnd-kit/core` and `@dnd-kit/sortable`. The required dependencies are included in the base installation:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Enabling Row Reordering

To enable row reordering, add the `enableRowOrdering` prop to your `DataTable` component:

```tsx
import { DataTable } from "@/components/table/DataTable";
import { z } from "zod";

const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  priority: z.number(),
  status: z.string(),
});

export function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleRowOrderChange = (newData: Task[]) => {
    setTasks(newData);
    // Optional: Persist to backend
  };

  return (
    <DataTable
      schema={taskSchema}
      data={tasks}
      columns={columns}
      enableRowOrdering={true} // Enable row drag & drop
      onRowOrderChange={handleRowOrderChange} // Optional callback
    />
  );
}
```

---

## Implementation Details

### Visual Grip Icon

When `enableRowOrdering` is enabled, each row displays a grip icon (⋮⋮) at the beginning that users can drag:

```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  enableRowOrdering={true}
/>
```

The grip icon automatically appears as the first element in each row.

### Drag Behavior

When dragging:

- Grip icon is visible at the start of each row
- Row opacity reduces to 0.5 during drag
- Cursor changes to `grab` (hover) and `grabbing` (active)
- Smooth transitions for reordering
- Other rows shift to make space for the dragged row

### Data Updates

When rows are reordered, the `onRowOrderChange` callback is triggered with the new data order:

```tsx
export function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleRowOrderChange = useCallback((newData: Task[]) => {
    // Update state with new order
    setTasks(newData);

    // Optional: Persist to backend
    saveTasks(newData);
  }, []);

  return (
    <DataTable
      schema={taskSchema}
      data={tasks}
      columns={columns}
      enableRowOrdering={true}
      onRowOrderChange={handleRowOrderChange}
    />
  );
}
```

The callback receives the full data array in the new order, allowing you to update state and persist changes.

**Important:** Wrap your callback with `useCallback` to ensure stable references and prevent unnecessary re-renders.

### Pagination Behavior

Row reordering works within the current page:

- Users can only reorder rows visible on the current page
- Dragging a row to another page is not supported
- Order changes apply to the full dataset, not just the current page
- Moving to another page and back preserves the new order

### Virtual Scrolling

Row reordering works seamlessly with virtual scrolling:

- Only visible rows are rendered
- Drag operations remain smooth with thousands of rows
- Virtual row heights are automatically measured

### Type Definitions

The `TableMeta` interface is extended to support `enableRowOrdering`:

```tsx
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    bulkActions?: BulkAction<TData>[];
    enableRowOrdering?: boolean;
  }
}
```

---

## Use Cases

### Task Management

Perfect for task lists where users need to prioritize:

```tsx
const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

<DataTable
  schema={taskSchema}
  data={tasks}
  columns={taskColumns}
  enableRowOrdering={true}
/>;
```

### Playlist Management

Users can reorder songs in a playlist:

```tsx
const songColumns: ColumnDef<Song>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
];

<DataTable
  schema={songSchema}
  data={playlist}
  columns={songColumns}
  enableRowOrdering={true}
/>;
```

### Menu Items

Restaurant menu items can be reordered:

```tsx
const menuColumns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "name",
    header: "Item",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
];

<DataTable
  schema={menuSchema}
  data={menuItems}
  columns={menuColumns}
  enableRowOrdering={true}
/>;
```

---

## Best Practices

### Provide Clear Visual Feedback

The grip icon clearly indicates rows can be dragged. Users instinctively understand the interaction.

### Persist Changes

Always persist row order changes to prevent data loss:

```tsx
const handleOrderChange = async (newOrder: Task[]) => {
  // Save to backend
  await fetch("/api/tasks/reorder", {
    method: "POST",
    body: JSON.stringify({
      ids: newOrder.map((t) => t.id),
    }),
  });
};
```

### Use with Stable IDs

Ensure each row has a unique, stable `id` field:

```tsx
const taskSchema = z.object({
  id: z.number(), // Required for drag & drop
  title: z.string(),
  // ... other fields
});
```

### Consider Pagination

If you have many rows:

- Users can only reorder within the current page
- Consider increasing page size or disabling pagination for reorderable tables
- Or implement cross-page drag (custom implementation)

### Combine with Other Features

Row reordering works well with:

- Filtering (reorder filtered results)
- Sorting (disable sorting when manual order is important)
- Bulk actions (select multiple, then reorder)

---

## Examples

### Basic Task List

```tsx
const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task",
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => <Checkbox checked={row.original.completed} />,
  },
];

export function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <DataTable
      schema={taskSchema}
      data={tasks}
      columns={columns}
      enableRowOrdering={true}
    />
  );
}
```

### With Bulk Actions

```tsx
const bulkActions: BulkAction<Task>[] = [
  {
    label: "Mark Complete",
    icon: CheckCircle,
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await markComplete(ids);
    },
  },
];

<DataTable
  schema={taskSchema}
  data={tasks}
  columns={columns}
  enableRowOrdering={true}
  bulkActions={bulkActions}
/>;
```

### With Filtering

Users can filter and then reorder the filtered results:

````tsx
const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task",
    meta: {
      FilterComponent: ({ value, onChange }) => (
        <Input
          placeholder="Search tasks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
      filterLabel: "Search",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

<DataTable
  schema={taskSchema}
  data={tasks}
  columns={columns}
  enableRowOrdering={true}
  enableFilter={true}
/>
Use the `onRowOrderChange` callback to persist changes:

```tsx
export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleRowOrderChange = async (newData: Task[]) => {
    // Update local state
    setTasks(newData);

    // Persist to backend
    await fetch("/api/tasks/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: newData.map((task, index) => ({
          id: task.id,
          position: index,
        })),
      }),
    });
  };

  return (
    <DataTable
      schema={taskSchema}
      data={tasks}
      columns={columns}
      enableRowOrdering={true}
      onRowOrderChange={handleRowOrderChang
      schema={taskSchema}
      data={tasks}
      columns={columns}
      enableRowOrdering={true}
    />
  );
}
````

---

## Troubleshooting

### Grip Icon Not Showing

Ensure `enableRowOrdering={true}` is set on the DataTable:

```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  enableRowOrdering={true} // Required
/>
```

### Rows Not Draggable

Check that:

1. `@dnd-kit` dependencies are installed
2. Each row has a unique `id` field
3. The `getRowId` function can extract the id

```bash
npm ls @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Order Not Persisting

Row order is stored in the data array passed to the table. To persist:

1. Listen for changes with `useEffect`
2. Save to backend or local storage
3. Load saved order on mount

```tsx
useEffect(() => {
  localStorage.setItem("taskOrder", JSON.stringify(tasks));
}, [tasks]);
```

### Drag Not Working on Mobile

The library includes touch sensor support. Ensure you're not preventing touch events:

```css
/* Avoid this */
* {
  touch-action: none;
}
```

### Rows Jump Back After Drag

Ensure each row has a stable, unique `id`:

```tsx
const schema = z.object({
  id: z.number(), // Must be unique and stable
  // ... other fields
});
```

---

## Performance

Row reordering is highly performant:

- Works with virtual scrolling (thousands of rows)
- Only rerenders affected rows
- Smooth animations even with large datasets
- Works with pagination and filtering

---

## Accessibility

The drag & drop implementation includes:

- Keyboard support for reordering rows
- Touch support for mobile devices
- Screen reader support with ARIA attributes
- Clear visual feedback during drag operations
- Focus management for keyboard users

---

## Disabling Row Reordering

To disable row reordering, simply omit the `enableRowOrdering` prop or set it to `false`:

```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  // No enableRowOrdering prop - feature disabled
/>
```

Or explicitly:

```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  enableRowOrdering={false}
/>
```
