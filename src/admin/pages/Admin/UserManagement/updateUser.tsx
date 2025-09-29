import React, { useState } from "react";
import ModalForm from "../Components/ModalForm/ModalForm";

interface UpdateUserProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (userData: any) => Promise<void>;
  userData: any;
  roleOptions?: Array<{ RoleID: number; RoleName: string; Description: string }>;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ 
  show, 
  onClose, 
  onUpdate, 
  userData,
  roleOptions = [] 
}) => {
  const userColumns = [
    {
      name: "Email",
      label: "Email",
      type: "email" as const,
      required: true,
      placeholder: "Nhập email",
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
      name: "TotalSpent",
      label: "Tổng chi tiêu",
      type: "number" as const,
      placeholder: "0",
    },
    {
      name: "LoyaltyPoints",
      label: "Điểm thưởng",
      type: "number" as const,
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
    const updatedData = {
      ...userData,
      ...formData,
      TotalSpent: Number(formData.TotalSpent) || 0,
      LoyaltyPoints: Number(formData.LoyaltyPoints) || 0,
      role: roleOptions.find(role => role.RoleID.toString() === formData.RoleID) || userData.role
    };

    await onUpdate(updatedData);
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1500);
    });
  };

  const initialData = userData ? {
    ...userData,
    RoleID: userData.role?.RoleID?.toString() || "",
  } : {};

  return (
    <ModalForm
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Cập nhật người dùng"
      columns={userColumns}
      initialData={initialData}
      submitText="Cập nhật"
    //   size="lg"
      onFileUpload={handleFileUpload}
    />
  );
};

export default UpdateUser;