import { OptionItem } from 'components';
import { UploadedFile } from 'components/file-upload/useUploadFile';

export class TerminationEditorState {
  departureReason?: OptionItem;
  resignationDate?: Date;
  dayOff?: Date;
  content?: string;
  receiver?: OptionItem;
  information?: string;
  files?: UploadedFile[];
  isLoading?: boolean;
  showError?: boolean;

  employeeOptions?: OptionItem[];
  departureReasonOptions?: OptionItem[];
}
