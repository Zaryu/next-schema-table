"use client";

import * as React from "react";
import { Table, RowSelectionState } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BulkAction } from "@/lib/table/types";
import { Code, Loader2 } from "lucide-react";

interface BulkActionsProps<TData> {
  table: Table<TData>;
  rowSelection: RowSelectionState;
}

export function BulkActions<TData>({
  table,
  rowSelection,
}: BulkActionsProps<TData>) {
  const [isExecuting, setIsExecuting] = React.useState(false);

  const bulkActions = table.options.meta?.bulkActions || [];

  const selectedCount = Object.keys(rowSelection).length;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleAction = async (action: BulkAction<TData>) => {
    if (selectedCount === 0) return;

    if (action.confirmMessage) {
      const confirmed = window.confirm(
        action.confirmMessage.replace("{count}", String(selectedCount))
      );
      if (!confirmed) return;
    }

    setIsExecuting(true);
    try {
      await action.action(selectedRows);
      table.resetRowSelection();
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!bulkActions || bulkActions.length === 0 || selectedCount === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isExecuting}>
          {isExecuting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Code className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {bulkActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <React.Fragment key={action.label}>
              {index > 0 &&
                bulkActions[index - 1].variant !== action.variant && (
                  <DropdownMenuSeparator />
                )}
              <DropdownMenuItem
                onClick={() => handleAction(action)}
                className={
                  action.variant === "destructive"
                    ? "text-destructive focus:text-destructive"
                    : ""
                }
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
