# Bulk Actions

Bulk actions allow users to perform operations on multiple selected rows at once.

---

## Table of Contents

- [Basic Setup](#basic-setup)
- [BulkAction Interface](#bulkaction-interface)
- [Examples](#examples)
- [Confirmation Dialog](#confirmation-dialog)
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
/>
```

---

## BulkAction Interface

```tsx
interface BulkAction<TData> {
  label: string;
  action: (rows: Row<TData>[]) => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmMessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
}
```

### Properties

| Property         | Type                                            | Required | Description                                                |
| ---------------- | ----------------------------------------------- | -------- | ---------------------------------------------------------- |
| `label`          | `string`                                        | Yes      | Button text displayed to user                              |
| `action`         | `(rows: Row<TData>[]) => void \| Promise<void>` | Yes      | Function called when action is triggered                   |
| `variant`        | `"default" \| "destructive"`                    | No       | Button style variant. Use `destructive` for dangerous actions |
| `confirmMessage` | `string`                                        | No       | Confirmation dialog message. Use `{count}` placeholder     |
| `icon`           | `React.ComponentType<{ className?: string }>`   | No       | Icon component from lucide-react or similar                |

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

## Row Selection

The table automatically adds a checkbox column when bulk actions are provided.

### Select Column

The select column is added automatically with:
- Header checkbox to select/deselect all rows on current page
- Row checkboxes for individual selection
- Indeterminate state when some rows are selected

### Accessing Selected Rows

In your action handler, you receive an array of TanStack Table `Row` objects:

```tsx
action: (rows) => {
  rows.forEach((row) => {
    console.log(row.original);  // Your data object
    console.log(row.id);        // Row ID
    console.log(row.index);     // Row index
  });
}
```

### Disabling Row Selection

Row selection is only enabled when `bulkActions` are provided. To disable:

```tsx
<DataTable
  schema={schema}
  data={data}
  columns={columns}
  // Don't provide bulkActions prop
/>
```

---

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

```tsx
import { BulkAction } from "@/lib/table/types";
import { Trash2, Mail, Shield, ShieldOff, Download } from "lucide-react";
import { toast } from "sonner";

export function getUserBulkActions(
  deleteUsers: (ids: number[]) => Promise<void>,
  updateAdmin: (ids: number[], isAdmin: boolean) => Promise<void>,
  sendEmail: (emails: string[]) => Promise<void>
): BulkAction<User>[] {
  return [
    {
      label: "Export to CSV",
      variant: "default",
      icon: Download,
      action: (rows) => {
        const data = rows.map((r) => r.original);
        exportToCSV(data, "users.csv");
        toast.success(`Exported ${rows.length} users`);
      },
    },
    {
      label: "Send Email",
      variant: "default",
      icon: Mail,
      confirmMessage: "Send notification to {count} users?",
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
    {
      label: "Make Admin",
      variant: "default",
      icon: Shield,
      confirmMessage: "Promote {count} users to admin?",
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
      icon: ShieldOff,
      confirmMessage: "Remove admin rights from {count} users?",
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
    {
      label: "Delete Users",
      variant: "destructive",
      icon: Trash2,
      confirmMessage: "Permanently delete {count} users? This cannot be undone.",
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
  ];
}
```
