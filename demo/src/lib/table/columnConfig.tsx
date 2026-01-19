import { ColumnDef } from "@tanstack/react-table";
import { FilterComponentProps } from "./types";
import { SortableHeader } from "../../components/table/SortableHeader";
import { formatColumnLabel } from "../utils";
import { GripVertical } from "lucide-react";

export type ColumnConfig<T> = {
  key?: keyof T;
  id?: string;
  label?: string;
  header?: ColumnDef<T>["header"];
  cell?: ColumnDef<T>["cell"];
  filterComponent?: React.ComponentType<FilterComponentProps<any>>;
  filterFn?: ColumnDef<T>["filterFn"];
  enableSorting?: boolean;
  enableHiding?: boolean;
  enableColumnOrdering?: boolean;
  enableDragging?: boolean;
  excludeFromColumnOrder?: boolean;
  meta?: Record<string, any>;
  [key: string]: any;
};

import { Checkbox } from "../../components/ui/checkbox";

import { z } from "zod";

export function CreateColumnConfig<T>(
  columnsOrSchema: Array<ColumnConfig<T>> | z.ZodObject<any>,
  options?: {
    withBulkActions?: boolean;
    selectColumn?: ColumnDef<T>;
    dragColumn?: ColumnDef<T>;
    enableRowOrdering?: boolean;
    schema?: z.ZodObject<any>;
  }
): ColumnDef<T>[] {
  let cols: Array<ColumnConfig<T>>;
  let schema: z.ZodObject<any> | undefined = undefined;

  if (columnsOrSchema instanceof z.ZodObject) {
    schema = columnsOrSchema;
    cols = Object.keys(schema.shape).map((key) => ({
      key: key as keyof T,
      label: formatColumnLabel(key),
      enableSorting: true,
      enableHiding: true,
      enableColumnOrdering: true,
    }));
  } else {
    cols = columnsOrSchema;
    if (options?.schema) {
      schema = options.schema;
    }
  }
  if (options?.withBulkActions) {
    const hasSelect = cols.some((col) => col.id === "select");
    if (!hasSelect) {
      const selectCol = options.selectColumn ?? {
        id: "select",
        header: ({ table }: any) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }: any) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        meta: {
          excludeFromColumnOrder: true,
        },
      };
      cols = [selectCol, ...cols];
    }
  }
  if (options?.enableRowOrdering) {
    const hasDrag = cols.some((col) => col.id === "drag");
    if (!hasDrag) {
      const dragCol = options.dragColumn ?? {
        id: "drag",
        header: () => null,
        cell: () => (
          <GripVertical
            className="text-muted-foreground size-3"
            data-drag-handle
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        excludeFromColumnOrder: true,
      };
      cols = [dragCol, ...cols];
    }
  }
  return cols.map((col) => {
    const id = col.id ?? (col.key as string | undefined);
    let header = col.header;
    let cell = col.cell;
    let enableColumnOrdering = col.enableColumnOrdering;
    let excludeFromColumnOrder = col.excludeFromColumnOrder;
    let filterComponent = col.filterComponent;
    if (schema && col.key && !filterComponent) {
      const shape = schema.shape;
      const fieldSchema = shape[col.key];
      if (fieldSchema) {
        let baseType: any = fieldSchema;
        while (baseType._def?.innerType) {
          baseType = baseType._def.innerType;
        }
        const typeName = baseType._def?.typeName;
        if (typeName === "ZodString") {
          filterComponent = ({
            value,
            onChange,
            label,
          }: FilterComponentProps<string>) => (
            <input
              className="max-w-xs mr-4 w-20 md:w-54 border rounded px-2 py-1"
              placeholder={label}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        } else if (typeName === "ZodBoolean") {
          filterComponent = ({
            value,
            onChange,
          }: FilterComponentProps<boolean>) => (
            <select
              className="max-w-xs mr-4 w-20 md:w-54 border rounded px-2 py-1"
              value={value || "all"}
              onChange={(e) =>
                onChange(e.target.value === "all" ? "" : e.target.value)
              }
            >
              <option value="all">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          );
        } else if (typeName === "ZodNumber") {
          filterComponent = ({
            value,
            onChange,
            label,
          }: FilterComponentProps<number>) => (
            <input
              type="number"
              className="max-w-xs mr-4 w-20 md:w-54 border rounded px-2 py-1"
              placeholder={label}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        } else if (typeName === "ZodDate") {
          filterComponent = ({
            onChange,
            label,
            parsedValue,
          }: FilterComponentProps<Date>) => (
            <input
              type="date"
              className="max-w-xs mr-4 w-20 md:w-54 border rounded px-2 py-1"
              placeholder={label}
              value={parsedValue ? parsedValue.toISOString().slice(0, 10) : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        }
      }
    }
    if (!header && (col.enableSorting ?? true) && col.key) {
      header = ({ column, table }: any) => (
        <SortableHeader column={column} table={table}>
          {col.label ??
            formatColumnLabel(col.key as string) ??
            formatColumnLabel(id as string)}
        </SortableHeader>
      );
    } else if (!header && col.enableDragging === true && col.key) {
      header = () => null;
      cell = () => <GripVertical className="text-muted-foreground size-3" />;
      enableColumnOrdering = true;
      excludeFromColumnOrder ? undefined : (excludeFromColumnOrder = true);
    } else if (!header) {
      header =
        col.label ??
        formatColumnLabel(col.key as string) ??
        formatColumnLabel(id as string);
    }
    const meta = {
      label: col.label,
      FilterComponent: filterComponent,
      enableColumnOrdering: enableColumnOrdering,
      excludeFromColumnOrder: col.excludeFromColumnOrder,
      ...col.meta,
    };
    const base: any = {
      id,
      header,
      cell,
      filterFn: col.filterFn,
      enableSorting: col.enableSorting ?? true,
      enableHiding: col.enableHiding ?? true,
      meta,
      ...col,
    };
    if (col.key) {
      base.accessorKey = col.key as string;
    }
    return base;
  });
}
