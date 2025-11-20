import React from "react";
import { Modal, message } from "antd";
import { Edit } from "lucide-react";
import OrderForm from "../../../components/OrderForm/OrderForm";
import { useOrder } from "../../../../hooks/useOrder";
import { 
  type OrderDTO, 
  type OrderRequestDTO,
  type MealOption,
  type TableOption,
  type UserOption
} from "../../../../service/orderService";
import Cookies from "js-cookie";

interface UpdateOrderProps {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  orderData: OrderDTO | null;
  meals: MealOption[];
  tables: TableOption[];
  users: UserOption[];
  loadingMeals: boolean;
  loadingTables: boolean;
  loadingUsers: boolean;
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({ 
  show, 
  onClose, 
  onUpdate, 
  orderData,
  meals,
  tables,
  users,
  loadingMeals,
  loadingTables,
  loadingUsers
}) => {
  const token = Cookies.get('authToken') || '';
  const { useUpdateOrder } = useOrder(token);
  const updateOrderMutation = useUpdateOrder();

  const handleSubmit = async (data: OrderRequestDTO) => {
    if (!orderData) return;

    try {
      await updateOrderMutation.mutateAsync({
        orderId: orderData.orderID,
        data,
      });
      message.success('Đã cập nhật đơn hàng thành công!');
      onUpdate();
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật đơn hàng!');
      throw error;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-xl font-bold">
          <Edit className="w-6 h-6 text-orange-600" />
          Cập nhật đơn hàng #{orderData?.orderID}
        </div>
      }
      open={show}
      onCancel={onClose}
      width={1200}
      footer={null}
      style={{ top: 20 }}
      destroyOnClose
    >
      {orderData && (
        <OrderForm
          initialData={orderData}
          meals={meals}
          tables={tables}
          users={users}
          loadingMeals={loadingMeals}
          loadingTables={loadingTables}
          loadingUsers={loadingUsers}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={updateOrderMutation.isPending}
        />
      )}
    </Modal>
  );
};

export default UpdateOrder;