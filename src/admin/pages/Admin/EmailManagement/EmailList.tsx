// import React, { useState } from "react";
// import { Button, message } from "antd";
// import { Plus, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const EmailList: React.FC = () => {
//   const navigate = useNavigate();

//   const handleSendEmail = () => {
//     navigate("/admin/emails/send");
//   };

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <Mail className="w-7 h-7 text-blue-600" />
//           <h2 className="text-2xl font-bold text-gray-900">Quản lý Email</h2>
//         </div>
//         <Button
//           type="primary"
//           icon={<Plus className="w-4 h-4" />}
//           onClick={handleSendEmail}
//           size="large"
//         >
//           Gửi Email
//         </Button>
//       </div>

//       {/* Content */}
//       <div className="text-center py-12">
//         <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử gửi email</h3>
//         <p className="text-gray-500 mb-6">Bấm nút "Gửi Email" để gửi email mới.</p>
//         <Button type="primary" onClick={handleSendEmail}>
//           Gửi Email Ngay
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default EmailList;



import React, { useState } from "react";
import { Button, message, Table, Spin, Tag } from "antd";
import { Plus, Mail, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEmail } from "../../../../hooks/useEmail";
import type { EmailHistoryDTO } from "../../../../service/emailService";

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { useEmailHistory } = useEmail(token);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const { data: historyData, isLoading, error } = useEmailHistory(page, size);

  const handleSendEmail = () => {
    navigate("/admin/emails/send");
  };

  const handleViewEmail = (record: EmailHistoryDTO) => {
    navigate(`/admin/emails/view/${record.id}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Kiểu Gửi',
      dataIndex: 'sendType',
      key: 'sendType',
    },
    {
      title: 'Thời Gian Gửi',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'SUCCESS' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: EmailHistoryDTO) => (
        <Button
          type="link"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewEmail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-500">Không thể tải lịch sử email. Vui lòng thử lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Email</h2>
        </div>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleSendEmail}
          size="large"
        >
          Gửi Email
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : historyData && historyData.content.length > 0 ? (
        <Table
          columns={columns}
          dataSource={historyData.content}
          rowKey="id"
          pagination={{
            current: page + 1,
            pageSize: size,
            total: historyData.totalElements,
            onChange: (pageNum) => setPage(pageNum - 1),
          }}
        />
      ) : (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử gửi email</h3>
          <p className="text-gray-500 mb-6">Bấm nút "Gửi Email" để gửi email mới.</p>
          <Button type="primary" onClick={handleSendEmail}>
            Gửi Email Ngay
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailList;