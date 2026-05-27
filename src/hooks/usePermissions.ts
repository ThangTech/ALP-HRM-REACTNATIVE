// hooks/usePermissions.ts

import { PERMISSION_GROUPS } from 'configs/contansts';
import useAppContext from './useAppContext';

export const usePermissions = () => {
  const { permission } = useAppContext(); // lấy từ context

  const permissionCodes = new Set(permission?.map((p) => p.code));

  const hasPermission = (code: string) => permissionCodes.has(code);

  const hasAnyPermission = (codes: string[]) => {
    return codes.some((code) => permissionCodes.has(code));
  };

  const hasGroupPermission = (groupKey: keyof typeof PERMISSION_GROUPS) => {
    const groupCodes = PERMISSION_GROUPS[groupKey];
    return hasAnyPermission(groupCodes);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasGroupPermission,
  };
};
