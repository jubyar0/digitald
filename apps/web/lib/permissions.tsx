// lib/permissions.ts
import React from 'react';
import { adminApi } from '@/lib/api';

// Define permission types
export type Permission =
  | 'manage_admins'
  | 'manage_platform_settings'
  | 'manage_api_settings'
  | 'view_all_data'
  | 'manage_users'
  | 'manage_vendors'
  | 'manage_products'
  | 'manage_orders'
  | 'manage_finances'
  | 'manage_content'
  | 'manage_cms_pages'
  | 'manage_categories'
  | 'view_reports'
  | 'view_support_tickets'
  | 'assign_tickets'
  | 'respond_to_tickets'
  | 'view_users'
  | 'view_vendors';

// Define role types
export type Role =
  | 'super_admin'
  | 'support_manager'
  | 'content_manager'
  | 'support_agent';

// Role to permissions mapping
export const rolePermissions: Record<Role, Permission[]> = {
  super_admin: [
    'manage_admins',
    'manage_platform_settings',
    'manage_api_settings',
    'view_all_data',
    'manage_users',
    'manage_vendors',
    'manage_products',
    'manage_orders',
    'manage_finances',
    'manage_content',
    'manage_cms_pages',
    'manage_categories',
    'view_reports',
    'view_support_tickets',
    'assign_tickets',
    'respond_to_tickets',
    'view_users',
    'view_vendors',
  ],
  support_manager: [
    'manage_users',
    'manage_vendors',
    'view_support_tickets',
    'assign_tickets',
    'view_reports',
  ],
  content_manager: [
    'manage_products',
    'manage_categories',
    'manage_content',
    'manage_cms_pages',
  ],
  support_agent: [
    'view_support_tickets',
    'respond_to_tickets',
    'view_users',
    'view_vendors',
  ],
};

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  return permissions.includes(permission);
}

// Check if a role has all specified permissions
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

// Hook for checking permissions in components
export function usePermissions() {
  // In a real implementation, this would get the current user's role from context or API
  // For now, we'll mock it
  const currentUserRole: Role = 'super_admin'; // This would come from context or API

  const checkPermission = (permission: Permission) => {
    return hasPermission(currentUserRole, permission);
  };

  const checkAllPermissions = (permissions: Permission[]) => {
    return hasAllPermissions(currentUserRole, permissions);
  };

  const checkAnyPermission = (permissions: Permission[]) => {
    return hasAnyPermission(currentUserRole, permissions);
  };

  return {
    role: currentUserRole,
    hasPermission: checkPermission,
    hasAllPermissions: checkAllPermissions,
    hasAnyPermission: checkAnyPermission,
    permissions: getRolePermissions(currentUserRole),
  };
}

// Higher-order component for protecting routes/components based on permissions
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission
) {
  return function WithPermissionWrapper(props: P) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(requiredPermission)) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>You don&apos;t have permission to view this page.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Component for conditionally rendering content based on permissions
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}