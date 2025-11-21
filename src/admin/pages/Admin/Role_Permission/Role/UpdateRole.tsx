import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useRole } from '../../../../../hooks/useRoles';
import Cookies from 'js-cookie';
import type { RoleDTO, RoleRequest } from '../../../../../service/roleService';

interface UpdateRoleProps {
  open: boolean;
  onClose: () => void;
  role: RoleDTO | null;
  onSuccess: () => void;
}

const UpdateRole: React.FC<UpdateRoleProps> = ({
  open,
  onClose,
  role,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const token = Cookies.get('authToken') || '';
  const { useUpdateRole } = useRole(token);
  const updateMutation = useUpdateRole();

  useEffect(() => {
    if (role && open) {
      form.setFieldsValue({
        roleName: role.roleName,
        description: role.description || '',
      });
    }
  }, [role, open, form]);

  const handleSubmit = async (values: RoleRequest) => {
    if (!role) return;

    try {
      await updateMutation.mutateAsync({
        id: role.roleID,
        data: values,
      });
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Update role error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const isSystemRole = role && ['USER', 'ADMIN', 'MANAGER'].includes(role.roleName);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Cập nhật vai trò</span>
        </div>
      }
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={updateMutation.isPending}
      okText="Cập nhật"
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
            disabled={isSystemRole ?? false}
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

        {isSystemRole && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
            ⚠️ Đây là vai trò hệ thống, không thể thay đổi tên vai trò.
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateRole;