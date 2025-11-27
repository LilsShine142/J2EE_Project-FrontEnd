import React, { useState } from "react";
import { Plus } from "lucide-react";
import ModalForm from "../../Admin/Components/ModalForm/ModalForm";
import { MStatusMeal } from "../../../../lib/constants/constants";
import AddButton from "../../../components/PermissionButton/AddButton";

interface CategoryOption {
  categoryID: number;
  categoryName: string;
  description: string;
}

interface StatusOption {
  id: number;
  description: string;
  code: string;
}

interface AddNewMealProps {
  onAdd: (mealData: any) => Promise<void>;
  categoryOptions: CategoryOption[];
  statusOptions: StatusOption[];
  disabled: boolean;
}

const AddNewMeal: React.FC<AddNewMealProps> = ({ 
  onAdd, 
  categoryOptions, 
  statusOptions,
  disabled
}) => {
  const mealColumns = [
    {
      name: "mealName",
      label: "Tên món ăn",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên món ăn",
    },
    {
      name: "price",
      label: "Giá",
      type: "number" as const,
      required: true,
      placeholder: "Nhập giá",
    },
    {
      name: "categoryID",
      label: "Danh mục",
      type: "select" as const,
      required: true,
      options: categoryOptions.map((category) => ({
        label: category.categoryName,
        value: category.categoryID.toString(),
      })),
    },
    {
      name: "statusId",
      label: "Trạng thái",
      type: "select" as const,
      required: true,
      defaultValue: String(MStatusMeal.ACTIVE.code),
      options: statusOptions.map((status) => ({
        label: status.description,
        value: String(status.id),
      })),
    },
    {
      name: "image",
      label: "Hình ảnh",
      type: "file" as const,
      span: 2 as const,
    },
  ];

  const initialFormData = mealColumns.reduce((acc, col) => {
    acc[col.name] = col.defaultValue || "";
    return acc;
  }, {} as { [key: string]: any });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (formData: any) => {
    const mealData = {
      ...formData,
      price: Number(formData.price) || 0,
      categoryID: Number(formData.categoryID),
      statusId: Number(formData.statusId),
    };

    await onAdd(mealData);
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
      <AddButton
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={!!disabled}
      >
        <Plus className="w-4 h-4" />
        Thêm món ăn
      </AddButton>

      <ModalForm
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData(initialFormData);
        }}
        onSubmit={handleSubmit}
        initialData={formData}
        title="Thêm món ăn mới"
        columns={mealColumns}
        submitText="Thêm món ăn"
        onFileUpload={handleFileUpload}
      />
    </>
  );
};

export default AddNewMeal;