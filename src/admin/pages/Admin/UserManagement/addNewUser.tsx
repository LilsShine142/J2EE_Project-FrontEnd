import React, { useState } from "react";
import { Plus } from "lucide-react";
import ModalForm from "../Components/ModalForm/ModalForm";

interface AddNewUserProps {
  onAdd: (userData: any) => Promise<void>;
  columns: any;
  initialFormData: any;
  roleOptions?: Array<{ RoleID: number; RoleName: string; Description: string }>;
}

const AddNewUser: React.FC<AddNewUserProps> = ({ onAdd, columns, initialFormData, roleOptions = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (formData: any) => {
    const userData = {
      ...formData,
      UserID: Date.now(),
    //   VerifyCode: formData.Status === "Verified" ? "VERIFIED" : null,
      TotalSpent: Number(formData.TotalSpent) || 0,
      LoyaltyPoints: Number(formData.LoyaltyPoints) || 0,
      role: roleOptions.find(role => role.RoleID.toString() === formData.RoleID) || {
        RoleID: 1,
        RoleName: "Staff",
        Description: "Nhân viên"
      }
    };

      await onAdd(userData);
      setShowModal(false);
      setFormData(initialFormData);
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1500);
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Thêm người dùng
      </button>

      <ModalForm
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData(initialFormData);
        }}
        onSubmit={handleSubmit}
        initialData={formData}
        title="Thêm người dùng mới"
        columns={columns}
        submitText="Thêm người dùng"
        // size="lg"
        onFileUpload={handleFileUpload}
      />
    </>
  );
};

export default AddNewUser;