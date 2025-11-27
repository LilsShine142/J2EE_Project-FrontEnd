import React, { useState, useEffect } from "react";
import { Button, Space, message, Table, Spin, Tag, Input } from "antd";
import { FileText, Eye, RefreshCw, Search } from "lucide-react";
import Cookies from "js-cookie";
import { useLog } from "../../../../hooks/useLogs";
import type { LogDTO } from "../../../../service/logService";
import LogView from "./LogView";

const { Search: AntSearch } = Input;

const LogList: React.FC = () => {
  const token = Cookies.get("authToken") || "";
  const { useLogs } = useLog(token);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<LogDTO | null>(null);

  const offset = (currentPage - 1) * pageSize;

  const { data: logsData, isLoading, error, refetch } = useLogs(
    offset,
    pageSize,
    search,
    !!token
  );

  const logs = logsData?.content ?? [];
  const fetchedTotalItems = logsData?.totalElements ?? 0;
  const fetchedTotalPages = logsData?.totalPages ?? 1;

  useEffect(() => {
    setTotalItems(fetchedTotalItems);
    setTotalPages(fetchedTotalPages);
  }, [fetchedTotalItems, fetchedTotalPages]);

  const handleViewLog = (record: LogDTO) => {
    setSelectedLog(record);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    refetch();
    message.success("Đã làm mới danh sách!");
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const columns = [
    {
      title: 'Log ID',
      dataIndex: 'logID',
      key: 'logID',
    },
    {
      title: 'Bảng',
      dataIndex: 'tableName',
      key: 'tableName',
    },
    {
      title: 'Record ID',
      dataIndex: 'recordID',
      key: 'recordID',
    },
    {
      title: 'Hành Động',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={action === 'SEND' || action === 'CREATE' ? 'green' : action === 'ERROR' ? 'red' : 'blue'}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Thời Gian',
      dataIndex: 'changeTime',
      key: 'changeTime',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Chi Tiết',
      dataIndex: 'changeDetails',
      key: 'changeDetails',
      ellipsis: true,
    },
    {
      title: 'User ID',
      dataIndex: 'userID',
      key: 'userID',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: LogDTO) => (
        <Button
          type="link"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewLog(record)}
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
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-500 mb-6">Không thể tải danh sách logs. Vui lòng thử lại.</p>
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
          <FileText className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Logs</h2>
        </div>
        <Space>
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
      <div className="flex gap-4 mb-6">
        <AntSearch
          placeholder="Tìm kiếm theo bảng hoặc hành động"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : logs.length > 0 ? (
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="logID"
          pagination={{
            current: currentPage,
            pageSize,
            total: totalItems,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: handlePageChange,
            showTotal: (total, range) => (
              <span className="text-sm text-gray-600">
                Hiển thị {range[0]}-{range[1]} trong tổng số {total} logs
              </span>
            ),
            position: ["bottomRight"],
          }}
          size="middle"
          className="log-table"
        />
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có logs</h3>
          <p className="text-gray-500">Không có logs nào được tìm thấy.</p>
        </div>
      )}

      {/* Detail View Overlay */}
      {selectedLog && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-200 ease-out animate-in fade-in"
            onClick={() => setSelectedLog(null)}
          />
          
          {/* Content Container */}
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-4xl max-h-[90vh] pointer-events-auto transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-2"
              onClick={(e) => e.stopPropagation()}
            >
              <LogView log={selectedLog} onClose={() => setSelectedLog(null)} />
            </div>
          </div>
        </>
      )}

      <style>{`
        /* Container của pagination */
        .log-table .ant-pagination {
          display: flex;
          justify-content: space-between !important;
          align-items: center;
          padding: 20px 24px !important;
          margin: 0 !important;
        }

        /* Đẩy dòng chữ "Hiển thị..." về bên trái */
        .log-table .ant-pagination-total-text {
          margin-right: auto !important;
          float: none !important;
        }

        /* Các nút phân trang + select page size vẫn ở bên phải */
        .log-table .ant-pagination-options,
        .log-table .ant-pagination-prev,
        .log-table .ant-pagination-next,
        .log-table .ant-pagination-item,
        .log-table .ant-select-selector {
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default LogList;