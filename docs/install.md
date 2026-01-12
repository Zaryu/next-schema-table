# Installation

Complete installation instructions for Next Schema Table.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Install Dependencies](#step-1-install-dependencies)
- [Step 2: Install UI Dependencies](#step-2-install-ui-dependencies)
- [Step 3: Copy Source Files](#step-3-copy-source-files)
- [Step 4: Install Optional Components](#step-4-install-optional-components)
- [Step 5: Configure TypeScript](#step-5-configure-typescript)
- [Step 6: Set Up nuqs Provider](#step-6-set-up-nuqs-provider)
- [Step 7: Verify Installation](#step-7-verify-installation)
- [Troubleshooting](#troubleshooting)
- [Alternative Installation](#alternative-installation)
- [Updating](#updating)
- [Uninstalling](#uninstalling)
- [Next Steps](#next-steps)
- [Support](#support)

---

## Prerequisites

Before installing, ensure you have:

- Node.js 18 or higher
- A Next.js 13+ project with App Router
- Package manager (npm, pnpm, or yarn)

---

## Step 1: Install Dependencies

Install the required peer dependencies:

### Using npm

```bash
npm install zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

### Using pnpm (recommended)

```bash
pnpm add zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

### Using yarn

```bash
yarn add zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

---

## Step 2: Install UI Dependencies

This library uses shadcn/ui components. Install the required components:

### Initialize shadcn/ui (if not already done)

```bash
npx shadcn-ui@latest init
```

### Install required components

Core components (required):

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add dropdown-menu
npx shadcn@latest add switch
npx shadcn@latest add skeleton
```

Optional components (for examples and advanced features):

```bash
npx shadcn@latest add checkbox
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add alert-dialog
npx shadcn@latest add popover
npx shadcn@latest add separator
```

Note: The optional components are only needed if you're using bulk actions, the example implementation, or custom filter components.

Note: `lucide-react` is already included in step 1, no separate installation needed.

---

## Step 3: Copy Source Files

Copy the following directories to your project:

### 1. Table Components

Copy the entire `src/components/table` directory to your project:

```
your-project/
└── src/
    └── components/
        └── table/          ← Copy this entire folder
            ├── DataTable.tsx
            ├── VirtualTable.tsx
            ├── TablePagination.tsx
            ├── TableFilter.tsx
            ├── BulkActions.tsx
            ├── SortableHeader.tsx
            ├── ColumnVisibilityDropdown.tsx
            ├── TableSettings.tsx
            ├── MobileActionsMenu.tsx
            ├── MobileSettingsMenu.tsx
            └── index.ts
```

### 2. Table Hook

Copy `src/hooks/useDataTable.ts` to your hooks directory:

```
your-project/
└── src/
    └── hooks/
        └── useDataTable.ts  ← Copy this file
```

If you don't have a `hooks` directory, create it:

```bash
mkdir -p src/hooks
```

### 3. Type Definitions

Copy the `src/lib/table` directory:

```
your-project/
└── src/
    └── lib/
        └── table/          ← Copy this entire folder
            └── types.ts
```

If you don't have a `lib` directory, create it:

```bash
mkdir -p src/lib/table
```

---

## Step 4: Install Optional Components

### Date Picker (if using date filters)

You'll need a date picker component. You can use shadcn/ui's or create your own:

```bash
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

Then create a DatePicker component at `src/components/ui/date-picker.tsx`:

```tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

Install date-fns:

```bash
npm install date-fns
# or
pnpm add date-fns
# or
yarn add date-fns
```

### Toast Notifications (for bulk action feedback)

Install Sonner for toast notifications:

```bash
npm install sonner
# or
pnpm add sonner
# or
yarn add sonner
```

Add the Toaster to your root layout:

```tsx
// app/layout.tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

---

## Step 5: Configure TypeScript

Ensure your `tsconfig.json` has path aliases configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Step 6: Set Up nuqs Provider

Wrap your app with the nuqs provider in your root layout:

```tsx
// app/layout.tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
```

---

## Step 7: Verify Installation

Create a test page to verify everything works:

```tsx
// app/test-table/page.tsx
"use client";

import { DataTable } from "@/components/table/DataTable";
import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const testSchema = z.object({
  id: z.number(),
  name: z.string(),
});

type TestData = z.infer<typeof testSchema>;

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

export default function TestPage() {
  const data = [
    { id: 1, name: "Test 1" },
    { id: 2, name: "Test 2" },
  ];

  const memoizedColumns = useMemo(() => columns, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Table</h1>
      <DataTable schema={testSchema} data={data} columns={memoizedColumns} />
    </div>
  );
}
```

Visit `http://localhost:3000/test-table` and you should see a working table.

---

## Troubleshooting

### Module Not Found Errors

If you get import errors:

1. Check that all files are in the correct directories
2. Verify path aliases in `tsconfig.json`
3. Restart your dev server
4. Clear `.next` cache: `rm -rf .next`

### Type Errors

If you see TypeScript errors:

1. Ensure you're using TypeScript 5+
2. Install all peer dependencies
3. Check that Zod schema matches your data
4. Verify column definitions use correct types

### UI Component Errors

If shadcn/ui components are missing:

1. Run `npx shadcn-ui@latest init` first
2. Install all required components listed in Step 2
3. Check that `components/ui` directory exists

### Styling Issues

If the table doesn't look right:

1. Ensure Tailwind CSS is properly configured
2. Check that shadcn/ui components are styled
3. Verify `globals.css` includes shadcn/ui styles

### nuqs Errors

If query parameters don't work:

1. Ensure `NuqsAdapter` is in root layout
2. Verify you're using Next.js App Router (not Pages Router)
3. Check that components using nuqs are client components (`"use client"`)

---

## Alternative Installation

Note: This library is not yet published to npm. For now, copy the source files as described above.

Once published, you'll be able to install via:

```bash
npm install next-schema-table
```

---

## Updating

To update to the latest version:

1. Pull the latest changes from the repository
2. Copy any changed files to your project
3. Check CHANGELOG.md for breaking changes
4. Test your application thoroughly

---

## Uninstalling

To remove Next Schema Table:

1. Delete the copied directories:
   - `src/components/table`
   - `src/hooks/useDataTable.ts`
   - `src/lib/table`

2. Remove peer dependencies (if not used elsewhere):

   ```bash
   npm uninstall zod @tanstack/react-table @tanstack/react-virtual nuqs
   ```

3. Remove from your code:
   - Delete any pages using `DataTable`
   - Remove `NuqsAdapter` from layout
   - Remove unused UI components

---

## Next Steps

After installation:

1. Read the [Getting Started Guide](./getting-started.md)
2. Check out the [Examples](./examples.md)
3. Review the [API Reference](./api-reference.md)
4. Explore [Filtering](./filtering.md), [Sorting](./sorting.md), and [Bulk Actions](./bulk-actions.md)

---

## Support

If you run into issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [documentation](./docs/)
3. Open an issue on GitHub
