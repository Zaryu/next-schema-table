import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface DraggableTableRowProps {
  row: any;
}

export function DraggableTableRow({ row }: DraggableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={isDragging ? "sortable-dragging" : ""}
    >
      {row.getVisibleCells().map((cell: any, index: number) => (
        <TableCell
          key={cell.id}
          style={{
            width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined
          }}
        >
          {index === 0 ? (
            <div
              className="cursor-grab active:cursor-grabbing"
              {...listeners}
              {...attributes}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
