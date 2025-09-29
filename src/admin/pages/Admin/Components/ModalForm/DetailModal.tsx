import React from 'react';
import { Modal } from 'antd';

interface DetailColumn {
  label: string;
  key: string;
  render?: (value: any, data: any) => React.ReactNode;
}

interface DetailModalProps<T> {
  show: boolean;
  onClose: () => void;
  title: string;
  data: T | null;
  columns: DetailColumn[];
  width?: number | string;
}

const DetailModal = <T extends object>({ 
  show, 
  onClose, 
  title, 
  data, 
  columns,
  width = 520 
}: DetailModalProps<T>) => {
  if (!data) return null;

  return (
    <Modal
      title={title}
      visible={show}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Đóng
        </button>
      ]}
      width={width}
    >
      <div className="space-y-3">
        {columns.map((col) => {
          const value = data[col.key as keyof T];
          return (
            <div key={col.key}>
              <strong>{col.label}:</strong> {col.render ? col.render(value, data) : String(value)}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default DetailModal;