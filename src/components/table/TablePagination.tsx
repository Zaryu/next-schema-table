import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Table, RowSelectionState } from "@tanstack/react-table";

interface TablePaginationProps {
  table: Table<any>;
  page: number;
  pageSize: number;
  limits?: number[];
  pageCount: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number, maxPageSize: number) => void;
  loading?: boolean;
  rowSelection?: RowSelectionState;
  labels?: {
    rowsPerPage?: string;
    selectedRows?: { singular: string; plural: string };
    pageInfo?: { page: string; of: string };
  };
}

export function TablePagination({
  page,
  pageSize,
  limits = [15, 50, 100, 250, 500],
  pageCount,
  handlePageChange,
  handlePageSizeChange,
  rowSelection = {},
  labels,
}: TablePaginationProps) {
  const maxPageSize = Math.max(...limits);

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="flex items-center justify-between px-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {selectedCount > 0 ? (
          <>
            {selectedCount}{" "}
            {selectedCount === 1
              ? labels?.selectedRows?.singular || "Row selected"
              : labels?.selectedRows?.plural || "Rows selected"}{" "}
          </>
        ) : null}
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            {labels?.rowsPerPage || "Rows per page"}
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) =>
              handlePageSizeChange(Number(value), maxPageSize)
            }
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {limits.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {labels?.pageInfo?.page || "Page"} {page}{" "}
          {labels?.pageInfo?.of || "of"} {pageCount}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={page <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => handlePageChange(pageCount)}
            disabled={page >= pageCount}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
