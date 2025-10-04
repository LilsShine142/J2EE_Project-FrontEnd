import React, { useState } from "react";
import { Plus } from "lucide-react";
import ModalForm from "../../Components/ModalForm/ModalForm";

interface AddNewTableTypeProps {
  onAdd: (tableTypeData: any) => Promise<void>;
}

const AddNewTableType: React.FC<AddNewTableTypeProps> = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    TypeName: "",
    Capacity: 4,
    Description: "",
    Status: "Active",
    CreatedAt: new Date().toISOString().split("T")[0],
    UpdatedAt: new Date().toISOString().split("T")[0],
  });

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
      label: "Sức chứa",
      type: "number" as const,
      required: true,
      defaultValue: 4,
      placeholder: "Nhập số lượng người tối đa",
    },
    {
      name: "Description",
      label: "Mô tả",
      type: "textarea" as const,
      placeholder: "Nhập mô tả loại bàn (nếu có)",
      span: 2 as const,
    },
    {
      name: "Status",
      label: "Trạng thái",
      type: "select" as const,
      required: true,
      defaultValue: "Active",
      options: [
        { label: "Hoạt động", value: "Active" },
        { label: "Ngừng hoạt động", value: "Inactive" },
      ],
    },
    {
      name: "CreatedAt",
      label: "Ngày tạo",
      type: "date" as const,
      defaultValue: new Date().toISOString().split("T")[0],
    },
    {
      name: "UpdatedAt",
      label: "Ngày cập nhật",
      type: "date" as const,
      defaultValue: new Date().toISOString().split("T")[0],
    },
  ];

  const handleSubmit = async (data: any) => {
    const tableTypeData = {
      ...data,
      TableTypeId: Date.now(),
      Capacity: Number(data.Capacity) || 0,
      CreatedAt: data.CreatedAt || new Date().toISOString(),
      UpdatedAt: data.UpdatedAt || new Date().toISOString(),
    };

    await onAdd(tableTypeData);
    setShowModal(false);

    // Reset form
    setFormData({
      TypeName: "",
      Capacity: 4,
      Description: "",
      Status: "Active",
      CreatedAt: new Date().toISOString().split("T")[0],
      UpdatedAt: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Thêm loại bàn
      </button>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initialData={formData}
        title="Thêm loại bàn mới"
        columns={tableTypeColumns}
        submitText="Thêm loại bàn"
      />
    </>
  );
};

export default AddNewTableType;
