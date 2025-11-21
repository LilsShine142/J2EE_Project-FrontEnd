import React, { useState } from 'react';
import { Button, Space, Table, Tag, Modal, Input, Spin, Empty, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined, LinkOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useRolePermission } from '../../../../../hooks/useRolePermissions';
import { useRole } from '../../../../../hooks/useRoles';
import { usePermission } from '../../../../../hooks/usePermissions';
import Cookies from 'js-cookie';
import type { RolePermissionDTO } from '../../../../../service/rolePermissionService';
import AddRolePermission from './AddRolePermission';
import BatchRolePermissionAssignment from './BatchRolePermissionAssignment';
import dayjs from 'dayjs';

const RolePermissionList: React.FC = () => {
  const token = Cookies.get('authToken') || '';
  const { useRolePermissions, useDeleteRolePermission } = useRolePermission(token);
  const { useRoles } = useRole(token);
  const { usePermissions } = usePermission(token);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [filterRoleId, setFilterRoleId] = useState<number | undefined>();
  const [filterPermissionId, setFilterPermissionId] = useState<number | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const { data, isLoading, isFetching, refetch } = useRolePermissions(
    currentPage,
    pageSize,
    search
  );

  // Get roles and permissions for filter
  const { data: rolesData } = useRoles(0, 100);
  const { data: permissionsData } = usePermissions(0, 100);

  const deleteMutation = useDeleteRolePermission();

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleDelete = (record: RolePermissionDTO) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa quyền "${record.permissionName}" khỏi vai trò "${record.roleName}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => deleteMutation.mutate({ 
        roleId: record.roleId, 
        permissionId: record.permissionId 
      }),
    });
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

  const handleResetFilter = () => {
    setFilterRoleId(undefined);
    setFilterPermissionId(undefined);
    setSearch('');
    setCurrentPage(0);
  };

  // Filter data locally
  const filteredData = React.useMemo(() => {
    let result = data?.content || [];
    
    if (filterRoleId) {
      result = result.filter(item => item.roleId === filterRoleId);
    }
    
    if (filterPermissionId) {
      result = result.filter(item => item.permissionId === filterPermissionId);
    }
    
    return result;
  }, [data?.content, filterRoleId, filterPermissionId]);

  const columns = [
    {
      title: 'Vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 150,
      render: (name: string) => (
        <Tag color="blue" className="font-medium text-sm px-3 py-1">
          {name}
        </Tag>
      ),
    },
    {
      title: 'Quyền',
      dataIndex: 'permissionName',
      key: 'permissionName',
      width: 200,
      render: (name: string) => (
        <Tag color="cyan" className="font-medium">
          {name}
        </Tag>
      ),
    },
    {
      title: 'Ngày gán',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => (
        <span className="text-sm text-gray-600">
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => (
        <span className="text-sm text-gray-600">
          {dayjs(date).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: RolePermissionDTO) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
          loading={deleteMutation.isPending}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const isFirstLoading = isLoading && !data;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LinkOutlined className="text-3xl text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý phân quyền</h2>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
            size="large"
          >
            Làm mới
          </Button>
          <Button
            icon={<AppstoreAddOutlined />}
            onClick={() => setShowBatchModal(true)}
            size="large"
            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
          >
            Gán hàng loạt
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            size="large"
          >
            Gán quyền
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input.Search
          placeholder="Tìm kiếm..."
          onSearch={handleSearch}
          onChange={(e) => !e.target.value && handleSearch('')}
          allowClear
          size="large"
        />
        
        <Select
          placeholder="Lọc theo vai trò"
          value={filterRoleId}
          onChange={setFilterRoleId}
          allowClear
          size="large"
          className="w-full"
          showSearch
          optionFilterProp="children"
        >
          {rolesData?.content.map(role => (
            <Select.Option key={role.roleID} value={role.roleID}>
              {role.roleName}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo quyền"
          value={filterPermissionId}
          onChange={setFilterPermissionId}
          allowClear
          size="large"
          className="w-full"
          showSearch
          optionFilterProp="children"
        >
          {permissionsData?.content.map(permission => (
            <Select.Option key={permission.permissionID} value={permission.permissionID}>
              {permission.permissionName}
            </Select.Option>
          ))}
        </Select>
      </div>

      {(filterRoleId || filterPermissionId) && (
        <div className="mb-4">
          <Button 
            onClick={handleResetFilter}
            size="small"
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Table */}
      {isFirstLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey={(record) => `${record.roleId}-${record.permissionId}`}
            loading={{
              spinning: isFetching,
              tip: 'Đang tải dữ liệu...',
            }}
            locale={{
              emptyText: isFetching ? ' ' : (
                <Empty
                  description="Không có phân quyền nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={{
              current: currentPage + 1,
              pageSize: pageSize,
              total: filteredData.length,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <span className="text-sm text-gray-600">
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} phân quyền
                </span>
              ),
              onChange: handlePageChange,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: 900 }}
          />
        </div>
      )}

      {/* Add Single Modal */}
      <AddRolePermission
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      {/* Batch Assignment Modal */}
      <BatchRolePermissionAssignment
        open={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onSuccess={() => {
          setShowBatchModal(false);
          refetch();
        }}
      />
    </div>
  );
};

export default RolePermissionList;