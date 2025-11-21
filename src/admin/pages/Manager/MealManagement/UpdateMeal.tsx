import React from "react";
import ModalForm from "../../Admin/Components/ModalForm/ModalForm";

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

interface UpdateMealProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (mealData: any) => Promise<void>;
  mealData: any;
  categoryOptions: CategoryOption[];
  statusOptions: StatusOption[];
}

const UpdateMeal: React.FC<UpdateMealProps> = ({ 
  show, 
  onClose, 
  onUpdate, 
  mealData,
  categoryOptions,
  statusOptions
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

  const handleSubmit = async (formData: any) => {
    const updatedData = {
      ...mealData,
      ...formData,
      price: Number(formData.price) || 0,
      categoryID: Number(formData.categoryID),
      statusId: Number(formData.statusId),
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

  const initialData = mealData ? {
    ...mealData,
    categoryID: mealData.categoryID?.toString() || "",
    statusId: String(mealData.statusId) || "",
  } : {};

  return (
    <ModalForm
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Cập nhật món ăn"
      columns={mealColumns}
      initialData={initialData}
      submitText="Cập nhật"
      onFileUpload={handleFileUpload}
    />
  );
};

export default UpdateMeal;