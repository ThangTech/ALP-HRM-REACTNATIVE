import { NotificationItemType } from 'common/enum/notification-item-type';

export interface NotificationsMeta {
  total_all: number;
}
export interface NotificationsRoot {
  summary: NotificationsMeta;
  details: {
    gtc: NotificationModel[];
    leave: NotificationModel[];
    overtime: NotificationModel[];
    resignation: NotificationModel[];
  };
}

/**
 * {
                    "id": 75633,
                    "name": "GTC/2026/00291",
                    "employee_id": 3332,
                    "employee_name": "Trần Thị Thanh Thủy",
                    "employee_code": "SVN00135",
                    "state": "waiting",
                    "label_state": "Chờ duyệt",
                    "stage_name": "C&B phụ trách TH/KD",
                    "description": "Giải trình công"
                }
 */
export interface NotificationModel {
  id: number;
  name: string;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  state: string;
  label_state: string;
  stage_name: string;
  description: string;
  type?: NotificationItemType;
}
