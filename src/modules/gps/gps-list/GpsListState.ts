import { GpsModel } from 'common/model/gps-model';

export interface GpsListState {
  limit: number;
  offset: number;
  from?: Date;
  to?: Date;
  triggerFetch?: number;

  items: GpsModel[];
}
