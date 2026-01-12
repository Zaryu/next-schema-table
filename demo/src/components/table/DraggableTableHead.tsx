import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableHead } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";

interface DraggableTableHeadProps {
  column: any;
  table: any;
}

export function DraggableTableHead({
  column,
  table,
}: DraggableTableHeadProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const headerContext = table
    .getHeaderGroups()[0]
    .headers.find((h: any) => h.column.id === column.id)
    ?.getContext();

  return (
    <TableHead
      ref={setNodeRef}
      style={{
        ...style,
        width: column.getSize() !== 150 ? column.getSize() : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          {flexRender(column.columnDef.header, headerContext)}
        </div>
      </div>
    </TableHead>
  );
}
