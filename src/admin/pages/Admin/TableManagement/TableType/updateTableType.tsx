import React from "react";
import ModalForm from "../../Components/ModalForm/ModalForm";
interface UpdateTableTypeProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (tableTypeData: any) => Promise<void>;
  tableTypeData: any;
}

const UpdateTableType: React.FC<UpdateTableTypeProps> = ({
  show,
  onClose,
  onUpdate,
  tableTypeData,
}) => {
  const tableTypeColumns = [
    {
      name: "TypeName",
      label: "Tên loại bàn",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên loại bàn",
    },
    {
      name: "Capacity",
      label: "Sức chứa (người)",
      type: "number" as const,
      required: true,
      placeholder: "Nhập sức chứa tối đa",
    },
    {
      name: "Description",
      label: "Mô tả",
      type: "textarea" as const,
      placeholder: "Nhập mô tả (nếu có)",
      span: 2 as const,
    },
    {
      name: "Status",
      label: "Trạng thái",
      type: "select" as const,
      required: true,
      options: [
        { label: "Hoạt động", value: "Active" },
        { label: "Ngừng hoạt động", value: "Inactive" },
      ],
    },
    {
      name: "CreatedAt",
      label: "Ngày tạo",
      type: "date" as const,
      required: true,
    },
    {
      name: "UpdatedAt",
      label: "Ngày cập nhật",
      type: "date" as const,
      required: true,
    },
  ];

  const handleSubmit = async (formData: any) => {
    const updatedData = {
      ...tableTypeData,
      ...formData,
      Capacity: Number(formData.Capacity) || 0,
      UpdatedAt: formData.UpdatedAt || new Date().toISOString().split("T")[0],
    };

    await onUpdate(updatedData);
  };

  const initialData = tableTypeData
    ? {
        ...tableTypeData,
        CreatedAt:
          tableTypeData.CreatedAt?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        UpdatedAt:
          tableTypeData.UpdatedAt?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      }
    : {};

  return (
    <ModalForm
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Cập nhật loại bàn"
      columns={tableTypeColumns}
      initialData={initialData}
      submitText="Cập nhật"
    />
  );
};

export default UpdateTableType;
