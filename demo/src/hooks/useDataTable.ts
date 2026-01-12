import { useEffect, useState, useMemo, useRef } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { validateFilterValue, BulkAction } from "@/lib/table/types";

// ============================================================================
// Helper Functions
// ============================================================================
function getValidColumnIds<T>(columns: ColumnDef<T>[]): string[] {
  return columns
    .filter((col) => {
      if (col.enableColumnFilter === false) return false;
      if (col.id === "actions") return false;
      return true;
    })
    .map((col) => {
      return ("accessorKey" in col ? col.accessorKey : undefined) || col.id;
    })
    .filter((id): id is string => typeof id === "string");
}

function getSortableColumnIds<T>(columns: ColumnDef<T>[]): string[] {
  return columns
    .filter((col) => {
      if (col.enableSorting === false) return false;
      if (col.id === "actions") return false;
      if (col.id === "select") return false;
      return true;
    })
    .map((col) => {
      return ("accessorKey" in col ? col.accessorKey : undefined) || col.id;
    })
    .filter((id): id is string => typeof id === "string");
}

function isValidColumnId(columnId: string, validIds: string[]): boolean {
  return validIds.includes(columnId);
}

// ============================================================================
// Hook
// ============================================================================
export function useDataTable<T>(
  initialData: T[],
  columns: ColumnDef<T>[],
  schema: z.ZodObject<any>,
  limits: number[] = [15, 50, 100, 250, 500],
  bulkActions?: BulkAction<T>[],
  enableRowOrdering?: boolean,
  onRowOrderChange?: (newData: T[]) => void,
  onColumnOrderChange?: (newColumnOrder: string[]) => void
) {
  // ============================================================================
  // Memoized Column IDs and Defaults
  // ============================================================================
  const validColumnIds = useMemo(() => getValidColumnIds(columns), [columns]);
  const sortableColumnIds = useMemo(
    () => getSortableColumnIds(columns),
    [columns]
  );
  const defaultFilterColumn = useMemo(
    () => validColumnIds[0] || "",
    [validColumnIds]
  );
  const defaultPageSize = useMemo(() => limits[0] || 15, [limits]);

  // ============================================================================
  // URL Query State (nuqs)
  // ============================================================================
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(defaultPageSize),
      filter: parseAsString.withDefault(""),
      filterColumn: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault(""),
      sortOrder: parseAsString.withDefault(""),
      autoScroll: parseAsString.withDefault("true"),
    },
    {
      shallow: false,
      history: "push",
    }
  );

  const { page, filter, sortBy, sortOrder, autoScroll } = params;

  // Validate and normalize pageSize
  const pageSize = useMemo(() => {
    const rawPageSize = params.pageSize;
    if (!limits.includes(rawPageSize)) {
      setParams({ pageSize: defaultPageSize }, { history: "replace" });
      return defaultPageSize;
    }
    return rawPageSize;
  }, [params.pageSize, limits, defaultPageSize, setParams]);

  // Validate and normalize filterColumn
  const filterColumn = useMemo(() => {
    const rawFilterColumn = params.filterColumn;
    if (rawFilterColumn && !isValidColumnId(rawFilterColumn, validColumnIds)) {
      setParams({ filterColumn: null, filter: null }, { history: "replace" });
      return defaultFilterColumn;
    }
    return rawFilterColumn || defaultFilterColumn;
  }, [params.filterColumn, validColumnIds, defaultFilterColumn, setParams]);

  // ============================================================================
  // Local State
  // ============================================================================
  const [data, setData] = useState<T[]>(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    columns
      .map((col) => {
        if ("accessorKey" in col && col.accessorKey) {
          return col.accessorKey as string;
        }
        return col.id || "";
      })
      .filter(Boolean)
  );
  const [isDragging, setIsDragging] = useState(false);

  // ============================================================================
  // Refs
  // ============================================================================
  const parentRef = useRef<HTMLDivElement>(null!);
  const isInitialMountRow = useRef(true);
  const isInitialMountColumn = useRef(true);

  // ============================================================================
  // Memoized Computed Values
  // ============================================================================
  const sorting: SortingState = useMemo(() => {
    if (!sortBy || !sortOrder) return [];
    if (sortOrder !== "asc" && sortOrder !== "desc") return [];
    const isValidSortColumn = isValidColumnId(sortBy, sortableColumnIds);
    if (!isValidSortColumn) return [];
    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [sortBy, sortOrder, sortableColumnIds]);

  const columnFilters: ColumnFiltersState = useMemo(() => {
    if (filter && filterColumn) {
      return [{ id: filterColumn, value: filter }];
    }
    return [];
  }, [filter, filterColumn]);

  // ============================================================================
  // DnD Sensors
  // ============================================================================
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {})
  );

  // ============================================================================
  // Event Handlers - Sorting
  // ============================================================================
  const handleSortingChange = (
    updaterOrValue: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const newSorting =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    if (newSorting.length === 0) {
      setParams({ sortBy: null, sortOrder: null });
    } else {
      const sort = newSorting[0];
      setParams({ sortBy: sort.id, sortOrder: sort.desc ? "desc" : "asc" });
    }
  };

  // ============================================================================
  // Event Handlers - Pagination
  // ============================================================================
  const handlePageChange = (newPage: number) => {
    setParams({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number, maxPageSize: number) => {
    setParams({
      pageSize: newPageSize > maxPageSize ? maxPageSize : newPageSize,
      page: 1,
    });
  };

  // ============================================================================
  // Event Handlers - Filtering
  // ============================================================================
  const handleFilterChange = (value: string) => {
    if (value) {
      if (schema && filterColumn) {
        const isValid = validateFilterValue(schema, filterColumn, value);
        if (!isValid) {
          console.warn(
            `Invalid filter value for ${filterColumn}:`,
            value,
            "- value does not match schema type"
          );
          return;
        }
      }
      setParams({ filter: value, page: 1 });
    } else {
      setParams({ filter: null, filterColumn: null, page: 1 });
    }
  };

  const handleFilterColumnChange = (value: string) => {
    if (value && isValidColumnId(value, validColumnIds)) {
      setParams({ filterColumn: value, filter: null, page: 1 });
    } else {
      setParams({ filterColumn: defaultFilterColumn, filter: null, page: 1 });
    }
  };

  // ============================================================================
  // Event Handlers - Drag & Drop
  // ============================================================================

  const handleColumnDragEndEvent = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRowDragEndEvent = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex(
          (item: any) => String(item.id) === String(active.id)
        );
        const newIndex = items.findIndex(
          (item: any) => String(item.id) === String(over.id)
        );
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent, sortableColumnIds: string[]) => {
    setIsDragging(false);
    const activeId = String(event.active.id);
    const isColumnDrag = sortableColumnIds.includes(activeId);
    if (isColumnDrag) {
      handleColumnDragEndEvent(event);
    } else {
      handleRowDragEndEvent(event);
    }
  };

  const handleDragCancel = () => {
    setIsDragging(false);
  };

  // ============================================================================
  // Event Handlers - Auto Scroll
  // ============================================================================
  const handleAutoScrollToggle = (enabled: boolean) => {
    setParams({ autoScroll: enabled ? "true" : "false" });
  };

  // ============================================================================
  // Side Effects
  // ============================================================================
  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Manage overflow during drag
  useEffect(() => {
    if (!parentRef.current) return;
    const tableContainer = parentRef.current.querySelector(
      '[data-slot="table-container"]'
    ) as HTMLElement;
    if (!tableContainer) return;

    if (isDragging) {
      tableContainer.style.overflow = "hidden";
    } else {
      tableContainer.style.overflow = "";
    }
  }, [isDragging]);

  // ============================================================================
  // TanStack Table Instance
  // ============================================================================
  const table = useReactTable({
    data: data,
    columns,
    pageCount: Math.max(1, Math.ceil(data.length / pageSize)),
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility,
      columnOrder,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    meta: {
      bulkActions,
      enableRowOrdering,
    },
    getRowId: (row: any) => String(row.id),
    enableRowSelection: true,
    enableSortingRemoval: true,
    enableMultiSort: false,
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // ============================================================================
  // Table Values
  // ============================================================================
  const allRows = table.getFilteredRowModel().rows;
  const rows = table.getPaginationRowModel().rows;

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(allRows.length / pageSize)),
    [allRows.length, pageSize]
  );

  const currentPage = useMemo(() => {
    if (page < 1) {
      setParams({ page: 1 }, { history: "replace" });
      return 1;
    }
    if (page > pageCount && pageCount > 0) {
      setParams({ page: pageCount }, { history: "replace" });
      return pageCount;
    }
    return page;
  }, [page, pageCount, setParams]);

  // ============================================================================
  // Virtualizer
  // ============================================================================
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  // Measure virtualizer when rows change
  useEffect(() => {
    if (rows.length > 0 && parentRef.current) {
      rowVirtualizer.measure();
    }
  }, [rows.length, rowVirtualizer]);

  // Auto-scroll to top on page change
  useEffect(() => {
    if (autoScroll === "true" && parentRef.current) {
      parentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, autoScroll]);

  //Callback for row order change
  useEffect(() => {
    if (isInitialMountRow.current) {
      isInitialMountRow.current = false;
      return;
    }

    if (onRowOrderChange) {
      onRowOrderChange(data);
    }
  }, [data, onRowOrderChange]);

  // Callback for column order change
  useEffect(() => {
    if (isInitialMountColumn.current) {
      isInitialMountColumn.current = false;
      return;
    }

    if (onColumnOrderChange) {
      const excludedKeys = columns
        .filter((col) => col.meta?.excludeFromColumnOrder === true)
        .map((col) => ("accessorKey" in col ? col.accessorKey : col.id))
        .filter((key): key is string => typeof key === "string");
      const filteredColumnOrder = columnOrder.filter(
        (key) => !excludedKeys.includes(key)
      );

      onColumnOrderChange(filteredColumnOrder);
    }
  }, [columnOrder, onColumnOrderChange, columns]);

  return {
    table,
    parentRef,
    rowVirtualizer,
    rowSelection,
    setRowSelection,
    sorting,
    handleSortingChange,
    filter,
    setFilter: (value: string) => setParams({ filter: value || null }),
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    handleFilterColumnChange,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    isDragging,
    data,
    columnOrder,
    pageCount,
    currentPage,
    page,
    pageSize,
    filterColumn,
    validColumnIds,
    autoScroll: autoScroll === "true",
    handleAutoScrollToggle,
  };
}
