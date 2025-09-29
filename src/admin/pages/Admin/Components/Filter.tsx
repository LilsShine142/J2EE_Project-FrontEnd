// import React from "react";
// import { Select } from "antd";

// interface FilterOption {
//   key: string;
//   label: string;
//   type: "select";
//   placeholder: string;
//   values: { value: string | number; label: string }[];
// }

// interface FilterProps {
//   filters: { [key: string]: string | number };
//   options: FilterOption[];
//   onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onReset: () => void;
// }

// const Filter: React.FC<FilterProps> = ({ filters, options, onFilterChange, onReset }) => {
//   return (
//     <div className="flex flex-wrap gap-4 mb-4">
//       {options.map((option) => (
//         <div key={option.key}>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {option.label}
//           </label>
//           {option.type === "select" ? (
//             <select
//               name={option.key}
//               value={filters[option.key]}
//               onChange={onFilterChange}
//               className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//             >
//               <option value="">Tất cả</option>
//               {option.values.map((val) => (
//                 <option key={val.value} value={val.value}>
//                   {val.label}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               type={option.type}
//               name={option.key}
//               value={filters[option.key]}
//               onChange={(e) => onFilterChange(e)}
//               placeholder={option.placeholder}
//               className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           )}
//         </div>
//       ))}
//       <div className="self-end">

//         <button
//           onClick={onReset}
//           className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
//         >
//           Reset Filter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Filter;


import React from "react";
import { RotateCcw } from "lucide-react";

interface FilterOption {
  key: string;
  label: string;
  type: "select";
  placeholder: string;
  values: { value: string; label: string }[];
}

interface FilterProps {
  filters: { [key: string]: string };
  options: FilterOption[];
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
}

const Filter: React.FC<FilterProps> = ({
  filters,
  options,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {options.map((option) => (
        <select
          key={option.key}
          name={option.key}
          value={filters[option.key] || ""}
          onChange={onFilterChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[150px]"
        >
          <option value="">{option.placeholder}</option>
          {option.values.map((value) => (
            <option key={value.value} value={value.value}>
              {value.label}
            </option>
          ))}
        </select>
      ))}
      
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        title="Reset filters"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
};

export default Filter;