import React from 'react';
import { Modal, Form, Input } from 'antd';
import { usePermission } from '../../../../../hooks/usePermissions';
import Cookies from 'js-cookie';
import type { PermissionRequest } from '../../../../../service/permissionService';

interface AddPermissionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPermission: React.FC<AddPermissionProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const token = Cookies.get('authToken') || '';
  const { useCreatePermission } = usePermission(token);
  const createMutation = useCreatePermission();

  const handleSubmit = async (values: PermissionRequest) => {
    try {
      await createMutation.mutateAsync(values);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Create permission error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Thêm quyền mới</span>
        </div>
      }
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={createMutation.isPending}
      okText="Thêm"
      cancelText="Hủy"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="permissionName"
          label="Tên quyền"
          rules={[
            { required: true, message: 'Vui lòng nhập tên quyền!' },
            { min: 3, message: 'Tên quyền phải có ít nhất 3 ký tự!' },
            { max: 100, message: 'Tên quyền không được quá 100 ký tự!' },
          ]}
        >
          <Input
            placeholder="Ví dụ: view_reports, manage_users..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { max: 500, message: 'Mô tả không được quá 500 ký tự!' },
          ]}
        >
          <Input.TextArea
            placeholder="Mô tả chi tiết về quyền này..."
            rows={4}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPermission;