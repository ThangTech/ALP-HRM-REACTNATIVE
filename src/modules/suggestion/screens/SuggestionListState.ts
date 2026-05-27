import { SuggestionStatus } from 'common/enum/suggestion-status';
import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { SuggestionModel } from 'common/model/suggestion-model';

export interface SuggestionListState {
  offset: number;
  limit: number;
  type: SuggestionViewType;
  from?: Date;
  to?: Date;
  status?: SuggestionStatus;
  triggerRefresh?: number;

  items?: SuggestionModel[];
}
