import { TicketType } from 'common/enum/ticket-type';

export interface DeleteTicketArg {
  type: TicketType;
  ticketId?: number;
}
