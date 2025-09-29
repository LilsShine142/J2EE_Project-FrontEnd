// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./CustomTable";
// import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// // Định nghĩa kiểu cho cột
// interface Column<T> {
//   key: string;
//   label: string;
//   className?: string;
//   render?: (row: T) => React.ReactNode;
//   isSort?: boolean;
// }

// // Định nghĩa kiểu cho cấu hình sắp xếp
// interface SortConfig {
//   key: string;
//   direction: "ascending" | "descending";
// }

// // Định nghĩa props cho AdminTable
// interface AdminTableProps<T extends { id?: number }> {
//   data: T[];
//   columns: Column<T>[];
//   onSort: (key: string) => void;
//   sortConfig: SortConfig;
//   onRowClick?: (row: T) => void;
// }

// const AdminTable = <T extends { id?: number }>({
//   data,
//   columns,
//   onSort,
//   sortConfig,
//   onRowClick,
// }: AdminTableProps<T>) => {
//   return (
//     <div className="p-2 bg-white rounded-lg overflow-x-auto">
//       <Table className="w-full">
//         <TableHeader>
//           <TableRow>
//             {columns.map((col) => (
//               <TableHead
//                 key={col.key}
//                 isSort={col.isSort}
//                 onClick={() => {
//                   if (col.isSort) {
//                     onSort(col.key);
//                   }
//                 }}
//               >
//                 <div className="flex items-center">
//                   {col.label}
//                   {col.isSort && sortConfig.key === col.key && (
//                     sortConfig.direction === "ascending" ? (
//                       <FaChevronUp className="ml-1 text-gray-500" />
//                     ) : (
//                       <FaChevronDown className="ml-1 text-gray-500" />
//                     )
//                   )}
//                 </div>
//               </TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((row, rowIndex) => (
//             <TableRow
//               key={row.id || rowIndex}
//               className="cursor-pointer"
//               onClick={() => onRowClick && onRowClick(row)}
//             >
//               {columns.map((col) => (
//                 <TableCell key={col.key} className={col.className}>
//                   {col.render ? col.render(row) : (row as any)[col.key]}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {data.length === 0 && (
//         <div className="text-center text-gray-500 mt-4">No data available</div>
//       )}
//     </div>
//   );
// };

// export default AdminTable;




import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TableColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onSort?: (key: string) => void;
  sortConfig?: {
    key: string;
    direction: 'ascending' | 'descending';
  };
}

const DataTable: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  sortConfig,
}) => {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center gap-1">
                  <span>{column.label}</span>
                  {column.sortable !== false && sortConfig?.key === column.key && (
                    <span className="text-blue-500">
                      {sortConfig.direction === 'ascending' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-4 py-8 text-center text-gray-500"
              >
                Không có dữ liệu để hiển thị
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr 
                key={row.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 text-sm text-gray-900">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;