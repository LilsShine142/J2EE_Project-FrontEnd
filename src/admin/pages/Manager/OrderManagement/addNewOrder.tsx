import React, { useState, useEffect } from "react";
import { Modal, Button, message, Spin } from "antd";
import { Plus, ShoppingCart } from "lucide-react";
import OrderForm from "../../../components/OrderForm/OrderForm";
import { useOrder } from "../../../../hooks/useOrder";
import { 
  type OrderRequestDTO,
  type MealOption,
  type TableOption,
  type UserOption
} from "../../../../service/orderService";
import Cookies from "js-cookie";

interface AddNewOrderProps {
  onAdd: () => void;
  meals: MealOption[];
  tables: TableOption[];
  users: UserOption[];
  loadingMeals: boolean;
  loadingTables: boolean;
  loadingUsers: boolean;
  onLoadFormData: () => Promise<void>;
  onUserAdded?: (newUser: UserOption) => void;
}

const AddNewOrder: React.FC<AddNewOrderProps> = ({ 
  onAdd,
  meals,
  tables,
  users,
  loadingMeals,
  loadingTables,
  loadingUsers,
  onLoadFormData,
  onUserAdded
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [localUsers, setLocalUsers] = useState<UserOption[]>(users);
  const token = Cookies.get('authToken') || '';
  const { useCreateOrder } = useOrder(token);
  const createOrderMutation = useCreateOrder();

  // Sync users prop with local state
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Load data when modal opens
  useEffect(() => {
    if (showModal) {
      loadData();
    }
  }, [showModal]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      await onLoadFormData();
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUserAdded = (newUser: UserOption) => {
    // Add to local state immediately
    setLocalUsers(prev => [newUser, ...prev]);
    
    // Notify parent component
    if (onUserAdded) {
      onUserAdded(newUser);
    }

    message.success({
      content: `Đã thêm và chọn khách hàng: ${newUser.fullName}`,
      icon: '✅',
      duration: 3,
    });
  };

  const handleSubmit = async (data: OrderRequestDTO) => {
    try {
      await createOrderMutation.mutateAsync(data);
      message.success({
        content: 'Đã tạo đơn hàng thành công!',
        icon: '✅',
        duration: 3,
      });
      setShowModal(false);
      onAdd();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi tạo đơn hàng!');
      throw error;
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<Plus className="w-4 h-4" />}
        onClick={() => setShowModal(true)}
        size="large"
        className="mb-4"
        style={{ 
          borderRadius: '8px',
          fontWeight: 600,
          height: '44px',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        Tạo đơn hàng mới
      </Button>

      <Modal
        title={
          <div className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <span>Tạo đơn hàng mới</span>
          </div>
        }
        open={showModal}
        onCancel={handleCancel}
        width={1200}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose
        maskClosable={false}
        className="order-modal"
      >
        <Spin 
          spinning={isLoadingData} 
          tip="Đang tải dữ liệu..."
          size="large"
        >
          <div style={{ minHeight: isLoadingData ? '400px' : 'auto' }}>
            {!isLoadingData && (
              <OrderForm
                meals={meals}
                tables={tables}
                users={localUsers}
                loadingMeals={loadingMeals}
                loadingTables={loadingTables}
                loadingUsers={loadingUsers}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={createOrderMutation.isPending}
                onUserAdded={handleUserAdded}
              />
            )}
          </div>
        </Spin>
      </Modal>

      <style>{`
        .order-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        
        .order-modal .ant-modal-header {
          background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
          border-bottom: none;
          padding: 20px 24px;
        }
        
        .order-modal .ant-modal-body {
          padding: 24px;
        }
      `}</style>
    </>
  );
};

export default AddNewOrder;