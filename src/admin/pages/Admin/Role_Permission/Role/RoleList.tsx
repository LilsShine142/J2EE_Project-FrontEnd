import React, { useState } from 'react';
import { Button, Space, Table, Tag, Modal, Input, Spin, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, TeamOutlined, KeyOutlined } from '@ant-design/icons';
import { useRole } from '../../../../../hooks/useRoles';
import Cookies from 'js-cookie';
import type { RoleDTO } from '../../../../../service/roleService';
import AddRole from './AddRole';
import UpdateRole from './UpdateRole';
import RolePermissionAssignment from './RolePermissionAssignment';
import dayjs from 'dayjs';

const RoleList: React.FC = () => {
  const token = Cookies.get('authToken') || '';
  const { useRoles, useDeleteRole } = useRole(token);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDTO | null>(null);

  // Get current user ID from cookie or context
  const currentUserId = 1; // TODO: Replace with actual user ID from auth context

  const { data, isLoading, isFetching, refetch } = useRoles(
    currentPage,
    pageSize,
    search
  );

  const deleteMutation = useDeleteRole();

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleEdit = (role: RoleDTO) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleManagePermissions = (role: RoleDTO) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  const handleDelete = (role: RoleDTO) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa vai trò "${role.roleName}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(role.roleID),
    });
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'roleID',
      key: 'roleID',
      width: 80,
      render: (id: number) => (
        <span className="font-mono text-sm font-semibold text-blue-600">#{id}</span>
      ),
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (name: string) => (
        <Tag color="blue" className="font-medium text-base px-3 py-1">
          {name}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => desc || <span className="text-gray-400 italic">Không có mô tả</span>,
    },
    {
      title: 'Ngày tạo',
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
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: RoleDTO) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleManagePermissions(record)}
            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
          >
            Phân quyền
          </Button>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            loading={deleteMutation.isPending}
            disabled={['USER', 'ADMIN', 'MANAGER'].includes(record.roleName)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const isFirstLoading = isLoading && !data;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TeamOutlined className="text-3xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý vai trò</h2>
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
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            size="large"
          >
            Thêm vai trò
          </Button>
        </Space>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên vai trò..."
          onSearch={handleSearch}
          onChange={(e) => !e.target.value && handleSearch('')}
          allowClear
          size="large"
          className="max-w-md"
        />
      </div>

      {/* Table */}
      {isFirstLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table
            dataSource={data?.content || []}
            columns={columns}
            rowKey="roleID"
            loading={{
              spinning: isFetching,
              tip: 'Đang tải dữ liệu...',
            }}
            locale={{
              emptyText: isFetching ? ' ' : (
                <Empty
                  description="Không có vai trò nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            pagination={{
              current: currentPage + 1,
              pageSize: pageSize,
              total: data?.totalElements || 0,
              showSizeChanger: true,
              showTotal: (total, range) => (
                <span className="text-sm text-gray-600">
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} vai trò
                </span>
              ),
              onChange: handlePageChange,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      )}

      {/* Modals */}
      <AddRole
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      <UpdateRole
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedRole(null);
          refetch();
        }}
      />

      <RolePermissionAssignment
        open={showPermissionModal}
        onClose={() => {
          setShowPermissionModal(false);
          setSelectedRole(null);
          refetch(); // Refresh to update permission count if needed
        }}
        role={selectedRole}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default RoleList;