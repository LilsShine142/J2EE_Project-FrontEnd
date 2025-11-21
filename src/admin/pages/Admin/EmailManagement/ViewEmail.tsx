import React from "react";
import { Card, message, Spin } from "antd";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Giả định có API lấy chi tiết email, nhưng backend không có, nên placeholder
const ViewEmail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleCancel = () => {
    navigate("/admin/emails");
  };

  // Placeholder, vì không có API
  return (
    <div className="update-bill-container p-6">
      <Card
        title={
          <div className="flex items-center gap-3">
            <ArrowLeft
              className="w-5 h-5 cursor-pointer hover:text-blue-600"
              onClick={handleCancel}
            />
            <Mail className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold">Chi tiết Email</span>
          </div>
        }
        className="shadow-lg"
      >
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông tin chi tiết</h3>
          <p className="text-gray-500">Backend chưa hỗ trợ API lấy chi tiết email.</p>
        </div>
      </Card>
    </div>
  );
};

export default ViewEmail;