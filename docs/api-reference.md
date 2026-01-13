# API Reference

Complete API documentation for Next Schema Table.

---

## Table of Contents

- [DataTable Component](#datatable-component)
- [BulkAction Interface](#bulkaction-interface)
- [FilterComponentProps](#filtercomponentprops)
- [Column Meta](#column-meta)
- [SortableHeader Component](#sortableheader-component)
- [useDataTable Hook](#usedatatable-hook)
- [Query Parameters](#query-parameters)
- [Type Utilities](#type-utilities)
- [Component Exports](#component-exports)
- [TypeScript](#typescript)
- [Error Handling](#error-handling)

---

## DataTable Component

Main table component that renders the complete table with all features.

### Props

```tsx
interface DataTableProps<Schema extends z.ZodObject<any>> {
  schema: Schema;
  data: z.infer<Schema>[];
  columns: ColumnDef<z.infer<Schema>>[];
  limits?: number[];
  enableFilter?: boolean;
  enableRowOrdering?: boolean;
  bulkActions?: BulkAction<z.infer<Schema>>[];
  TableActions?: (table: Table<z.infer<Schema>>) => React.ReactNode;
  labels?: {
    table?: {
      noData: string;
    };
    columnVisibility?: {
      title: string;
    };
    settings: {
      title?: string;
      autoScroll?: string;
    };
    pagination?: {
      rowsPerPage?: string;
      pageInfo?: { page: string; of: string };
      selectedRows?: { singular: string; plural: string };
    };
  };
}
```

### Parameters

| Parameter           | Type                            | Required | Default                   | Description                                       |
| ------------------- | ------------------------------- | -------- | ------------------------- | ------------------------------------------------- |
| `schema`            | `z.ZodObject<any>`              | Yes      | -                         | Zod schema for data validation and type inference |
| `data`              | `z.infer<Schema>[]`             | Yes      | -                         | Array of data objects matching the schema         |
| `columns`           | `ColumnDef<z.infer<Schema>>[]`  | Yes      | -                         | TanStack Table column definitions                 |
| `limits`            | `number[]`                      | No       | `[15, 50, 100, 250, 500]` | Available page size options                       |
| `enableFilter`      | `boolean`                       | No       | `true`                    | Enable/disable column filtering UI                |
| `enableRowOrdering` | `boolean`                       | No       | `false`                   | Enable drag & drop row reordering                 |
| `bulkActions`       | `BulkAction<z.infer<Schema>>[]` | No       | `undefined`               | Bulk actions for selected rows                    |
| `TableActions`      | `(table) => ReactNode`          | No       | `undefined`               | Custom actions to render in toolbar               |
| `labels`            | `object`                        | No       | `undefined`               | Custom labels for table UI elements               |

### Example

```tsx
<DataTable
  schema={userSchema}
  data={users}
  columns={columns}
  limits={[10, 25, 50]}
  enableFilter={true}
  enableRowOrdering={true}
  bulkActions={bulkActions}
  TableActions={(table) => (
    <Button onClick={() => exportTable(table)}>Export All</Button>
  )}
  labels={{
    table: {
      noData: "No users found",
    },
    pagination: {
      rowsPerPage: "Users per page",
    },
  }}
/>
```

---

## BulkAction Interface

Configuration for bulk actions on selected rows.

### Type Definition

```tsx
interface BulkAction<TData = any> {
  label: string;
  action: (rows: Row<TData>[]) => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmMessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
}
```

### Properties

| Property         | Type                                            | Required | Description                                                                        |
| ---------------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `label`          | `string`                                        | Yes      | Button text displayed to user                                                      |
| `action`         | `(rows: Row<TData>[]) => void \| Promise<void>` | Yes      | Function called when action is triggered. Receives selected rows                   |
| `variant`        | `"default" \| "destructive"`                    | No       | Button style variant. Use `destructive` for dangerous actions                      |
| `confirmMessage` | `string`                                        | No       | Confirmation dialog message. Use `{count}` placeholder for number of selected rows |
| `icon`           | `React.ComponentType<{ className?: string }>`   | No       | Icon component (e.g., from lucide-react)                                           |

### Example

```tsx
import { Trash2, Shield } from "lucide-react";

const bulkActions: BulkAction<User>[] = [
  {
    label: "Delete Users",
    variant: "destructive",
    icon: Trash2,
    confirmMessage: "Delete {count} users permanently?",
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await deleteUsers(ids);
    },
  },
  {
    label: "Promote to Admin",
    variant: "default",
    icon: Shield,
    confirmMessage: "Promote {count} users to admin?",
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await promoteToAdmin(ids);
    },
  },
];
```

---

## FilterComponentProps

Props passed to custom filter components.

### Type Definition

```tsx
interface FilterComponentProps<T = unknown> {
  value: string;
  onChange: (value: string) => void;
  label: string;
  parsedValue: T | null;
  schemaType: "string" | "boolean" | "number" | "date" | "unknown";
}
```

### Properties

| Property      | Type                                                       | Description                                   |
| ------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `value`       | `string`                                                   | Current filter value from URL (always string) |
| `onChange`    | `(value: string) => void`                                  | Function to update the filter value           |
| `label`       | `string`                                                   | Display label from column's `meta.label`      |
| `parsedValue` | `T \| null`                                                | Type-safe parsed value based on Zod schema    |
| `schemaType`  | `"string" \| "boolean" \| "number" \| "date" \| "unknown"` | Detected schema type for the column           |

### Example

```tsx
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Text filter
meta: {
  label: "Search by name",
  FilterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => (
    <Input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}

// Select filter
meta: {
  label: "Filter by role",
  FilterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => (
    <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? "" : val)}>
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
}

// Date filter with parsed value
meta: {
  label: "Filter by date",
  FilterComponent: ({ parsedValue, onChange, label }: FilterComponentProps<Date>) => (
    <DatePicker
      date={parsedValue || undefined}
      onDateChange={(date) => onChange(date ? date.toISOString() : "")}
      placeholder={label}
    />
  ),
}
```

---

## Column Meta

Extended properties for TanStack Table columns.

### Type Definition

```tsx
interface ColumnMeta {
  label?: string;
  FilterComponent?: React.ComponentType<FilterComponentProps<any>>;
  enableColumnOrdering?: boolean;
}
```

### Properties

| Property               | Type                                             | Description                                                               |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------------------- |
| `label`                | `string`                                         | Label shown in filter dropdown, placeholder and columnVisibility dropdown |
| `FilterComponent`      | `React.ComponentType<FilterComponentProps<any>>` | Custom filter UI component                                                |
| `enableColumnOrdering` | `boolean`                                        | Enable drag & drop reordering for this column (default: false)            |

### Example

```tsx
{
  accessorKey: "email",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Email
    </SortableHeader>
  ),
  enableSorting: true,
  enableColumnFilter: true,
  meta: {
    label: "Search",
    FilterComponent: EmailFilter,
    enableColumnOrdering: true,  // Allow drag & drop
  },
}
```

---

## SortableHeader Component

Header component that adds sorting functionality to a column. When `enableColumnOrdering: true` is set in the column meta, it also displays a drag handle for reordering.

### Props

```tsx
interface SortableHeaderProps {
  column: Column<any>;
  table: Table<any>;
  children: React.ReactNode;
}
```

### Parameters

| Parameter  | Type              | Description               |
| ---------- | ----------------- | ------------------------- |
| `column`   | `Column<any>`     | TanStack Table column     |
| `table`    | `Table<any>`      | TanStack Table instance   |
| `children` | `React.ReactNode` | Header content to display |

### Example

```tsx
{
  accessorKey: "name",
  header: ({ column, table }) => (
    <SortableHeader column={column} table={table}>
      Name
    </SortableHeader>
  ),
  enableSorting: true,
  meta: {
    //Label for column visibility dropdown and filter dropdown items
    //If not passed, table will fall to accessorKey and will format it. E.g.: isAdmin -> Is Admin, created_at -> Created At
    label: "Name"
    enableColumnOrdering: true,  // Adds drag handle
  },
}
```

---

## useDataTable Hook

Main hook for managing table state. Used internally by `DataTable` component.

### Signature

```tsx
function useDataTable<T>(
  initialData: T[],
  columns: ColumnDef<T>[],
  schema: z.ZodObject<any>,
  limits?: number[],
  bulkActions?: BulkAction<T>[],
  enableRowOrdering?: boolean
);
```

### Parameters

| Parameter           | Type               | Description            |
| ------------------- | ------------------ | ---------------------- |
| `initialData`       | `T[]`              | Initial data array     |
| `columns`           | `ColumnDef<T>[]`   | Column definitions     |
| `schema`            | `z.ZodObject<any>` | Zod schema             |
| `limits`            | `number[]`         | Page size options      |
| `bulkActions`       | `BulkAction<T>[]`  | Bulk actions           |
| `enableRowOrdering` | `boolean`          | Enable row drag & drop |

### Returns

```tsx
{
  table: Table<T>;
  parentRef: RefObject<HTMLDivElement>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  rowSelection: RowSelectionState;
  setRowSelection: (state: RowSelectionState) => void;
  sorting: SortingState;
  handleSortingChange: OnChangeFn<SortingState>;
  filter: string;
  setFilter: (value: string) => void;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number, maxPageSize: number) => void;
  handleFilterChange: (value: string) => void;
  handleFilterColumnChange: (value: string) => void;
  sensors: SensorDescriptor<any>[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleRowDragEnd: (event: DragEndEvent) => void;
  pageCount: number;
  currentPage: number;
  page: number;
  pageSize: number;
  filterColumn: string;
  validColumnIds: string[];
  autoScroll: boolean;
  handleAutoScrollToggle: (enabled: boolean) => void;
}
```

---

## Query Parameters

The table automatically syncs state to URL query parameters using `nuqs`.

### Parameters

| Parameter      | Type                | Description                       | Example              |
| -------------- | ------------------- | --------------------------------- | -------------------- |
| `page`         | `number`            | Current page number (1-indexed)   | `?page=2`            |
| `pageSize`     | `number`            | Number of rows per page           | `?pageSize=50`       |
| `filter`       | `string`            | Current filter value              | `?filter=john`       |
| `filterColumn` | `string`            | Column being filtered             | `?filterColumn=name` |
| `sortBy`       | `string`            | Column being sorted               | `?sortBy=createdAt`  |
| `sortOrder`    | `"asc" \| "desc"`   | Sort direction                    | `?sortOrder=desc`    |
| `autoScroll`   | `"true" \| "false"` | Auto-scroll to top on page change | `?autoScroll=true`   |

### Complete URL Example

```
/users?page=2&pageSize=50&filter=admin&filterColumn=role&sortBy=createdAt&sortOrder=desc&autoScroll=true
```

### Validation

Query parameters are automatically validated:

- Invalid page numbers are reset to valid range
- Invalid page sizes are replaced with default
- Invalid column IDs are ignored
- Invalid sort orders are removed

---

## Type Utilities

### Schema Inference

```tsx
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;
// Result: { id: number; name: string; email: string; }
```

### Filter Value Parsing

```tsx
function parseFilterValue<T = unknown>(
  schema: z.ZodObject<any>,
  columnKey: string,
  filterValue: string
): {
  parsedValue: T | null;
  schemaType: FilterComponentProps["schemaType"];
};
```

Automatically parses filter values based on schema type:

- `z.string()` → returns string as-is
- `z.number()` → parses to number via `parseFloat()`
- `z.boolean()` → parses "true"/"false" to boolean
- `z.date()` → parses to Date object via `new Date()`

### Filter Value Validation

```tsx
function validateFilterValue(
  schema: z.ZodObject<any>,
  columnKey: string,
  filterValue: string
): boolean;
```

Validates that a filter value matches the expected schema type. Returns `true` if valid, `false` otherwise.

---

## Component Exports

### Main Components

- `DataTable` - Primary table component
- `VirtualTable` - Virtual scrolling table body
- `TablePagination` - Pagination controls
- `TableFilter` - Filter UI component
- `BulkActions` - Bulk action buttons
- `SortableHeader` - Sortable column header (supports drag & drop when `enableColumnOrdering: true`)
- `DraggableTableHead` - Internal draggable column header component
- `DraggableTableRow` - Internal draggable table row component (used when `enableRowOrdering: true`)
- `ColumnVisibilityDropdown` - Show/hide columns menu
- `TableSettings` - Table settings menu
- `MobileActionsMenu` - Mobile actions dropdown
- `MobileSettingsMenu` - Mobile settings dropdown

### Import Example

```tsx
import { DataTable, SortableHeader } from "@/components/table";
```

---

## TypeScript

The library is fully typed with TypeScript 5+. All props, return types, and generic parameters are strongly typed.

### Generic Type Parameters

```tsx
// Schema type is inferred from Zod schema
const schema = z.object({
  id: z.number(),
  name: z.string(),
});

type Data = z.infer<typeof schema>;

// Column definitions use inferred type
const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

// DataTable component enforces type safety
<DataTable
  schema={schema}
  data={data} // Must match schema type
  columns={columns} // Must match schema type
/>;
```

### Module Augmentation

This library extends TanStack Table with custom meta types:

```tsx
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string;
    FilterComponent?: React.ComponentType<FilterComponentProps<any>>;
    enableColumnOrdering?: boolean;
  }

  interface TableMeta<TData> {
    bulkActions?: BulkAction<TData>[];
    enableRowOrdering?: boolean;
  }
}
```

This allows type-safe access to custom properties on columns and tables.

---

## Error Handling

### Schema Validation

Data is validated at runtime against the Zod schema. The library expects valid data but does not throw errors for invalid data. Instead, it logs warnings to the console.

### Filter Validation

Filter values are validated against the schema type. Invalid values are rejected with a console warning and the filter is not applied.

### Query Parameter Validation

Invalid query parameters are automatically corrected:

- Wrong page size → replaced with default
- Invalid page number → reset to valid range
- Invalid column IDs → ignored
- Invalid sort order → removed

The corrected parameters are updated in the URL using `history: "replace"` to avoid polluting browser history.

### Common Issues

**Filters not working:**

- Ensure column has `enableColumnFilter` not set to `false`
- Column must have valid `accessorKey` or `id`
- Filter value must match schema type

**Sorting not working:**

- Column must have `enableSorting: true`
- Must use `SortableHeader` component
- Column must have valid `accessorKey`

**TypeScript errors:**

- Verify data matches Zod schema
- Column definitions must use `z.infer<typeof schema>` as generic type
- Ensure all dependencies are up to date
