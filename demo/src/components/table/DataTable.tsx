"use client";

import { useId } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDataTable } from "@/hooks/useDataTable";
import { TablePagination } from "./TablePagination";
import { ColumnVisibilityDropdown } from "./ColumnVisibilityDropdown";
import { VirtualTable } from "./VirtualTable";
import { TableFilter } from "./TableFilter";
import { BulkActions } from "./BulkActions";
import { TableSettings } from "./TableSettings";
import { MobileActionsMenu } from "./MobileActionsMenu";
import { MobileSettingsMenu } from "./MobileSettingsMenu";
import { z } from "zod";
import { ColumnDef, Table } from "@tanstack/react-table";
import { BulkAction } from "@/lib/table/types";

type DataTableProps<Schema extends z.ZodObject<any>> = {
  data: z.infer<Schema>[];
  columns: ColumnDef<z.infer<Schema>>[];
  schema: Schema;
  limits?: number[];
  enableFilter?: boolean;
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
  enableRowOrdering?: boolean;
  onRowOrderChange?: (newData: z.infer<Schema>[]) => void;
  onColumnOrderChange?: (newColumnOrder: string[]) => void;
};

export function DataTable<Schema extends z.ZodObject<any>>({
  data: initialData,
  columns,
  schema,
  limits,
  enableFilter = true,
  enableRowOrdering = false,
  onRowOrderChange,
  onColumnOrderChange,
  bulkActions,
  TableActions,
  labels,
}: DataTableProps<Schema>) {
  const sortableId = useId();

  const {
    table,
    parentRef,
    rowVirtualizer,
    filter,
    setFilter,
    handlePageChange,
    handlePageSizeChange,
    handleFilterColumnChange,
    sensors,
    pageCount,
    currentPage,
    pageSize,
    filterColumn,
    rowSelection,
    autoScroll,
    handleAutoScrollToggle,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    isDragging,
    data,
    columnOrder,
  } = useDataTable(
    initialData,
    columns,
    schema,
    limits,
    bulkActions,
    enableRowOrdering,
    onRowOrderChange,
    onColumnOrderChange
  );

  return (
    <Tabs
      defaultValue="outline"
      className="w-full h-[90%] flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="hidden lg:flex flex-row gap-2">
          <BulkActions table={table} rowSelection={rowSelection} />
          {enableFilter && (
            <TableFilter
              table={table}
              filterColumn={filterColumn}
              filterValue={filter}
              onFilterColumnChange={handleFilterColumnChange}
              onFilterValueChange={setFilter}
              schema={schema}
            />
          )}
          {TableActions && TableActions(table)}
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <ColumnVisibilityDropdown
            table={table}
            label={labels?.columnVisibility}
          />
          <TableSettings
            autoScroll={autoScroll}
            onAutoScrollChange={handleAutoScrollToggle}
            labels={labels?.settings}
          />
        </div>

        <div className="flex lg:hidden items-center gap-2 w-full justify-between">
          <MobileActionsMenu>
            <BulkActions table={table} rowSelection={rowSelection} />
            {enableFilter && (
              <TableFilter
                table={table}
                filterColumn={filterColumn}
                filterValue={filter}
                onFilterColumnChange={handleFilterColumnChange}
                onFilterValueChange={setFilter}
                schema={schema}
              />
            )}
            {TableActions && TableActions(table)}
          </MobileActionsMenu>
          <MobileSettingsMenu>
            <ColumnVisibilityDropdown
              table={table}
              label={labels?.columnVisibility}
            />
            <TableSettings
              autoScroll={autoScroll}
              onAutoScrollChange={handleAutoScrollToggle}
              labels={labels?.settings}
            />
          </MobileSettingsMenu>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <VirtualTable
          table={table}
          rowVirtualizer={rowVirtualizer}
          parentRef={parentRef}
          sensors={sensors}
          sortableId={sortableId}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleDragCancel={handleDragCancel}
          isDragging={isDragging}
          labels={labels?.table}
        />
        <TablePagination
          table={table}
          page={currentPage}
          pageSize={pageSize}
          limits={limits}
          pageCount={pageCount}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          rowSelection={rowSelection}
          labels={labels?.pagination}
        />
      </TabsContent>
    </Tabs>
  );
}
