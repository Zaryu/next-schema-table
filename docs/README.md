# Documentation

Complete documentation for Next Schema Table.

---

## Getting Started

New to Next Schema Table? Start here:

- [Getting Started](./getting-started.md) - Quick introduction and first steps
- [Installation Guide](./install.md) - Complete installation instructions

---

## Core Concepts

### [API Reference](./api-reference.md)

Complete API documentation including:
- DataTable Component
- BulkAction Interface
- FilterComponentProps
- Column Meta
- Query Parameters
- Type Utilities
- Error Handling

### [Examples](./examples.md)

Real-world examples including:
- Basic User Table
- Advanced Product Catalog
- Task Management Dashboard
- Order Management System
- Analytics Dashboard
- Content Management System

---

## Features

### Data Operations

- [Filtering](./filtering.md) - Custom filter components and type parsing
- [Sorting](./sorting.md) - Three-state sorting with URL sync
- [Bulk Actions](./bulk-actions.md) - Select and perform batch operations

### Layout Customization

- [Column Reordering](./column-ordering.md) - Drag and drop columns (opt-in per column)
- [Row Reordering](./row-ordering.md) - Drag and drop rows (opt-in at table level)

---

## Documentation Structure

### Quick Reference

| Document | Description |
|----------|-------------|
| [getting-started.md](./getting-started.md) | Quick start guide for new users |
| [install.md](./install.md) | Installation and setup instructions |
| [api-reference.md](./api-reference.md) | Complete API documentation |
| [examples.md](./examples.md) | Real-world usage examples |
| [filtering.md](./filtering.md) | Column filtering guide |
| [sorting.md](./sorting.md) | Column sorting guide |
| [bulk-actions.md](./bulk-actions.md) | Bulk action implementation |
| [column-ordering.md](./column-ordering.md) | Column drag and drop guide |
| [row-ordering.md](./row-ordering.md) | Row drag and drop guide |

---

## Common Tasks

### Adding Features

**Enable Filtering:**
```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  enableFilter={true}  // Enabled by default
/>
```

**Enable Row Reordering:**
```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  enableRowOrdering={true}
/>
```

**Enable Column Reordering:**
```tsx
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

**Add Bulk Actions:**
```tsx
const bulkActions: BulkAction<User>[] = [
  {
    label: "Delete Users",
    variant: "destructive",
    icon: Trash2,
    action: async (rows) => {
      await deleteUsers(rows.map(r => r.original.id));
    },
  },
];

<DataTable
  schema={schema}
  data={data}
  columns={columns}
  bulkActions={bulkActions}
/>
```

---

## Troubleshooting

### Common Issues

**Table not rendering:**
- Check that schema matches data structure
- Verify all required dependencies are installed
- Ensure `NuqsAdapter` is in your layout

**Filtering not working:**
- Column must have `enableColumnFilter` not set to `false`
- Column must have valid `accessorKey` or `id`
- Filter value must match schema type

**Sorting not working:**
- Column must have `enableSorting: true`
- Use `SortableHeader` component
- Column must have valid `accessorKey`

**Pagination not working:**
- Check that data array has more items than page size
- Verify URL parameters are not corrupted
- Ensure `getPaginationRowModel` is being used

For more troubleshooting, see:
- [API Reference - Error Handling](./api-reference.md#error-handling)
- [Installation Guide - Troubleshooting](./install.md#troubleshooting)

---

## Advanced Topics

### Type Safety

Next Schema Table is fully typed with TypeScript 5+. All props, return types, and generic parameters are strongly typed:

```tsx
const schema = z.object({
  id: z.number(),
  name: z.string(),
});

type User = z.infer<typeof schema>;

const columns: ColumnDef<User>[] = [
  // Fully typed columns
];

<DataTable
  schema={schema}
  data={users}  // Must match User type
  columns={columns}  // Must match User type
/>
```

See [API Reference - TypeScript](./api-reference.md#typescript) for more details.

### URL State Management

All table state is automatically synced to URL query parameters:

```
/users?page=2&pageSize=50&filter=admin&filterColumn=role&sortBy=createdAt&sortOrder=desc
```

This enables:
- Bookmarkable table states
- Shareable links
- Browser back/forward navigation
- Deep linking

See [API Reference - Query Parameters](./api-reference.md#query-parameters) for more details.

### Virtual Scrolling

The table uses `@tanstack/react-virtual` for efficient rendering of large datasets:

- Renders only visible rows
- Smooth scrolling with thousands of rows
- Auto-measured row heights
- Configurable overscan

Works seamlessly with all features including drag and drop.

---

## Contributing

Found an issue or want to contribute? Check the main [README](../README.md) for contribution guidelines.

---

## Support

For questions and issues:
- Check the relevant documentation section above
- Review [Examples](./examples.md) for common patterns
- See [Troubleshooting](#troubleshooting) for common issues
- Open an issue on GitHub

---

## External Resources

### Dependencies

- [TanStack Table](https://tanstack.com/table) - Headless table library
- [TanStack Virtual](https://tanstack.com/virtual) - Virtual scrolling
- [Zod](https://zod.dev) - Schema validation
- [nuqs](https://nuqs.47ng.com/) - Type-safe query string state
- [dnd-kit](https://dndkit.com/) - Drag and drop toolkit

### Related Tools

- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Next.js](https://nextjs.org/) - React framework
