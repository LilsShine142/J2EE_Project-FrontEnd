import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, Modal, Input, Spin, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, KeyOutlined } from '@ant-design/icons';
import { usePermission } from '../../../../../hooks/usePermissions';
import Cookies from 'js-cookie';
import type { PermissionDTO } from '../../../../../service/permissionService';
import AddPermission from './AddPermission';
import UpdatePermission from './UpdatePermission';
import ActionButtons from '../../../../components/PermissionButton/ActionButtons';
import { useCurrentUser } from '../../../../../hooks/useUserHooks';
import AddButton from '../../../../components/PermissionButton/AddButton';

const PermissionList: React.FC = () => {
  const { data: user } = useCurrentUser();
  const token = Cookies.get("authToken") || "";
  const { getMyPermissions } = usePermission(token);

  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const { usePermissions, useDeletePermission } = usePermission(token);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionDTO | null>(null);

  const { data, isLoading, isFetching, refetch } = usePermissions(
    currentPage,
    pageSize,
    search
  );

  const deleteMutation = useDeletePermission();

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleEdit = (permission: PermissionDTO) => {
    setSelectedPermission(permission);
    setShowEditModal(true);
  };

  const handleDelete = (permission: PermissionDTO) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa quyền "${permission.permissionName}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(permission.permissionID),
    });
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1);
    setPageSize(size);
  };

    useEffect(() => {
      if (user && user.roleId && (user.roleId === 2 || user.roleId === 3)) {
        getMyPermissions(token)
          .then((perms) => {
            const codes = perms.map((p: any) => p.permissionName).filter(Boolean);
            setMyPermissions(codes);
          })
          .catch((err) => {
            console.error("Lỗi lấy permission:", err);
            setMyPermissions([]);
          });
      } else {
        setMyPermissions([]);
      }
      console.log("My Permissions:", myPermissions);
    }, [token, user]);
  
    const hasPermission = (code: string) => myPermissions.includes(code);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'permissionID',
      key: 'permissionID',
      width: 80,
      render: (id: number) => (
        <span className="font-mono text-sm font-semibold text-blue-600">#{id}</span>
      ),
    },
    {
      title: 'Tên quyền',
      dataIndex: 'permissionName',
      key: 'permissionName',
      render: (name: string) => (
        <Tag color="cyan" className="font-medium">
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
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (record: PermissionDTO) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!hasPermission("UPDATE_PERMISSION")}
            className={
              hasPermission("UPDATE_PERMISSION")
                ? ""
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            loading={deleteMutation.isPending}
            disabled={!hasPermission("DELETE_PERMISSION")}
            className={
              hasPermission("DELETE_PERMISSION")
                ? ""
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }
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
          <KeyOutlined className="text-3xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý quyền</h2>
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
          <AddButton
            // type="primary"
            onClick={() => setShowAddModal(true)}
            // size="large"
            disabled={!hasPermission("ADD_PERMISSION")}
          >
            Thêm quyền
          </AddButton>
        </Space>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên quyền..."
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
            rowKey="permissionID"
            loading={{
              spinning: isFetching,
              tip: 'Đang tải dữ liệu...',
            }}
            locale={{
              emptyText: isFetching ? ' ' : (
                <Empty
                  description="Không có quyền nào"
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
                  Hiển thị {range[0]}-{range[1]} trong tổng số {total} quyền
                </span>
              ),
              onChange: handlePageChange,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
          />
        </div>
      )}

      {/* Modals */}
      <AddPermission
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      <UpdatePermission
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPermission(null);
        }}
        permission={selectedPermission}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedPermission(null);
          refetch();
        }}
      />
    </div>
  );
};

export default PermissionList;