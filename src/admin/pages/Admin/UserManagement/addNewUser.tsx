import React, { useState } from "react";
import { Plus } from "lucide-react";
import ModalForm from "../Components/ModalForm/ModalForm";

interface AddNewUserProps {
  onAdd: (userData: any) => Promise<void>;
  roleOptions?: Array<{ RoleID: number; RoleName: string; Description: string }>;
}

const AddNewUser: React.FC<AddNewUserProps> = ({ onAdd, roleOptions = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        Email: "",
        Password: "",
        FullName: "",
        PhoneNumber: "",
        Status: "Unverified",
        StatusWork: "Active",
        RoleID: "",
        gender: "",
        JoinDate: new Date().toISOString().split('T')[0],
        TotalSpent: 0,
        LoyaltyPoints: 0,
        avatar: ""
    });
    const userColumns = [
        {
        name: "Email",
        label: "Email",
        type: "email" as const,
        required: true,
        placeholder: "Nhập email",
        },
        {
        name: "Password",
        label: "Mật khẩu",
        type: "password" as const,
        required: true,
        placeholder: "Nhập mật khẩu",
        },
        {
        name: "FullName",
        label: "Họ và tên",
        type: "text" as const,
        required: true,
        placeholder: "Nhập họ và tên",
        },
        {
        name: "PhoneNumber",
        label: "Số điện thoại",
        type: "tel" as const,
        required: true,
        placeholder: "Nhập số điện thoại",
        },
        {
        name: "Status",
        label: "Trạng thái",
        type: "select" as const,
        required: true,
        defaultValue: "Unverified",
        options: [
            { label: "Đã xác minh", value: "Verified" },
            { label: "Chưa xác minh", value: "Unverified" },
        ],
        },
        {
        name: "StatusWork",
        label: "Trạng thái làm việc",
        type: "select" as const,
        required: true,
        defaultValue: "Active",
        options: [
            { label: "Hoạt động", value: "Active" },
            { label: "Không hoạt động", value: "Inactive" },
        ],
        },
        {
        name: "RoleID",
        label: "Vai trò",
        type: "select" as const,
        required: true,
        options: roleOptions.map((role) => ({
            label: role.RoleName,
            value: role.RoleID.toString(),
        })),
        },
        {
        name: "gender",
        label: "Giới tính",
        type: "select" as const,
        options: [
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" },
            { label: "Khác", value: "other" },
        ],
        },
        {
        name: "JoinDate",
        label: "Ngày tham gia",
        type: "date" as const,
        defaultValue: new Date().toISOString().split('T')[0],
        },
        {
        name: "TotalSpent",
        label: "Tổng chi tiêu",
        type: "number" as const,
        defaultValue: 0,
        placeholder: "0",
        },
        {
        name: "LoyaltyPoints",
        label: "Điểm thưởng",
        type: "number" as const,
        defaultValue: 0,
        placeholder: "0",
        },
        {
        name: "avatar",
        label: "Ảnh đại diện",
        type: "file" as const,
        span: 2 as const,
        },
    ];

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
      setFormData({
      Email: "",
      Password: "",
      FullName: "",
      PhoneNumber: "",
      Status: "Unverified",
      StatusWork: "Active",
      RoleID: "",
      gender: "",
      JoinDate: new Date().toISOString().split('T')[0],
      TotalSpent: 0,
      LoyaltyPoints: 0,
      avatar: ""
    });
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
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initialData = {formData} 
        title="Thêm người dùng mới"
        columns={userColumns}
        submitText="Thêm người dùng"
        // size="lg"
        onFileUpload={handleFileUpload}
      />
    </>
  );
};

export default AddNewUser;