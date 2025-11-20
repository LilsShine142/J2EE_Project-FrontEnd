export interface PermissionDTO {
  permissionID: number;
  permissionName: string;
  description?: string;
}

export interface RoleDTO {
  roleID: number;
  roleName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermissionDTO {
  rolePermissionId: number;
  roleId: number;
  permissionId: number;
  grantedAt: string;
  grantedByUserId?: number;
}

export interface PermissionRequest {
  permissionName: string;
  description?: string;
}

export interface RoleRequest {
  roleName: string;
  description?: string;
}

export interface RolePermissionRequest {
  roleId: number;
  permissionId: number;
  grantedByUserId: number;
}

export interface PermissionFilterParams {
  search?: string;
}

export interface RoleFilterParams {
  search?: string;
}

export interface RolePermissionFilterParams {
  search?: string;
}

// Extended type cho form với permissions
export interface RoleWithPermissions extends RoleDTO {
  permissions?: PermissionDTO[];
  permissionIds?: number[];
}