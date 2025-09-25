import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = (): (number | string)[] => {
    let pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Hiển thị tất cả trang nếu ≤5
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      // Trang gần đầu: 1 2 3 ... last
      pages = [1, 2, 3, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      // Trang gần cuối: 1 ... last-2 last-1 last
      pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
    } else {
      // Trang ở giữa: 1 ... current-1 current current+1 ... last
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }

    return pages;
  };

  console.log("currentPage", currentPage);
  
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        {"<"}
      </button>

      {renderPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 py-1 mx-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 mx-1 rounded transition-colors ${
              currentPage === page 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;