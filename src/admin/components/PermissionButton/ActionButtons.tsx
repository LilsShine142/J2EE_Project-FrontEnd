import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  permissions,
}) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={onView}
        className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
      >
        <FaEye className="w-3 h-3" /> Xem
      </button>
      <button
        disabled={!permissions.canEdit}
        onClick={() => permissions.canEdit && onEdit()}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          permissions.canEdit
            ? "bg-yellow-500 text-white hover:bg-yellow-600"
            : "bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-yellow-600"
        }`}
      >
        <FaEdit className="w-3 h-3" /> Sửa
      </button>
      <button
        disabled={!permissions.canDelete}
        onClick={() => permissions.canDelete && onDelete()}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
          permissions.canDelete
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-red-600"
        }`}
      >
        <FaTrash className="w-3 h-3" /> Xóa
      </button>
    </div>
  );
};

export default ActionButtons;