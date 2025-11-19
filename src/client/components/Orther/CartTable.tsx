import React, { type JSX } from 'react';

interface Column {
  key: string;
  label: string;
  align: 'left' | 'center' | 'right';
}

interface CartTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell: (item: T, columnKey: string) => JSX.Element;
  keyExtractor: (item: T) => string | number;
}

function CartTable<T>({ columns, data, renderCell, keyExtractor }: CartTableProps<T>) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            {columns.map(({ key, label, align }) => (
              <th 
                key={key} 
                className={`py-4 px-4 font-semibold text-gray-900 text-${align}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={keyExtractor(item)} className="border-b border-gray-200">
              {columns.map(({ key }) => renderCell(item, key))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartTable;