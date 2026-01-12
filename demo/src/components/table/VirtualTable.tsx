import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { DraggableTableHead } from "./DraggableTableHead";
import { DraggableTableRow } from "./DraggableTableRow";

interface VirtualTableProps {
  table: any;
  rowVirtualizer: any;
  parentRef: React.RefObject<HTMLDivElement>;
  sensors: any;
  sortableId: string;
  handleDragStart: (sortableColumnIds: string[], activeId?: string) => void;
  handleDragEnd: (event: DragEndEvent, sortableColumnIds: string[]) => void;
  handleDragCancel: () => void;
  isDragging: boolean;
  loading?: boolean;
  labels?: {
    noData: string;
  };
}

export function VirtualTable({
  table,
  rowVirtualizer,
  parentRef,
  sensors,
  sortableId,
  handleDragStart,
  handleDragEnd,
  handleDragCancel,
  isDragging,
  labels,
}: VirtualTableProps) {
  const rows = table.getRowModel().rows;
  const virtualItems = rowVirtualizer.getVirtualItems();

  const visibleLeafColumns = table.getVisibleLeafColumns();
  const visibleColumnCount = visibleLeafColumns.length;

  const columnVisibility = table.getState().columnVisibility;
  const visibilityKey = JSON.stringify(columnVisibility);

  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border p-8 text-center text-muted-foreground">
        {labels?.noData || "No data available"}
      </div>
    );
  }

  const sortableColumnIds = visibleLeafColumns
    .filter((col: any) => col.columnDef.meta?.enableColumnOrdering === true)
    .map((col: any) => col.id);

  const enableRowOrdering = table.options.meta?.enableRowOrdering === true;
  const sortableRowIds = enableRowOrdering
    ? rows.map((row: any) => row.id)
    : [];

  return (
    <div className="overflow-hidden rounded-lg border">
      <DndContext
        sensors={sensors}
        id={sortableId}
        onDragStart={(event: DragStartEvent) =>
          handleDragStart(sortableColumnIds, String(event.active.id))
        }
        onDragEnd={(event) => handleDragEnd(event, sortableColumnIds)}
        onDragCancel={handleDragCancel}
        autoScroll={false}
      >
        <div
          ref={parentRef}
          style={{ height: "400px" }}
          className={isDragging ? "overflow-hidden" : "overflow-auto"}
        >
          <Table key={visibilityKey}>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <SortableContext
                items={sortableColumnIds}
                strategy={horizontalListSortingStrategy}
              >
                <TableRow>
                  {visibleLeafColumns.map((column: any) => {
                    const isDraggable =
                      column.columnDef.meta?.enableColumnOrdering === true;

                    if (isDraggable) {
                      return (
                        <DraggableTableHead
                          key={column.id}
                          column={column}
                          table={table}
                        />
                      );
                    }

                    return (
                      <TableHead
                        key={column.id}
                        style={{
                          width:
                            column.getSize() !== 150
                              ? column.getSize()
                              : undefined,
                        }}
                      >
                        {flexRender(
                          column.columnDef.header,
                          table
                            .getHeaderGroups()[0]
                            .headers.find((h: any) => h.column.id === column.id)
                            ?.getContext()
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </SortableContext>
            </TableHeader>
            <TableBody>
              {enableRowOrdering ? (
                <SortableContext
                  items={sortableRowIds}
                  strategy={verticalListSortingStrategy}
                >
                  {virtualItems[0]?.start > 0 && (
                    <tr
                      style={{
                        height: virtualItems[0].start,
                      }}
                    >
                      <td colSpan={visibleColumnCount} />
                    </tr>
                  )}
                  {virtualItems.map((virtualRow: any) => {
                    const row = table.getRowModel().rows[virtualRow.index];

                    if (!row) return null;

                    return <DraggableTableRow key={row.id} row={row} />;
                  })}
                </SortableContext>
              ) : (
                <>
                  {virtualItems[0]?.start > 0 && (
                    <tr
                      style={{
                        height: virtualItems[0].start,
                      }}
                    >
                      <td colSpan={visibleColumnCount} />
                    </tr>
                  )}
                  {virtualItems.map((virtualRow: any) => {
                    const row = table.getRowModel().rows[virtualRow.index];

                    if (!row) return null;

                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell: any) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width:
                                cell.column.getSize() !== 150
                                  ? cell.column.getSize()
                                  : undefined,
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </>
              )}
              {(() => {
                const virtualItems = rowVirtualizer.getVirtualItems();
                if (!virtualItems.length) return null;
                const last = virtualItems[virtualItems.length - 1];
                const bottom =
                  rowVirtualizer.getTotalSize() - (last.start + last.size);
                return bottom > 0 ? (
                  <tr style={{ height: bottom }}>
                    <td colSpan={visibleColumnCount} />
                  </tr>
                ) : null;
              })()}
            </TableBody>
          </Table>
        </div>
      </DndContext>
    </div>
  );
}
