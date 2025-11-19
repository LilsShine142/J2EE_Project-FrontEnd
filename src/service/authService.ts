import Cookies from "js-cookie";
import { axiosInstance } from "../lib/axios/axios";
import routes from "../config/routes";

// === ENUM: Role Names ===
export const RoleName = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  STAFF: "Staff",
  CUSTOMER: "Customer",
} as const;

export type RoleName = typeof RoleName[keyof typeof RoleName];

// === MAPPING: roleId → RoleName (nếu backend không trả RoleName) ===
const roleIdToName: Record<number, RoleName> = {
  1: RoleName.ADMIN,
  2: RoleName.MANAGER,
  3: RoleName.STAFF,
  4: RoleName.CUSTOMER,
};

// === Helper: Tạo config với token (dùng chung) ===
export const configToken = (token: string | null) => {
  console.log('Configuring token for request:', token);
  if (!token) {
    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// === ROUTE THEO VAI TRÒ ===
export const getDefaultRoute = (roleName: RoleName): string => {
  const routeMap: Record<RoleName, string> = {
    [RoleName.ADMIN]: routes.admin_dashboard,
    [RoleName.MANAGER]: routes.admin_dashboard,
    [RoleName.STAFF]: routes.admin_dashboard,
    [RoleName.CUSTOMER]: routes.client_dashboard,
  };
  return routeMap[roleName] || routes.client_dashboard;
};

// === INTERFACE: User từ backend ===
export interface User {
  userId: number;
  roleId: number;
  RoleName?: RoleName; // Optional: backend có thể trả hoặc không
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  statusId: number;
  statusWork: string;
  totalSpent: number;
  loyaltyPoints: number;
  joinDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// === RESPONSE CẤU TRÚC ===
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// === DỮ LIỆU TRẢ VỀ SAU KHI LOGIN ===
export interface AuthData {
  token: string;
  user: User;
  googleAttributes?: Record<string, any>;
  facebookAttributes?: Record<string, any>;
}

// === MÃ HÓA BASE64 (dùng cho OAuth attributes) ===
const encodeBase64 = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch (e) {
    console.warn("Base64 encode failed:", e);
    return "";
  }
};

// === LƯU DỮ LIỆU AUTH VÀO COOKIES ===
export const saveAuthData = (
  token: string,
  user: User,
  googleAttributes?: Record<string, any>,
  facebookAttributes?: Record<string, any>
): void => {
  // XÓA DỮ LIỆU CŨ
  Cookies.remove("authToken");
  Cookies.remove("user");
  Cookies.remove("googleAttributes");
  Cookies.remove("facebookAttributes");

  // LƯU MỚI
  Cookies.set("authToken", token, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });

  // Bổ sung RoleName nếu thiếu
  const userWithRole: User = {
    ...user,
    RoleName: user.RoleName || roleIdToName[user.roleId] || RoleName.CUSTOMER,
  };

  Cookies.set("user", JSON.stringify(userWithRole), {
    expires: 7,
    sameSite: "lax",
  });

  if (googleAttributes) {
    const encoded = encodeBase64(JSON.stringify(googleAttributes));
    if (encoded) {
      Cookies.set("googleAttributes", encoded, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
    }
  }

  if (facebookAttributes) {
    const encoded = encodeBase64(JSON.stringify(facebookAttributes));
    if (encoded) {
      Cookies.set("facebookAttributes", encoded, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
    }
  }

  // GÁN TOKEN CHO AXIOS
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// === ĐĂNG NHẬP THƯỜNG ===
export const login = async (email: string, password: string): Promise<AuthData> => {
  const response = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>(
    "/auth/login",
    { email, password }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Đăng nhập thất bại");
  }

  const { token, user } = response.data.data;
  if (!token || !user) {
    throw new Error("Thiếu token hoặc thông tin người dùng");
  }

  saveAuthData(token, user);
  return { token, user };
};

// === ĐĂNG KÝ ===
export const register = async (
  fullName: string,
  email: string,
  password: string,
  phoneNumber: string,
  statusId: number,
  statusWork: string,
  roleId: number
): Promise<void> => {
  const response = await axiosInstance.post<ApiResponse<null>>("/users/register", {
    fullName,
    email,
    password,
    phoneNumber,
    statusId,
    statusWork,
    roleId,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Đăng ký thất bại");
  }
};

// === ĐĂNG NHẬP FACEBOOK ===
export const loginWithFacebook = async (facebookToken: string): Promise<AuthData> => {
  const response = await axiosInstance.post<ApiResponse<{ token: string; user: User; facebookAttributes?: any }>>(
    "/auth/facebook",
    { token: facebookToken }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Đăng nhập Facebook thất bại");
  }

  const { token, user, facebookAttributes } = response.data.data;
  if (!token || !user) throw new Error("Thiếu token hoặc user");

  saveAuthData(token, user, undefined, facebookAttributes);
  return { token, user, facebookAttributes };
};

// === ĐĂNG XUẤT ===
export const logout = (): void => {
  Cookies.remove("authToken");
  Cookies.remove("user");
  Cookies.remove("googleAttributes");
  Cookies.remove("facebookAttributes");
  delete axiosInstance.defaults.headers.common["Authorization"];
};

// === LẤY USER HIỆN TẠI ===
export const getCurrentUser = (): User | null => {
  const token = Cookies.get("authToken");
  const userStr = Cookies.get("user");

  if (!token || !userStr) return null;

  try {
    const user = JSON.parse(userStr) as User;
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return user;
  } catch (e) {
    console.warn("Parse user from cookie failed:", e);
    logout();
    return null;
  }
};

// === LẤY THUỘC TÍNH OAUTH ===
export const getGoogleAttributes = (): Record<string, any> | null => {
  const data = Cookies.get("googleAttributes");
  if (!data) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(data)));
  } catch {
    Cookies.remove("googleAttributes");
    return null;
  }
};

export const getFacebookAttributes = (): Record<string, any> | null => {
  const data = Cookies.get("facebookAttributes");
  if (!data) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(data)));
  } catch {
    Cookies.remove("facebookAttributes");
    return null;
  }
};

// === OAUTH2 CALLBACK (Google/Facebook) ===
export const oauth2Callback = async (
  provider: "google" | "facebook",
  code: string
): Promise<AuthData> => {
  const response = await axiosInstance.get<ApiResponse<{ token: string; user: User; googleAttributes?: any; facebookAttributes?: any }>>(
    `/auth/oauth2/callback/${provider}`,
    {
      params: { code },
      withCredentials: true,
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Xác thực thất bại");
  }

  const { token, user, googleAttributes, facebookAttributes } = response.data.data;
  if (!token || !user) {
    throw new Error("Thiếu token hoặc thông tin người dùng");
  }

  saveAuthData(token, user, googleAttributes, facebookAttributes);
  return { token, user, googleAttributes, facebookAttributes };
};

// === KIỂM TRA ĐĂNG NHẬP ===
export const checkAuthToken = (): boolean => {
  return !!Cookies.get("authToken") && !!Cookies.get("user");
};

// === KIỂM TRA QUYỀN ===
export const hasRole = (roleName: RoleName): boolean => {
  const user = getCurrentUser();
  return user?.RoleName === roleName;
};

export const getAuthToken = (): string | null => {
  return Cookies.get("authToken") || null;
};

export const isAdmin = (): boolean => hasRole(RoleName.ADMIN);
export const isStaff = (): boolean => hasRole(RoleName.STAFF);
export const isCustomer = (): boolean => hasRole(RoleName.CUSTOMER);