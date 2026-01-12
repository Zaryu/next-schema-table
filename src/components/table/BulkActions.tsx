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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [activeActionIndex, setActiveActionIndex] = React.useState<
    number | null
  >(null);

  const bulkActions = table.options.meta?.bulkActions || [];

  const selectedCount = Object.keys(rowSelection).length;
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleAction = async (action: BulkAction<TData>) => {
    if (selectedCount === 0) return;

    setIsExecuting(true);
    try {
      await action.action(selectedRows);
      table.resetRowSelection();
    } finally {
      setIsExecuting(false);
      setActiveActionIndex(null);
    }
  };

  const handleActionClick = (action: BulkAction<TData>, index: number) => {
    if (action.skipConfirm) {
      handleAction(action);
    } else {
      setActiveActionIndex(index);
    }
  };

  if (!bulkActions || bulkActions.length === 0 || selectedCount === 0) {
    return null;
  }

  return (
    <>
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
            const CustomDropdownItem = action.customDropdownItem;

            return (
              <React.Fragment key={action.label}>
                {index > 0 &&
                  bulkActions[index - 1].variant !== action.variant && (
                    <DropdownMenuSeparator />
                  )}
                {CustomDropdownItem ? (
                  <CustomDropdownItem
                    onClick={() => handleActionClick(action, index)}
                    selectedCount={selectedCount}
                    selectedRows={selectedRows}
                  />
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleActionClick(action, index)}
                    className={
                      action.variant === "destructive"
                        ? "text-destructive focus:text-destructive"
                        : ""
                    }
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                )}
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {bulkActions.map((action, index) => {
        const CustomConfirmComponent = action.confirmComponent;
        const isOpen = activeActionIndex === index;

        if (CustomConfirmComponent) {
          return (
            <CustomConfirmComponent
              key={action.label}
              open={isOpen}
              onOpenChange={(open) => {
                if (!open) setActiveActionIndex(null);
              }}
              onConfirm={() => handleAction(action)}
              selectedCount={selectedCount}
              selectedRows={selectedRows}
            />
          );
        }

        if (action.skipConfirm) {
          return null;
        }

        return (
          <AlertDialog
            key={action.label}
            open={isOpen}
            onOpenChange={(open) => {
              if (!open) setActiveActionIndex(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {action.label || "Confirm Action"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {action?.confirmMessage?.replace(
                    "{count}",
                    String(selectedCount)
                  ) ||
                    `Are you sure you want to proceed with this action on ${selectedCount} selected items?`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleAction(action)}>
                  {action.confirmBtnLabel || "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      })}
    </>
  );
}
