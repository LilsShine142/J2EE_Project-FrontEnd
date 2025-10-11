// import React from "react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange
// }) => {
//   if (totalPages <= 1) return null;

//   const renderPageNumbers = (): (number | string)[] => {
//     let pages: (number | string)[] = [];

//     if (totalPages <= 5) {
//       // Hiển thị tất cả trang nếu ≤5
//       pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else if (currentPage <= 3) {
//       // Trang gần đầu: 1 2 3 ... last
//       pages = [1, 2, 3, "...", totalPages];
//     } else if (currentPage >= totalPages - 2) {
//       // Trang gần cuối: 1 ... last-2 last-1 last
//       pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
//     } else {
//       // Trang ở giữa: 1 ... current-1 current current+1 ... last
//       pages = [
//         1,
//         "...",
//         currentPage - 1,
//         currentPage,
//         currentPage + 1,
//         "...",
//         totalPages,
//       ];
//     }

//     return pages;
//   };

//   console.log("currentPage", currentPage);
  
//   return (
//     <div className="flex justify-center mt-4">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
//       >
//         {"<"}
//       </button>

//       {renderPageNumbers().map((page, index) =>
//         page === "..." ? (
//           <span key={`ellipsis-${index}`} className="px-3 py-1 mx-1 text-gray-500">
//             ...
//           </span>
//         ) : (
//           <button
//             key={page}
//             onClick={() => onPageChange(page as number)}
//             className={`px-3 py-1 mx-1 rounded transition-colors ${
//               currentPage === page
//                 ? "bg-blue-500 text-white hover:bg-blue-600"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//           >
//             {page}
//           </button>
//         )
//       )}

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
//       >
//         {">"}
//       </button>
//     </div>
//   );
// };

// export default Pagination;


import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = false,
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center gap-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm border rounded-md transition-colors ${
              currentPage === page
                ? "bg-blue-500 text-white border-blue-500"
                : "text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-sm text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;