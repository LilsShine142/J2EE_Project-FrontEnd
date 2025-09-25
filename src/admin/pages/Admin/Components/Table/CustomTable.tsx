import React from "react";

// Table Component
interface TableProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Table = ({ children, className = "", onClick }: TableProps) => {
  return (
    <table
      className={`w-full border-collapse ${className}`}
      onClick={onClick}
      style={{ border: "1px solid #E5E7EB" }}
    >
      {children}
    </table>
  );
};

// TableHeader Component
interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableHeader = ({ children, className = "", onClick }: TableHeaderProps) => {
  return (
    <thead
      onClick={onClick}
      className={`bg-gray-100 h-10 ${className}`}
    >
      {children}
    </thead>
  );
};

// TableHead Component
interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  isSort?: boolean;
  onClick?: () => void;
}

export const TableHead = ({
  children,
  className = "",
  isSort = false,
  onClick,
}: TableHeadProps) => {
  return (
    <th
      onClick={isSort ? onClick : undefined}
      className={`text-left px-3 py-2 border-b font-medium text-gray-800 ${isSort ? "cursor-pointer hover:bg-gray-200" : ""} ${className}`}
      style={{ borderBottom: "1px solid #E5E7EB" }}
    >
      {children}
    </th>
  );
};

// TableBody Component
interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableBody = ({ children, className = "", onClick }: TableBodyProps) => {
  return (
    <tbody onClick={onClick} className={className}>
      {children}
    </tbody>
  );
};

// TableRow Component
interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableRow = ({ children, className = "", onClick }: TableRowProps) => {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-gray-50 ${className}`}
    >
      {children}
    </tr>
  );
};

// TableCell Component
interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableCell = ({ children, className = "", onClick }: TableCellProps) => {
  return (
    <td
      onClick={onClick}
      className={`px-3 py-2 text-gray-700 ${className}`}
      style={{ borderBottom: "1px solid #E5E7EB" }}
    >
      {children}
    </td>
  );
};