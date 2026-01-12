import { Column, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface SortableHeaderProps<TData> {
  column: Column<TData>;
  table: Table<TData>;
  children: React.ReactNode;
}

export function SortableHeader<TData>({
  column,
  table,
  children,
}: SortableHeaderProps<TData>) {
  const sortingState = table.getState().sorting;
  const columnSort = sortingState.find((s) => s.id === column.id);
  const isSorted = columnSort ? (columnSort.desc ? "desc" : "asc") : false;

  const handleClick = () => {
    console.log(`Click on ${column.id}, current:`, isSorted);
    if (isSorted === false) {
      column.toggleSorting(false);
    } else if (isSorted === "asc") {
      column.toggleSorting(true);
    } else {
      column.clearSorting();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2"
      onClick={handleClick}
    >
      {children}
      {isSorted === "asc" ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : isSorted === "desc" ? (
        <ChevronDown className="ml-1 h-4 w-4" />
      ) : (
        <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}
