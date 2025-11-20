import React, { useState } from "react";
import { Card, message, Select, Spin, Space, Radio, Alert, Button } from "antd";
import { ArrowLeft, Receipt, ShoppingCart, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BillForm from "../../../components/BillForm/BillForm";
import { useBill } from "../../../../hooks/useBill";
import { useOrder } from "../../../../hooks/useOrder";
import { useBooking } from "../../../../hooks/useBookings";
import type { BillFormData } from "../../../../types/bill";
import { ORDER_STATUS } from "../../../../lib/constants/constants";
import Cookies from "js-cookie";

type BillType = 'order' | 'booking';

const AddNewBill: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("authToken") || "";
  
  const { useCheckoutAtRestaurant, useCreateBillForOrder } = useBill(token);
  const { useAllOrders } = useOrder(token);
  const { useAllBookings } = useBooking(token);

  const [billType, setBillType] = useState<BillType>('order');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Get confirmed orders
  const { data: ordersData, isLoading: loadingOrders } = useAllOrders(
    0,
    100,
    undefined,
    ORDER_STATUS.CONFIRMED.id
  );

  // Get confirmed bookings
  const { data: bookingsData, isLoading: loadingBookings } = useAllBookings(
    0,
    100,
    ORDER_STATUS.CONFIRMED.id,
    undefined,
  );

  const checkoutMutation = useCheckoutAtRestaurant();
  const createBillForOrderMutation = useCreateBillForOrder();

  const handleSubmit = async (formData: BillFormData) => {
    try {
      if (billType === 'order') {
        if (!selectedOrderId) {
          message.error("Vui lòng chọn order!");
          return;
        }

        const order = ordersData?.content.find(o => o.orderID === selectedOrderId);
        if (!order) {
          message.error("Không tìm thấy order!");
          return;
        }

        if (order.bookingID) {
          await checkoutMutation.mutateAsync({
            bookingId: order.bookingID,
            paymentPercentage: formData.paymentPercentage,
            voucherCode: formData.voucherCode,
            orderInfo: formData.orderInfo,
          });
          message.success("Xuất hóa đơn thành công! Booking và Order đã hoàn tất, bàn đã được giải phóng.");
        } else {
          await createBillForOrderMutation.mutateAsync({
            orderId: selectedOrderId,
            paymentData: {
              amount: 0,
              orderInfo: formData.orderInfo,
              paymentMethod: formData.paymentMethod,
            }
          });
          message.success("Xuất hóa đơn thành công!");
        }
      } else {
        if (!selectedBookingId) {
          message.error("Vui lòng chọn booking!");
          return;
        }

        const booking = bookingsData?.content.find(b => b.bookingID === selectedBookingId);
        if (!booking) {
          message.error("Không tìm thấy booking!");
          return;
        }

        await checkoutMutation.mutateAsync({
          bookingId: selectedBookingId,
          paymentPercentage: formData.paymentPercentage,
          voucherCode: formData.voucherCode,
          orderInfo: formData.orderInfo,
        });
        message.success("Xuất hóa đơn thành công! Booking đã hoàn tất, bàn đã được giải phóng.");
      }

      navigate("/manager/bills");
    } catch (error: any) {
      console.error("❌ Error creating bill:", error);
      message.error(error.message || "Xuất hóa đơn thất bại!");
    }
  };

  const handleCancel = () => {
    navigate("/manager/bills");
  };

  const selectedOrder = ordersData?.content.find(o => o.orderID === selectedOrderId);
  const selectedBooking = bookingsData?.content.find(b => b.bookingID === selectedBookingId);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleCancel}
            className="hover:bg-gray-100"
          />
          <Receipt className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Xuất hóa đơn mới</h2>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Chọn loại hóa đơn */}
        <Card className="border shadow-sm">
          <div className="space-y-4">
            <label className="block text-base font-semibold text-gray-900">
              Loại hóa đơn <span className="text-red-500">*</span>
            </label>
            <Radio.Group
              value={billType}
              onChange={(e) => {
                setBillType(e.target.value);
                setSelectedOrderId(null);
                setSelectedBookingId(null);
              }}
              size="large"
              className="w-full"
            >
              <Space direction="vertical" className="w-full" size="middle">
                <Radio value="order" className="w-full p-3 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Xuất bill cho Order</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Khách đến quán (có hoặc không có đặt trước) và đã gọi món
                      </div>
                    </div>
                  </div>
                </Radio>

                <Radio value="booking" className="w-full p-3 border rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Xuất bill cho Booking</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Khách đặt trước, đến quán nhưng không gọi thêm món
                      </div>
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        </Card>

        {/* Chọn Order */}
        {billType === 'order' && (
          <Card className="border shadow-sm">
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-900">
                Chọn Order cần xuất hóa đơn <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Chọn order..."
                size="large"
                style={{ width: "100%" }}
                loading={loadingOrders}
                value={selectedOrderId}
                onChange={setSelectedOrderId}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={ordersData?.content.map(order => ({
                  value: order.orderID,
                  label: `Order #${order.orderID} - ${order.userName} - ${order.tableName}${order.bookingID ? ` (Booking #${order.bookingID})` : ''} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount || 0)}`,
                }))}
                notFoundContent={
                  loadingOrders ? (
                    <div className="text-center py-4">
                      <Spin size="small" />
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      Không có order nào đang chờ thanh toán
                    </div>
                  )
                }
              />

              {selectedOrder && (
                <Alert
                  message={
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {selectedOrder.bookingID 
                          ? `🎯 Order có Booking (Trường hợp 2)` 
                          : `🆕 Order không có Booking (Trường hợp 1)`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedOrder.bookingID 
                          ? `Khách đã đặt trước và gọi thêm món. Sau khi xuất bill, booking và order sẽ hoàn tất, bàn sẽ được giải phóng.`
                          : `Khách đến quán mà không đặt trước. Sau khi xuất bill, order sẽ hoàn tất và bàn sẽ được giải phóng.`}
                      </div>
                    </div>
                  }
                  type={selectedOrder.bookingID ? "info" : "success"}
                  showIcon
                />
              )}
            </div>
          </Card>
        )}

        {/* Chọn Booking */}
        {billType === 'booking' && (
          <Card className="border shadow-sm">
            <div className="space-y-4">
              <label className="block text-base font-semibold text-gray-900">
                Chọn Booking cần xuất hóa đơn <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Chọn booking..."
                size="large"
                style={{ width: "100%" }}
                loading={loadingBookings}
                value={selectedBookingId}
                onChange={setSelectedBookingId}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={bookingsData?.content.map(booking => ({
                  value: booking.bookingID,
                  label: `Booking #${booking.bookingID} - ${booking.userName || 'N/A'} - ${booking.tableName} - ${booking.startTime} đến ${booking.endTime}`,
                }))}
                notFoundContent={
                  loadingBookings ? (
                    <div className="text-center py-4">
                      <Spin size="small" />
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      Không có booking nào đang chờ thanh toán
                    </div>
                  )
                }
              />

              {selectedBooking && (
                <Alert
                  message="🍽️ Booking không có Order (Trường hợp 3)"
                  description="Khách đặt trước nhưng không gọi thêm món. Sau khi xuất bill, booking sẽ hoàn tất, bàn sẽ được giải phóng."
                  type="warning"
                  showIcon
                />
              )}
            </div>
          </Card>
        )}

        {/* Bill Form */}
        {((billType === 'order' && selectedOrderId && selectedOrder) || 
          (billType === 'booking' && selectedBookingId && selectedBooking)) && (
          <Card className="border shadow-sm">
            <BillForm
              initialData={{
                orderId: billType === 'order' ? (selectedOrderId ?? undefined) : undefined,
                bookingId: billType === 'order' 
                  ? selectedOrder?.bookingID || undefined 
                  : (selectedBookingId ?? undefined),
                orderDetails: billType === 'order' ? selectedOrder : undefined,
                bookingDetails: billType === 'booking' ? selectedBooking : undefined,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={checkoutMutation.isPending || createBillForOrderMutation.isPending}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddNewBill;