// import React from "react";

// interface AddButtonProps {
//   onClick: () => void;
//   permissionCode?: string;
//   hasPermission?: (code: string) => boolean;
//   text?: string;
//   className?: string;
//   children?: React.ReactNode;
// }

// const AddButton: React.FC<AddButtonProps> = ({ onClick, permissionCode, hasPermission, text, className = "", children }) => {
//   const disabled = permissionCode && hasPermission ? !hasPermission(permissionCode) : false;

//   return (
//     <button
//       disabled={disabled}
//       onClick={onClick}
//       className={`px-4 py-2 rounded ${className} ${
//         disabled
//           ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//           : "bg-green-500 text-white hover:bg-green-600"
//       }`}
//     >
//       {children || text}
//     </button>
//   );
// };

// export default AddButton;





import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface AddButtonProps {
  onClick: () => void;
  disabled: boolean;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, disabled, text, className = "", children }) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      icon={<PlusOutlined />}
      className={`px-5 py-5 rounded ${className} ${
        disabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-green-500 text-white hover:bg-green-600"
      }`}
    >
      {children || text}
    </Button>
  );
};

export default AddButton;