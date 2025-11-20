import React, { useState } from 'react';
import { Modal, Form, Select, Alert } from 'antd';
import { useRolePermission } from '../../../../../hooks/useRolePermissions';
import { useRole } from '../../../../../hooks/useRoles';
import { usePermission } from '../../../../../hooks/usePermissions';
import Cookies from 'js-cookie';
import type { RolePermissionRequest } from '../../../../../service/rolePermissionService';

interface AddRolePermissionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddRolePermission: React.FC<AddRolePermissionProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const token = Cookies.get('authToken') || '';
  const { useCreateRolePermission, usePermissionsByRoleId } = useRolePermission(token);
  const { useRoles } = useRole(token);
  const { usePermissions } = usePermission(token);
  
  const createMutation = useCreateRolePermission();
  const currentUserId = 1; // TODO: Get from auth context

  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();

  // Get all roles and permissions
  const { data: rolesData, isLoading: loadingRoles } = useRoles(0, 100);
  const { data: permissionsData, isLoading: loadingPermissions } = usePermissions(0, 100);
  
  // Get permissions already assigned to selected role
  const { data: assignedPermissions } = usePermissionsByRoleId(selectedRoleId || 0);

  const assignedPermissionIds = assignedPermissions?.map(rp => rp.permissionId) || [];

  const handleSubmit = async (values: { roleId: number; permissionId: number }) => {
    try {
      const data: RolePermissionRequest = {
        roleId: values.roleId,
        permissionId: values.permissionId,
        grantedByUserId: currentUserId,
      };
      
      await createMutation.mutateAsync(data);
      form.resetFields();
      setSelectedRoleId(undefined);
      onSuccess();
    } catch (error) {
      console.error('Create role-permission error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRoleId(undefined);
    onClose();
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleId(roleId);
    form.setFieldValue('permissionId', undefined);
  };

  // Filter out already assigned permissions
  const availablePermissions = permissionsData?.content.filter(
    permission => !assignedPermissionIds.includes(permission.permissionID)
  ) || [];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Gán quyền cho vai trò</span>
        </div>
      }
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={createMutation.isPending}
      okText="Gán quyền"
      cancelText="Hủy"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Alert
          message="Lưu ý"
          description="Chọn vai trò trước, sau đó chọn quyền cần gán. Chỉ hiển thị các quyền chưa được gán cho vai trò đã chọn."
          type="info"
          showIcon
          className="mb-4"
        />

        <Form.Item
          name="roleId"
          label="Vai trò"
          rules={[
            { required: true, message: 'Vui lòng chọn vai trò!' },
          ]}
        >
          <Select
            placeholder="Chọn vai trò"
            size="large"
            loading={loadingRoles}
            onChange={handleRoleChange}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children || '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {rolesData?.content.map(role => (
              <Select.Option key={role.roleID} value={role.roleID}>
                {role.roleName}
                {role.description && (
                  <span className="text-gray-500 text-xs ml-2">
                    - {role.description}
                  </span>
                )}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="permissionId"
          label="Quyền"
          rules={[
            { required: true, message: 'Vui lòng chọn quyền!' },
          ]}
        >
          <Select
            placeholder={selectedRoleId ? "Chọn quyền" : "Vui lòng chọn vai trò trước"}
            size="large"
            loading={loadingPermissions}
            disabled={!selectedRoleId}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={
              selectedRoleId && availablePermissions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Tất cả quyền đã được gán cho vai trò này
                </div>
              ) : null
            }
          >
            {availablePermissions.map(permission => (
              <Select.Option 
                key={permission.permissionID} 
                value={permission.permissionID}
                label={permission.permissionName}
              >
                <div>
                  <div className="font-medium">{permission.permissionName}</div>
                  {permission.description && (
                    <div className="text-gray-500 text-xs">
                      {permission.description}
                    </div>
                  )}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedRoleId && assignedPermissions && assignedPermissions.length > 0 && (
          <Alert
            message={`Vai trò này đã có ${assignedPermissions.length} quyền`}
            description={
              <div className="mt-2">
                <div className="font-medium mb-1">Các quyền đã gán:</div>
                <div className="flex flex-wrap gap-1">
                  {assignedPermissions.map(rp => (
                    <span 
                      key={rp.permissionId}
                      className="inline-block bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded"
                    >
                      {rp.permissionName}
                    </span>
                  ))}
                </div>
              </div>
            }
            type="info"
            className="mt-4"
          />
        )}
      </Form>
    </Modal>
  );
};

export default AddRolePermission;