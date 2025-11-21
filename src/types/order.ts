export interface OrderDetail {
  mealName: string;
  quantity: number;
  subTotal: number;
}

export interface OrderDTO {
  orderID: number;
  userID: string;
  userName: string;
  tableName: string;
  orderDetails: OrderDetail[];
  totalAmount: number;
  orderDate: string;
  statusId: number;
  bookingID?: number | null;
  createdAt: string;
  updatedAt: string;
}