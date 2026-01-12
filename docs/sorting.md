# Sorting

Enable sorting to let users order table data by any column.

---

## Table of Contents

- [Basic Sorting](#basic-sorting)
- [Three-State Sorting](#three-state-sorting)
- [Examples](#examples)
- [URL Synchronization](#url-synchronization)
- [Programmatic Sorting](#programmatic-sorting)
- [Disabling Sorting](#disabling-sorting)
- [Multi-Column Sorting](#multi-column-sorting)
- [Sort Indicators](#sort-indicators)
- [Custom Header with Sorting](#custom-header-with-sorting)
- [Sorting with Filtering](#sorting-with-filtering)
- [Default Sort Order](#default-sort-order)
- [Sorting Performance](#sorting-performance)
- [Best Practices](#best-practices)

---

## Basic Sorting

Use the `SortableHeader` component to make columns sortable:

```tsx
import { SortableHeader } from "@/components/table/SortableHeader";

{
  accessorKey: "name",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  enableSorting: true,
}
```

---

## Three-State Sorting

Clicking a sortable header cycles through three states:

1. **None** - No sorting (initial state)
2. **Ascending** - A → Z, 0 → 9, oldest → newest
3. **Descending** - Z → A, 9 → 0, newest → oldest
4. **Back to None** - Returns to unsorted state

Visual indicators:
- No icon: Not sorted
- Arrow up: Ascending
- Arrow down: Descending

---

## Examples

### Text Sorting

```tsx
{
  accessorKey: "name",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  enableSorting: true,
}
```

### Number Sorting

```tsx
{
  accessorKey: "age",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Age
    </SortableHeader>
  ),
  enableSorting: true,
}
```

### Date Sorting

```tsx
{
  accessorKey: "createdAt",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Created At
    </SortableHeader>
  ),
  cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  enableSorting: true,
  sortingFn: "datetime",  // Use datetime sorting
}
```

### Custom Sort Function

For complex sorting logic:

```tsx
{
  accessorKey: "status",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Status
    </SortableHeader>
  ),
  enableSorting: true,
  sortingFn: (rowA, rowB, columnId) => {
    const statusOrder = { active: 0, pending: 1, inactive: 2 };
    const aStatus = rowA.getValue(columnId) as keyof typeof statusOrder;
    const bStatus = rowB.getValue(columnId) as keyof typeof statusOrder;
    return statusOrder[aStatus] - statusOrder[bStatus];
  },
}
```

---

## URL Synchronization

Sort state is synced to URL query parameters:

```
/users?sortBy=name&sortOrder=asc
```

This allows:
- Bookmarking sorted views
- Sharing links with specific sort order
- Browser back/forward navigation

---

## Programmatic Sorting

Access the table instance to sort programmatically:

```tsx
// In a custom action or button
const handleSort = () => {
  const nameColumn = table.getColumn("name");
  nameColumn?.toggleSorting(false); // false = ascending
};
```

---

## Disabling Sorting

### Per Column

```tsx
{
  accessorKey: "id",
  header: "ID",
  enableSorting: false,  // This column cannot be sorted
}
```

### Entire Table

The table doesn't have a global "disable all sorting" prop, but you can simply not use `SortableHeader` and set `enableSorting: false` on all columns.

---

## Multi-Column Sorting

Currently, the table supports single-column sorting only. Multi-column sorting can be added by modifying the `useDataTable` hook to enable `enableMultiSort: true`.

---

## Sort Indicators

The `SortableHeader` component shows visual indicators:

- **Unsorted**: No icon
- **Ascending**: Arrow pointing up
- **Descending**: Arrow pointing down

You can customize these in the `SortableHeader` component.

---

## Custom Header with Sorting

You can combine custom header rendering with sorting:

```tsx
{
  accessorKey: "email",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Email Address
      </div>
    </SortableHeader>
  ),
  enableSorting: true,
}
```

---

## Sorting with Filtering

Sorting works seamlessly with filtering. When you filter data, sorting is applied to the filtered results.

---

## Default Sort Order

To set a default sort order, modify the URL or add it to your initial page state:

```tsx
// In your page component
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("sortBy")) {
    // Set default sort
    params.set("sortBy", "createdAt");
    params.set("sortOrder", "desc");
    router.push(`?${params.toString()}`);
  }
}, []);
```

Or use nuqs defaults:

```tsx
// In useDataTable hook
const [params, setParams] = useQueryStates({
  sortBy: parseAsString.withDefault("createdAt"),
  sortOrder: parseAsString.withDefault("desc"),
  // ...
});
```

---

## Sorting Performance

For large datasets:
- Sorting is performed client-side by TanStack Table
- Virtual scrolling keeps rendering performant
- Consider server-side sorting for datasets with 10,000+ rows

---

## Best Practices

### Enable for Relevant Columns

Not all columns need sorting (e.g., actions, checkboxes).

### Use Appropriate Sort Functions

Dates need `datetime`, custom types need custom functions.

### Provide Visual Feedback

Use `SortableHeader` for clear indicators.

### Consider Default Sort

Set sensible defaults (e.g., newest first for timestamps).

### Test Edge Cases

Empty values, null values, special characters.

### Complete Example

```tsx
import { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "@/components/table/SortableHeader";
import { Badge } from "@/components/ui/badge";

export function getColumns(): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Name
        </SortableHeader>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Email
        </SortableHeader>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Role
        </SortableHeader>
      ),
      cell: ({ row }) => <Badge>{row.original.role}</Badge>,
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        // Custom sort: admin > user > guest
        const order = { admin: 0, user: 1, guest: 2 };
        const a = rowA.getValue(columnId) as keyof typeof order;
        const b = rowB.getValue(columnId) as keyof typeof order;
        return order[a] - order[b];
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column, table }) => (
        <SortableHeader column={column} table={table}>
          Created At
        </SortableHeader>
      ),
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      enableSorting: true,
      sortingFn: "datetime",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button onClick={() => edit(row.original)}>Edit</button>
      ),
      enableSorting: false,  // Actions column not sortable
    },
  ];
}
```
