import { TimeSheetViewType } from 'common/enum/time-sheet-view-type';
import dayjs from 'dayjs';
import api from 'hooks/api';
import useSWR from 'swr';

type Props = {
  date?: string;
  viewType?: TimeSheetViewType;
  employeeId?: number;
};

const useTimeSheet = ({ date, viewType, employeeId }: Props) => {
  const { data: timeKeeping, error: errorTimeKeeping } = useSWR<TimeKeeping>(
    'timeKeeping',
    async () => {
      const res = await api.POST({
        path: '/api/models/hr-attendance/execute/get_attendance_today',
        data: {},
      });
      return res.data;
    },
  );

  const {
    data: attendanceList,
    isLoading: isLoadingAttendanceList,
    error: errorAttendanceList,
    mutate: mutateAttendanceList,
  } = useSWR<AttendanceList>(['attendanceList', date, viewType, employeeId], async () => {
    let apiPath = '/api/models/hr-attendance/execute/get_attendance_in_month';
    if (viewType === TimeSheetViewType.MANAGE_TIME_SHEET) {
      if (!employeeId) {
        return;
      }
      apiPath = '/api/models/hr-attendance/execute/get_attendance_for_one_employee';
    }
    const res = await api.POST({
      path: apiPath,
      data: {
        kwargs: {
          id: employeeId,
          month: date ? dayjs(date).month() + 1 : undefined,
          year: date ? dayjs(date).year() : undefined,
        },
      },
    });
    return res.data;
  });

  const { data: attendanceSummary, isLoading: isLoadingAttendanceSummary } =
    useSWR<AttendanceSummary>(['get_total_work_in_month', date, viewType, employeeId], async () => {
      let apiPath = '/api/models/hr-attendance/execute/get_total_work_in_month';
      if (viewType === TimeSheetViewType.MANAGE_TIME_SHEET) {
        if (!employeeId) {
          return;
        }
        apiPath = '/api/models/hr-attendance/execute/get_employee_total_work_in_month';
      }
      const res = await api.POST({
        path: apiPath,
        data: {
          kwargs: {
            id: employeeId,
            month: date ? dayjs(date).month() + 1 : undefined,
            year: date ? dayjs(date).year() : undefined,
          },
        },
      });
      return res.data;
    });

  return [
    {
      get timeKeeping() {
        return timeKeeping;
      },
      get errorTimeKeeping() {
        return errorTimeKeeping;
      },
      get attendanceList() {
        return attendanceList;
      },
      get errorAttendanceList() {
        return errorAttendanceList;
      },
      get attendanceSummary() {
        return attendanceSummary;
      },
      get isLoadingAttendanceList() {
        return isLoadingAttendanceList;
      },
      get isLoadingAttendanceSummary() {
        return isLoadingAttendanceSummary;
      },
    },
    {
      mutateAttendanceList,
    },
  ] as const;
};

export default useTimeSheet;
