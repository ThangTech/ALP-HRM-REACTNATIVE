import { SalaryTicket } from 'common/model/salary-ticket';

export interface SalaryTicketListState {
  dateFrom?: Date;
  dateTo?: Date;
  limit: number;
  offset: number;
  triggerReload?: number;

  items?: SalaryTicket[];
}
