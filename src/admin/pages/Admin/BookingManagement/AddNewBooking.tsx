import React, { useState } from "react";
import { Plus } from "lucide-react";
import ModalForm from "../Components/ModalForm/ModalForm";
import AddButton from "../../../components/PermissionButton/AddButton";

interface StatusOption {
  id: string;
  description: string;
  code: string;
}

interface AddNewBookingProps {
  onAdd: (bookingData: any) => Promise<void>;
  statusOptions: StatusOption[];
  disabled: boolean;
}

const AddNewBooking: React.FC<AddNewBookingProps> = ({ 
  onAdd, 
  statusOptions,
  disabled,
}) => {
  const bookingColumns = [
    {
      name: "userID",
      label: "ID Khách hàng",
      type: "number" as const,
      required: true,
      placeholder: "Nhập ID khách hàng",
    },
    {
      name: "tableID",
      label: "ID Bàn",
      type: "number" as const,
      required: true,
      placeholder: "Nhập ID bàn",
    },
    {
      name: "bookingDate",
      label: "Ngày đặt",
      type: "date" as const,
      required: true,
    },
    {
      name: "startTime",
      label: "Giờ bắt đầu",
      type: "text" as const,
      required: true,
      placeholder: "HH:MM",
    },
    {
      name: "endTime",
      label: "Giờ kết thúc",
      type: "text" as const,
      required: true,
      placeholder: "HH:MM",
    },
    {
      name: "numberOfGuests",
      label: "Số khách",
      type: "number" as const,
      required: true,
      placeholder: "Nhập số khách",
    },
    {
      name: "initialPayment",
      label: "Đặt cọc",
      type: "number" as const,
      placeholder: "Nhập số tiền đặt cọc",
    },
    {
      name: "paymentMethod",
      label: "Phương thức thanh toán",
      type: "select" as const,
      options: [
        { label: "Tiền mặt", value: "CASH" },
        { label: "Chuyển khoản", value: "BANK_TRANSFER" },
        { label: "Ví điện tử", value: "E_WALLET" },
      ],
    },
    {
      name: "notes",
      label: "Ghi chú",
      type: "textarea" as const,
      placeholder: "Nhập ghi chú đặc biệt",
      span: 2 as const,
    },
  ];

  const initialFormData = bookingColumns.reduce((acc, col) => {
    acc[col.name] = (col as any).defaultValue || "";
    return acc;
  }, {} as { [key: string]: any });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (formData: any) => {
    const bookingData = {
      userID: Number(formData.userID),
      tableID: Number(formData.tableID),
      bookingDate: formData.bookingDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      numberOfGuests: Number(formData.numberOfGuests),
      initialPayment: formData.initialPayment ? Number(formData.initialPayment) : undefined,
      paymentMethod: formData.paymentMethod || undefined,
      notes: formData.notes || undefined,
    };

    await onAdd(bookingData);
    setShowModal(false);
    setFormData(initialFormData);
  };

  return (
    <>
      <AddButton
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        disabled={!!disabled}
      >
        Thêm đặt bàn
      </AddButton>

      <ModalForm
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData(initialFormData);
        }}
        onSubmit={handleSubmit}
        initialData={formData}
        title="Thêm đặt bàn mới"
        columns={bookingColumns}
        submitText="Thêm đặt bàn"
      />
    </>
  );
};

export default AddNewBooking;