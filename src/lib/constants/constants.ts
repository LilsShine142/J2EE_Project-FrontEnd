// Định nghĩa các trạng thái xác minh (Status) cho cột Status trong bảng Users
export type UserVerificationStatus = "Verified" | "Unverified";
export const USER_STATUS_ID = {
  VERIFIED: 13,
  UNVERIFIED: 14,
  ACTIVE: 15,
  INACTIVE: 16,
};

// Định nghĩa các trạng thái cho món ăn (Meal Status)
export const MEAL_STATUS_ID = {
  ACTIVE: 1,
  INACTIVE: 2,
};

// // Định nghĩa các trạng thái công việc (StatusWork) cho cột StatusWork trong bảng Users
// export type UserWorkStatus = "Active" | "Inactive";
// export const UserWorkStatus = {
//   ACTIVE: "Active" as UserWorkStatus,
//   INACTIVE: "Inactive" as UserWorkStatus,
// };

// Object tổng hợp các trạng thái với code và description
export const MStatusUser = {
  VERIFIED: {
    code: USER_STATUS_ID.VERIFIED,
    description: "Đã xác minh",
  },
  UNVERIFIED: {
    code: USER_STATUS_ID.UNVERIFIED,
    description: "Chưa xác minh",
  },
  ACTIVE: {
    code: USER_STATUS_ID.ACTIVE,
    description: "Hoạt động",
  },
  INACTIVE: {
    code: USER_STATUS_ID.INACTIVE,
    description: "Không hoạt động",
  },
};

// Object tổng hợp các trạng thái Meal với code và description
export const MStatusMeal = {
  ACTIVE: {
    code: MEAL_STATUS_ID.ACTIVE,
    description: "Hoạt động",
  },
  INACTIVE: {
    code: MEAL_STATUS_ID.INACTIVE,
    description: "Không hoạt động",
  },
};

// Status cho đơn hàng và hóa đơn
export const ORDER_STATUS = {
  PENDING: {
    id: 3,
    description: "Đang chờ xử lý",
    code: "PENDING",
    color: "warning"
  },
  COMPLETED: {
    id: 6,
    description: "Đã hoàn thành",
    code: "COMPLETED",
    color: "success"
  },
  CANCELLED: {
    id: 5,
    description: "Đã hủy",
    code: "CANCELLED",
    color: "error"
  },
  CONFIRMED: {
    id: 1, // CONFIRMED status id LÀ 4 NHƯNG TẠM THỜI ĐỂ 1 CHO DỄ TEST
    description: "Đã xác nhận",
    code: "CONFIRMED",
    color: "processing"
  },
  AVAILABLE: {
    id: 9,
    description: "Sẵn sàng",
    code: "AVAILABLE",
    color: "success"
  },
  // Bill statuses
  PAID: {
    id: 15,
    description: "Đã thanh toán",
    code: "PAID",
    color: "success"
  },
  PARTIALLY_PAID: {
    id: 16,
    description: "Thanh toán một phần",
    code: "PARTIALLY_PAID",
    color: "processing"
  },
  FAILED: {
    id: 17,
    description: "Thanh toán thất bại",
    code: "FAILED",
    color: "error"
  },
  REFUNDED: {
    id: 18,
    description: "Đã hoàn tiền",
    code: "REFUNDED",
    color: "purple"
  },

} as const;

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

// Roles người dùng
export const RoleID = {
    CUSTOMER: 1,
    ADMIN: 2,
    STAFF: 3,
};
  
// Filter options cho Bill List
export const BILL_STATUS_OPTIONS = [
  ORDER_STATUS.PAID,
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PARTIALLY_PAID,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.REFUNDED,
  ORDER_STATUS.FAILED,
];

// Filter options cho Order List
export const ORDER_STATUS_FILTER_OPTIONS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
];

// Table status options
export const TABLE_STATUS_OPTIONS = [
  ORDER_STATUS.AVAILABLE,
];
