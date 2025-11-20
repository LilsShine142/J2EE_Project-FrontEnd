import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useRole } from '../../../../../hooks/useRoles';
import Cookies from 'js-cookie';
import type { RoleRequest } from '../../../../../service/roleService';

interface AddRoleProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddRole: React.FC<AddRoleProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const token = Cookies.get('authToken') || '';
  const { useCreateRole } = useRole(token);
  const createMutation = useCreateRole();

  const handleSubmit = async (values: RoleRequest) => {
    try {
      await createMutation.mutateAsync(values);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Create role error:', error);
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
          <span className="text-lg font-semibold">Thêm vai trò mới</span>
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
          name="roleName"
          label="Tên vai trò"
          rules={[
            { required: true, message: 'Vui lòng nhập tên vai trò!' },
            { min: 2, message: 'Tên vai trò phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Tên vai trò không được quá 50 ký tự!' },
            {
              pattern: /^[A-Z_]+$/,
              message: 'Tên vai trò chỉ được chứa chữ in hoa và dấu gạch dưới!',
            },
          ]}
          tooltip="Tên vai trò nên viết hoa và dùng dấu gạch dưới, ví dụ: STAFF, MANAGER"
        >
          <Input
            placeholder="Ví dụ: STAFF, MANAGER, CHEF..."
            size="large"
            style={{ textTransform: 'uppercase' }}
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
            placeholder="Mô tả chi tiết về vai trò này..."
            rows={4}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRole;