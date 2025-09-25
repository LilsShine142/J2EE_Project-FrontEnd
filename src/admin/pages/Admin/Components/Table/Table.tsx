import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./CustomTable";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// Định nghĩa kiểu cho cột
interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
  isSort?: boolean;
}

// Định nghĩa kiểu cho cấu hình sắp xếp
interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

// Định nghĩa props cho AdminTable
interface AdminTableProps<T extends { id?: number }> {
  data: T[];
  columns: Column<T>[];
  onSort: (key: string) => void;
  sortConfig: SortConfig;
  onRowClick?: (row: T) => void;
}

const AdminTable = <T extends { id?: number }>({
  data,
  columns,
  onSort,
  sortConfig,
  onRowClick,
}: AdminTableProps<T>) => {
  return (
    <div className="p-2 bg-white rounded-lg overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                isSort={col.isSort}
                onClick={() => {
                  if (col.isSort) {
                    onSort(col.key);
                  }
                }}
              >
                <div className="flex items-center">
                  {col.label}
                  {col.isSort && sortConfig.key === col.key && (
                    sortConfig.direction === "ascending" ? (
                      <FaChevronUp className="ml-1 text-gray-500" />
                    ) : (
                      <FaChevronDown className="ml-1 text-gray-500" />
                    )
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              className="cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length === 0 && (
        <div className="text-center text-gray-500 mt-4">No data available</div>
      )}
    </div>
  );
};

export default AdminTable;