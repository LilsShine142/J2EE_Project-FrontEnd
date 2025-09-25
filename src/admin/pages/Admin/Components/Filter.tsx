import React from "react";
import { Select } from "antd";

interface FilterOption {
  key: string;
  label: string;
  type: "select";
  placeholder: string;
  values: { value: string | number; label: string }[];
}

interface FilterProps {
  filters: { [key: string]: string | number };
  options: FilterOption[];
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onReset: () => void;
}

const Filter: React.FC<FilterProps> = ({ filters, options, onFilterChange, onReset }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {options.map((option) => (
        <div key={option.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {option.label}
          </label>
          {option.type === "select" ? (
            <select
              name={option.key}
              value={filters[option.key]}
              onChange={onFilterChange}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Tất cả</option>
              {option.values.map((val) => (
                <option key={val.value} value={val.value}>
                  {val.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={option.type}
              name={option.key}
              value={filters[option.key]}
              onChange={(e) => onFilterChange(e)}
              placeholder={option.placeholder}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          )}
        </div>
      ))}
      <div className="self-end">

        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;