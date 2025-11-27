import React from "react";
import { Card, Descriptions, Tag } from "antd";
import { ArrowLeft, FileText } from "lucide-react";
import type { LogDTO } from "../../../../service/logService";

interface Column {
  label: string;
  key: keyof LogDTO;
  span?: number;
  render?: (value: any) => React.ReactNode;
}

interface LogViewProps {
  log: LogDTO;
  onClose: () => void;
}

const LogView: React.FC<LogViewProps> = ({ log, onClose }) => {
  const columns: Column[] = [
    { label: 'Log ID', key: 'logID' },
    { label: 'Bảng', key: 'tableName' },
    { label: 'Record ID', key: 'recordID' },
    { label: 'Hành Động', key: 'action', render: (value) => <Tag color={value === 'SEND' || value === 'CREATE' ? 'green' : value === 'ERROR' ? 'red' : 'blue'}>{value}</Tag> },
    { label: 'Thời Gian', key: 'changeTime', render: (value) => new Date(value).toLocaleString() },
    { label: 'User ID', key: 'userID' },
    { label: 'User Name', key: 'userName' },
    { label: 'Chi Tiết', key: 'changeDetails', span: 2, render: (value) => <div style={{ whiteSpace: 'pre-wrap' }}>{value}</div> },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="w-5 h-5 cursor-pointer hover:text-blue-600"
            onClick={onClose}
          />
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">Chi tiết Log - ID: {log.logID}</span>
        </div>
      }
      className="shadow-lg"
    >
      <Descriptions bordered column={2}>
        {columns.map((col) => (
          <Descriptions.Item key={col.key} label={col.label} span={col.span || 1}>
            {col.render ? col.render(log[col.key]) : log[col.key]}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};

export default LogView;