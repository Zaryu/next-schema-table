# Dependencies Overview

Complete list of all dependencies required for Next Schema Table.

## Core Dependencies

These are **required** for the table to work:

### NPM Packages

```bash
npm install zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

| Package                   | Version          | Purpose                                     |
| ------------------------- | ---------------- | ------------------------------------------- |
| `zod`                     | ^3.0.0           | Schema validation and type inference        |
| `@tanstack/react-table`   | ^8.0.0           | Headless table logic and state management   |
| `@tanstack/react-virtual` | ^3.0.0           | Virtual scrolling for large datasets        |
| `@tanstack/react-pacer`   | ^0.17.0+         | Pacer utilities for TanStack libraries      |
| `nuqs`                    | ^1.0.0 or ^2.0.0 | Type-safe URL query parameter management    |
| `@dnd-kit/core`           | ^6.0.0           | Drag and drop core functionality            |
| `@dnd-kit/sortable`       | ^8.0.0+          | Sortable items (column reordering)          |
| `@dnd-kit/utilities`      | ^3.0.0           | Utilities for drag and drop (CSS transform) |
| `lucide-react`            | ^0.200.0+        | Icon library for UI elements                |

### shadcn/ui Components (Required)

These shadcn/ui components are **required** for core functionality:

```bash
npx shadcn@latest add button input label select table tabs dropdown-menu switch skeleton
```

| Component       | Purpose                                               |
| --------------- | ----------------------------------------------------- |
| `button`        | Buttons for pagination, bulk actions, settings        |
| `input`         | Text input for filters and pagination                 |
| `label`         | Labels for form elements                              |
| `select`        | Dropdown selects for filters and page size            |
| `table`         | Table structure (Table, TableHeader, TableBody, etc.) |
| `tabs`          | Tabs container for table                              |
| `dropdown-menu` | Column visibility and mobile menus                    |
| `switch`        | Toggle switches for settings                          |
| `skeleton`      | Loading skeleton for table                            |

## Optional Dependencies

These are **optional** and only needed for specific features:

### For Bulk Actions & Example Implementation

```bash
npx shadcn@latest add checkbox badge alert-dialog
```

| Component      | Purpose                               |
| -------------- | ------------------------------------- |
| `checkbox`     | Row selection for bulk actions        |
| `badge`        | Status badges in cells                |
| `alert-dialog` | Confirmation dialogs for bulk actions |

### For Date Filtering

```bash
npx shadcn@latest add popover calendar
npm install date-fns
```

| Component  | Purpose                          |
| ---------- | -------------------------------- |
| `popover`  | Popover for date picker          |
| `calendar` | Calendar component               |
| `date-fns` | Date formatting and manipulation |

### For Advanced Features

```bash
npx shadcn@latest add separator card
```

| Component   | Purpose                            |
| ----------- | ---------------------------------- |
| `separator` | Visual separators in menus         |
| `card`      | Card containers (used in examples) |

## Framework Dependencies

### Next.js

- **Version:** ^13.0.0, ^14.0.0, or ^15.0.0
- **Router:** App Router required
- **Server Components:** Client components used (`"use client"`)

### React

- **Version:** ^18.0.0 or ^19.0.0
- **React DOM:** ^18.0.0 or ^19.0.0

### TypeScript

- **Version:** ^5.0.0 (recommended)
- Full TypeScript support with strict mode

## Peer Dependencies

The library specifies these as peer dependencies in `package.json`:

```json
{
  "peerDependencies": {
    "@dnd-kit/core": "^6.0.0",
    "@dnd-kit/sortable": "^8.0.0 || ^9.0.0 || ^10.0.0",
    "@dnd-kit/utilities": "^3.0.0",
    "@tanstack/react-pacer": "^0.17.0",
    "@tanstack/react-table": "^8.0.0",
    "@tanstack/react-virtual": "^3.0.0",
    "lucide-react": "^0.200.0",
    "next": "^13.0.0 || ^14.0.0 || ^15.0.0",
    "nuqs": "^1.0.0 || ^2.0.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "zod": "^3.0.0"
  }
}
```

## Dev Dependencies

For development and type checking:

```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Styling Dependencies

The library assumes you have:

- **Tailwind CSS** - For utility classes
- **CSS Variables** - For shadcn/ui theming

shadcn/ui automatically sets these up when you run `npx shadcn@latest init`.

## Version Compatibility

### Tested Versions

The library has been tested with:

- Next.js 15.0.0
- React 18.3.0
- TanStack Table 8.20.0
- TanStack Virtual 3.10.0
- TanStack Pacer 0.19.1
- Zod 3.23.0
- nuqs 2.2.0
- @dnd-kit/core 6.3.1
- @dnd-kit/sortable 10.0.0

### Minimum Versions

- Node.js: 18.0.0+
- TypeScript: 5.0.0+
- Next.js: 13.0.0+
- React: 18.0.0+

## Installation Commands Summary

### Quick Install (All Required Dependencies)

```bash
# NPM
npm install zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react

# pnpm (recommended)
pnpm add zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react

# Yarn
yarn add zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react
```

### shadcn/ui Components

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Core components (required)
npx shadcn@latest add button input label select table tabs dropdown-menu switch skeleton

# Optional components
npx shadcn@latest add checkbox badge alert-dialog popover calendar separator card
```

### Optional: Date Support

```bash
npm install date-fns
# or
pnpm add date-fns
# or
yarn add date-fns
```

## Troubleshooting

### Missing Dependencies

If you get import errors, verify all dependencies are installed:

```bash
npm ls zod @tanstack/react-table @tanstack/react-virtual @tanstack/react-pacer nuqs @dnd-kit/core @dnd-kit/sortable lucide-react
```

### Version Conflicts

If you have version conflicts:

1. Check your `package.json` for conflicting versions
2. Update to compatible versions
3. Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### shadcn/ui Issues

If shadcn/ui components are missing:

1. Ensure `npx shadcn@latest init` was run
2. Check that `components/ui` directory exists
3. Verify `components.json` exists in project root
4. Re-run component installation commands

## Bundle Size

Approximate sizes (minified + gzipped):

- **Core Library:** ~25KB
- **Dependencies:**
  - TanStack Table: ~35KB
  - TanStack Virtual: ~5KB
  - TanStack Pacer: ~3KB
  - @dnd-kit packages: ~20KB
  - Zod: ~14KB
  - nuqs: ~5KB
  - lucide-react: ~1KB per icon
- **Total (with deps):** ~108KB

Tree-shaking helps reduce the final bundle size.

## License Compatibility

All dependencies use permissive licenses compatible with MIT:

- **MIT:** Most dependencies
- **Apache 2.0:** Some Radix UI components

No GPL or restrictive licenses.
