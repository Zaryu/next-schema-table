# Bulk Actions

Bulk actions allow users to perform operations on multiple selected rows at once.

---

## Table of Contents

- [Basic Setup](#basic-setup)
- [BulkAction Interface](#bulkaction-interface)
- [Examples](#examples)
- [Confirmation Dialog](#confirmation-dialog)
- [Custom Dropdown Items](#custom-dropdown-items)
- [Custom Confirm Dialogs](#custom-confirm-dialogs)
- [Skip Confirmation](#skip-confirmation)
- [Row Selection](#row-selection)
- [Multiple Actions](#multiple-actions)
- [Async Actions](#async-actions)
- [Error Handling](#error-handling)
- [Conditional Actions](#conditional-actions)
- [Best Practices](#best-practices)

---

## Basic Setup

Add bulk actions to your table by providing a `bulkActions` array:

```tsx
import { BulkAction } from "@/lib/table/types";
import { Trash2, Mail, Shield } from "lucide-react";

const bulkActions: BulkAction<User>[] = [
  {
    label: "Delete Users",
    variant: "destructive",
    icon: Trash2,
    confirmMessage: "Are you sure you want to delete {count} users?",
    action: async (rows) => {
      const userIds = rows.map((r) => r.original.id);
      await deleteUsers(userIds);
    },
  },
];

<DataTable
  schema={userSchema}
  data={users}
  columns={columns}
  bulkActions={bulkActions}
/>;
```

---

## BulkAction Interface

```tsx
interface BulkAction<TData> {
  label: string;
  action: (rows: Row<TData>[]) => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmMessage?: string;
  confirmBtnLabel?: string;
  confirmComponent?: React.ComponentType<BulkActionConfirmProps<TData>>;
  customDropdownItem?: React.ComponentType<BulkActionDropdownItemProps<TData>>;
  icon?: React.ReactElement;
  skipConfirm?: boolean;
}

interface BulkActionConfirmProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCount: number;
  selectedRows: Row<TData>[];
}

interface BulkActionDropdownItemProps<TData> {
  onClick: () => void;
  selectedCount: number;
  selectedRows: Row<TData>[];
}
```

### Properties

| Property             | Type                                                      | Required | Description                                                         |
| -------------------- | --------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| `label`              | `string`                                                  | Yes      | Button text displayed to user                                       |
| `action`             | `(rows: Row<TData>[]) => void \| Promise<void>`           | Yes      | Function called when action is triggered                            |
| `variant`            | `"default" \| "destructive"`                              | No       | Button style variant. Use `destructive` for dangerous actions       |
| `confirmMessage`     | `string`                                                  | No       | Simple confirmation dialog message. Use `{count}` placeholder       |
| `confirmBtnLabel`    | `string`                                                  | No       | Label for confirm button in default dialog                          |
| `confirmComponent`   | `React.ComponentType<BulkActionConfirmProps<TData>>`      | No       | Custom confirm dialog component. Overrides default dialog           |
| `customDropdownItem` | `React.ComponentType<BulkActionDropdownItemProps<TData>>` | No       | Custom dropdown item component. Replaces default dropdown menu item |
| `icon`               | `React.ReactElement`                                      | No       | Icon element from lucide-react or similar                           |
| `skipConfirm`        | `boolean`                                                 | No       | If true, skips confirmation dialog and executes action immediately  |

---

## Examples

### Delete Action

```tsx
{
  label: "Delete Selected",
  variant: "destructive",
  icon: Trash2,
  confirmMessage: "Delete {count} users? This cannot be undone.",
  action: async (rows) => {
    const ids = rows.map((r) => r.original.id);
    await fetch("/api/users/bulk-delete", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },
}
```

### Email Action

```tsx
{
  label: "Send Email",
  variant: "default",
  icon: Mail,
  confirmMessage: "Send email to {count} users?",
  action: async (rows) => {
    const emails = rows.map((r) => r.original.email);
    await fetch("/api/send-bulk-email", {
      method: "POST",
      body: JSON.stringify({ emails }),
    });
  },
}
```

### Status Update

```tsx
{
  label: "Mark as Active",
  variant: "default",
  icon: CheckCircle,
  action: async (rows) => {
    const ids = rows.map((r) => r.original.id);
    await fetch("/api/users/bulk-update", {
      method: "PATCH",
      body: JSON.stringify({
        ids,
        isActive: true,
      }),
    });
  },
}
```

### Export Action

```tsx
{
  label: "Export to CSV",
  variant: "default",
  icon: Download,
  action: (rows) => {
    const data = rows.map((r) => r.original);
    const csv = convertToCSV(data);
    downloadFile(csv, "users.csv");
  },
}
```

---

## Confirmation Dialog

Use `confirmMessage` for destructive or important actions. The `{count}` placeholder is replaced with the number of selected rows:

```tsx
{
  label: "Archive Users",
  confirmMessage: "Archive {count} users? They will be moved to the archive.",
  action: async (rows) => {
    const ids = rows.map((r) => r.original.id);
    await archiveUsers(ids);
  },
}
```

The library automatically shows a confirmation dialog before executing the action.

---

## Custom Dropdown Items

You can create custom dropdown menu items with complex layouts using the `customDropdownItem` property:

```tsx
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BulkActionDropdownItemProps } from "@/lib/table/types";

function CustomEmailDropdownItem({
  onClick,
  selectedCount,
  selectedRows,
}: BulkActionDropdownItemProps<User>) {
  const hasAdmins = selectedRows.some((r) => r.original.is_admin);

  return (
    <DropdownMenuItem onClick={onClick} className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      <div className="flex flex-col">
        <span>Send Email to All</span>
        <span className="text-xs text-muted-foreground">
          {selectedCount} recipient{selectedCount === 1 ? "" : "s"}
          {hasAdmins && " (includes admins)"}
        </span>
      </div>
    </DropdownMenuItem>
  );
}

const bulkActions: BulkAction<User>[] = [
  {
    label: "Send Email",
    variant: "default",
    customDropdownItem: CustomEmailDropdownItem,
    confirmMessage: "Send email to {count} selected users?",
    action: async (rows) => {
      const emails = rows.map((r) => r.original.email);
      await sendBulkEmail(emails);
    },
  },
];
```

### Custom Dropdown Item Props

Your custom dropdown component receives:

- `onClick`: Function to trigger the action (will open confirm dialog if configured)
- `selectedCount`: Number of selected rows
- `selectedRows`: Array of selected Row objects with full data access

---

## Custom Confirm Dialogs

For more complex confirmation dialogs, use the `confirmComponent` property:

```tsx
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
import { BulkActionConfirmProps } from "@/lib/table/types";

function CustomDeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  selectedRows,
}: BulkActionConfirmProps<User>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Danger Zone
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                You are about to permanently delete {selectedCount} user
                {selectedCount === 1 ? "" : "s"}:
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {selectedRows.slice(0, 3).map((row) => (
                  <li key={row.original.id} className="text-sm font-medium">
                    {row.original.name} ({row.original.email})
                  </li>
                ))}
                {selectedCount > 3 && (
                  <li className="text-sm">
                    ...and {selectedCount - 3} more user
                    {selectedCount - 3 === 1 ? "" : "s"}
                  </li>
                )}
              </ul>
              <p className="mt-3 text-destructive font-semibold">
                This action cannot be undone!
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground"
          >
            Yes, Delete All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const bulkActions: BulkAction<User>[] = [
  {
    label: "Delete Users",
    variant: "destructive",
    icon: <Trash2 />,
    confirmComponent: CustomDeleteConfirm,
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await deleteUsers(ids);
      toast.success(`Successfully deleted ${rows.length} users!`);
    },
  },
];
```

### Custom Confirm Dialog Props

Your custom confirm component receives:

- `open`: Boolean indicating if dialog is open
- `onOpenChange`: Function to control dialog visibility
- `onConfirm`: Function to call when user confirms (executes the action)
- `selectedCount`: Number of selected rows
- `selectedRows`: Array of selected Row objects with full data access

### When to Use Custom Confirm Dialogs

Use custom confirm dialogs when you need:

- List of affected items with details
- Additional input fields or options
- Complex validation or warnings
- Custom styling or branding
- Multi-step confirmation process

---

## Skip Confirmation

For non-destructive actions like exports or downloads, you can skip the confirmation dialog:

```tsx
{
  label: "Export to CSV",
  variant: "default",
  icon: <Download />,
  skipConfirm: true,  // No confirmation dialog
  action: async (rows) => {
    const data = rows.map((r) => r.original);
    downloadCSV(data, "export.csv");
    toast.success(`Exported ${rows.length} users!`);
  },
}
```

### When to Skip Confirmation

Skip confirmation for:

- Export/download actions
- Non-destructive operations
- Quick actions that can be easily undone
- Operations that provide immediate feedback

**Never skip confirmation for:**

- Deleting data
- Modifying important records
- Actions that cannot be undone
- Operations with significant consequences

---

## Row Selection

### Select Column

In order to get the selected Count, you`ll need to create a select column in cour columnsDef like this example:

```tsx
{
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
  enableColumnFilter: false,
  meta: {
    excludeFromColumnOrder: true,
  },
}
```

This will generate select fields in each row also with a select all functionality at the top.

In the future, i will eventually add a option, that you can activate it with just one prop, or when bulk action are defined

### Accessing Selected Rows

In your action handler, you receive an array of TanStack Table `Row` objects:

```tsx
action: (rows) => {
  rows.forEach((row) => {
    console.log(row.original); // Your data object
    console.log(row.id); // Row ID
    console.log(row.index); // Row index
  });
};
```

## Multiple Actions

You can define multiple bulk actions:

```tsx
const bulkActions: BulkAction<User>[] = [
  {
    label: "Make Admin",
    icon: Shield,
    confirmMessage: "Promote {count} users to admin?",
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await promoteToAdmin(ids);
    },
  },
  {
    label: "Remove Admin",
    icon: ShieldOff,
    confirmMessage: "Demote {count} users from admin?",
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await demoteFromAdmin(ids);
    },
  },
  {
    label: "Delete Users",
    variant: "destructive",
    icon: Trash2,
    confirmMessage: "Delete {count} users permanently?",
    action: async (rows) => {
      const ids = rows.map((r) => r.original.id);
      await deleteUsers(ids);
    },
  },
];
```

All actions appear as buttons in the bulk actions toolbar.

---

## Async Actions

Actions can be async. The UI shows loading state while the action executes:

```tsx
{
  label: "Process Users",
  action: async (rows) => {
    // Loading state shown automatically
    await processUsers(rows.map((r) => r.original.id));

    // Optionally show success message
    toast.success(`Processed ${rows.length} users`);
  },
}
```

---

## Error Handling

Handle errors in your action and show appropriate feedback:

```tsx
{
  label: "Update Users",
  action: async (rows) => {
    try {
      const ids = rows.map((r) => r.original.id);
      await updateUsers(ids);
      toast.success("Users updated successfully");
    } catch (error) {
      toast.error("Failed to update users");
      console.error(error);
    }
  },
}
```

---

## Conditional Actions

Show different actions based on user permissions or context:

```tsx
const bulkActions: BulkAction<User>[] = useMemo(() => {
  const actions: BulkAction<User>[] = [];

  // Always available
  actions.push({
    label: "Export Selected",
    icon: Download,
    action: (rows) => exportUsers(rows),
  });

  // Only for admins
  if (isAdmin) {
    actions.push({
      label: "Delete Users",
      variant: "destructive",
      icon: Trash2,
      confirmMessage: "Delete {count} users?",
      action: (rows) => deleteUsers(rows),
    });
  }

  return actions;
}, [isAdmin]);
```

---

## Best Practices

### Always Confirm Destructive Actions

Use `confirmMessage` for delete, archive, or other dangerous operations:

```tsx
{
  label: "Delete Users",
  variant: "destructive",
  confirmMessage: "Delete {count} users permanently? This cannot be undone.",
  action: async (rows) => { /* ... */ },
}
```

### Provide Clear Labels

Users should understand exactly what will happen:

**Good:**

- "Delete Users"
- "Send Welcome Email"
- "Export to CSV"

**Bad:**

- "Action"
- "Process"
- "Do Thing"

### Use Appropriate Variants

Use `variant: "destructive"` for dangerous actions like delete or remove.

### Add Icons

Visual indicators improve UX and help users identify actions quickly:

```tsx
import { Trash2, Mail, Download, Shield } from "lucide-react";

{
  label: "Delete Users",
  icon: Trash2,  // Clear visual indicator
  variant: "destructive",
  action: async (rows) => { /* ... */ },
}
```

### Handle Errors Gracefully

Always catch errors and provide user-friendly messages:

```tsx
{
  label: "Update Status",
  action: async (rows) => {
    try {
      await updateStatus(rows);
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  },
}
```

### Refresh Data After Actions

Update table data after successful operations:

```tsx
{
  label: "Delete Users",
  action: async (rows) => {
    await deleteUsers(rows);
    await refetch(); // Refresh your data
  },
}
```

### Provide Feedback

Use toast notifications to confirm success or report errors:

```tsx
import { toast } from "sonner";

{
  label: "Process Users",
  action: async (rows) => {
    try {
      await processUsers(rows);
      toast.success(`Processed ${rows.length} users`);
    } catch (error) {
      toast.error("Processing failed");
    }
  },
}
```

---

## Complete Example

Here's a comprehensive example using all bulk action features:

```tsx
import {
  BulkAction,
  BulkActionConfirmProps,
  BulkActionDropdownItemProps,
} from "@/lib/table/types";
import { Trash2, Mail, Shield, ShieldOff, Download } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
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

// Custom Dropdown Item
function CustomEmailItem({
  onClick,
  selectedCount,
}: BulkActionDropdownItemProps<User>) {
  return (
    <DropdownMenuItem onClick={onClick} className="flex items-center gap-2">
      <Mail className="h-4 w-4" />
      <div className="flex flex-col">
        <span>Send Email to All</span>
        <span className="text-xs text-muted-foreground">
          {selectedCount} recipient{selectedCount === 1 ? "" : "s"}
        </span>
      </div>
    </DropdownMenuItem>
  );
}

// Custom Confirm Dialog
function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  selectedRows,
}: BulkActionConfirmProps<User>) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            Danger Zone
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                You are about to permanently delete {selectedCount} user
                {selectedCount === 1 ? "" : "s"}:
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                {selectedRows.slice(0, 3).map((row) => (
                  <li key={row.original.id} className="text-sm font-medium">
                    {row.original.name} ({row.original.email})
                  </li>
                ))}
                {selectedCount > 3 && (
                  <li className="text-sm">
                    ...and {selectedCount - 3} more user
                    {selectedCount - 3 === 1 ? "" : "s"}
                  </li>
                )}
              </ul>
              <p className="mt-3 text-destructive font-semibold">
                This action cannot be undone!
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground"
          >
            Yes, Delete All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function getUserBulkActions(
  deleteUsers: (ids: number[]) => Promise<void>,
  updateAdmin: (ids: number[], isAdmin: boolean) => Promise<void>,
  sendEmail: (emails: string[]) => Promise<void>
): BulkAction<User>[] {
  return [
    // Standard action with default confirm
    {
      label: "Make Admin",
      variant: "default",
      icon: <Shield />,
      confirmMessage: "Promote {count} users to admin?",
      confirmBtnLabel: "Make Admin",
      action: async (rows) => {
        try {
          const ids = rows.map((r) => r.original.id);
          await updateAdmin(ids, true);
          toast.success(`${rows.length} users promoted to admin`);
        } catch (error) {
          toast.error("Failed to promote users");
          console.error(error);
        }
      },
    },
    {
      label: "Remove Admin",
      variant: "default",
      icon: <ShieldOff />,
      confirmMessage: "Remove admin rights from {count} users?",
      confirmBtnLabel: "Remove Admin",
      action: async (rows) => {
        try {
          const ids = rows.map((r) => r.original.id);
          await updateAdmin(ids, false);
          toast.success(`Removed admin from ${rows.length} users`);
        } catch (error) {
          toast.error("Failed to remove admin rights");
          console.error(error);
        }
      },
    },
    // Custom dropdown item + default confirm
    {
      label: "Send Email",
      variant: "default",
      customDropdownItem: CustomEmailItem,
      confirmMessage: "Send email to {count} selected users?",
      confirmBtnLabel: "Send Email",
      action: async (rows) => {
        try {
          const emails = rows.map((r) => r.original.email);
          await sendEmail(emails);
          toast.success(`Email sent to ${rows.length} users`);
        } catch (error) {
          toast.error("Failed to send emails");
          console.error(error);
        }
      },
    },
    // Custom confirm dialog
    {
      label: "Delete Users",
      variant: "destructive",
      icon: <Trash2 />,
      confirmComponent: DeleteConfirmDialog,
      action: async (rows) => {
        try {
          const ids = rows.map((r) => r.original.id);
          await deleteUsers(ids);
          toast.success(`${rows.length} users deleted`);
        } catch (error) {
          toast.error("Failed to delete users");
          console.error(error);
        }
      },
    },
    // Skip confirmation (non-destructive action)
    {
      label: "Export to CSV",
      variant: "default",
      icon: <Download />,
      skipConfirm: true,
      action: (rows) => {
        const data = rows.map((r) => r.original);
        exportToCSV(data, "users.csv");
        toast.success(`Exported ${rows.length} users`);
      },
    },
  ];
}
```
