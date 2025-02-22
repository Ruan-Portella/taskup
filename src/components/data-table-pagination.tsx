import { Table } from "@tanstack/react-table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { ReactNode } from "react"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const totalPageCount = table.getPageCount();
  const page = table.getState().pagination.pageIndex === 0 ? 1 : table.getState().pagination.pageIndex + 1;

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];

    items.push(
      <PaginationItem key={1}>
        <PaginationLink href="#" onClick={() => table.setPageIndex(1)} isActive={page === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    );

    if (page > 3 && totalPageCount > 5) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    let startPage = 0;

    if (page >= totalPageCount - 3) {
      startPage = totalPageCount - 4
    } else {
      startPage = page - 1
    }

    const start = Math.max(2, startPage);

    let endPage = 0;

    if (page <= 3) {
      endPage = 4
    } else {
      endPage = page + 1
    }

    const end = Math.min(totalPageCount - 1, endPage);

    if (totalPageCount > 1) {
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href={'#'} onClick={() => table.setPageIndex(i)} isActive={page === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    if (page < totalPageCount - 2 && totalPageCount > 5) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (totalPageCount === 2) {
      items.push(
        <PaginationItem key={2}>
          <PaginationLink href={'#'} onClick={() => table.setPageIndex(2)} isActive={page === 2}>
            2
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (totalPageCount > 2) {
      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink href={'#'} onClick={() => table.setPageIndex(totalPageCount)} isActive={page === totalPageCount}>
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <div className="flex items-center justify-between mt-4 flex-col lg:flex-row">
      <div className="w-full items-center text-sm font-medium hidden md:flex">
        Página {table.getState().pagination.pageIndex + 1} de{" "}
        {table.getPageCount()}
      </div>
      <div className="flex w-full flex-col gap-2 items-center justify-between sm:flex-row lg:justify-end">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium truncate">Linhas por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => table.setPageIndex(table.getState().pagination.pageIndex)} />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem>
                <PaginationNext href="#" onClick={() => table.setPageIndex((table.getState().pagination.pageIndex + 2) > (totalPageCount - 1) ? totalPageCount : table.getState().pagination.pageIndex + 2)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
