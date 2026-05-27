import { Discipline } from 'common/model/discipline';
import { OptionItem } from 'components';

export interface DisciplineListState {
  offset?: number;
  triggerRefresh?: number;
  disciplineType: OptionItem;
  disciplineTypes: OptionItem[];
  disciplines?: Discipline[];
}
