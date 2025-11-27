import React, { useState, useEffect } from "react";
import { Button, Space, message, Table, Spin, Tag, Input, Select, DatePicker, InputNumber } from "antd";
import { Plus, Mail, Eye, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEmail } from "../../../../hooks/useEmail";
import type { EmailHistoryDTO } from "../../../../service/emailService";
import dayjs from 'dayjs';
import ViewEmail from "./ViewEmail";
import { usePermission } from "../../../../hooks/usePermissions";
import { useCurrentUser } from "../../../../hooks/useUserHooks";

const { Option } = Select;
const { RangePicker } = DatePicker;

const EmailList: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  const { data: user } = useCurrentUser();
  const { getMyPermissions } = usePermission(token);
  const { useEmailHistory } = useEmail(token);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<{
    userId?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
  }>({});
  const [selectedEmail, setSelectedEmail] = useState<EmailHistoryDTO | null>(null);
  const [myPermissions, setMyPermissions] = useState<string[]>([]);

  const offset = (currentPage - 1) * pageSize;

  const { data: historyData, isLoading, error, refetch } = useEmailHistory(
    offset,
    pageSize,
    filters.userId,
    filters.startDate,
    filters.endDate,
    filters.type,
    !!token
  );

  const emailsData = historyData?.content ?? [];
  const fetchedTotalItems = historyData?.totalElements ?? 0;
  const fetchedTotalPages = historyData?.totalPages ?? 1;

  useEffect(() => {
    setTotalItems(fetchedTotalItems);
    setTotalPages(fetchedTotalPages);
  }, [fetchedTotalItems, fetchedTotalPages]);

  const handleSendEmail = () => {
    navigate("/admin/emails/send");
  };

  const handleViewEmail = (record: EmailHistoryDTO) => {
    setSelectedEmail(record);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilters((prev) => ({
        ...prev,
        startDate: dates[0].format('YYYY-MM-DDTHH:mm:ss'),
        endDate: dates[1].format('YYYY-MM-DDTHH:mm:ss'),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setFilters({});
    setCurrentPage(1);
    refetch();
    message.success("Đã làm mới danh sách!");
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
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
  }, [token, user]);

  const hasPermission = (code: string) => myPermissions.includes(code);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tiêu Đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Kiểu Gửi',
      dataIndex: 'sendType',
      key: 'sendType',
    },
    {
      title: 'Thời Gian Gửi',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'SUCCESS' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: EmailHistoryDTO) => (
        <Button
          type="link"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewEmail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-500 mb-6">Không thể tải lịch sử email. Vui lòng thử lại.</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Email</h2>
        </div>
        <Space>
          <Button
            // type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleSendEmail}
            size="large"
            disabled={!hasPermission("SEND_EMAIL")}
            className={
              hasPermission("SEND_EMAIL")
                ? "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }
          >
            Gửi Email
          </Button>
          <Button
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefresh}
            size="large"
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <InputNumber
          placeholder="User ID"
          value={filters.userId}
          onChange={(value) => handleFilterChange('userId', value)}
          style={{ width: 120 }}
        />
        <RangePicker
          value={filters.startDate && filters.endDate ? [dayjs(filters.startDate), dayjs(filters.endDate)] : null}
          onChange={handleDateRangeChange}
          format="YYYY-MM-DD"
        />
        <Select
          placeholder="Kiểu gửi"
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="USER">User</Option>
          <Option value="LIST">List</Option>
          <Option value="ROLE">Role</Option>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : emailsData.length > 0 ? (
        <Table
          columns={columns}
          dataSource={emailsData}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: handlePageChange,
            showTotal: (total, range) => (
              <span className="text-sm text-gray-600">
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} email
              </span>
            ),
            position: ["bottomRight"],
          }}
          size="middle"
          className="email-table"
        />
      ) : (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử gửi email</h3>
          <p className="text-gray-500 mb-6">Bấm nút "Gửi Email" để gửi email mới.</p>
          <Button type="primary" onClick={handleSendEmail}>
            Gửi Email Ngay
          </Button>
        </div>
      )}

      {/* Detail View Overlay */}
      {selectedEmail && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-200 ease-out animate-in fade-in"
            onClick={() => setSelectedEmail(null)}
          />
          
          {/* Content Container */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-4xl max-h-[90vh] pointer-events-auto transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ViewEmail email={selectedEmail} onClose={() => setSelectedEmail(null)} />
            </div>
          </div>
        </>
      )}

      <style>{`
        /* Container của pagination */
        .email-table .ant-pagination {
          display: flex;
          justify-content: space-between !important;
          align-items: center;
          padding: 20px 24px !important;
          margin: 0 !important;
        }

        /* Đẩy dòng chữ "Hiển thị..." về bên trái */
        .email-table .ant-pagination-total-text {
          margin-right: auto !important;
          float: none !important;
        }

        /* Các nút phân trang + select page size vẫn ở bên phải */
        .email-table .ant-pagination-options,
        .email-table .ant-pagination-prev,
        .email-table .ant-pagination-next,
        .email-table .ant-pagination-item,
        .email-table .ant-select-selector {
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default EmailList;