// Định nghĩa các trạng thái xác minh (Status) cho cột Status trong bảng Users
export type UserVerificationStatus = "Verified" | "Unverified";
export const UserVerificationStatus = {
  VERIFIED: "Verified" as UserVerificationStatus,
  UNVERIFIED: "Unverified" as UserVerificationStatus,
};

// Định nghĩa các trạng thái công việc (StatusWork) cho cột StatusWork trong bảng Users
export type UserWorkStatus = "Active" | "Inactive";
export const UserWorkStatus = {
  ACTIVE: "Active" as UserWorkStatus,
  INACTIVE: "Inactive" as UserWorkStatus,
};

// Object tổng hợp các trạng thái với code và description
const MStatusUser = {
  VERIFIED: {
    code: UserVerificationStatus.VERIFIED,
    description: "Đã xác minh",
  },
  UNVERIFIED: {
    code: UserVerificationStatus.UNVERIFIED,
    description: "Chưa xác minh",
  },
  ACTIVE: {
    code: UserWorkStatus.ACTIVE,
    description: "Hoạt động",
  },
  INACTIVE: {
    code: UserWorkStatus.INACTIVE,
    description: "Không hoạt động",
  },
};

export default MStatusUser;