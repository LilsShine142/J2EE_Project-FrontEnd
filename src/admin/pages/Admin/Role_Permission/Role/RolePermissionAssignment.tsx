import React, { useState, useEffect, type Key } from 'react';
import { Modal, Transfer, Spin, Alert, type TransferProps } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { usePermission } from '../../../../../hooks/usePermissions';
import { useRolePermission } from '../../../../../hooks/useRolePermissions';
import Cookies from 'js-cookie';
import type { RoleDTO } from '../../../../../service/roleService';
import type { PermissionDTO } from '../../../../../service/permissionService';

interface RolePermissionAssignmentProps {
  open: boolean;
  onClose: () => void;
  role: RoleDTO | null;
  currentUserId: number;
}

const RolePermissionAssignment: React.FC<RolePermissionAssignmentProps> = ({
  open,
  onClose,
  role,
  currentUserId,
}) => {
  const token = Cookies.get('authToken') || '';
  const { usePermissions } = usePermission(token);
  const { usePermissionsByRoleId, useBatchAssignPermissions, useBatchRemovePermissions } = useRolePermission(token);

  const [targetKeys, setTargetKeys] = useState<number[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  // Get all permissions
  const { data: permissionsData, isLoading: loadingPermissions } = usePermissions(
    0,
    1000,
    undefined,
    { enabled: open }
  );

  // Get current role permissions
  const { data: rolePermissions, isLoading: loadingRolePermissions } = usePermissionsByRoleId(
    role?.roleID || 0
  );

  const assignMutation = useBatchAssignPermissions();
  const removeMutation = useBatchRemovePermissions();

  useEffect(() => {
    if (rolePermissions) {
      const permissionIds = rolePermissions.map((rp) => rp.permissionId);
      setTargetKeys(permissionIds);
    }
  }, [rolePermissions]);
    
    const handleChange = (
        newTargetKeys: Key[],
        direction: TransferDirection,
        moveKeys: Key[]
    ) => {
        setTargetKeys(newTargetKeys as number[]);
    };

    const handleSelectChange = (
        sourceSelectedKeys: Key[],
        targetSelectedKeys: Key[]
    ) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as number[]);
    };

  const handleSave = async () => {
    if (!role) return;

    try {
      const currentPermissionIds = rolePermissions?.map((rp) => rp.permissionId) || [];
      const toAdd = targetKeys.filter((id) => !currentPermissionIds.includes(id));
      const toRemove = currentPermissionIds.filter((id) => !targetKeys.includes(id));

      const promises = [];

      if (toAdd.length > 0) {
        promises.push(
          assignMutation.mutateAsync({
            roleId: role.roleID,
            permissionIds: toAdd,
            grantedByUserId: currentUserId,
          })
        );
      }

      if (toRemove.length > 0) {
        promises.push(
          removeMutation.mutateAsync({
            roleId: role.roleID,
            permissionIds: toRemove,
          })
        );
      }

      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error('Save permissions error:', error);
    }
  };

  const dataSource = permissionsData?.content.map((permission: PermissionDTO) => ({
    key: permission.permissionID,
    title: permission.permissionName,
    description: permission.description || '',
  })) || [];

  const isLoading = loadingPermissions || loadingRolePermissions;
  const isSaving = assignMutation.isPending || removeMutation.isPending;

  return (
    <Modal
      title={`Phân quyền cho vai trò: ${role?.roleName || ''}`}
      open={open}
      onOk={handleSave}
      onCancel={onClose}
      confirmLoading={isSaving}
      okText="Lưu"
      cancelText="Hủy"
      width={800}
    >
      {isLoading ? (
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
              width: 350,
              height: 400,
            }}
            showSearch
            filterOption={(inputValue, item) =>
              item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
              item.description.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </>
      )}
    </Modal>
  );
};

export default RolePermissionAssignment;