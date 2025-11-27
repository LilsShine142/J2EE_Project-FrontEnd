import React from "react";
import { Card, Descriptions, Tag } from "antd";
import { ArrowLeft, Mail } from "lucide-react";
import type { EmailHistoryDTO } from "../../../../service/emailService";

interface Column {
  label: string;
  key: keyof EmailHistoryDTO;
  span?: number;
  render?: (value: any) => React.ReactNode;
}

interface ViewEmailProps {
  email: EmailHistoryDTO;
  onClose: () => void;
}

const ViewEmail: React.FC<ViewEmailProps> = ({ email, onClose }) => {
  const columns: Column[] = [
    { label: 'ID', key: 'id' },
    { label: 'User ID', key: 'userId' },
    { label: 'Email', key: 'email' },
    { label: 'Tiêu Đề', key: 'title' },
    { label: 'Kiểu Gửi', key: 'sendType' },
    { label: 'Thời Gian Gửi', key: 'sentAt', render: (value) => new Date(value).toLocaleString() },
    { label: 'Trạng Thái', key: 'status', render: (value) => <Tag color={value === 'SUCCESS' || value === 'SEND' ? 'green' : 'red'}>{value}</Tag> },
    { label: 'Nội Dung', key: 'content', span: 2, render: (value) => <div style={{ whiteSpace: 'pre-wrap' }}>{value}</div> },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="w-5 h-5 cursor-pointer hover:text-blue-600"
            onClick={onClose}
          />
          <Mail className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">Chi tiết Email - ID: {email.id}</span>
        </div>
      }
      className="shadow-lg"
    >
      <Descriptions bordered column={2}>
        {columns.map((col) => (
          <Descriptions.Item key={col.key} label={col.label} span={col.span || 1}>
            {col.render ? col.render(email[col.key]) : email[col.key]}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};

export default ViewEmail;