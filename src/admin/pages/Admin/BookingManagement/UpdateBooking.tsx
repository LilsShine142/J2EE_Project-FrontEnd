import React from "react";
import ModalForm from "../../Admin/Components/ModalForm/ModalForm";

interface StatusOption {
  id: string;
  description: string;
  code: string;
}

interface UpdateBookingProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (bookingData: any) => Promise<void>;
  bookingData: any;
  statusOptions: StatusOption[];
}

const UpdateBooking: React.FC<UpdateBookingProps> = ({ 
  show, 
  onClose, 
  onUpdate, 
  bookingData,
  statusOptions
}) => {
  const bookingColumns = [
    {
      name: "tableId",
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
      name: "numberOfGuests",
      label: "Số khách",
      type: "number" as const,
      required: true,
      placeholder: "Nhập số khách",
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select" as const,
      required: true,
      options: statusOptions.map((status) => ({
        label: status.description,
        value: status.id,
      })),
    },
    {
      name: "specialRequests",
      label: "Yêu cầu đặc biệt",
      type: "textarea" as const,
      placeholder: "Nhập yêu cầu đặc biệt",
      span: 2 as const,
    },
  ];

  const handleSubmit = async (formData: any) => {
    const updatedData = {
      ...bookingData,
      tableId: Number(formData.tableId),
      bookingDate: formData.bookingDate,
      numberOfGuests: Number(formData.numberOfGuests),
      specialRequests: formData.specialRequests || undefined,
    };

    await onUpdate(updatedData);
  };

  const initialData = bookingData ? {
    tableId: bookingData.tableId,
    bookingDate: bookingData.bookingDate,
    numberOfGuests: bookingData.numberOfGuests,
    status: bookingData.status,
    specialRequests: bookingData.specialRequests || "",
  } : {};

  return (
    <ModalForm
      show={show}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Cập nhật đặt bàn"
      columns={bookingColumns}
      initialData={initialData}
      submitText="Cập nhật"
    />
  );
};

export default UpdateBooking;