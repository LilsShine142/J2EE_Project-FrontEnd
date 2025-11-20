// import React, { useState, useEffect } from "react";
// import { Form, Select, InputNumber, Card, Space, Divider, message, Input, Button, Radio, Alert } from "antd";
// import { Receipt, Percent, Tag as TagIcon, FileText, CreditCard, DollarSign } from "lucide-react";
// import { type BillFormData, BillPaymentMethod, BillPaymentPercentage } from "../../../types/bill";
// import type { OrderDTO } from "../../../service/orderService";
// import Cookies from 'js-cookie';
// import '../../css/BillForm-list.css';

// interface BillFormProps {
//   initialData?: {
//     orderId?: number;
//     bookingId?: number;
//     orderDetails?: OrderDTO;
//   };
//   onSubmit: (data: BillFormData) => Promise<void>;
//   onCancel: () => void;
//   isLoading: boolean;
// }

// const BillForm: React.FC<BillFormProps> = ({
//   initialData,
//   onSubmit,
//   onCancel,
//   isLoading = false,
// }) => {
//   const [form] = Form.useForm();
//   const [paymentPercentage, setPaymentPercentage] = useState<number>(BillPaymentPercentage.FULL);
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const token = Cookies.get('authToken') || '';

//   useEffect(() => {
//     if (initialData) {
//       const orderInfo = initialData.bookingId
//         ? `Thanh toán booking #${initialData.bookingId}`
//         : `Thanh toán order #${initialData.orderId}`;

//       form.setFieldsValue({
//         bookingId: initialData.bookingId,
//         orderId: initialData.orderId,
//         paymentPercentage: BillPaymentPercentage.FULL,
//         orderInfo: orderInfo,
//         paymentMethod: BillPaymentMethod.CASH,
//       });

//       // Calculate total from order details
//       if (initialData.orderDetails) {
//         const total = initialData.orderDetails.orderDetails?.reduce(
//           (sum, detail) => sum + detail.subTotal,
//           0
//         ) || 0;
//         setTotalAmount(total);
//       }
//     }
//   }, [initialData, form]);

//   const handleSubmit = async (values: any) => {
//     console.log('📤 Bill Form values:', values);

//     const billData: BillFormData = {
//       bookingId: values.bookingId,
//       orderId: values.orderId,
//       paymentPercentage: values.paymentPercentage,
//       voucherCode: values.voucherCode,
//       orderInfo: values.orderInfo,
//       paymentMethod: values.paymentMethod,
//     };

//     console.log('📤 Bill data:', billData);

//     try {
//       await onSubmit(billData);
//     } catch (error) {
//       console.error('❌ Submit error:', error);
//     }
//   };

//   const calculatePaymentAmount = () => {
//     return (totalAmount * paymentPercentage) / 100;
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
//   };

//   return (
//     <div className="bill-form-container">
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//       >
//         <Card
//           title={
//             <div className="flex items-center gap-2">
//               <Receipt className="w-5 h-5 text-blue-600" />
//               <span className="text-lg font-semibold">Thông tin hóa đơn</span>
//             </div>
//           }
//           className="shadow-lg"
//         >
//           <Space direction="vertical" className="w-full" size="large">
//             {/* Order/Booking ID (Hidden) */}
//             {initialData?.orderId && (
//               <Form.Item name="orderId" hidden>
//                 <InputNumber />
//               </Form.Item>
//             )}

//             {initialData?.bookingId && (
//               <Form.Item name="bookingId" hidden>
//                 <InputNumber />
//               </Form.Item>
//             )}

//             {/* Order Info Display */}
//             {initialData?.orderDetails && (
//               <Alert
//                 message={
//                   <div className="space-y-2">
//                     <div className="font-semibold text-base">
//                       {initialData.bookingId
//                         ? `Booking #${initialData.bookingId}`
//                         : `Order #${initialData.orderId}`}
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div>
//                         <span className="text-gray-600">Khách hàng:</span>{' '}
//                         <span className="font-medium">{initialData.orderDetails.userName}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Bàn:</span>{' '}
//                         <span className="font-medium">{initialData.orderDetails.tableName}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Số món:</span>{' '}
//                         <span className="font-medium">{initialData.orderDetails.orderDetails?.length || 0}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Tổng tiền:</span>{' '}
//                         <span className="font-bold text-green-600">{formatCurrency(totalAmount)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 }
//                 type="info"
//                 showIcon={false}
//                 className="order-info-alert"
//               />
//             )}

//             <Divider />

//             {/* Payment Percentage */}
//             <Form.Item
//               name="paymentPercentage"
//               label={
//                 <span className="flex items-center gap-2 text-sm font-medium">
//                   <Percent className="w-4 h-4 text-purple-600" />
//                   Phần trăm thanh toán
//                 </span>
//               }
//               rules={[{ required: true, message: 'Vui lòng chọn phần trăm thanh toán!' }]}
//             >
//               <Radio.Group
//                 onChange={(e) => setPaymentPercentage(e.target.value)}
//                 size="large"
//                 className="w-full"
//               >
//                 <Space direction="vertical" className="w-full">
//                   <Radio value={BillPaymentPercentage.FULL} className="w-full">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">Thanh toán toàn bộ (100%)</span>
//                       <span className="text-green-600 font-bold">
//                         {formatCurrency(calculatePaymentAmount())}
//                       </span>
//                     </div>
//                   </Radio>
//                   {initialData?.bookingId && (
//                     <Radio value={BillPaymentPercentage.PARTIAL} className="w-full">
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">Đặt cọc (30%)</span>
//                         <span className="text-orange-600 font-bold">
//                           {formatCurrency((totalAmount * 30) / 100)}
//                         </span>
//                       </div>
//                     </Radio>
//                   )}
//                 </Space>
//               </Radio.Group>
//             </Form.Item>

//             {/* Voucher Code */}
//             <Form.Item
//               name="voucherCode"
//               label={
//                 <span className="flex items-center gap-2 text-sm font-medium">
//                   <TagIcon className="w-4 h-4 text-red-600" />
//                   Mã giảm giá (tùy chọn)
//                 </span>
//               }
//             >
//               <Input
//                 placeholder="Nhập mã voucher"
//                 size="large"
//                 prefix={<TagIcon className="w-4 h-4 text-gray-400" />}
//                 allowClear
//               />
//             </Form.Item>

//             {/* Order Info */}
//             <Form.Item
//               name="orderInfo"
//               label={
//                 <span className="flex items-center gap-2 text-sm font-medium">
//                   <FileText className="w-4 h-4 text-blue-600" />
//                   Thông tin thanh toán
//                 </span>
//               }
//               rules={[{ required: true, message: 'Vui lòng nhập thông tin thanh toán!' }]}
//             >
//               <Input.TextArea
//                 placeholder="Mô tả giao dịch..."
//                 size="large"
//                 rows={3}
//                 showCount
//                 maxLength={200}
//               />
//             </Form.Item>

//             {/* Payment Method */}
//             <Form.Item
//               name="paymentMethod"
//               label={
//                 <span className="flex items-center gap-2 text-sm font-medium">
//                   <CreditCard className="w-4 h-4 text-green-600" />
//                   Phương thức thanh toán
//                 </span>
//               }
//               rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
//             >
//               <Radio.Group size="large" className="w-full">
//                 <Space direction="vertical" className="w-full">
//                   <Radio value={BillPaymentMethod.CASH} className="w-full">
//                     <div className="flex items-center gap-2">
//                       <DollarSign className="w-4 h-4" />
//                       <span className="font-medium">Tiền mặt</span>
//                     </div>
//                   </Radio>
//                   <Radio value={BillPaymentMethod.TRANSFER} className="w-full">
//                     <div className="flex items-center gap-2">
//                       <CreditCard className="w-4 h-4" />
//                       <span className="font-medium">Chuyển khoản</span>
//                     </div>
//                   </Radio>
//                 </Space>
//               </Radio.Group>
//             </Form.Item>

//             <Divider />

//             {/* Summary */}
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Tổng tiền:</span>
//                   <span className="text-lg font-semibold">{formatCurrency(totalAmount)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Phần trăm thanh toán:</span>
//                   <span className="text-lg font-semibold">{paymentPercentage}%</span>
//                 </div>
//                 <Divider className="my-2" />
//                 <div className="flex justify-between items-center">
//                   <span className="text-base font-semibold">Số tiền thanh toán:</span>
//                   <span className="text-2xl font-bold text-green-600">
//                     {formatCurrency(calculatePaymentAmount())}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <Space className="w-full" size="middle">
//               <Button
//                 onClick={onCancel}
//                 size="large"
//                 block
//                 disabled={isLoading}
//                 className="cancel-btn"
//               >
//                 Hủy
//               </Button>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 size="large"
//                 block
//                 loading={isLoading}
//                 className="submit-btn"
//                 icon={<Receipt className="w-4 h-4" />}
//               >
//                 Xuất hóa đơn
//               </Button>
//             </Space>
//           </Space>
//         </Card>
//       </Form>
//     </div>
//   );
// };

// export default BillForm;

























import React, { useState, useEffect } from "react";
import { Form, InputNumber, Card, Space, Divider, Input, Button, Radio, Alert, Spin } from "antd";
import { Receipt, Percent, Tag as TagIcon, FileText, CreditCard, DollarSign } from "lucide-react";
import { type BillFormData, BillPaymentMethod, BillPaymentPercentage } from "../../../types/bill";
import type { OrderDTO } from "../../../service/orderService";
import type { BookingDTO } from "../../../service/bookingService";
import { getMealById } from "../../../service/mealService";
import Cookies from 'js-cookie';
import '../../css/BillForm-list.css';

interface BillFormProps {
  initialData?: {
    orderId?: number;
    bookingId?: number;
    orderDetails?: OrderDTO;
    bookingDetails?: BookingDTO;
  };
  onSubmit: (data: BillFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

interface MealWithPrice {
  mealID: number;
  mealName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

const BillForm: React.FC<BillFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const [paymentPercentage, setPaymentPercentage] = useState<number>(BillPaymentPercentage.FULL);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loadingTotal, setLoadingTotal] = useState<boolean>(false);
  const [mealsWithPrice, setMealsWithPrice] = useState<MealWithPrice[]>([]);
  
  const token = Cookies.get('authToken') || '';

  useEffect(() => {
    const calculateTotal = async () => {
      if (!initialData) return;

      const isOrder = !!initialData.orderDetails;
      const isBooking = !!initialData.bookingDetails;

      const orderInfo = isOrder
        ? `Thanh toán order #${initialData.orderId}${initialData.bookingId ? ` (Booking #${initialData.bookingId})` : ''}`
        : `Thanh toán booking #${initialData.bookingId}`;

      form.setFieldsValue({
        bookingId: initialData.bookingId,
        orderId: initialData.orderId,
        paymentPercentage: BillPaymentPercentage.FULL,
        orderInfo: orderInfo,
        paymentMethod: BillPaymentMethod.CASH,
      });

      // ✅ Calculate total for ORDER
      if (isOrder && initialData.orderDetails) {
        const total = initialData.orderDetails.orderDetails?.reduce(
          (sum, detail) => sum + detail.subTotal,
          0
        ) || 0;
        setTotalAmount(total);
        
        // Prepare meals with price for display (already have subtotal)
        const mealsData = initialData.orderDetails.orderDetails?.map(detail => ({
          mealID: detail.mealID,
          mealName: detail.mealName || `Món #${detail.mealID}`,
          price: detail.subTotal / detail.quantity,
          quantity: detail.quantity,
          subtotal: detail.subTotal,
        })) || [];
        setMealsWithPrice(mealsData);
      } 
      // ✅ Calculate total for BOOKING (fetch meal prices from bookingDetails)
      else if (isBooking && initialData.bookingDetails?.bookingDetails) {
        setLoadingTotal(true);
        
        try {
          const bookingDetails = initialData.bookingDetails.bookingDetails;
          
          console.log('📋 Booking details:', bookingDetails);
          
          // Fetch prices for all meals in parallel
          const mealPromises = bookingDetails.map(async (detail) => {
            try {
              const mealData = await getMealById(token, detail.mealID);
              const subtotal = mealData.price * detail.quantity;
              
              console.log(`💰 Meal #${detail.mealID} (${mealData.mealName}): ${mealData.price} x ${detail.quantity} = ${subtotal}`);
              
              return {
                mealID: detail.mealID,
                mealName: mealData.mealName,
                price: mealData.price,
                quantity: detail.quantity,
                subtotal: subtotal,
              };
            } catch (error) {
              console.error(`❌ Error fetching meal #${detail.mealID}:`, error);
              return {
                mealID: detail.mealID,
                mealName: `Món #${detail.mealID}`,
                price: 0,
                quantity: detail.quantity,
                subtotal: 0,
              };
            }
          });

          const mealsData = await Promise.all(mealPromises);
          setMealsWithPrice(mealsData);

          // Calculate total
          const total = mealsData.reduce((sum, meal) => sum + meal.subtotal, 0);
          console.log(`✅ Total calculated for booking: ${total}`);
          setTotalAmount(total);
          
        } catch (error) {
          console.error('❌ Error calculating total:', error);
        } finally {
          setLoadingTotal(false);
        }
      }
    };

    calculateTotal();
  }, [initialData, form, token]);

  const handleSubmit = async (values: any) => {
    console.log('📤 Bill Form values:', values);

    const billData: BillFormData = {
      bookingId: values.bookingId,
      orderId: values.orderId,
      paymentPercentage: values.paymentPercentage,
      voucherCode: values.voucherCode,
      orderInfo: values.orderInfo,
      paymentMethod: values.paymentMethod,
    };

    console.log('📤 Bill data:', billData);
    console.log('💰 Total amount:', totalAmount);

    try {
      await onSubmit(billData);
    } catch (error) {
      console.error('❌ Submit error:', error);
    }
  };

  const calculatePaymentAmount = () => {
    return (totalAmount * paymentPercentage) / 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const isOrder = !!initialData?.orderDetails;
  const isBooking = !!initialData?.bookingDetails;

  // Show loading spinner while calculating total
  if (loadingTotal) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" tip="Đang tính tổng tiền..." />
      </div>
    );
  }

  return (
    <div className="bill-form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Card
          title={
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold">Thông tin hóa đơn</span>
            </div>
          }
          className="shadow-lg"
        >
          <Space direction="vertical" className="w-full" size="large">
            {/* Hidden fields */}
            {initialData?.orderId && (
              <Form.Item name="orderId" hidden>
                <InputNumber />
              </Form.Item>
            )}

            {initialData?.bookingId && (
              <Form.Item name="bookingId" hidden>
                <InputNumber />
              </Form.Item>
            )}

            {/* Info Display - Order */}
            {isOrder && initialData?.orderDetails && (
              <Alert
                message={
                  <div className="space-y-2">
                    <div className="font-semibold text-base">
                      Order #{initialData.orderId}
                      {initialData.bookingId && (
                        <span className="text-purple-600"> (Booking #{initialData.bookingId})</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Khách hàng:</span>{' '}
                        <span className="font-medium">{initialData.orderDetails.userName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Bàn:</span>{' '}
                        <span className="font-medium">{initialData.orderDetails.tableName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Số món:</span>{' '}
                        <span className="font-medium">{mealsWithPrice.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tổng tiền:</span>{' '}
                        <span className="font-bold text-green-600">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>

                    {/* Meal details */}
                    {mealsWithPrice.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-2">Chi tiết món ăn:</div>
                        <div className="space-y-1">
                          {mealsWithPrice.map((meal, index) => (
                            <div key={index} className="text-xs flex justify-between items-center">
                              <span className="text-gray-700">
                                {meal.mealName} x {meal.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(meal.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                }
                type="info"
                showIcon={false}
                className="order-info-alert"
              />
            )}

            {/* Info Display - Booking */}
            {isBooking && initialData?.bookingDetails && (
              <Alert
                message={
                  <div className="space-y-2">
                    <div className="font-semibold text-base">
                      Booking #{initialData.bookingId}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Khách hàng:</span>{' '}
                        <span className="font-medium">{initialData.bookingDetails.userName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Bàn:</span>{' '}
                        <span className="font-medium">{initialData.bookingDetails.tableName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Thời gian:</span>{' '}
                        <span className="font-medium">
                          {initialData.bookingDetails.startTime} - {initialData.bookingDetails.endTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Số khách:</span>{' '}
                        <span className="font-medium">{initialData.bookingDetails.numberOfGuests}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Số món đã đặt:</span>{' '}
                        <span className="font-medium">{mealsWithPrice.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tổng tiền món:</span>{' '}
                        <span className="font-bold text-green-600">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>

                    {/* Meal details */}
                    {mealsWithPrice.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-2">Chi tiết món ăn:</div>
                        <div className="space-y-1">
                          {mealsWithPrice.map((meal, index) => (
                            <div key={index} className="text-xs flex justify-between items-center">
                              <span className="text-gray-700">
                                {meal.mealName} x {meal.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(meal.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Booking notes */}
                    {initialData.bookingDetails.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-600 mb-1">Ghi chú:</div>
                        <div className="text-xs text-gray-700">{initialData.bookingDetails.notes}</div>
                      </div>
                    )}
                  </div>
                }
                type="warning"
                showIcon={false}
                className="order-info-alert"
              />
            )}

            <Divider />

            {/* Payment Percentage */}
            <Form.Item
              name="paymentPercentage"
              label={
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Percent className="w-4 h-4 text-purple-600" />
                  Phần trăm thanh toán
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn phần trăm thanh toán!' }]}
            >
              <Radio.Group
                onChange={(e) => setPaymentPercentage(e.target.value)}
                size="large"
                className="w-full"
              >
                <Space direction="vertical" className="w-full">
                  <Radio value={BillPaymentPercentage.FULL} className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Thanh toán toàn bộ (100%)</span>
                      <span className="text-green-600 font-bold">
                        {formatCurrency(calculatePaymentAmount())}
                      </span>
                    </div>
                  </Radio>
                  {initialData?.bookingId && !isOrder && (
                    <Radio value={BillPaymentPercentage.PARTIAL} className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Đặt cọc (30%)</span>
                        <span className="text-orange-600 font-bold">
                          {formatCurrency((totalAmount * 30) / 100)}
                        </span>
                      </div>
                    </Radio>
                  )}
                </Space>
              </Radio.Group>
            </Form.Item>

            {/* Voucher Code */}
            <Form.Item
              name="voucherCode"
              label={
                <span className="flex items-center gap-2 text-sm font-medium">
                  <TagIcon className="w-4 h-4 text-red-600" />
                  Mã giảm giá (tùy chọn)
                </span>
              }
            >
              <Input
                placeholder="Nhập mã voucher"
                size="large"
                prefix={<TagIcon className="w-4 h-4 text-gray-400" />}
                allowClear
              />
            </Form.Item>

            {/* Order Info */}
            <Form.Item
              name="orderInfo"
              label={
                <span className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Thông tin thanh toán
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập thông tin thanh toán!' }]}
            >
              <Input.TextArea
                placeholder="Mô tả giao dịch..."
                size="large"
                rows={3}
                showCount
                maxLength={200}
              />
            </Form.Item>

            {/* Payment Method */}
            <Form.Item
              name="paymentMethod"
              label={
                <span className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  Phương thức thanh toán
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
            >
              <Radio.Group size="large" className="w-full">
                <Space direction="vertical" className="w-full">
                  <Radio value={BillPaymentMethod.CASH} className="w-full">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Tiền mặt</span>
                    </div>
                  </Radio>
                  <Radio value={BillPaymentMethod.TRANSFER} className="w-full">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">Chuyển khoản</span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Divider />

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="text-lg font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phần trăm thanh toán:</span>
                  <span className="text-lg font-semibold">{paymentPercentage}%</span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Số tiền thanh toán:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculatePaymentAmount())}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Space className="w-full" size="middle">
              <Button
                onClick={onCancel}
                size="large"
                block
                disabled={isLoading}
                className="cancel-btn"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                className="submit-btn"
                icon={<Receipt className="w-4 h-4" />}
              >
                Xuất hóa đơn
              </Button>
            </Space>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default BillForm;