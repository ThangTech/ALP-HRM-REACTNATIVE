export type Language = 'en' | 'vi';
export const DEFAULT_LANGUAGE: Language = 'vi';

export const WAITING_ME = 'waiting_me';
export const DEFAULT_CHANNEL_ID = 'default_channel_id';

export const PERMISSIONS = {
  QMS_DIRECTOR: 'g10_access_management.qms_director',
  QMS_CUTTING_SUPPLY: 'g10_access_management.qms_cutting_supply',
  QMS_CUTTING_TABLE_ALLOCATION: 'g10_access_management.qms_cutting_table_allocation',
  QMS_CUTTING_KCS: 'g10_access_management.qms_cutting_kcs',
  QMS_PRESSING_KCS: 'g10_access_management.qms_pressing_kcs',
  QMS_SEWING_KCS: 'g10_access_management.qms_sewing_kcs',
  QMS_FINAL_INSPECTION: 'g10_access_management.qms_final_inspection',
  QMS_CUTTING_INSPECTION: 'g10_access_management.qms_cutting_inspection',
  QMS_PRESSING_INSPECTION: 'g10_access_management.qms_pressing_inspection',
  QMS_SEWING_INSPECTION: 'g10_access_management.qms_sewing_inspection',
  QMS_TECHNICAL: 'g10_access_management.qms_technical',
  QMS_ADMIN: 'g10_access_management.qms_admin',
  QMS_CUTTING_TEAM_LEADER: 'g10_access_management.qms_cutting_team_leader',
  QMS_PRESSING_TEAM_LEADER: 'g10_access_management.qms_pressing_team_leader',
  QMS_SEWING_TEAM_LEADER: 'g10_access_management.qms_sewing_team_leader',
} as const;

export const PERMISSION_GROUPS = {
  CUTTING: [
    PERMISSIONS.QMS_ADMIN,
    PERMISSIONS.QMS_DIRECTOR,
    PERMISSIONS.QMS_CUTTING_TEAM_LEADER,
    PERMISSIONS.QMS_CUTTING_INSPECTION,
    PERMISSIONS.QMS_CUTTING_KCS,
  ],
  LINE_INPUT_SEWING: [
    PERMISSIONS.QMS_ADMIN,
    PERMISSIONS.QMS_DIRECTOR,
    PERMISSIONS.QMS_SEWING_TEAM_LEADER,
    PERMISSIONS.QMS_CUTTING_TEAM_LEADER,
    PERMISSIONS.QMS_SEWING_INSPECTION,
    PERMISSIONS.QMS_CUTTING_SUPPLY,
  ],
  LINE_INPUT_IRONING: [
    PERMISSIONS.QMS_ADMIN,
    PERMISSIONS.QMS_DIRECTOR,
    PERMISSIONS.QMS_PRESSING_TEAM_LEADER,
    PERMISSIONS.QMS_SEWING_TEAM_LEADER,
  ],
  SEWING: [
    PERMISSIONS.QMS_ADMIN,
    PERMISSIONS.QMS_DIRECTOR,
    PERMISSIONS.QMS_SEWING_TEAM_LEADER,
    PERMISSIONS.QMS_SEWING_INSPECTION,
    PERMISSIONS.QMS_SEWING_KCS,
  ],
  IRONING: [
    PERMISSIONS.QMS_ADMIN,
    PERMISSIONS.QMS_DIRECTOR,
    PERMISSIONS.QMS_PRESSING_TEAM_LEADER,
    PERMISSIONS.QMS_PRESSING_INSPECTION,
    PERMISSIONS.QMS_PRESSING_KCS,
  ],
};

export const MAP_STATUS = new Map([
  ['all', 'Tất cả'],
  ['draft', 'Dự thảo'],
  ['waiting', 'Chờ duyệt'],
  [WAITING_ME, 'Chờ tôi duyệt'],
  ['confirm', 'Chờ duyệt'],
  ['approved', 'Đã duyệt'],
  ['validate', 'Đã duyệt'],
  ['refused', 'Từ chối'],
  ['refuse', 'Từ chối'],
  ['cancel', 'Huỷ bỏ'],
]);

export const SUGGESTION_BG_COLOR = new Map([
  // Đang xử lý
  ['processing', '$pendingBg'],
  // Mới tiếp nhận
  ['reception', '$grey'],
  // Đã xử lý
  ['processed', '$approvedBg'],
]);

export const SUGGESTION_TEXT_COLOR = new Map([
  ['processing', '$pendingText'],
  ['reception', '$white'],
  ['processed', '$approvedText'],
]);

export const SUGGESTION_TEXT = new Map([
  ['processing', 'Đang xử lý'],
  ['reception', 'Tiếp nhận'],
  ['processed', 'Đã xử lý'],
]);
