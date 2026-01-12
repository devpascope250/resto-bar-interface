"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search, Calendar, Loader2 } from "lucide-react"; // 👈 Added Loader2

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  // Date filter props
  onDateFilterChange?: (startDate: Date | null, endDate: Date | null) => void;
  showDateFilter?: boolean;
  dateFilterPlaceholder?: string;
  // 👇 New loading prop
  isRefetching?: boolean;
  isLoading?: boolean;
  additionalFilters?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onDateFilterChange,
  showDateFilter = false,
  dateFilterPlaceholder = "Filter by date",
  isRefetching = false,
  isLoading = false,
  additionalFilters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Date filter state
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  // Handle date filter changes and call parent callback
  React.useEffect(() => {
    if (onDateFilterChange) {
      onDateFilterChange(startDate, endDate);
    }
  }, [startDate, endDate, onDateFilterChange]);

  // Function to clear date filters
  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* 👇 Loading indicator in header */}
      <div className="relative">
        {isRefetching && (
          <div className="absolute top-2 right-2 z-10">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4 flex-1">
            {searchKey && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={
                    (table.getColumn(searchKey)?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(searchKey)
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm pl-9"
                />
              </div>
            )}

            {showDateFilter && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !startDate && !endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate || endDate ? (
                        <>
                          {startDate
                            ? format(startDate, "MMM dd, yyyy")
                            : "Start"}{" "}
                          - {endDate ? format(endDate, "MMM dd, yyyy") : "End"}
                        </>
                      ) : (
                        <span>{dateFilterPlaceholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex">
                      <CalendarComponent
                        mode="range"
                        selected={{
                          from: startDate || undefined,
                          to: endDate || undefined,
                        }}
                        onSelect={(range) => {
                          setStartDate(range?.from || null);
                          setEndDate(range?.to || null);
                        }}
                        autoFocus
                      />
                    </div>
                    {(startDate || endDate) && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearDateFilter}
                          className="w-full"
                        >
                          Clear Date Filter
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateFilter}
                    className="h-8 px-2 lg:px-3"
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}
            {
              additionalFilters && (
                <div className="flex items-center gap-2">
                  {additionalFilters}
                </div>
              )
            }
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-transparent">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Table body remains unchanged - no loading states here */}
      {isLoading ? (
        <Card className="border-border/20">
          <CardContent className="flex min-h-[100px] items-center justify-center">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      ) : data && data.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="border-border/20">
          <CardContent className="flex min-h-[100px] items-center justify-center">
            <p className="text-muted-foreground">No Records found</p>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
