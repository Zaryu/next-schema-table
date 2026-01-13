import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Columns3 } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface Props {
  table: Table<any>;
  loading?: boolean;
  label?: {
    title: string;
  };
}

const columnLabels: Record<string, string> = {
  name: "Name",
  email: "E-Mail",
  provider: "Provider",
  is_admin: "Status",
  created_at: "Erstellt am",
  actions: "Aktionen",
};

export function ColumnVisibilityDropdown({ table, label }: Props) {
  const hidableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  const [updateCounter, setUpdateCounter] = React.useState(0);

  const columnVisibility = table.getState().columnVisibility;

  const visibilityKey = JSON.stringify(columnVisibility) + updateCounter;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu key={visibilityKey}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-32 lg:w-50 h-9">
            <Columns3 className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">
              {label?.title || "Customize"}
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {hidableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => {
                column.toggleVisibility(!!value);
                setUpdateCounter((prev) => prev + 1);
              }}
            >
              {column.columnDef.meta?.label || column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
