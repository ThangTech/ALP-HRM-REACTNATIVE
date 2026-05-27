import { UploadedFile } from 'timesheet/screens/TimesheetExplanationDetail';

export class TimeSheetExplanationDetailState {
  timeSheetDetail?: Partial<TimesheetExplanationDetail>;
  uploadedFiles?: UploadedFile[];
  apiFilesLoaded?: boolean;
}
