import { PERMISSION_LABELS } from "../const/permission-labels";

export const getPermissionLabel = (permission: string) =>
    PERMISSION_LABELS[permission] ?? permission;
  