import { z, ZodAny } from "zod";
import { Row, Column } from "@tanstack/react-table";

export interface FilterComponentProps<T = unknown> {
  value: string;
  onChange: (value: string) => void;
  label: string;
  parsedValue: T | null;
  schemaType: "string" | "boolean" | "number" | "date" | "unknown";
}

export interface BulkAction<TData = z.ZodObject<any>> {
  label: string;
  action: (rows: Row<TData>[]) => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmMessage?: string;
  confirmBtnLabel?: string;
  confirmComponent?: React.ComponentType<BulkActionConfirmProps<TData>>;
  customDropdownItem?: React.ComponentType<BulkActionDropdownItemProps<TData>>;
  icon?: React.ReactElement;
  skipConfirm?: boolean;
}

export interface BulkActionConfirmProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCount: number;
  selectedRows: Row<TData>[];
}

export interface BulkActionDropdownItemProps<TData> {
  onClick: () => void;
  selectedCount: number;
  selectedRows: Row<TData>[];
}

/**
 * Parses a filter value based on the schema field type
 * @param schema - The Zod schema for the table data
 * @param columnKey - The column accessor key
 * @param filterValue - The filter value as string (from URL)
 * @returns Parsed value or null if invalid
 */
export function parseFilterValue<T = unknown>(
  schema: z.ZodObject<any>,
  columnKey: string,
  filterValue: string
): { parsedValue: T | null; schemaType: FilterComponentProps["schemaType"] } {
  if (!filterValue) {
    return { parsedValue: null, schemaType: "unknown" };
  }

  try {
    // Get the field schema from the object schema
    const shape = schema.shape;
    if (!shape) {
      return { parsedValue: filterValue as T, schemaType: "unknown" };
    }

    const fieldSchema = shape[columnKey];
    if (!fieldSchema) {
      return { parsedValue: filterValue as T, schemaType: "unknown" };
    }

    // Unwrap optional, nullable, default types to get base type
    let baseType: any = fieldSchema;
    while (baseType._def?.innerType) {
      baseType = baseType._def.innerType;
    }

    const typeName = baseType._def?.typeName;

    // Parse based on underlying type
    switch (typeName) {
      case "ZodString":
        return {
          parsedValue: filterValue as T,
          schemaType: "string",
        };
      case "ZodBoolean":
        if (filterValue === "true") {
          return { parsedValue: true as T, schemaType: "boolean" };
        }
        if (filterValue === "false") {
          return { parsedValue: false as T, schemaType: "boolean" };
        }
        return { parsedValue: null, schemaType: "boolean" };
      case "ZodNumber":
        const num = Number(filterValue);
        return {
          parsedValue: (isNaN(num) ? null : num) as T,
          schemaType: "number",
        };
      case "ZodDate":
        const date = new Date(filterValue);
        return {
          parsedValue: (isNaN(date.getTime()) ? null : date) as T,
          schemaType: "date",
        };
      default:
        return {
          parsedValue: filterValue as T,
          schemaType: "unknown",
        };
    }
  } catch (e) {
    console.warn("Filter parse error:", e);
    return { parsedValue: null, schemaType: "unknown" };
  }
}

/**
 * Validates a filter value against a schema field
 * @param schema - The Zod schema for the table data
 * @param columnKey - The column accessor key
 * @param filterValue - The filter value as string (from URL)
 * @returns true if valid, false otherwise
 */
export function validateFilterValue(
  schema: z.ZodObject<any>,
  columnKey: string,
  filterValue: string
): boolean {
  if (!filterValue) return true;

  const { parsedValue, schemaType } = parseFilterValue(
    schema,
    columnKey,
    filterValue
  );

  // If parsing failed (null result for non-empty input), validation fails
  if (parsedValue === null && filterValue !== "") {
    return schemaType === "boolean"; // Allow empty for boolean (means "all")
  }

  return true;
}

/**
 * Handles 3-state sorting: null -> asc -> desc -> null
 * @param column - The table column
 */
export function getNextSortingState<TData>(column: Column<TData>) {
  const currentSort = column.getIsSorted();

  if (!currentSort) {
    // null -> asc
    column.toggleSorting(false);
  } else if (currentSort === "asc") {
    // asc -> desc
    column.toggleSorting(true);
  } else {
    // desc -> null
    column.clearSorting();
  }
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string;
    FilterComponent?: React.ComponentType<FilterComponentProps<any>>;
    enableColumnOrdering?: boolean;
    excludeFromColumnOrder?: boolean;
  }

  interface TableMeta<TData> {
    bulkActions?: BulkAction<TData>[];
    enableRowOrdering?: boolean;
  }
}
