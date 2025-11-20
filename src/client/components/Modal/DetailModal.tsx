import React from 'react';
import { Modal, Descriptions } from 'antd';

interface Field {
  label: string;
  value: any;
}

interface DetailModalProps {
  visible: boolean;
  title: string;
  fields: Field[];
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  title,
  fields,
  onCancel,
}) => {
  return (
    <Modal
      open={visible}
      title={title}
      footer={null}
      onCancel={onCancel}
      width={600}
    >
      <Descriptions bordered column={1} size="small">
        {fields.map((field, index) => (
          <Descriptions.Item key={index} label={field.label}>
            {field.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Modal>
  );
};

export default DetailModal;