import React, { useState, useEffect } from 'react';
import { Modal, Transfer, Spin, Alert, Select, Form } from 'antd';
import { usePermission } from '../../../../../hooks/usePermissions';
import { useRolePermission } from '../../../../../hooks/useRolePermissions';
import { useRole } from '../../../../../hooks/useRoles';
import Cookies from 'js-cookie';
import type { PermissionDTO } from '../../../../../service/permissionService';

interface BatchRolePermissionAssignmentProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BatchRolePermissionAssignment: React.FC<BatchRolePermissionAssignmentProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const token = Cookies.get('authToken') || '';
  const { usePermissions } = usePermission(token);
  const { usePermissionsByRoleId, useBatchAssignPermissions, useBatchRemovePermissions } = useRolePermission(token);
  const { useRoles } = useRole(token);

  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();
  const [targetKeys, setTargetKeys] = useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const currentUserId = 1; // TODO: Get from auth context

  // Get all roles and permissions
  const { data: rolesData } = useRoles(0, 100);
  const { data: permissionsData, isLoading: loadingPermissions } = usePermissions(0, 1000);

  // Get current role permissions
  const { data: rolePermissions, isLoading: loadingRolePermissions } = usePermissionsByRoleId(
    selectedRoleId || 0
  );

  const assignMutation = useBatchAssignPermissions();
  const removeMutation = useBatchRemovePermissions();

  useEffect(() => {
    if (rolePermissions) {
      const permissionIds = rolePermissions.map((rp) => rp.permissionId);
      setTargetKeys(permissionIds);
    }
  }, [rolePermissions]);

  const handleChange = (newTargetKeys: React.Key[]) => {
    setTargetKeys(newTargetKeys.map(key => Number(key)));
  };

  const handleSelectChange = (sourceSelectedKeys: React.Key[], targetSelectedKeys: React.Key[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys].map(key => Number(key)));
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleId(roleId);
    setTargetKeys([]);
    setSelectedKeys([]);
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;

    try {
      const currentPermissionIds = rolePermissions?.map((rp) => rp.permissionId) || [];
      const toAdd = targetKeys.filter((id) => !currentPermissionIds.includes(id));
      const toRemove = currentPermissionIds.filter((id) => !targetKeys.includes(id));

      const promises = [];

      if (toAdd.length > 0) {
        promises.push(
          assignMutation.mutateAsync({
            roleId: selectedRoleId,
            permissionIds: toAdd,
            grantedByUserId: currentUserId,
          })
        );
      }

      if (toRemove.length > 0) {
        promises.push(
          removeMutation.mutateAsync({
            roleId: selectedRoleId,
            permissionIds: toRemove,
          })
        );
      }

      await Promise.all(promises);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Save permissions error:', error);
    }
  };

  const handleClose = () => {
    setSelectedRoleId(undefined);
    setTargetKeys([]);
    setSelectedKeys([]);
    form.resetFields();
    onClose();
  };

  const dataSource = permissionsData?.content.map((permission: PermissionDTO) => ({
    key: permission.permissionID,
    title: permission.permissionName,
    description: permission.description || '',
  })) || [];

  const isLoading = loadingPermissions || (selectedRoleId && loadingRolePermissions);
  const isSaving = assignMutation.isPending || removeMutation.isPending;

  return (
    <Modal
      title="Gán quyền hàng loạt"
      open={open}
      onOk={handleSave}
      onCancel={handleClose}
      confirmLoading={isSaving}
      okText="Lưu"
      cancelText="Hủy"
      width={900}
      okButtonProps={{ disabled: !selectedRoleId }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Chọn vai trò"
          required
        >
          <Select
            placeholder="Chọn vai trò để phân quyền"
            size="large"
            onChange={handleRoleChange}
            value={selectedRoleId}
            showSearch
            optionFilterProp="children"
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
      </Form>

      {!selectedRoleId ? (
        <Alert
          message="Vui lòng chọn vai trò"
          description="Chọn một vai trò để bắt đầu phân quyền."
          type="info"
          showIcon
        />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <>
          <Alert
            message="Hướng dẫn"
            description="Di chuyển các quyền từ bên trái sang bên phải để gán quyền cho vai trò này."
            type="info"
            showIcon
            className="mb-4"
          />
          <Transfer
            dataSource={dataSource}
            titles={['Quyền chưa gán', 'Quyền đã gán']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            render={(item) => (
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            )}
            listStyle={{
              width: 400,
              height: 400,
            }}
            showSearch
            filterOption={(inputValue, item) =>
              item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
              item.description.toLowerCase().includes(inputValue.toLowerCase())
            }
            locale={{
              itemUnit: 'quyền',
              itemsUnit: 'quyền',
              searchPlaceholder: 'Tìm kiếm quyền...',
              notFoundContent: 'Không tìm thấy',
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default BatchRolePermissionAssignment;