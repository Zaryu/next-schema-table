# Example Implementation

This directory contains a complete, production-ready example of the Next Schema Table in action.

## Files

- **[columns.tsx](./columns.tsx)** - Advanced column definitions with all features
- **[page.tsx](./page.tsx)** - Complete page implementation with stats cards

## What's Demonstrated

### Column Features

1. **Selection Column** - Checkbox for bulk actions
2. **Text Filtering** - Name and email fields with text input filters
3. **Select Filtering** - Provider field with dropdown filter
4. **Boolean Filtering** - Admin status with true/false/all filter
5. **Date Filtering** - Created date with calendar picker
6. **Sortable Headers** - All data columns are sortable
7. **Custom Cell Rendering** - Badges, icons, and formatted dates
8. **Row Actions** - Edit and delete buttons per row

### Table Features

- ✅ Virtual scrolling (handles large datasets)
- ✅ Pagination with customizable page sizes
- ✅ Column visibility toggle
- ✅ Bulk actions (Make Admin, Remove Admin, Delete)
- ✅ URL state synchronization
- ✅ Responsive mobile design
- ✅ Type-safe with Zod schema

## How to Use This Example

### 1. Copy to Your Project

Copy both files to your Next.js app:

```bash
cp src/example/columns.tsx app/users/columns.tsx
cp src/example/page.tsx app/users/page.tsx
```

### 2. Replace Dummy Data

In `page.tsx`, replace the `EXAMPLE_USERS` constant with your own data source:

```tsx
// Replace this:
const users = EXAMPLE_USERS;

// With your API call:
const { data: users = [], isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});
```

### 3. Customize the Schema

In `columns.tsx`, modify the Zod schema to match your data:

```tsx
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  // Add your own fields here
});
```

### 4. Customize Columns

Add, remove, or modify columns to fit your needs:

```tsx
export function getUserColumns(): ColumnDef<User>[] {
  return [
    // Your custom columns here
  ];
}
```

### 5. Implement Real Actions

Replace the console.log handlers with real API calls:

```tsx
const handleEdit = async (user: User) => {
  // Navigate to edit page
  router.push(`/users/${user.id}/edit`);
};

const handleDelete = async (user: User) => {
  // Show confirmation and call API
  if (confirm(`Delete ${user.name}?`)) {
    await deleteUser(user.id);
    refetch(); // Refresh the table
  }
};
```

## Key Patterns

### Memoization

Always memoize columns and bulk actions to prevent unnecessary re-renders:

```tsx
const columns = React.useMemo(() => getUserColumns(), []);
const bulkActions = React.useMemo(() => getBulkActions(), []);
```

### Type Safety

Export and use the inferred User type:

```tsx
export type User = z.infer<typeof userSchema>;

// Use it in your handlers
const handleEdit = (user: User) => {
  // TypeScript knows all properties of user
};
```

### Filter Components

Each column can have a custom filter:

```tsx
meta: {
  FilterComponent: ({ value, onChange, label }) => (
    <Input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
  filterLabel: "Search by name",
}
```

### Dynamic Filters

Fetch filter options from your API:

```tsx
FilterComponent: ({ value, onChange, label }) => {
  const { data: options } = useQuery(...);

  return (
    <Select value={value} onValueChange={onChange}>
      {options.map(opt => (
        <SelectItem value={opt}>{opt}</SelectItem>
      ))}
    </Select>
  );
}
```

## Customization Ideas

### Add More Columns

```tsx
{
  accessorKey: "last_login",
  header: "Last Login",
  cell: ({ row }) => formatDistanceToNow(new Date(row.original.last_login)),
}
```

### Add Row Expansion

```tsx
{
  id: "expand",
  cell: ({ row }) => (
    <Button onClick={() => row.toggleExpanded()}>
      {row.getIsExpanded() ? "▼" : "▶"}
    </Button>
  ),
}
```

### Add Export Button

```tsx
const handleExport = () => {
  const csv = convertToCSV(table.getFilteredRowModel().rows);
  downloadFile(csv, "users.csv");
};

<DataTable
  TableActions={() => (
    <Button onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  )}
/>
```

## Performance Tips

1. **Memoize everything** - columns, bulk actions, computed values
2. **Use React.useMemo** for expensive calculations
3. **Debounce filter inputs** for better UX with large datasets
4. **Virtual scrolling** handles thousands of rows automatically
5. **Lazy load data** if you have millions of records (server-side pagination)

## Troubleshooting

### Filters not working
- Check that `enableColumnFilter` is not set to `false`
- Verify column has valid `accessorKey` or `id`
- Ensure filter value matches schema type

### Sorting not working
- Make sure `enableSorting: true` is set
- Use `SortableHeader` component in header
- For custom types, provide a `sortingFn`

### TypeScript errors
- Ensure data matches Zod schema exactly
- Import and use the inferred `User` type
- Check that all column accessors exist on the data

## Next Steps

- Read the [Filtering Guide](../../docs/filtering.md)
- Read the [Sorting Guide](../../docs/sorting.md)
- Read the [Bulk Actions Guide](../../docs/bulk-actions.md)
- Check out more [Examples](../../docs/examples.md)
