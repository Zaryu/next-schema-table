# Filtering

Learn how to add powerful filtering capabilities to your tables with custom filter components.

---

## Table of Contents

- [Basic Filtering](#basic-filtering)
- [Custom Filter Components](#custom-filter-components)
- [FilterComponentProps API](#filtercomponentprops-api)
- [Filter Examples](#filter-examples)
- [Custom Filter Functions](#custom-filter-functions)
- [Disabling Filtering](#disabling-filtering)
- [Filter Validation](#filter-validation)
- [URL Query Parameters](#url-query-parameters)
- [Best Practices](#best-practices)

---

## Basic Filtering

Filtering is enabled by default. The table provides a column selector and filter input that allows users to search through table data.

---

## Custom Filter Components

You can create custom filter UI for each column using the `meta` property. This allows you to provide specialized input components that match your data type.

### Text Input Filter

```tsx
import { Input } from "@/components/ui/input";
import { ColumnConfig } from "@/lib/table/columnConfig";
import type { FilterComponentProps } from "@/lib/table/types";

const columns =
  ColumnConfig <
  schema >
  []([
    {
      key: "name",
      label: "Name",
      filterComponent: ({
        value,
        onChange,
        label,
      }: FilterComponentProps<string>) => (
        <Input
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-xs"
        />
      ),
    },
  ]);
```

### Select Filter

Perfect for enums or fixed value sets:

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ...existing code...
{
  key: "role",
  label: "Role",
  filterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? "" : val)}
    >
      <SelectTrigger className="max-w-xs">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Roles</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="guest">Guest</SelectItem>
      </SelectContent>
    </Select>
  ),
},
```

### Boolean Filter

For true/false values:

```tsx
// ...existing code...
{
  key: "isActive",
  label: "Status",
  filterFn: (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const cellValue = row.getValue(columnId) as boolean;
    return cellValue === (filterValue === "true");
  },
  filterComponent: ({ value, onChange, label }: FilterComponentProps<boolean>) => (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val === "all" ? "" : val)}
    >
      <SelectTrigger className="max-w-xs">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="true">Active</SelectItem>
        <SelectItem value="false">Inactive</SelectItem>
      </SelectContent>
    </Select>
  ),
},
```

### Date Filter

For date fields:

```tsx
import { DatePicker } from "@/components/ui/date-picker";

// ...existing code...
{
  key: "createdAt",
  label: "Created At",
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
  filterComponent: ({ parsedValue, onChange, label }: FilterComponentProps<Date>) => (
    <DatePicker
      date={parsedValue || undefined}
      onDateChange={(date) => onChange(date ? date.toISOString() : "")}
      placeholder={label}
      className="max-w-xs"
    />
  ),
},
```

### Dynamic Filter with Data

Fetch options from your data:

```tsx
// ...existing code...
{
  key: "provider",
  label: "Provider",
  filterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => {
    const { data: providers = [] } = useProvidersQuery();
    return (
      <Select
        value={value || "all"}
        onValueChange={(val) => onChange(val === "all" ? "" : val)}
      >
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Providers</SelectItem>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.name}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
},
```

---

## FilterComponentProps API

The `FilterComponent` receives these props for building custom filter UI.

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

| Property      | Type                                                       | Description                                    |
| ------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `value`       | `string`                                                   | Current filter value from URL (always string)  |
| `onChange`    | `(value: string) => void`                                  | Function to update the filter value            |
| `label`       | `string`                                                   | Display label from column's `meta.filterLabel` |
| `parsedValue` | `T \| null`                                                | Type-safe parsed value based on Zod schema     |
| `schemaType`  | `"string" \| "boolean" \| "number" \| "date" \| "unknown"` | Detected schema type for the column            |

### value vs parsedValue

- `value`: Always a string (from URL query params)
- `parsedValue`: Type-safe value based on Zod schema
  - String fields → `string`
  - Boolean fields → `boolean`
  - Number fields → `number`
  - Date fields → `Date`

Use `parsedValue` when you need the typed value:

```tsx
// For a date column
meta: {
  FilterComponent: ({ parsedValue, onChange }: FilterComponentProps<Date>) => (
    <DatePicker
      date={parsedValue || undefined}  // parsedValue is Date | null
      onDateChange={(date) => onChange(date ? date.toISOString() : "")}
    />
  ),
}
```

---

## Filter Examples

### Text Search Filter

```tsx
import { Input } from "@/components/ui/input";

meta: {
  FilterComponent: ({ value, onChange, label }: FilterComponentProps<string>) => (
    <Input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}
```

### Select Filter with Options

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

meta: {
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
```

### Date Filter with Picker

```tsx
import { DatePicker } from "@/components/ui/date-picker";

meta: {
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

## Custom Filter Functions

For complex filtering logic, provide a custom `filterFn`:

```tsx
{
  accessorKey: "price",
  header: "Price",
  filterFn: (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const price = row.getValue(columnId) as number;
    const [min, max] = filterValue.split("-").map(Number);
    return price >= min && price <= max;
  },
  meta: {
    label: "Price",
    FilterComponent: ({ value, onChange }: FilterComponentProps) => (
      <Select value={value || "all"} onValueChange={(val) => onChange(val === "all" ? "" : val)}>
        <SelectTrigger className="max-w-xs">
          <SelectValue placeholder="Price range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="0-100">$0 - $100</SelectItem>
          <SelectItem value="100-500">$100 - $500</SelectItem>
          <SelectItem value="500-1000">$500 - $1000</SelectItem>
          <SelectItem value="1000-999999">$1000+</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
}
```

---

## Disabling Filtering

### Per Column

```tsx
{
  accessorKey: "id",
  header: "ID",
  enableColumnFilter: false,  // This column won't appear in filter options
}
```

### Entire Table

```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  enableFilter={false} // Disables all filtering UI
/>
```

---

## Filter Validation

Filters are automatically validated against your Zod schema:

```tsx
const userSchema = z.object({
  age: z.number(), // Only valid numbers accepted
  email: z.string().email(), // Must be valid email format
  // ...
});
```

Invalid filter values are rejected and a warning is logged.

---

## URL Query Parameters

Filters sync to URL query parameters:

```
/users?filter=john&filterColumn=name
```

This enables:

- Bookmarking filtered views
- Sharing specific filters
- Browser back/forward navigation

---

## Best Practices

### Provide Clear Labels

Use descriptive `filterLabel` values that help users understand what they're filtering.

### Match Input Type to Data

Use appropriate input components for each data type:

- Text fields → `Input`
- Enums → `Select`
- Booleans → `Select` or `Switch`
- Dates → `DatePicker`
- Numbers → `Input` with type="number" or range selects

### Include "All" Option

For select filters, always include an "all" option to clear the filter.

### Handle Empty Values

Check for empty filter values in `filterFn` to show all rows when no filter is applied.

### Memoize Dynamic Data

Use React hooks to fetch filter options efficiently and prevent unnecessary re-renders.

### Complete Example

See the [example columns](../demo/page.tsx) for complete implementations of:

- Text search filters
- Select filters with dynamic options
- Boolean filters with badges
- Date filters with calendar picker
- Custom filter functions
