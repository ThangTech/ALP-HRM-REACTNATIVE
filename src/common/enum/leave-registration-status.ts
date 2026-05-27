export enum LeaveRegistrationStatus {
  // Nháp [Không có trạng thái này]
  DRAFT = 'draft',
  // trạng thái này là dự thảo
  PENDING = 'confirm',
  // Đã duyệt
  APPROVED = 'validate',
  // Đang chờ các bước tiếp theo duyệt
  APPROVED_1 = 'validate1',
  APPROVED_2 = 'validate2',
  APPROVED_3 = 'validate3',
  APPROVED_4 = 'validate4',
  APPROVED_5 = 'validate5',
  APPROVED_6 = 'validate6',
  APPROVED_7 = 'validate7',
  APPROVED_8 = 'validate8',
  APPROVED_9 = 'validate9',
  APPROVED_10 = 'validate10',
  APPROVED_11 = 'validate11',
  APPROVED_12 = 'validate12',
  APPROVED_13 = 'validate13',
  APPROVED_14 = 'validate14',
  APPROVED_15 = 'validate15',
  APPROVED_16 = 'validate16',
  // Từ chối
  REJECTED = 'refuse',
  // Huỷ
  CANCELLED = 'cancel',
}
export enum LeaveButtonType {
  //  Trình duyệt
  APPROVAL_SUBMIT = 'approval_submit',
  //  Duyệt
  APPROVAL_ACCEPT = 'approval_accept',
  //  Từ chối
  APPROVAL_REJECT = 'approval_reject',
  //  Huỷ
  ACTION_CANCEL = 'set_to_cancel',
  //  Đưa về nháp
  APPROVAL_SET_TO_DRAFT = 'approval_set_to_draft',
}
