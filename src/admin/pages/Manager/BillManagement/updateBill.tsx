import React from "react";
import { Card, message, Spin } from "antd";
import { ArrowLeft, Receipt } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BillDetailView from "../BillManagement/BillDetailView";
import { useBill } from "../../../../hooks/useBill";
import Cookies from "js-cookie";

const UpdateBill: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const token = Cookies.get("authToken") || "";
  const { useBillById } = useBill(token);

  const billId = parseInt(id || "0");

  const { data: bill, isLoading } = useBillById(billId);

  const handleCancel = () => {
    navigate("/manager/bills");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải thông tin hóa đơn..." />
      </div>
    );
  }

  if (!bill) {
    message.error("Không tìm thấy hóa đơn!");
    navigate("/manager/bills");
    return null;
  }

  return (
    <div className="update-bill-container p-6">
      <Card
        title={
          <div className="flex items-center gap-3">
            <ArrowLeft
              className="w-5 h-5 cursor-pointer hover:text-blue-600"
              onClick={handleCancel}
            />
            <Receipt className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">Chi tiết hóa đơn</span>
          </div>
        }
        className="shadow-lg"
      >
        <BillDetailView bill={bill} />
      </Card>
    </div>
  );
};

export default UpdateBill;