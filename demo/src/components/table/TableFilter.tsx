import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { z } from "zod";
import { parseFilterValue } from "@/lib/table/types";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { X } from "lucide-react";

interface TableFilterProps {
  table: Table<any>;
  filterColumn: string;
  filterValue: string;
  onFilterColumnChange: (col: string) => void;
  onFilterValueChange: (val: string) => void;
  loading?: boolean;
  schema?: z.ZodObject<any>;
}

export function TableFilter({
  table,
  filterColumn,
  filterValue,
  onFilterColumnChange,
  onFilterValueChange,
  schema,
}: TableFilterProps) {
  const [localValue, setLocalValue] = React.useState(filterValue);

  const debouncedOnChange = useDebouncedCallback(
    (value: string) => {
      onFilterValueChange(value);
    },
    { wait: 300 }
  );

  React.useEffect(() => {
    setLocalValue(filterValue);
  }, [filterValue]);

  const filterableColumns = table
    .getAllLeafColumns()
    .filter(
      (col) =>
        col.id !== "actions" && col.columnDef.enableColumnFilter !== false
    );

  const currentColumn = filterableColumns.find(
    (col) => col.id === filterColumn
  );

  const { parsedValue, schemaType } = React.useMemo(() => {
    if (schema && filterColumn) {
      return parseFilterValue(schema, filterColumn, filterValue);
    }
    return { parsedValue: filterValue, schemaType: "unknown" as const };
  }, [schema, filterColumn, filterValue]);

  const handleInputChange = (value: string) => {
    setLocalValue(value);
    debouncedOnChange(value);
  };

  const handleClearFilters = () => {
    setLocalValue("");
    onFilterValueChange("");
    if (filterableColumns.length > 0) {
      onFilterColumnChange(filterableColumns[0].id);
    }
  };

  const hasActiveFilter = filterValue !== "";

  const FilterComponent = currentColumn?.columnDef.meta?.FilterComponent;
  const filterLabel =
    currentColumn?.columnDef.meta?.label || currentColumn?.id || "";

  return (
    <div className="flex items-center gap-2">
      <Select value={filterColumn} onValueChange={onFilterColumnChange}>
        <SelectTrigger className="w-24 md:w-32">
          <SelectValue placeholder="Spalte" />
        </SelectTrigger>
        <SelectContent>
          {filterableColumns.map((col) => {
            const label = col.columnDef.meta?.label || col.id;
            return (
              <SelectItem key={col.id} value={col.id}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {FilterComponent ? (
        <FilterComponent
          value={filterValue}
          onChange={onFilterValueChange}
          label={filterLabel}
          parsedValue={parsedValue}
          schemaType={schemaType}
        />
      ) : (
        <Input
          className="max-w-xs w-20 md:w-54"
          placeholder={filterLabel}
          value={localValue}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      )}

      {hasActiveFilter && (
        <Button
          variant="secondary"
          size="icon"
          onClick={handleClearFilters}
          className="h-9 w-9"
          title="Filter zurücksetzen"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
