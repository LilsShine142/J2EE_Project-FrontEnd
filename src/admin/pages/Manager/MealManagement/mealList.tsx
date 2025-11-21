import React, { useState, useEffect } from "react";
import Filter from "../../Admin/Components/Filter";
import { Input, Modal, Spin } from "antd";
import DataTable from "../../Admin/Components/Table/Table";
import AddNewMeal from "./AddMeal";
import UpdateMeal from "./UpdateMeal";
import { notification } from 'antd';
import Pagination from "../../Admin/Components/Pagination";
import { MStatusMeal } from "../../../../lib/constants/constants";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DetailModal from "../../Admin/Components/ModalForm/DetailModal";
import { type MealDTO } from '../../../../service/mealService';
import { useMeal } from '../../../../hooks/useMeal';
import Cookies from 'js-cookie';
import { useCategory } from "../../../../hooks/useCategory";
import type { CategoryDTO } from '../../../../service/categoryService';

export interface Category {
  categoryID: number;
  categoryName: string;
  description?: string;
}

export interface CategoryOption {
  categoryID: number;
  categoryName: string;
  description: string;
}

interface StatusOption {
  id: number;
  description: string;
  code: string;
}

const MealList: React.FC = () => {
  
  interface FilterOption {
    key: string;
    label: string;
    type: "select";
    placeholder: string;
    values: { value: string; label: string }[];
  }

  const [data, setData] = useState<MealDTO[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealDTO | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const itemsPerPage = 10;
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState({
    category: "",
    status: "",
  });

    const token = Cookies.get('authToken') || '';
    const { useCategories } = useCategory(token);
    const { data: categoriesPageData } = useCategories(0, 100); // Lấy 100 categories
  
    const { useMeals, useDeleteMeal } = useMeal(token);

  // Tạo status options từ MStatusMeal (ACTIVE và INACTIVE)
    const statusOptions: StatusOption[] = [
        {
        id: MStatusMeal.ACTIVE.code,
        description: MStatusMeal.ACTIVE.description,
        code: String(MStatusMeal.ACTIVE.code),
        },
        {
        id: MStatusMeal.INACTIVE.code,
        description: MStatusMeal.INACTIVE.description,
        code: String(MStatusMeal.INACTIVE.code),
        }
    ];
    
    console.log("statusOptions:", statusOptions);

    useEffect(() => {
        if (categoriesPageData?.content) {
        const mappedCategories = categoriesPageData.content.map((category: CategoryDTO) => ({
            categoryID: category.categoryID,
            categoryName: category.categoryName,
            description: category.description ?? '',
        }));
        setCategoryOptions(mappedCategories);
        }
    }, [categoriesPageData]);

  const filterOptions: FilterOption[] = [
    {
      key: "category",
      label: "Danh mục",
      type: "select",
      placeholder: "Chọn danh mục",
      values: categoryOptions.map((item) => ({
        value: String(item.categoryID),
        label: item.categoryName,
      })),
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn Trạng thái",
      values: statusOptions.map((item) => ({
        value: String(item.id),
        label: item.description,
      })),
    },
  ];

  const categoryId = filters.category ? Number(filters.category) : undefined;
  const statusId = filters.status ? Number(filters.status) : undefined;
  console.log("Applied statusId filter:", statusId);
  const {
    data: pageData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useMeals({
    page: currentPage - 1,
    size: itemsPerPage,
    search: searchQuery,
    categoryId,
    statusId,
  });

    const deleteMealMutation = useDeleteMeal();
    const mealsData = pageData?.content ?? [];
    const fetchedTotalItems = pageData?.totalElements ?? 0;
    const fetchedTotalPages = pageData?.totalPages ?? 1;
    console.log("meals data:", mealsData);
    console.log("total items:", fetchedTotalItems);
    console.log("total pages:", fetchedTotalPages);
    
    useEffect(() => {
        if (pageData) {
        setData(mealsData);
        setTotalItems(fetchedTotalItems);
        setTotalPages(fetchedTotalPages);
        setIsInitialLoad(false);
        }
    }, [pageData, mealsData, fetchedTotalItems, fetchedTotalPages]);

  useEffect(() => {
    if (!isInitialLoad) {
      setCurrentPage(1);
    }
  }, [filters.category, filters.status, searchQuery]);

  // Chỉ hiển thị loading khi lần đầu load
  if (isLoading && isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu!
        <button onClick={() => refetch()} className="ml-2 text-blue-500 underline">
          Thử lại
        </button>
      </div>
    );
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      category: "",
      status: "",
    });
    setSearchQuery("");
  };
  
  const handleView = (id: number) => {
    const meal = data.find((m) => m.mealID === id);
    if (meal) {
      setSelectedMeal(meal);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: number) => {
    const meal = data.find((m) => m.mealID === id);
    if (meal) {
      setSelectedMeal(meal);
      setShowEditModal(true);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa món ăn này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteMealMutation.mutateAsync(id);
          refetch();
        } catch (error) {
          console.error('Delete error:', error);
        }
      },
    });
  };

  const handleAddMeal = async (mealData: any) => {
    try {
      console.log("Adding meal:", mealData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã thêm món ăn mới thành công!',
      });
      refetch();
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi thêm món ăn!',
      });
      throw error;
    }
  };

  const handleUpdateMeal = async (mealData: any) => {
    try {
      console.log("Updating meal:", mealData);
      
      api.success({
        message: 'Thành công',
        description: 'Đã cập nhật món ăn thành công!',
      });
      
      setShowEditModal(false);
      setSelectedMeal(null);
      refetch();
    } catch (error) {
      api.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật món ăn!',
      });
      throw error;
    }
  };

  const columns = [
    { 
      key: "mealID", 
      label: "ID",
      render: (row: MealDTO) => (
        <span className="font-mono text-sm">{row.mealID}</span>
      )
    },
    {
      key: "image", 
      label: "Hình ảnh",
      render: (row: MealDTO) => (
        <img 
          src={row.image || '/placeholder-meal.png'} 
          alt={row.mealName}
          className="w-16 h-16 object-cover rounded"
        />
      )
    },
    {
      key: "mealName", 
      label: "Tên món ăn",
      render: (row: MealDTO) => (
        <div className="font-medium">{row.mealName}</div>
      )
    },
    {
      key: "categoryName", 
      label: "Danh mục",
      render: (row: MealDTO) => (
        <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
          {row.categoryName}
        </span>
      )
    },
    {
      key: "price", 
      label: "Giá",
      render: (row: MealDTO) => (
        <span className="font-semibold text-green-600">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.price)}
        </span>
      )
    },
    {
      key: "statusId", 
      label: "Trạng thái",
      render: (row: MealDTO) => {
        const status = statusOptions.find(s => s.id === row.statusId);
        return (
          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
            row.statusId === MStatusMeal.ACTIVE.code
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status?.description || 'Không xác định'}
          </span>
        );
      }
    },
    {
      key: "actions",
      label: "Hành động",
      render: (row: MealDTO) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row.mealID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            title="Xem chi tiết"
          >
            <FaEye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.mealID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.mealID);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
            title="Xóa"
          >
            <FaTrash className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  const mealDetailColumns = [
    { label: "ID", key: "mealID" },
    { label: "Tên món ăn", key: "mealName" },
    { 
      label: "Hình ảnh", 
      key: "image",
      render: (value: string) => (
        <img src={value || '/placeholder-meal.png'} alt="Meal" className="w-32 h-32 object-cover rounded" />
      )
    },
    { 
      label: "Giá", 
      key: "price",
      render: (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    { label: "Danh mục", key: "categoryName" },
    { 
      label: "Trạng thái", 
      key: "statusId",
      render: (value: number) => {
        const status = statusOptions.find(s => s.id === value);
        return status?.description || 'Không xác định';
      }
    },
    { 
      label: "Ngày tạo", 
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleString('vi-VN')
    },
    { 
      label: "Cập nhật lần cuối", 
      key: "updatedAt",
      render: (value: string) => new Date(value).toLocaleString('vi-VN')
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4 text-black">Danh sách món ăn</h2>
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6 text-black">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="🔍 Tìm kiếm món ăn..."
            className="w-full"
            size="large"
          />
        </div>
        <Filter
          filters={filters}
          options={filterOptions}
          onFilterChange={handleInputChange}
          onReset={handleReset}
        />
      </div>

      <AddNewMeal 
        onAdd={handleAddMeal}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
      />

      <div className="bg-white rounded-lg border overflow-hidden relative">
        {/* Loading overlay khi đang fetch */}
        {isFetching && !isInitialLoad && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
        
        {/* Table với transition mượt */}
        <div className="transition-opacity duration-300" style={{ opacity: isFetching ? 0.5 : 1 }}>
          <DataTable
            columns={columns}
            data={(data ?? []).map(meal => ({ ...meal, id: meal.mealID }))}
            onSort={() => {}}
            sortConfig={{ key: '', direction: 'ascending' }}
          />
        </div>

        <div className="flex justify-between items-center p-2 bg-gray-100 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Hiển thị {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} món ăn
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <UpdateMeal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMeal(null);
        }}
        onUpdate={handleUpdateMeal}
        mealData={selectedMeal}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
      />

      <DetailModal<MealDTO>
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedMeal(null);
        }}
        title="Chi tiết món ăn"
        data={selectedMeal}
        columns={mealDetailColumns}
      />
    </div>
  );
};

export default MealList;