import { FileData } from './user-attachment';

export interface GpsModel {
  attendance_time: string;
  reason: string;
  address_name: string;
  address_detail: string;
  address: string;
  latitude: number;
  longitude: number;
  action_type: string;
  files?: FileData[];
}
