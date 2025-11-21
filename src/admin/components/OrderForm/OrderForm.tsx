// import React, { useState, useEffect } from "react";
// import { Form, Select, InputNumber, Card, Row, Col, Tag, Space, Divider, message, Input, Avatar, Button, Spin } from "antd";
// import { ShoppingCart, Trash2, User, MapPin, Search, Plus } from "lucide-react";
// import {
//   type MealOption,
//   type TableOption,
//   type UserOption,
//   type OrderRequestDTO,
//   type OrderDTO,
//   type OrderDetailRequest
// } from "../../../service/orderService";
// import { ORDER_STATUS } from "../../../lib/constants/constants";

// interface MealItem extends MealOption {
//   quantity: number;
// }

// interface OrderFormProps {
//   initialData?: OrderDTO | null;
//   meals: MealOption[];
//   tables: TableOption[];
//   users: UserOption[];
//   loadingMeals?: boolean;
//   loadingTables?: boolean;
//   loadingUsers?: boolean;
//   onSubmit: (data: OrderRequestDTO) => Promise<void>;
//   onCancel: () => void;
//   isLoading?: boolean;
// }

// const OrderForm: React.FC<OrderFormProps> = ({
//   initialData,
//   meals,
//   tables,
//   users,
//   loadingMeals = false,
//   loadingTables = false,
//   loadingUsers = false,
//   onSubmit,
//   onCancel,
//   isLoading = false
// }) => {
//   const [form] = Form.useForm();
//   const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);
//   const [searchMeal, setSearchMeal] = useState("");

//   // Load initial data if editing
//   useEffect(() => {
//     if (initialData) {
//       form.setFieldsValue({
//         userID: initialData.userID,
//         tableID: initialData.tableID,
//         bookingID: initialData.bookingID,
//       });
      
//       // Convert order details to meal items
//       if (initialData.orderDetails && meals.length > 0) {
//         const mealItems: MealItem[] = initialData.orderDetails.map(detail => {
//           const meal = meals.find(m => m.mealID === detail.mealID);
//           return {
//             mealID: detail.mealID,
//             mealName: detail.mealName,
//             price: detail.mealPrice,
//             quantity: detail.quantity,
//             categoryName: meal?.categoryName || '',
//             image: meal?.image || '',
//             statusId: 1,
//           };
//         });
//         setSelectedMeals(mealItems);
//       }
//     }
//   }, [initialData, meals, form]);

//   // Filter meals by search
//   const filteredMeals = meals.filter(meal =>
//     meal.mealName.toLowerCase().includes(searchMeal.toLowerCase())
//   );

//   // Handle add meal to order
//   const handleAddMeal = (meal: MealOption) => {
//     const existingMeal = selectedMeals.find(m => m.mealID === meal.mealID);
//     if (existingMeal) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === meal.mealID ? { ...m, quantity: m.quantity + 1 } : m
//         )
//       );
//       message.success(`Đã tăng số lượng ${meal.mealName}`);
//     } else {
//       setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
//       message.success(`Đã thêm ${meal.mealName}`);
//     }
//   };

//   // Handle update quantity
//   const handleUpdateQuantity = (mealID: number, quantity: number) => {
//     if (quantity <= 0) {
//       handleRemoveMeal(mealID);
//       return;
//     }
//     setSelectedMeals(
//       selectedMeals.map(m =>
//         m.mealID === mealID ? { ...m, quantity } : m
//       )
//     );
//   };

//   // Handle remove meal
//   const handleRemoveMeal = (mealID: number) => {
//     setSelectedMeals(selectedMeals.filter(m => m.mealID !== mealID));
//     message.info('Đã xóa món khỏi đơn hàng');
//   };

//   // Calculate total
//   const calculateTotal = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.price * meal.quantity, 0);
//   };

//   // Handle form submit
//   const handleSubmit = async (values: any) => {
//     if (selectedMeals.length === 0) {
//       message.error('Vui lòng chọn ít nhất một món ăn!');
//       return;
//     }

//     const orderDetails: OrderDetailRequest[] = selectedMeals.map(meal => ({
//       mealID: meal.mealID,
//       quantity: meal.quantity,
//     }));

//     const orderData: OrderRequestDTO = {
//       userID: values.userID,
//       tableID: values.tableID,
//       bookingID: values.bookingID || null,
//       statusId: ORDER_STATUS.PENDING.id,
//       orderDetails,
//     };

//     try {
//       await onSubmit(orderData);
//     } catch (error) {
//       // Error handled in parent
//     }
//   };

//   return (
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={handleSubmit}
//     >
//       <Row gutter={24}>
//         {/* LEFT SIDE - Menu Selection */}
//         <Col span={14}>
//           <Card
//             title={
//               <div className="flex items-center justify-between">
//                 <span className="text-lg font-semibold">Chọn món ăn</span>
//                 <Input
//                   prefix={<Search className="w-4 h-4 text-gray-400" />}
//                   placeholder="Tìm món ăn..."
//                   value={searchMeal}
//                   onChange={(e) => setSearchMeal(e.target.value)}
//                   className="w-64"
//                   allowClear
//                 />
//               </div>
//             }
//             className="h-[600px] overflow-auto"
//           >
//             {loadingMeals ? (
//               <div className="flex justify-center items-center h-full">
//                 <Spin size="large" tip="Đang tải món ăn..." />
//               </div>
//             ) : filteredMeals.length === 0 ? (
//               <div className="text-center text-gray-400 py-8">
//                 {searchMeal ? 'Không tìm thấy món ăn phù hợp' : 'Không có món ăn nào'}
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-3">
//                 {filteredMeals.map((meal) => (
//                   <Card
//                     key={meal.mealID}
//                     hoverable
//                     onClick={() => handleAddMeal(meal)}
//                     className="cursor-pointer hover:shadow-lg transition-shadow"
//                     bodyStyle={{ padding: '12px' }}
//                   >
//                     <div className="flex items-center gap-3">
//                       <Avatar
//                         size={50}
//                         src={meal.image}
//                         className="bg-blue-100 text-2xl"
//                       >
//                         {!meal.image && '🍽️'}
//                       </Avatar>
//                       <div className="flex-1">
//                         <div className="font-semibold text-sm">{meal.mealName}</div>
//                         <Tag color="blue" className="text-xs">{meal.categoryName}</Tag>
//                         <div className="font-bold text-green-600 mt-1">
//                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(meal.price)}
//                         </div>
//                       </div>
//                       <Plus className="w-5 h-5 text-blue-600" />
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </Card>
//         </Col>

//         {/* RIGHT SIDE - Order Details */}
//         <Col span={10}>
//           <Card
//             title={
//               <div className="flex items-center gap-2">
//                 <ShoppingCart className="w-5 h-5" />
//                 <span>Chi tiết đơn hàng</span>
//                 <Tag color="blue">{selectedMeals.length} món</Tag>
//               </div>
//             }
//             className="h-[600px] flex flex-col"
//           >
//             {/* Customer & Table Selection */}
//             <Space direction="vertical" className="w-full mb-4" size="small">
//               <Form.Item
//                 name="userID"
//                 label={
//                   <span className="flex items-center gap-2">
//                     <User className="w-4 h-4" />
//                     Khách hàng
//                   </span>
//                 }
//                 rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
//               >
//                 <Select
//                   placeholder="Chọn khách hàng"
//                   size="large"
//                   showSearch
//                   loading={loadingUsers}
//                   filterOption={(input, option) =>
//                     ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
//                   }
//                   options={users.map(user => ({
//                     value: user.userID,
//                     label: `${user.fullName}${user.phone ? ` - ${user.phone}` : ''}`,
//                   }))}
//                   notFoundContent={loadingUsers ? <Spin size="small" /> : 'Không có dữ liệu'}
//                 />
//               </Form.Item>

//               <Form.Item
//                 name="tableID"
//                 label={
//                   <span className="flex items-center gap-2">
//                     <MapPin className="w-4 h-4" />
//                     Bàn
//                   </span>
//                 }
//                 rules={[{ required: true, message: 'Vui lòng chọn bàn!' }]}
//               >
//                 <Select
//                   placeholder="Chọn bàn"
//                   size="large"
//                   loading={loadingTables}
//                   notFoundContent={loadingTables ? <Spin size="small" /> : 'Không có dữ liệu'}
//                 >
//                   {tables.map(table => (
//                     <Select.Option
//                       key={table.tableID}
//                       value={table.tableID}
//                       disabled={!table.isAvailable}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>{table.tableName}</span>
//                         <Space size={4}>
//                           <Tag color={table.isAvailable ? 'green' : 'red'} className="text-xs">
//                             {table.statusName}
//                           </Tag>
//                           <span className="text-gray-400 text-xs">
//                             {table.capacity} chỗ
//                           </span>
//                         </Space>
//                       </div>
//                     </Select.Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item name="bookingID" label="Booking ID (nếu có)">
//                 <InputNumber
//                   placeholder="Nhập booking ID"
//                   className="w-full"
//                   size="large"
//                   min={1}
//                 />
//               </Form.Item>
//             </Space>

//             <Divider className="my-3" />

//             {/* Selected Meals List */}
//             <div className="flex-1 overflow-auto max-h-[250px] mb-4">
//               {selectedMeals.length === 0 ? (
//                 <div className="text-center text-gray-400 py-8">
//                   <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                   <p>Chưa có món nào được chọn</p>
//                 </div>
//               ) : (
//                 <Space direction="vertical" className="w-full" size="small">
//                   {selectedMeals.map((meal) => (
//                     <Card key={meal.mealID} size="small" className="mb-2">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <div className="font-semibold text-sm">{meal.mealName}</div>
//                           <div className="text-xs text-gray-500">
//                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(meal.price)}
//                           </div>
//                         </div>
//                         <Space>
//                           <InputNumber
//                             min={1}
//                             value={meal.quantity}
//                             onChange={(value) => handleUpdateQuantity(meal.mealID, value || 1)}
//                             size="small"
//                             className="w-16"
//                           />
//                           <Button
//                             type="text"
//                             danger
//                             icon={<Trash2 className="w-4 h-4" />}
//                             onClick={() => handleRemoveMeal(meal.mealID)}
//                             size="small"
//                           />
//                         </Space>
//                       </div>
//                       <div className="text-right font-semibold text-green-600 mt-1">
//                         {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(meal.price * meal.quantity)}
//                       </div>
//                     </Card>
//                   ))}
//                 </Space>
//               )}
//             </div>

//             <Divider className="my-3" />

//             {/* Total & Actions */}
//             <div className="bg-gray-50 p-4 rounded-lg mt-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <span className="text-lg font-semibold">Tổng cộng:</span>
//                 <span className="text-2xl font-bold text-green-600">
//                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
//                 </span>
//               </div>

//               <Space className="w-full" size="middle">
//                 <Button onClick={onCancel} size="large" block disabled={isLoading}>
//                   Hủy
//                 </Button>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   size="large"
//                   block
//                   loading={isLoading}
//                   disabled={selectedMeals.length === 0}
//                 >
//                   {initialData ? 'Cập nhật đơn hàng' : 'Tạo đơn hàng'}
//                 </Button>
//               </Space>
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </Form>
//   );
// };

// export default OrderForm;











// import React, { useState, useEffect } from "react";
// import { Form, Select, InputNumber, Card, Row, Col, Tag, Space, Divider, message, Input, Avatar, Button, Spin, Badge, Tooltip, Empty } from "antd";
// import { ShoppingCart, Trash2, User, MapPin, Search, Plus, Minus, ShoppingBag, CheckCircle } from "lucide-react";
// import {
//   type MealOption,
//   type TableOption,
//   type UserOption,
//   type OrderRequestDTO,
//   type OrderDTO,
//   type OrderDetailRequest
// } from "../../../service/orderService";
// import { ORDER_STATUS } from "../../../lib/constants/constants";
// import '../../css/OrderForm.css';

// interface MealItem extends MealOption {
//   quantity: number;
// }

// interface OrderFormProps {
//   initialData?: OrderDTO | null;
//   meals: MealOption[];
//   tables: TableOption[];
//   users: UserOption[];
//   loadingMeals: boolean;
//   loadingTables: boolean;
//   loadingUsers: boolean;
//   onSubmit: (data: OrderRequestDTO) => Promise<void>;
//   onCancel: () => void;
//   isLoading: boolean;
//   onUserAdded?: (newUser: UserOption) => void;
// }
// const OrderForm: React.FC<OrderFormProps> = ({
//   initialData,
//   meals = [],
//   tables = [],
//   users = [],
//   loadingMeals = false,
//   loadingTables = false,
//   loadingUsers = false,
//   onSubmit,
//   onCancel,
//   isLoading = false
// }) => {
//   const [form] = Form.useForm();
//   const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);
//   const [searchMeal, setSearchMeal] = useState("");
//   const [isFormReady, setIsFormReady] = useState(false);

//   // Animation on mount
//   useEffect(() => {
//     setTimeout(() => setIsFormReady(true), 100);
//   }, []);

//   // Load initial data if editing
//   useEffect(() => {
//     if (initialData) {
//       form.setFieldsValue({
//         userID: initialData.userID,
//         tableID: initialData.tableID,
//         bookingID: initialData.bookingID,
//       });
      
//       if (initialData.orderDetails && meals.length > 0) {
//         const mealItems: MealItem[] = initialData.orderDetails.map(detail => {
//           const meal = meals.find(m => m.mealID === detail.mealID);
//           return {
//             mealID: detail.mealID,
//             mealName: detail.mealName,
//             price: detail.mealPrice,
//             quantity: detail.quantity,
//             categoryName: meal?.categoryName || '',
//             image: meal?.image || '',
//             statusId: 1,
//           };
//         });
//         setSelectedMeals(mealItems);
//       }
//     }
//   }, [initialData, meals, form]);

//   const filteredMeals = meals.filter(meal =>
//     meal.mealName.toLowerCase().includes(searchMeal.toLowerCase())
//   );

//   const handleAddMeal = (meal: MealOption) => {
//     const existingMeal = selectedMeals.find(m => m.mealID === meal.mealID);
//     if (existingMeal) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === meal.mealID ? { ...m, quantity: m.quantity + 1 } : m
//         )
//       );
//       message.success({
//         content: `Đã tăng ${meal.mealName} lên ${existingMeal.quantity + 1}`,
//         icon: <Plus className="text-green-500" />,
//         duration: 2,
//       });
//     } else {
//       setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
//       message.success({
//         content: `Đã thêm ${meal.mealName}`,
//         icon: <CheckCircle className="text-green-500" />,
//         duration: 2,
//       });
//     }
//   };

//   const handleUpdateQuantity = (mealID: number, quantity: number) => {
//     if (quantity <= 0) {
//       handleRemoveMeal(mealID);
//       return;
//     }
//     setSelectedMeals(
//       selectedMeals.map(m =>
//         m.mealID === mealID ? { ...m, quantity } : m
//       )
//     );
//   };

//   const handleIncrement = (mealID: number) => {
//     setSelectedMeals(
//       selectedMeals.map(m =>
//         m.mealID === mealID ? { ...m, quantity: m.quantity + 1 } : m
//       )
//     );
//   };

//   const handleDecrement = (mealID: number) => {
//     const meal = selectedMeals.find(m => m.mealID === mealID);
//     if (meal && meal.quantity > 1) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === mealID ? { ...m, quantity: m.quantity - 1 } : m
//         )
//       );
//     } else {
//       handleRemoveMeal(mealID);
//     }
//   };

//   const handleRemoveMeal = (mealID: number) => {
//     setSelectedMeals(selectedMeals.filter(m => m.mealID !== mealID));
//     message.info({
//       content: 'Đã xóa món khỏi đơn hàng',
//       duration: 2,
//     });
//   };

//   const calculateTotal = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.price * meal.quantity, 0);
//   };

//   const calculateTotalItems = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.quantity, 0);
//   };

//   const handleSubmit = async (values: any) => {
//     if (selectedMeals.length === 0) {
//       message.error('Vui lòng chọn ít nhất một món ăn!');
//       return;
//     }

//     const orderDetails: OrderDetailRequest[] = selectedMeals.map(meal => ({
//       mealID: meal.mealID,
//       quantity: meal.quantity,
//     }));

//     const orderData: OrderRequestDTO = {
//       userID: values.userID,
//       tableID: values.tableID,
//       bookingID: values.bookingID || null,
//       statusId: ORDER_STATUS.PENDING.id,
//       orderDetails,
//     };

//     try {
//       await onSubmit(orderData);
//     } catch (error) {
//       // Error handled in parent
//     }
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
//   };

//   return (
//     <div className={`order-form-container ${isFormReady ? 'form-ready' : ''}`}>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//       >
//         <Row gutter={24}>
//           {/* LEFT SIDE - Menu Selection */}
//           <Col span={14}>
//             <Card
//               title={
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShoppingBag className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-semibold">Thực đơn</span>
//                     <Badge count={meals.length} showZero color="#1890ff" />
//                   </div>
//                   <Input
//                     prefix={<Search className="w-4 h-4 text-gray-400" />}
//                     placeholder="Tìm món ăn..."
//                     value={searchMeal}
//                     onChange={(e) => setSearchMeal(e.target.value)}
//                     className="w-72"
//                     allowClear
//                     size="large"
//                   />
//                 </div>
//               }
//               className="menu-card shadow-lg"
//               bodyStyle={{ padding: '16px', height: '600px', overflowY: 'auto' }}
//             >
//               {loadingMeals ? (
//                 <div className="flex justify-center items-center h-full">
//                   <Spin size="large" tip="Đang tải thực đơn..." />
//                 </div>
//               ) : filteredMeals.length === 0 ? (
//                 <Empty
//                   description={searchMeal ? 'Không tìm thấy món ăn phù hợp' : 'Không có món ăn nào'}
//                   image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 />
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   {filteredMeals.map((meal) => {
//                     const isSelected = selectedMeals.find(m => m.mealID === meal.mealID);
//                     return (
//                       <Card
//                         key={meal.mealID}
//                         hoverable
//                         onClick={() => handleAddMeal(meal)}
//                         className={`meal-card ${isSelected ? 'meal-selected' : ''}`}
//                         bodyStyle={{ padding: '12px' }}
//                       >
//                         <Badge
//                           count={isSelected?.quantity || 0}
//                           showZero={false}
//                           offset={[-5, 5]}
//                           style={{ backgroundColor: '#52c41a' }}
//                         >
//                           <Avatar
//                             size={64}
//                             src={meal.image}
//                             shape="square"
//                             className="meal-avatar"
//                           >
//                             {!meal.image && '🍽️'}
//                           </Avatar>
//                         </Badge>
//                         <div className="mt-2">
//                           <Tooltip title={meal.mealName}>
//                             <div className="font-semibold text-sm truncate">{meal.mealName}</div>
//                           </Tooltip>
//                           <Tag color="blue" className="text-xs mt-1">{meal.categoryName}</Tag>
//                           <div className="font-bold text-green-600 mt-1 text-base">
//                             {formatCurrency(meal.price)}
//                           </div>
//                         </div>
//                         <div className="absolute top-2 right-2">
//                           <Plus className="w-5 h-5 text-white bg-blue-500 rounded-full p-1 add-icon" />
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </Card>
//           </Col>

//           {/* RIGHT SIDE - Order Details */}
//           <Col span={10}>
//             <Card
//               title={
//                 <div className="flex items-center gap-2">
//                   <ShoppingCart className="w-5 h-5 text-orange-600" />
//                   <span className="font-semibold">Đơn hàng</span>
//                   <Badge
//                     count={calculateTotalItems()}
//                     showZero
//                     style={{ backgroundColor: '#ff4d4f' }}
//                   />
//                 </div>
//               }
//               className="order-detail-card shadow-lg"
//               bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '600px' }}
//             >
//               {/* Customer & Table Selection */}
//               <Space direction="vertical" className="w-full mb-3" size="small">
//                 <Form.Item
//                   name="userID"
//                   label={
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <User className="w-4 h-4 text-blue-600" />
//                       Khách hàng
//                     </span>
//                   }
//                   rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
//                   className="mb-2"
//                 >
//                   <Select
//                     placeholder="Chọn khách hàng"
//                     size="large"
//                     showSearch
//                     loading={loadingUsers}
//                     filterOption={(input, option) =>
//                       ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
//                     }
//                     options={users.map(user => ({
//                       value: user.userID,
//                       label: `${user.fullName}${user.phone ? ` - ${user.phone}` : ''}`,
//                     }))}
//                     notFoundContent={loadingUsers ? <Spin size="small" /> : 'Không có dữ liệu'}
//                     className="custom-select"
//                   />
//                 </Form.Item>

//                 <Form.Item
//                   name="tableID"
//                   label={
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <MapPin className="w-4 h-4 text-green-600" />
//                       Bàn
//                     </span>
//                   }
//                   rules={[{ required: true, message: 'Vui lòng chọn bàn!' }]}
//                   className="mb-2"
//                 >
//                   <Select
//                     placeholder="Chọn bàn"
//                     size="large"
//                     loading={loadingTables}
//                     notFoundContent={loadingTables ? <Spin size="small" /> : 'Không có dữ liệu'}
//                     className="custom-select"
//                   >
//                     {tables.map(table => (
//                       <Select.Option
//                         key={table.tableID}
//                         value={table.tableID}
//                         disabled={!table.isAvailable}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{table.tableName}</span>
//                           <Space size={4}>
//                             <Tag color={table.isAvailable ? 'green' : 'red'} className="text-xs">
//                               {table.statusName}
//                             </Tag>
//                             <span className="text-gray-400 text-xs">
//                               {table.capacity} chỗ
//                             </span>
//                           </Space>
//                         </div>
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="bookingID"
//                   label={<span className="text-sm font-medium">Booking ID (tùy chọn)</span>}
//                   className="mb-0"
//                 >
//                   <InputNumber
//                     placeholder="Nhập mã đặt bàn"
//                     className="w-full"
//                     size="large"
//                     min={1}
//                   />
//                 </Form.Item>
//               </Space>

//               <Divider className="my-3" />

//               {/* Selected Meals List */}
//               <div className="flex-1 overflow-auto meals-list mb-3">
//                 {selectedMeals.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
//                     <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
//                     <p className="text-base">Chưa có món nào được chọn</p>
//                     <p className="text-xs mt-1">Chọn món từ thực đơn bên trái</p>
//                   </div>
//                 ) : (
//                   <Space direction="vertical" className="w-full" size="middle">
//                     {selectedMeals.map((meal, index) => (
//                       <Card
//                         key={meal.mealID}
//                         size="small"
//                         className="meal-item-card"
//                         style={{ animationDelay: `${index * 0.05}s` }}
//                       >
//                         <div className="flex items-start gap-3">
//                           <Avatar
//                             size={48}
//                             src={meal.image}
//                             shape="square"
//                             className="flex-shrink-0"
//                           >
//                             {!meal.image && '🍽️'}
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-semibold text-sm mb-1 truncate">{meal.mealName}</div>
//                             <div className="text-xs text-gray-500 mb-2">
//                               {formatCurrency(meal.price)} x {meal.quantity}
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 icon={<Minus className="w-3 h-3" />}
//                                 onClick={() => handleDecrement(meal.mealID)}
//                                 className="quantity-btn"
//                               />
//                               <span className="font-semibold text-base px-2 min-w-[32px] text-center">
//                                 {meal.quantity}
//                               </span>
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 icon={<Plus className="w-3 h-3" />}
//                                 onClick={() => handleIncrement(meal.mealID)}
//                                 className="quantity-btn"
//                               />
//                               <Button
//                                 type="text"
//                                 danger
//                                 size="small"
//                                 icon={<Trash2 className="w-3 h-3" />}
//                                 onClick={() => handleRemoveMeal(meal.mealID)}
//                                 className="ml-auto"
//                               />
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <div className="font-bold text-green-600 text-base whitespace-nowrap">
//                               {formatCurrency(meal.price * meal.quantity)}
//                             </div>
//                           </div>
//                         </div>
//                       </Card>
//                     ))}
//                   </Space>
//                 )}
//               </div>

//               {/* Total & Actions */}
//               <div className="order-summary">
//                 <Divider className="my-3" />
//                 <div className="summary-detail">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-600">Tổng số món:</span>
//                     <span className="font-semibold">{calculateTotalItems()}</span>
//                   </div>
//                   <div className="flex justify-between items-center mb-3">
//                     <span className="text-base font-semibold">Tổng tiền:</span>
//                     <span className="text-2xl font-bold text-green-600">
//                       {formatCurrency(calculateTotal())}
//                     </span>
//                   </div>
//                 </div>

//                 <Space className="w-full" size="middle">
//                   <Button
//                     onClick={onCancel}
//                     size="large"
//                     block
//                     disabled={isLoading}
//                     className="cancel-btn"
//                   >
//                     Hủy
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     size="large"
//                     block
//                     loading={isLoading}
//                     disabled={selectedMeals.length === 0}
//                     className="submit-btn"
//                     icon={<CheckCircle className="w-4 h-4" />}
//                   >
//                     {initialData ? 'Cập nhật' : 'Tạo đơn hàng'}
//                   </Button>
//                 </Space>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Form>
//     </div>
//   );
// };

// export default OrderForm;












// import React, { useState, useEffect } from "react";
// import { Form, Select, InputNumber, Card, Row, Col, Tag, Space, Divider, message, Input, Avatar, Button, Spin, Badge, Tooltip, Empty } from "antd";
// import { ShoppingCart, Trash2, User, MapPin, Search, Plus, Minus, ShoppingBag, CheckCircle, UserPlus } from "lucide-react";
// import {
//   type MealOption,
//   type TableOption,
//   type UserOption,
//   type OrderRequestDTO,
//   type OrderDTO,
//   type OrderDetailRequest
// } from "../../../service/orderService";
// import { ORDER_STATUS } from "../../../lib/constants/constants";
// import AddCustomerModal from "../customerModal/AddCustomerModal";
// import '../../css/OrderForm.css';
// import Cookies from 'js-cookie';

// interface MealItem extends MealOption {
//   quantity: number;
// }

// interface OrderFormProps {
//   initialData?: OrderDTO | null;
//   meals: MealOption[];
//   tables: TableOption[];
//   users: UserOption[];
//   loadingMeals: boolean;
//   loadingTables: boolean;
//   loadingUsers: boolean;
//   onSubmit: (data: OrderRequestDTO) => Promise<void>;
//   onCancel: () => void;
//   isLoading: boolean;
//   onUserAdded?: (newUser: UserOption) => void;
// }

// const OrderForm: React.FC<OrderFormProps> = ({
//   initialData,
//   meals = [],
//   tables = [],
//   users = [],
//   loadingMeals = false,
//   loadingTables = false,
//   loadingUsers = false,
//   onSubmit,
//   onCancel,
//   isLoading = false,
//   onUserAdded
// }) => {
//   const [form] = Form.useForm();
//   const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);
//   const [searchMeal, setSearchMeal] = useState("");
//   const [isFormReady, setIsFormReady] = useState(false);
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
//   const [localUsers, setLocalUsers] = useState<UserOption[]>(users);
//   const token = Cookies.get('authToken') || '';

//   // Sync users prop with local state
//   useEffect(() => {
//     setLocalUsers(users);
//   }, [users]);

//   // Animation on mount
//   useEffect(() => {
//     setTimeout(() => setIsFormReady(true), 100);
//   }, []);

//   // Load initial data if editing
//   useEffect(() => {
//     if (initialData) {
//       form.setFieldsValue({
//         userID: initialData.userID,
//         tableID: initialData.tableID,
//         bookingID: initialData.bookingID,
//       });
      
//       if (initialData.orderDetails && meals.length > 0) {
//         const mealItems: MealItem[] = initialData.orderDetails.map(detail => {
//           const meal = meals.find(m => m.mealID === detail.mealID);
//           return {
//             mealID: detail.mealID,
//             mealName: detail.mealName,
//             price: detail.mealPrice,
//             quantity: detail.quantity,
//             categoryName: meal?.categoryName || '',
//             image: meal?.image || '',
//             statusId: 1,
//           };
//         });
//         setSelectedMeals(mealItems);
//       }
//     }
//   }, [initialData, meals, form]);

//   const filteredMeals = meals.filter(meal =>
//     meal.mealName.toLowerCase().includes(searchMeal.toLowerCase())
//   );

//   const handleAddMeal = (meal: MealOption) => {
//     const existingMeal = selectedMeals.find(m => m.mealID === meal.mealID);
//     if (existingMeal) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === meal.mealID ? { ...m, quantity: m.quantity + 1 } : m
//         )
//       );
//       message.success({
//         content: `Đã tăng ${meal.mealName} lên ${existingMeal.quantity + 1}`,
//         icon: <Plus className="text-green-500" />,
//         duration: 2,
//       });
//     } else {
//       setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
//       message.success({
//         content: `Đã thêm ${meal.mealName}`,
//         icon: <CheckCircle className="text-green-500" />,
//         duration: 2,
//       });
//     }
//   };

//   const handleUpdateQuantity = (mealID: number, quantity: number) => {
//     if (quantity <= 0) {
//       handleRemoveMeal(mealID);
//       return;
//     }
//     setSelectedMeals(
//       selectedMeals.map(m =>
//         m.mealID === mealID ? { ...m, quantity } : m
//       )
//     );
//   };

//   const handleIncrement = (mealID: number) => {
//     setSelectedMeals(
//       selectedMeals.map(m =>
//         m.mealID === mealID ? { ...m, quantity: m.quantity + 1 } : m
//       )
//     );
//   };

//   const handleDecrement = (mealID: number) => {
//     const meal = selectedMeals.find(m => m.mealID === mealID);
//     if (meal && meal.quantity > 1) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === mealID ? { ...m, quantity: m.quantity - 1 } : m
//         )
//       );
//     } else {
//       handleRemoveMeal(mealID);
//     }
//   };

//   const handleRemoveMeal = (mealID: number) => {
//     setSelectedMeals(selectedMeals.filter(m => m.mealID !== mealID));
//     message.info({
//       content: 'Đã xóa món khỏi đơn hàng',
//       duration: 2,
//     });
//   };

//   const calculateTotal = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.price * meal.quantity, 0);
//   };

//   const calculateTotalItems = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.quantity, 0);
//   };

//   const handleCustomerAdded = (newUser: UserOption) => {
//     // Add to local state immediately
//     setLocalUsers(prev => [newUser, ...prev]);
    
//     // Set as selected user in form
//     form.setFieldValue('userID', newUser.userID);
    
//     // Notify parent component
//     if (onUserAdded) {
//       onUserAdded(newUser);
//     }

//     message.success({
//       content: `Đã thêm và chọn khách hàng: ${newUser.fullName}`,
//       icon: '✅',
//       duration: 3,
//     });
//   };

//   const handleSubmit = async (values: any) => {
//     if (selectedMeals.length === 0) {
//       message.error('Vui lòng chọn ít nhất một món ăn!');
//       return;
//     }

//     const orderDetails: OrderDetailRequest[] = selectedMeals.map(meal => ({
//       mealID: meal.mealID,
//       quantity: meal.quantity,
//     }));

//     const orderData: OrderRequestDTO = {
//       userID: values.userID,
//       tableID: values.tableID,
//       bookingID: values.bookingID || null,
//       statusId: ORDER_STATUS.PENDING.id,
//       orderDetails,
//     };

//     try {
//       await onSubmit(orderData);
//     } catch (error) {
//       // Error handled in parent
//     }
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
//   };

//   return (
//     <div className={`order-form-container ${isFormReady ? 'form-ready' : ''}`}>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//       >
//         <Row gutter={24}>
//           {/* LEFT SIDE - Menu Selection */}
//           <Col span={14}>
//             <Card
//               title={
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShoppingBag className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-semibold">Thực đơn</span>
//                     <Badge count={meals.length} showZero color="#1890ff" />
//                   </div>
//                   <Input
//                     prefix={<Search className="w-4 h-4 text-gray-400" />}
//                     placeholder="Tìm món ăn..."
//                     value={searchMeal}
//                     onChange={(e) => setSearchMeal(e.target.value)}
//                     className="w-72"
//                     allowClear
//                     size="large"
//                   />
//                 </div>
//               }
//               className="menu-card shadow-lg"
//               bodyStyle={{ padding: '16px', height: '600px', overflowY: 'auto' }}
//             >
//               {loadingMeals ? (
//                 <div className="flex justify-center items-center h-full">
//                   <Spin size="large" tip="Đang tải thực đơn..." />
//                 </div>
//               ) : filteredMeals.length === 0 ? (
//                 <Empty
//                   description={searchMeal ? 'Không tìm thấy món ăn phù hợp' : 'Không có món ăn nào'}
//                   image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 />
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   {filteredMeals.map((meal) => {
//                     const isSelected = selectedMeals.find(m => m.mealID === meal.mealID);
//                     return (
//                       <Card
//                         key={meal.mealID}
//                         hoverable
//                         onClick={() => handleAddMeal(meal)}
//                         className={`meal-card ${isSelected ? 'meal-selected' : ''}`}
//                         bodyStyle={{ padding: '12px' }}
//                       >
//                         <Badge
//                           count={isSelected?.quantity || 0}
//                           showZero={false}
//                           offset={[-5, 5]}
//                           style={{ backgroundColor: '#52c41a' }}
//                         >
//                           <Avatar
//                             size={64}
//                             src={meal.image}
//                             shape="square"
//                             className="meal-avatar"
//                           >
//                             {!meal.image && '🍽️'}
//                           </Avatar>
//                         </Badge>
//                         <div className="mt-2">
//                           <Tooltip title={meal.mealName}>
//                             <div className="font-semibold text-sm truncate">{meal.mealName}</div>
//                           </Tooltip>
//                           <Tag color="blue" className="text-xs mt-1">{meal.categoryName}</Tag>
//                           <div className="font-bold text-green-600 mt-1 text-base">
//                             {formatCurrency(meal.price)}
//                           </div>
//                         </div>
//                         <div className="absolute top-2 right-2">
//                           <Plus className="w-5 h-5 text-white bg-blue-500 rounded-full p-1 add-icon" />
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </Card>
//           </Col>

//           {/* RIGHT SIDE - Order Details */}
//           <Col span={10}>
//             <Card
//               title={
//                 <div className="flex items-center gap-2">
//                   <ShoppingCart className="w-5 h-5 text-orange-600" />
//                   <span className="font-semibold">Đơn hàng</span>
//                   <Badge
//                     count={calculateTotalItems()}
//                     showZero
//                     style={{ backgroundColor: '#ff4d4f' }}
//                   />
//                 </div>
//               }
//               className="order-detail-card shadow-lg"
//               bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '600px' }}
//             >
//               {/* Customer & Table Selection */}
//               <Space direction="vertical" className="w-full mb-3" size="small">
//                 <Form.Item
//                   name="userID"
//                   label={
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <User className="w-4 h-4 text-blue-600" />
//                       Khách hàng
//                     </span>
//                   }
//                   rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
//                   className="mb-2"
//                 >
//                   <Space.Compact style={{ width: '100%' }}>
//                     <Select
//                       placeholder="Chọn khách hàng"
//                       size="large"
//                       showSearch
//                       loading={loadingUsers}
//                       style={{ width: 'calc(100% - 44px)' }}
//                       filterOption={(input, option) =>
//                         ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
//                       }
//                       options={localUsers.map(user => ({
//                         value: user.userID,
//                         label: `${user.fullName}${user.phone ? ` - ${user.phone}` : ''}`,
//                       }))}
//                       notFoundContent={
//                         loadingUsers ? (
//                           <div className="text-center py-2">
//                             <Spin size="small" />
//                           </div>
//                         ) : (
//                           <div className="text-center py-2 text-gray-400">
//                             Không có khách hàng nào
//                           </div>
//                         )
//                       }
//                       className="custom-select"
//                     />
//                     <Tooltip title="Thêm khách hàng mới">
//                       <Button
//                         size="large"
//                         type="primary"
//                         icon={<UserPlus className="w-4 h-4" />}
//                         onClick={() => setShowAddCustomerModal(true)}
//                         className="add-customer-btn"
//                         style={{
//                           background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                           border: 'none',
//                           height: '40px',
//                         }}
//                       />
//                     </Tooltip>
//                   </Space.Compact>
//                 </Form.Item>

//                 <Form.Item
//                   name="tableID"
//                   label={
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <MapPin className="w-4 h-4 text-green-600" />
//                       Bàn
//                     </span>
//                   }
//                   rules={[{ required: true, message: 'Vui lòng chọn bàn!' }]}
//                   className="mb-2"
//                 >
//                   <Select
//                     placeholder="Chọn bàn"
//                     size="large"
//                     loading={loadingTables}
//                     notFoundContent={
//                       loadingTables ? (
//                         <div className="text-center py-2">
//                           <Spin size="small" />
//                         </div>
//                       ) : (
//                         <div className="text-center py-2 text-gray-400">
//                           Không có bàn nào
//                         </div>
//                       )
//                     }
//                     className="custom-select"
//                   >
//                     {tables.map(table => (
//                       <Select.Option
//                         key={table.tableID}
//                         value={table.tableID}
//                         disabled={!table.isAvailable}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{table.tableName}</span>
//                           <Space size={4}>
//                             <Tag color={table.isAvailable ? 'green' : 'red'} className="text-xs">
//                               {table.statusName}
//                             </Tag>
//                             <span className="text-gray-400 text-xs">
//                               {table.capacity} chỗ
//                             </span>
//                           </Space>
//                         </div>
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="bookingID"
//                   label={<span className="text-sm font-medium">Booking ID (tùy chọn)</span>}
//                   className="mb-0"
//                 >
//                   <InputNumber
//                     placeholder="Nhập mã đặt bàn"
//                     className="w-full"
//                     size="large"
//                     min={1}
//                   />
//                 </Form.Item>
//               </Space>

//               <Divider className="my-3" />

//               {/* Selected Meals List */}
//               <div className="flex-1 overflow-auto meals-list mb-3">
//                 {selectedMeals.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
//                     <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
//                     <p className="text-base">Chưa có món nào được chọn</p>
//                     <p className="text-xs mt-1">Chọn món từ thực đơn bên trái</p>
//                   </div>
//                 ) : (
//                   <Space direction="vertical" className="w-full" size="middle">
//                     {selectedMeals.map((meal, index) => (
//                       <Card
//                         key={meal.mealID}
//                         size="small"
//                         className="meal-item-card"
//                         style={{ animationDelay: `${index * 0.05}s` }}
//                       >
//                         <div className="flex items-start gap-3">
//                           <Avatar
//                             size={48}
//                             src={meal.image}
//                             shape="square"
//                             className="flex-shrink-0"
//                           >
//                             {!meal.image && '🍽️'}
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-semibold text-sm mb-1 truncate">{meal.mealName}</div>
//                             <div className="text-xs text-gray-500 mb-2">
//                               {formatCurrency(meal.price)} x {meal.quantity}
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 icon={<Minus className="w-3 h-3" />}
//                                 onClick={() => handleDecrement(meal.mealID)}
//                                 className="quantity-btn"
//                               />
//                               <span className="font-semibold text-base px-2 min-w-[32px] text-center">
//                                 {meal.quantity}
//                               </span>
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 icon={<Plus className="w-3 h-3" />}
//                                 onClick={() => handleIncrement(meal.mealID)}
//                                 className="quantity-btn"
//                               />
//                               <Button
//                                 type="text"
//                                 danger
//                                 size="small"
//                                 icon={<Trash2 className="w-3 h-3" />}
//                                 onClick={() => handleRemoveMeal(meal.mealID)}
//                                 className="ml-auto"
//                               />
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <div className="font-bold text-green-600 text-base whitespace-nowrap">
//                               {formatCurrency(meal.price * meal.quantity)}
//                             </div>
//                           </div>
//                         </div>
//                       </Card>
//                     ))}
//                   </Space>
//                 )}
//               </div>

//               {/* Total & Actions */}
//               <div className="order-summary">
//                 <Divider className="my-3" />
//                 <div className="summary-detail">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-600">Tổng số món:</span>
//                     <span className="font-semibold">{calculateTotalItems()}</span>
//                   </div>
//                   <div className="flex justify-between items-center mb-3">
//                     <span className="text-base font-semibold">Tổng tiền:</span>
//                     <span className="text-2xl font-bold text-green-600">
//                       {formatCurrency(calculateTotal())}
//                     </span>
//                   </div>
//                 </div>

//                 <Space className="w-full" size="middle">
//                   <Button
//                     onClick={onCancel}
//                     size="large"
//                     block
//                     disabled={isLoading}
//                     className="cancel-btn"
//                   >
//                     Hủy
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     size="large"
//                     block
//                     loading={isLoading}
//                     disabled={selectedMeals.length === 0}
//                     className="submit-btn"
//                     icon={<CheckCircle className="w-4 h-4" />}
//                   >
//                     {initialData ? 'Cập nhật' : 'Tạo đơn hàng'}
//                   </Button>
//                 </Space>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Form>

//       {/* Add Customer Modal */}
//       <AddCustomerModal
//         visible={showAddCustomerModal}
//         onClose={() => setShowAddCustomerModal(false)}
//         onSuccess={handleCustomerAdded}
//         token={token}
//       />
//     </div>
//   );
// };

// export default OrderForm;







// import React, { useState, useEffect } from "react";
// import { Form, Select, InputNumber, Card, Row, Col, Tag, Space, Divider, message, Input, Avatar, Button, Spin, Badge, Tooltip, Empty, Alert } from "antd";
// import { ShoppingCart, Trash2, User, MapPin, Search, Plus, Minus, ShoppingBag, CheckCircle, UserPlus, Phone, Mail } from "lucide-react";
// import {
//   type MealOption,
//   type TableOption,
//   type UserOption,
//   type OrderRequestDTO,
//   type OrderDTO,
//   type OrderDetailRequest
// } from "../../../service/orderService";
// import { ORDER_STATUS } from "../../../lib/constants/constants";
// import AddCustomerModal from "../customerModal/AddCustomerModal";
// import '../../css/OrderForm.css';
// import Cookies from 'js-cookie';

// interface MealItem extends MealOption {
//   quantity: number;
// }

// interface OrderFormProps {
//   initialData?: OrderDTO | null;
//   meals: MealOption[];
//   tables: TableOption[];
//   users: UserOption[];
//   loadingMeals: boolean;
//   loadingTables: boolean;
//   loadingUsers: boolean;
//   onSubmit: (data: OrderRequestDTO) => Promise<void>;
//   onCancel: () => void;
//   isLoading: boolean;
//   onUserAdded?: (newUser: UserOption) => void;
// }

// const OrderForm: React.FC<OrderFormProps> = ({
//   initialData,
//   meals = [],
//   tables = [],
//   users = [],
//   loadingMeals = false,
//   loadingTables = false,
//   loadingUsers = false,
//   onSubmit,
//   onCancel,
//   isLoading = false,
//   onUserAdded
// }) => {
//   const [form] = Form.useForm();
//   const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);
//   const [searchMeal, setSearchMeal] = useState("");
//   const [isFormReady, setIsFormReady] = useState(false);
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
//   const [localUsers, setLocalUsers] = useState<UserOption[]>(users);
//   const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
//   const token = Cookies.get('authToken') || '';

//   // Helper function to get userId from user object (handles both userId and userID)
//   const getUserId = (user: UserOption): number => {
//     return user.userID || 0;
//   };

//   // Helper function to get phone from user object
//   const getUserPhone = (user: UserOption): string => {
//     return user.phone || '';
//   };

//   // Sync users prop with local state
//   useEffect(() => {
//     console.log('📋 Users updated:', users.length);
//     setLocalUsers(users);
    
//     // Update selectedUser if form has a value
//     const currentUserId = form.getFieldValue('userID');
//     if (currentUserId && users.length > 0) {
//       const user = users.find(u => getUserId(u) === currentUserId);
//       if (user) {
//         console.log('Auto-selected user from updated list:', user);
//         setSelectedUser(user);
//       }
//     }
//   }, [users, form]);

//   // Animation on mount
//   useEffect(() => {
//     setTimeout(() => setIsFormReady(true), 100);
//   }, []);

//   // Load initial data if editing
//   useEffect(() => {
//     if (initialData && localUsers.length > 0) {
//       console.log('Loading initial data:', initialData);
      
//       form.setFieldsValue({
//         userID: initialData.userID,
//         tableID: initialData.tableID,
//         bookingID: initialData.bookingID,
//       });
      
//       // Find and set selected user
//       const user = localUsers.find(u => getUserId(u) === initialData.userID);
//       if (user) {
//         console.log('Found initial user:', user);
//         setSelectedUser(user);
//       }
      
//       if (initialData.orderDetails && meals.length > 0) {
//         const mealItems: MealItem[] = initialData.orderDetails.map(detail => {
//           const meal = meals.find(m => m.mealID === detail.mealID);
//           return {
//             mealID: detail.mealID,
//             mealName: detail.mealName,
//             price: detail.mealPrice,
//             quantity: detail.quantity,
//             categoryName: meal?.categoryName || '',
//             image: meal?.image || '',
//             statusId: 1,
//           };
//         });
//         setSelectedMeals(mealItems);
//       }
//     }
//   }, [initialData, meals, form, localUsers]);

//   const filteredMeals = meals.filter(meal =>
//     meal.mealName.toLowerCase().includes(searchMeal.toLowerCase())
//   );

//   // Handle user selection change
//   const handleUserChange = (userId: number) => {
//     console.log('User selected - ID:', userId);
    
//     const user = localUsers.find(u => getUserId(u) === userId);
//     console.log('Found user:', user);
    
//     if (user) {
//       setSelectedUser(user);
//       console.log('Selected user details:', {
//         id: getUserId(user),
//         fullName: user.fullName,
//         phone: getUserPhone(user),
//         email: user.email
//       });
//     } else {
//       console.warn('⚠️ User not found for ID:', userId);
//       setSelectedUser(null);
//     }
//   };

//   const handleAddMeal = (meal: MealOption) => {
//     const existingMeal = selectedMeals.find(m => m.mealID === meal.mealID);
//     if (existingMeal) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === meal.mealID ? { ...m, quantity: m.quantity + 1 } : m
//         )
//       );
//       message.success({
//         content: `Đã tăng ${meal.mealName} lên ${existingMeal.quantity + 1}`,
//         icon: <Plus className="text-green-500" />,
//         duration: 2,
//       });
//     } else {
//       setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
//       message.success({
//         content: `Đã thêm ${meal.mealName}`,
//         icon: <CheckCircle className="text-green-500" />,
//         duration: 2,
//       });
//     }
//   };

//   const handleIncrement = (mealID: number) => {
//     setSelectedMeals(
//       selectedMeals.map(m =>
//         m.mealID === mealID ? { ...m, quantity: m.quantity + 1 } : m
//       )
//     );
//   };

//   const handleDecrement = (mealID: number) => {
//     const meal = selectedMeals.find(m => m.mealID === mealID);
//     if (meal && meal.quantity > 1) {
//       setSelectedMeals(
//         selectedMeals.map(m =>
//           m.mealID === mealID ? { ...m, quantity: m.quantity - 1 } : m
//         )
//       );
//     } else {
//       handleRemoveMeal(mealID);
//     }
//   };

//   const handleRemoveMeal = (mealID: number) => {
//     setSelectedMeals(selectedMeals.filter(m => m.mealID !== mealID));
//     message.info({
//       content: 'Đã xóa món khỏi đơn hàng',
//       duration: 2,
//     });
//   };

//   const calculateTotal = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.price * meal.quantity, 0);
//   };

//   const calculateTotalItems = () => {
//     return selectedMeals.reduce((sum, meal) => sum + meal.quantity, 0);
//   };

// const handleCustomerAdded = (newUser: UserOption) => {
//   console.log('✅ New customer added:', newUser);
  
//   const userId = getUserId(newUser);
  
//   // Add to local state
//   setLocalUsers(prev => {
//     const updated = [newUser, ...prev];
//     console.log('📋 Updated local users:', updated.length);
//     return updated;
//   });
  
//   // Set form value
//   form.setFieldValue('userID', userId);
  
//   // ✅ Set selected user để hiển thị thông tin
//   setSelectedUser(newUser);
  
//   // ✅ Đóng modal
//   setShowAddCustomerModal(false);
  
//   console.log('✅ Form value set:', form.getFieldValue('userID'));
//   console.log('✅ Selected user set:', newUser.fullName);
//   console.log('✅ Modal closed');
  
//   // Notify parent
//   if (onUserAdded) {
//     onUserAdded(newUser);
//   }

//   message.success({
//     content: `Đã thêm và chọn: ${newUser.fullName}`,
//     icon: '✅',
//     duration: 3,
//   });
// };
    
//   // ✅ Handle form submit with proper userID
//   const handleSubmit = async (values: any) => {
//     if (selectedMeals.length === 0) {
//       message.error('Vui lòng chọn ít nhất một món ăn!');
//       return;
//     }

//     // ✅ Get userId from form value (can be userId or userID from API)
//     const userId = values.userID;
    
//     console.log('📤 Submitting order with userID:', userId);
//     console.log('📤 Selected user:', selectedUser);

//     const orderDetails: OrderDetailRequest[] = selectedMeals.map(meal => ({
//       mealID: meal.mealID,
//       quantity: meal.quantity,
//     }));

//     const orderData: OrderRequestDTO = {
//       userID: userId, // ✅ Use the ID from form
//       tableID: values.tableID,
//       bookingID: values.bookingID || null,
//       statusId: ORDER_STATUS.PENDING.id,
//       orderDetails,
//     };

//     console.log('📤 Order data:', orderData);

//     try {
//       await onSubmit(orderData);
//     } catch (error) {
//       console.error('❌ Submit error:', error);
//     }
//   };

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
//   };

//   return (
//     <div className={`order-form-container ${isFormReady ? 'form-ready' : ''}`}>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//       >
//         <Row gutter={24}>
//           {/* LEFT SIDE - Menu Selection */}
//           <Col span={14}>
//             <Card
//               title={
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShoppingBag className="w-5 h-5 text-blue-600" />
//                     <span className="text-lg font-semibold">Thực đơn</span>
//                     <Badge count={meals.length} showZero color="#1890ff" />
//                   </div>
//                   <Input
//                     prefix={<Search className="w-4 h-4 text-gray-400" />}
//                     placeholder="Tìm món ăn..."
//                     value={searchMeal}
//                     onChange={(e) => setSearchMeal(e.target.value)}
//                     className="w-72"
//                     allowClear
//                     size="large"
//                   />
//                 </div>
//               }
//               className="menu-card shadow-lg"
//               bodyStyle={{ padding: '16px', height: '600px', overflowY: 'auto' }}
//             >
//               {loadingMeals ? (
//                 <div className="flex justify-center items-center h-full">
//                   <Spin size="large" tip="Đang tải thực đơn..." />
//                 </div>
//               ) : filteredMeals.length === 0 ? (
//                 <Empty
//                   description={searchMeal ? 'Không tìm thấy món ăn phù hợp' : 'Không có món ăn nào'}
//                   image={Empty.PRESENTED_IMAGE_SIMPLE}
//                 />
//               ) : (
//                 <div className="grid grid-cols-2 gap-4">
//                   {filteredMeals.map((meal) => {
//                     const isSelected = selectedMeals.find(m => m.mealID === meal.mealID);
//                     return (
//                       <Card
//                         key={meal.mealID}
//                         hoverable
//                         onClick={() => handleAddMeal(meal)}
//                         className={`meal-card ${isSelected ? 'meal-selected' : ''}`}
//                         bodyStyle={{ padding: '12px' }}
//                       >
//                         <Badge
//                           count={isSelected?.quantity || 0}
//                           showZero={false}
//                           offset={[-5, 5]}
//                           style={{ backgroundColor: '#52c41a' }}
//                         >
//                           <Avatar
//                             size={64}
//                             src={meal.image}
//                             shape="square"
//                             className="meal-avatar"
//                           >
//                             {!meal.image && '🍽️'}
//                           </Avatar>
//                         </Badge>
//                         <div className="mt-2">
//                           <Tooltip title={meal.mealName}>
//                             <div className="font-semibold text-sm truncate">{meal.mealName}</div>
//                           </Tooltip>
//                           <Tag color="blue" className="text-xs mt-1">{meal.categoryName}</Tag>
//                           <div className="font-bold text-green-600 mt-1 text-base">
//                             {formatCurrency(meal.price)}
//                           </div>
//                         </div>
//                         <div className="absolute top-2 right-2">
//                           <Plus className="w-5 h-5 text-white bg-blue-500 rounded-full p-1 add-icon" />
//                         </div>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </Card>
//           </Col>

//           {/* RIGHT SIDE - Order Details */}
//           <Col span={10}>
//             <Card
//               title={
//                 <div className="flex items-center gap-2">
//                   <ShoppingCart className="w-5 h-5 text-orange-600" />
//                   <span className="font-semibold">Đơn hàng</span>
//                   <Badge
//                     count={calculateTotalItems()}
//                     showZero
//                     style={{ backgroundColor: '#ff4d4f' }}
//                   />
//                 </div>
//               }
//               className="order-detail-card shadow-lg"
//               bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '600px' }}
//             >
//               {/* Customer & Table Selection */}
//               <Space direction="vertical" className="w-full mb-3" size="small">
//                 <Form.Item
//                   name="userID"
//                   label={
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <User className="w-4 h-4 text-blue-600" />
//                       Khách hàng
//                     </span>
//                   }
//                   rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
//                   className="mb-2"
//                 >
//                   <Space.Compact style={{ width: '100%' }}>
//                     <Select
//                       placeholder="Chọn khách hàng"
//                       size="large"
//                       showSearch
//                       loading={loadingUsers}
//                       disabled={false}
//                       style={{ width: 'calc(100% - 44px)' }}
//                       onChange={handleUserChange}
//                       filterOption={(input, option) =>
//                         ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
//                       }
//                       options={localUsers.map(user => {
//                         const userId = getUserId(user);
//                         const phone = getUserPhone(user);
//                         return {
//                           value: userId,
//                           label: `${user.fullName}${phone ? ` - ${phone}` : ''}`,
//                         };
//                       })}
//                       notFoundContent={
//                         loadingUsers ? (
//                           <div className="text-center py-2">
//                             <Spin size="small" />
//                           </div>
//                         ) : (
//                           <div className="text-center py-2 text-gray-400">
//                             Không có khách hàng nào
//                           </div>
//                         )
//                       }
//                       className="custom-select"
//                     />
//                     <Tooltip title="Thêm khách hàng mới">
//                       <Button
//                         size="large"
//                         type="primary"
//                         icon={<UserPlus className="w-4 h-4" />}
//                         onClick={() => setShowAddCustomerModal(true)}
//                         className="add-customer-btn"
//                         style={{
//                           background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                           border: 'none',
//                           height: '40px',
//                         }}
//                       />
//                     </Tooltip>
//                   </Space.Compact>
//                 </Form.Item>

//                 {/* ✅ Customer Info Display */}
//                 {selectedUser && (
//                   <Alert
//                     message={
//                       <div className="space-y-1.5">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4 text-blue-600" />
//                           <span className="font-semibold text-gray-700">{selectedUser.fullName}</span>
//                         </div>
//                         {getUserPhone(selectedUser) && (
//                           <div className="flex items-center gap-2 text-xs text-gray-600">
//                             <Phone className="w-3 h-3" />
//                             <span>{getUserPhone(selectedUser)}</span>
//                           </div>
//                         )}
//                         {selectedUser.email &&
//                          selectedUser.email !== `${getUserPhone(selectedUser)}@customer.temp` && (
//                           <div className="flex items-center gap-2 text-xs text-gray-600">
//                             <Mail className="w-3 h-3" />
//                             <span className="truncate max-w-[200px]">{selectedUser.email}</span>
//                           </div>
//                         )}
//                       </div>
//                     }
//                     type="info"
//                     showIcon={false}
//                     className="mb-2 customer-info-alert"
//                     style={{
//                       background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
//                       border: '1px solid #7dd3fc',
//                       borderRadius: '8px',
//                       padding: '10px 12px',
//                     }}
//                   />
//                 )}

//                 <Form.Item
//                   name="tableID"
//                   label={
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <MapPin className="w-4 h-4 text-green-600" />
//                       Bàn
//                     </span>
//                   }
//                   rules={[{ required: true, message: 'Vui lòng chọn bàn!' }]}
//                   className="mb-2"
//                 >
//                   <Select
//                     placeholder="Chọn bàn"
//                     size="large"
//                     loading={loadingTables}
//                     notFoundContent={
//                       loadingTables ? (
//                         <div className="text-center py-2">
//                           <Spin size="small" />
//                         </div>
//                       ) : (
//                         <div className="text-center py-2 text-gray-400">
//                           Không có bàn nào
//                         </div>
//                       )
//                     }
//                     className="custom-select"
//                   >
//                     {tables.map(table => (
//                       <Select.Option
//                         key={table.tableID}
//                         value={table.tableID}
//                         disabled={!table.isAvailable}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{table.tableName}</span>
//                           <Space size={4}>
//                             <Tag color={table.isAvailable ? 'green' : 'red'} className="text-xs">
//                               {table.statusName}
//                             </Tag>
//                             <span className="text-gray-400 text-xs">
//                               {table.capacity} chỗ
//                             </span>
//                           </Space>
//                         </div>
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="bookingID"
//                   label={<span className="text-sm font-medium">Booking ID (tùy chọn)</span>}
//                   className="mb-0"
//                 >
//                   <InputNumber
//                     placeholder="Nhập mã đặt bàn"
//                     className="w-full"
//                     size="large"
//                     min={1}
//                   />
//                 </Form.Item>
//               </Space>

//               <Divider className="my-3" />

//               {/* Selected Meals List */}
//               <div className="flex-1 overflow-auto meals-list mb-3">
//                 {selectedMeals.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
//                     <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
//                     <p className="text-base">Chưa có món nào được chọn</p>
//                     <p className="text-xs mt-1">Chọn món từ thực đơn bên trái</p>
//                   </div>
//                 ) : (
//                   <Space direction="vertical" className="w-full" size="middle">
//                     {selectedMeals.map((meal, index) => (
//                       <Card
//                         key={meal.mealID}
//                         size="small"
//                         className="meal-item-card"
//                         style={{ animationDelay: `${index * 0.05}s` }}
//                       >
//                         <div className="flex items-start gap-3">
//                           <Avatar
//                             size={48}
//                             src={meal.image}
//                             shape="square"
//                             className="flex-shrink-0"
//                           >
//                             {!meal.image && '🍽️'}
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-semibold text-sm mb-1 truncate">{meal.mealName}</div>
//                             <div className="text-xs text-gray-500 mb-2">
//                               {formatCurrency(meal.price)} x {meal.quantity}
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 icon={<Minus className="w-3 h-3" />}
//                                 onClick={() => handleDecrement(meal.mealID)}
//                                 className="quantity-btn"
//                               />
//                               <span className="font-semibold text-base px-2 min-w-[32px] text-center">
//                                 {meal.quantity}
//                               </span>
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 icon={<Plus className="w-3 h-3" />}
//                                 onClick={() => handleIncrement(meal.mealID)}
//                                 className="quantity-btn"
//                               />
//                               <Button
//                                 type="text"
//                                 danger
//                                 size="small"
//                                 icon={<Trash2 className="w-3 h-3" />}
//                                 onClick={() => handleRemoveMeal(meal.mealID)}
//                                 className="ml-auto"
//                               />
//                             </div>
//                           </div>
//                           <div className="flex flex-col items-end">
//                             <div className="font-bold text-green-600 text-base whitespace-nowrap">
//                               {formatCurrency(meal.price * meal.quantity)}
//                             </div>
//                           </div>
//                         </div>
//                       </Card>
//                     ))}
//                   </Space>
//                 )}
//               </div>

//               {/* Total & Actions */}
//               <div className="order-summary">
//                 <Divider className="my-3" />
//                 <div className="summary-detail">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-gray-600">Tổng số món:</span>
//                     <span className="font-semibold">{calculateTotalItems()}</span>
//                   </div>
//                   <div className="flex justify-between items-center mb-3">
//                     <span className="text-base font-semibold">Tổng tiền:</span>
//                     <span className="text-2xl font-bold text-green-600">
//                       {formatCurrency(calculateTotal())}
//                     </span>
//                   </div>
//                 </div>

//                 <Space className="w-full" size="middle">
//                   <Button
//                     onClick={onCancel}
//                     size="large"
//                     block
//                     disabled={isLoading}
//                     className="cancel-btn"
//                   >
//                     Hủy
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     size="large"
//                     block
//                     loading={isLoading}
//                     disabled={selectedMeals.length === 0}
//                     className="submit-btn"
//                     icon={<CheckCircle className="w-4 h-4" />}
//                   >
//                     {initialData ? 'Cập nhật' : 'Tạo đơn hàng'}
//                   </Button>
//                 </Space>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Form>

//       {/* Add Customer Modal */}
//       <AddCustomerModal
//         visible={showAddCustomerModal}
//         onClose={() => setShowAddCustomerModal(false)}
//         onSuccess={handleCustomerAdded}
//         token={token}
//       />
//     </div>
//   );
// };

// export default OrderForm;










import React, { useState, useEffect } from "react";
import { Form, Select, InputNumber, Card, Row, Col, Tag, Space, Divider, message, Input, Avatar, Button, Spin, Badge, Tooltip, Empty, Alert } from "antd";
import { ShoppingCart, Trash2, User, MapPin, Search, Plus, Minus, ShoppingBag, CheckCircle, UserPlus, Phone, Mail } from "lucide-react";
import {
  type MealOption,
  type TableOption,
  type UserOption,
  type OrderRequestDTO,
  type OrderDTO,
  type OrderDetailRequest
} from "../../../service/orderService";
import { ORDER_STATUS } from "../../../lib/constants/constants";
import AddCustomerModal from "../CustomerModal/AddCustomerModal";
import '../../css/OrderForm.css';
import Cookies from 'js-cookie';

interface MealItem extends MealOption {
  quantity: number;
}

interface OrderFormProps {
  initialData?: OrderDTO | null;
  meals: MealOption[];
  tables: TableOption[];
  users: UserOption[];
  loadingMeals: boolean;
  loadingTables: boolean;
  loadingUsers: boolean;
  onSubmit: (data: OrderRequestDTO) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  onUserAdded?: (newUser: UserOption) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  initialData,
  meals = [],
  tables = [],
  users = [],
  loadingMeals = false,
  loadingTables = false,
  loadingUsers = false,
  onSubmit,
  onCancel,
  isLoading = false,
  onUserAdded
}) => {
  const [form] = Form.useForm();
  const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);
  const [searchMeal, setSearchMeal] = useState("");
  const [isFormReady, setIsFormReady] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [localUsers, setLocalUsers] = useState<UserOption[]>(users);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const token = Cookies.get('authToken') || '';

  // Watch userId từ form để tự động update selectedUser
  const selectedUserId = Form.useWatch('userId', form);
  console.log("form values:", form.getFieldsValue());
  console.log('Selected User ID (watch):', selectedUserId);
  // Sync users prop với local state
  useEffect(() => {
    console.log('Users updated:', users.length);
    setLocalUsers(users);
  }, [users]);
  console.log('Local Users :', localUsers);
  // Auto update selectedUser khi userId thay đổi trong form
  useEffect(() => {
    if (selectedUserId !== undefined && selectedUserId !== null && localUsers.length > 0) {
      const user = localUsers.find(u => u.userId === selectedUserId);
      console.log('Auto-selecting user for ID:', selectedUserId, 'Found user:', user);
      if (user) {
        console.log('User auto-selected:', user);
        setSelectedUser(user);
      } else {
        setSelectedUser(null);
      }
    } else {
      // UserId chưa có hoặc users chưa load
      if (!selectedUserId) {
        console.log('ℹ️ No userId selected yet');
      }
      if (localUsers.length === 0) {
        console.log('ℹ️ No users loaded yet');
      }
      setSelectedUser(null);
    }
  }, [selectedUserId, localUsers]);
  console.log('Selected User ID from form:', selectedUserId);
  // Animation on mount
  useEffect(() => {
    setTimeout(() => setIsFormReady(true), 100);
  }, []);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      console.log('Loading initial data:', initialData);
      
      form.setFieldsValue({
        userId: initialData.userID,
        tableID: initialData.tableID,
        bookingID: initialData.bookingID,
      });
      
      if (initialData.orderDetails && meals.length > 0) {
        const mealItems: MealItem[] = initialData.orderDetails.map(detail => {
          const meal = meals.find(m => m.mealID === detail.mealID);
          return {
            mealID: detail.mealID,
            mealName: detail.mealName,
            price: detail.mealPrice,
            quantity: detail.quantity,
            categoryName: meal?.categoryName || '',
            image: meal?.image || '',
            statusId: 1,
          };
        });
        setSelectedMeals(mealItems);
      }
    }
  }, [initialData, meals, form, localUsers]);

  const filteredMeals = meals.filter(meal =>
    meal.mealName.toLowerCase().includes(searchMeal.toLowerCase())
  );

  const handleAddMeal = (meal: MealOption) => {
    const existingMeal = selectedMeals.find(m => m.mealID === meal.mealID);
    if (existingMeal) {
      setSelectedMeals(
        selectedMeals.map(m =>
          m.mealID === meal.mealID ? { ...m, quantity: m.quantity + 1 } : m
        )
      );
      message.success({
        content: `Đã tăng ${meal.mealName} lên ${existingMeal.quantity + 1}`,
        icon: <Plus className="text-green-500" />,
        duration: 2,
      });
    } else {
      setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
      message.success({
        content: `Đã thêm ${meal.mealName}`,
        icon: <CheckCircle className="text-green-500" />,
        duration: 2,
      });
    }
  };

  const handleIncrement = (mealID: number) => {
    setSelectedMeals(
      selectedMeals.map(m =>
        m.mealID === mealID ? { ...m, quantity: m.quantity + 1 } : m
      )
    );
  };

  const handleDecrement = (mealID: number) => {
    const meal = selectedMeals.find(m => m.mealID === mealID);
    if (meal && meal.quantity > 1) {
      setSelectedMeals(
        selectedMeals.map(m =>
          m.mealID === mealID ? { ...m, quantity: m.quantity - 1 } : m
        )
      );
    } else {
      handleRemoveMeal(mealID);
    }
  };

  const handleRemoveMeal = (mealID: number) => {
    setSelectedMeals(selectedMeals.filter(m => m.mealID !== mealID));
    message.info({
      content: 'Đã xóa món khỏi đơn hàng',
      duration: 2,
    });
  };

  const calculateTotal = () => {
    return selectedMeals.reduce((sum, meal) => sum + meal.price * meal.quantity, 0);
  };

  const calculateTotalItems = () => {
    return selectedMeals.reduce((sum, meal) => sum + meal.quantity, 0);
  };

  const handleCustomerAdded = (newUser: UserOption) => {
    console.log('New customer added:', newUser);

     setLocalUsers(prev => {
      const updated = [newUser, ...prev];
      console.log('Updated localUsers count:', updated.length);
      return updated;
    });
    form.setFieldValue('userId', newUser.userId);
    setShowAddCustomerModal(false);
    if (onUserAdded) {
      onUserAdded(newUser);
    }
    message.success({
      content: `Đã thêm và chọn: ${newUser.fullName}`,
      icon: '✅',
      duration: 3,
    });
  };
    
  const handleSubmit = async (values: any) => {
    console.log('📤 Raw form values from onFinish:', values);
  console.log('📤 All form fields:', form.getFieldsValue());
    if (selectedMeals.length === 0) {
      message.error('Vui lòng chọn ít nhất một món ăn!');
      return;
    }
    // TẠM THỜI GIẮN CỨNG USERID NẾU KHÔNG CÓ
    const userId = values.userId || form.getFieldValue('userId') || 6; 
    if (!userId) {
    message.error('Vui lòng chọn khách hàng!');
    return;
  }
    const orderDetails: OrderDetailRequest[] = selectedMeals.map(meal => ({
      mealID: meal.mealID,
      quantity: meal.quantity,
    }));

    const orderData: OrderRequestDTO = {
      userID: userId,
      tableID: values.tableID,
      bookingID: values.bookingID || null,
      statusId: ORDER_STATUS.PENDING.id,
      orderDetails,
    };

    console.log('Order data:', orderData);

    try {
      await onSubmit(orderData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className={`order-form-container ${isFormReady ? 'form-ready' : ''}`}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          {/* LEFT SIDE - Menu Selection */}
          <Col span={14}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold">Thực đơn</span>
                    <Badge count={meals.length} showZero color="#1890ff" />
                  </div>
                  <Input
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                    placeholder="Tìm món ăn..."
                    value={searchMeal}
                    onChange={(e) => setSearchMeal(e.target.value)}
                    className="w-72"
                    allowClear
                    size="large"
                  />
                </div>
              }
              className="menu-card shadow-lg"
              bodyStyle={{ padding: '16px', height: '600px', overflowY: 'auto' }}
            >
              {loadingMeals ? (
                <div className="flex justify-center items-center h-full">
                  <Spin size="large" tip="Đang tải thực đơn..." />
                </div>
              ) : filteredMeals.length === 0 ? (
                <Empty
                  description={searchMeal ? 'Không tìm thấy món ăn phù hợp' : 'Không có món ăn nào'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredMeals.map((meal) => {
                    const isSelected = selectedMeals.find(m => m.mealID === meal.mealID);
                    return (
                      <Card
                        key={meal.mealID}
                        hoverable
                        onClick={() => handleAddMeal(meal)}
                        className={`meal-card ${isSelected ? 'meal-selected' : ''}`}
                        bodyStyle={{ padding: '12px' }}
                      >
                        <Badge
                          count={isSelected?.quantity || 0}
                          showZero={false}
                          offset={[-5, 5]}
                          style={{ backgroundColor: '#52c41a' }}
                        >
                          <Avatar
                            size={64}
                            src={meal.image}
                            shape="square"
                            className="meal-avatar"
                          >
                            {!meal.image && '🍽️'}
                          </Avatar>
                        </Badge>
                        <div className="mt-2">
                          <Tooltip title={meal.mealName}>
                            <div className="font-semibold text-sm truncate">{meal.mealName}</div>
                          </Tooltip>
                          <Tag color="blue" className="text-xs mt-1">{meal.categoryName}</Tag>
                          <div className="font-bold text-green-600 mt-1 text-base">
                            {formatCurrency(meal.price)}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Plus className="w-5 h-5 text-white bg-blue-500 rounded-full p-1 add-icon" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </Col>

          {/* RIGHT SIDE - Order Details */}
          <Col span={10}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Đơn hàng</span>
                  <Badge
                    count={calculateTotalItems()}
                    showZero
                    style={{ backgroundColor: '#ff4d4f' }}
                  />
                </div>
              }
              className="order-detail-card shadow-lg"
              bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '600px' }}
            >
              {/* Customer & Table Selection */}
              <Space direction="vertical" className="w-full mb-3" size="small">
                <Form.Item
                  name="userId"
                  label={
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <User className="w-4 h-4 text-blue-600" />
                      Khách hàng
                    </span>
                  }
                  // rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
                  className="mb-2"
                >
                  <Space.Compact style={{ width: '100%' }}>
                    <Select
                      placeholder="Chọn khách hàng"
                      size="large"
                      showSearch
                      loading={loadingUsers}
                      style={{ width: 'calc(100% - 44px)' }}
                      filterOption={(input, option) =>
                        ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={localUsers.map(user => ({
                        value: user.userId,
                        label: `${user.fullName}${user.phoneNumber ? ` - ${user.phoneNumber}` : ''}`,
                      }))}
                      notFoundContent={
                        loadingUsers ? (
                          <div className="text-center py-2">
                            <Spin size="small" />
                          </div>
                        ) : (
                          <div className="text-center py-2 text-gray-400">
                            Không có khách hàng nào
                          </div>
                        )
                      }
                      className="custom-select"
                    />
                    <Tooltip title="Thêm khách hàng mới">
                      <Button
                        size="large"
                        type="primary"
                        icon={<UserPlus className="w-4 h-4" />}
                        onClick={() => setShowAddCustomerModal(true)}
                        className="add-customer-btn"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none',
                          height: '40px',
                        }}
                      />
                    </Tooltip>
                  </Space.Compact>
                </Form.Item>

                {/* Customer Info Display - Sử dụng backend format */}
                {selectedUser && (
                  <Alert
                    message={
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-700">{selectedUser.fullName}</span>
                        </div>
                        {selectedUser.phoneNumber && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{selectedUser.phoneNumber}</span>
                          </div>
                        )}
                        {selectedUser.email && 
                         selectedUser.email !== `${selectedUser.phoneNumber}@customer.temp` && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{selectedUser.email}</span>
                          </div>
                        )}
                      </div>
                    }
                    type="info"
                    showIcon={false}
                    className="mb-2 customer-info-alert"
                    style={{
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                      border: '1px solid #7dd3fc',
                      borderRadius: '8px',
                      padding: '10px 12px',
                    }}
                  />
                )}

                {/* Table Select - Sử dụng statusId thay vì isAvailable */}
                <Form.Item
                  name="tableID"
                  label={
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Bàn
                    </span>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn bàn!' }]}
                  className="mb-2"
                >
                  <Select
                    placeholder="Chọn bàn"
                    size="large"
                    showSearch
                    loading={loadingTables}
                    filterOption={(input, option) =>
                      (option?.children?.toString() || '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={
                      loadingTables ? (
                        <div className="text-center py-2">
                          <Spin size="small" />
                        </div>
                      ) : (
                        <div className="text-center py-2 text-gray-400">
                          Không có bàn nào
                        </div>
                      )
                    }
                    className="custom-select"
                  >
                    {tables.map(table => (
                      <Select.Option
                        key={table.tableID}
                        value={table.tableID}
                        disabled={table.statusId !== 9}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{table.tableName}</span>
                          <Space size={4}>
                            <Tag color={table.statusId === 9 ? 'green' : 'red'} className="text-xs">
                              {table.statusId === 9 ? 'Trống' : 'Đang sử dụng'}
                            </Tag>
                            <Tag color="blue" className="text-xs">
                              {table.tableTypeName}
                            </Tag>
                            <span className="text-gray-400 text-xs">
                              {table.capacity} chỗ
                            </span>
                          </Space>
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="bookingID"
                  label={<span className="text-sm font-medium">Booking ID (tùy chọn)</span>}
                  className="mb-0"
                >
                  <InputNumber
                    placeholder="Nhập mã đặt bàn"
                    className="w-full"
                    size="large"
                    min={1}
                  />
                </Form.Item>
              </Space>

              <Divider className="my-3" />

              {/* Selected Meals List */}
              <div className="flex-1 overflow-auto meals-list mb-3">
                {selectedMeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                    <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
                    <p className="text-base">Chưa có món nào được chọn</p>
                    <p className="text-xs mt-1">Chọn món từ thực đơn bên trái</p>
                  </div>
                ) : (
                  <Space direction="vertical" className="w-full" size="middle">
                    {selectedMeals.map((meal, index) => (
                      <Card
                        key={meal.mealID}
                        size="small"
                        className="meal-item-card"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar
                            size={48}
                            src={meal.image}
                            shape="square"
                            className="flex-shrink-0"
                          >
                            {!meal.image && '🍽️'}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm mb-1 truncate">{meal.mealName}</div>
                            <div className="text-xs text-gray-500 mb-2">
                              {formatCurrency(meal.price)} x {meal.quantity}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="default"
                                size="small"
                                icon={<Minus className="w-3 h-3" />}
                                onClick={() => handleDecrement(meal.mealID)}
                                className="quantity-btn"
                              />
                              <span className="font-semibold text-base px-2 min-w-[32px] text-center">
                                {meal.quantity}
                              </span>
                              <Button
                                type="default"
                                size="small"
                                icon={<Plus className="w-3 h-3" />}
                                onClick={() => handleIncrement(meal.mealID)}
                                className="quantity-btn"
                              />
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<Trash2 className="w-3 h-3" />}
                                onClick={() => handleRemoveMeal(meal.mealID)}
                                className="ml-auto"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="font-bold text-green-600 text-base whitespace-nowrap">
                              {formatCurrency(meal.price * meal.quantity)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </Space>
                )}
              </div>

              {/* Total & Actions */}
              <div className="order-summary">
                <Divider className="my-3" />
                <div className="summary-detail">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Tổng số món:</span>
                    <span className="font-semibold">{calculateTotalItems()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-semibold">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

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
                    disabled={selectedMeals.length === 0}
                    className="submit-btn"
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    {initialData ? 'Cập nhật' : 'Tạo đơn hàng'}
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Add Customer Modal */}
      <AddCustomerModal
        visible={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSuccess={handleCustomerAdded}
        token={token}
      />
    </div>
  );
};

export default OrderForm;