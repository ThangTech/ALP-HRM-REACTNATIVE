import { TerminationButtonType } from 'common/enum/termination-button-type';
import { Termination } from 'common/model/termination';

export class TerminationDetailState {
  id?: number;

  termination?: Termination;

  actionHandling?: TerminationButtonType;
}
