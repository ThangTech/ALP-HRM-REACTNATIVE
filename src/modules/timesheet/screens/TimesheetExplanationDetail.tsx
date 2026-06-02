import BottomSheet from '@gorhom/bottom-sheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  IcCalendar,
  IcDocument,
  IcDropdown,
  IcImage,
  IcPdf,
  IcTrash,
  IcUpload,
  IcVideo,
} from 'assets/svgs';
import IcArrowRight from 'assets/svgs/IcArrowRight';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { TerminationState } from 'common/enum/termination-state';
import { TicketType } from 'common/enum/ticket-type';
import {
  Button,
  DateTimePickerModal,
  Form,
  Header,
  Input,
  OptionItem,
  OptionPickerModal,
  Screen,
  showToast,
  Text,
  TimeRangePickerModal,
} from 'components';
import { FormRef } from 'components/base/Form';
import { BaseModalRef } from 'components/base/Modal';
import OptionDelete from 'components/OptionDelete';
import OptionMenu from 'components/OptionMenu';
import { AppStackParamList } from 'configs/navigation';
import dayjs from 'dayjs';
import { useDebouncedEffect } from 'hooks/useDebouncedEffect';
import { useDeleteTicket } from 'hooks/useDeleteTicket';
import CancelDialog from 'modules/leave-registration/detail/components/CancelDialog';
import CardContainer from 'modules/leave-registration/detail/components/CardContainer';
import ItemHistory from 'modules/leave-registration/detail/components/ItemHistory';
import ReportBlock from 'modules/leave-registration/leave-report/components/report-block';
import { FilePickerBottomSheet } from 'modules/user/components';
import { useFilePicker } from 'modules/user/hooks/useFilePicker';
import { goBack } from 'navigators';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getTokens, ScrollView, View } from 'tamagui';
import { useTimesheetExplanationDetail } from 'timesheet/hooks';
import { TimeSheetExplanationDetailState } from 'timesheet/state/TimeSheetExplanationDetailState';
import {
  cleanNumberString,
  formatDateTime,
  formatDateTimeForOdoo2,
  formatTime,
  formatTimeRange,
  horizontalScale,
  openMediaFile,
  scale,
  verticalScale,
} from 'utils';

type TimesheetExplanationDetailProps = NativeStackScreenProps<
  AppStackParamList,
  'TimesheetExplanationDetail'
>;

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'docx' | 'video';
  uri: string;
  size?: number;
  isFromAPI?: boolean; // Flag to distinguish API files from newly uploaded files
}

// Status Colors
const STATUS_COLORS = {
  draft: {
    bg: getTokens().color.d_grey.val,
    text: getTokens().color.white.val,
  },
  waiting: {
    bg: getTokens().color.l_yellow.val,
    text: getTokens().color.d_yellow.val,
  },
  approved: {
    bg: getTokens().color.l_green.val,
    text: getTokens().color.forest.val,
  },
  refused: {
    bg: getTokens().color.l_red.val,
    text: getTokens().color.d_red.val,
  },
  cancel: {
    bg: getTokens().color.l_red.val,
    text: getTokens().color.d_red.val,
  },
};

export const SectionHeading = ({
  title,
  initialExpanded = false,
  children,
}: {
  title: string;
  initialExpanded?: boolean;
  children?: ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  return (
    <>
      <View
        mt={verticalScale(16)}
        mb={verticalScale(10)}
        flexDirection="row"
        alignItems="center"
        bg="#F9FBFF"
        borderRadius={scale(12)}
        ph={horizontalScale(14)}
        pv={verticalScale(10)}
        borderWidth={1}
        borderColor="#E0E8F5"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View
          width={4}
          height={verticalScale(30)}
          borderRadius={scale(10)}
          bg="#D6E6FF"
          mr={horizontalScale(12)}
        />
        <Text fontSize={scale(16)} fontWeight="600" color="$blue" flex={1}>
          {title}
        </Text>
        {!!children && (
          <View style={{ transform: [{ rotate: isExpanded ? '-90deg' : '90deg' }] }}>
            <IcArrowRight size={20} />
          </View>
        )}
      </View>
      {isExpanded && children}
    </>
  );
};

const TimesheetExplanationDetail = ({ route }: TimesheetExplanationDetailProps) => {
  const { id, type, date: targetDate } = route.params || { id: 0, type: 'create' };

  const formRef = useRef<FormRef<TimesheetExplanationDetail>>(null);
  const dateTimePickerRef = useRef<BottomSheet>(null);
  const timeRangePickerRef = useRef<BottomSheet>(null);
  const optionPickerRef = useRef<BottomSheet>(null);
  const filePickerRef = useRef<BottomSheet>(null);
  const dialogRef = useRef<BaseModalRef>(null);

  const { pickImage, pickDocument, pickVideo } = useFilePicker();
  const deleteProvider = useDeleteTicket();

  const [state, setState] = useState<TimeSheetExplanationDetailState>({
    timeSheetDetail: {
      explanation_date: dayjs(targetDate).format('YYYY-MM-DD'),
      autoFillCoefficient: true,
      autoFillHoursOfBreak: true,
      autoFillExplainedDate: true,
    },
  });
  const detail = state.timeSheetDetail;
  const selectedDate = state.timeSheetDetail?.explanation_date;
  const selectedReason = state.timeSheetDetail?.explanation_reason;
  const selectedShift = state.timeSheetDetail?.explained_resource_calendar_id;
  const uploadedFiles = state.uploadedFiles || [];
  const timeToDestinationFrom = state.timeSheetDetail?.arrive_start_time;
  const timeToDestinationTo = state.timeSheetDetail?.arrive_end_time;
  const timeFromDestinationFrom = state.timeSheetDetail?.leave_start_time;
  const timeFromDestinationTo = state.timeSheetDetail?.leave_end_time;
  const explainedCheckIn = state.timeSheetDetail?.explained_check_in;
  const explainedCheckOut = state.timeSheetDetail?.explained_check_out;
  const overtime1From = state.timeSheetDetail?.overtime_first_start;
  const overtime1To = state.timeSheetDetail?.overtime_first_end;
  const overtime2From = state.timeSheetDetail?.overtime_second_start;
  const overtime2To = state.timeSheetDetail?.overtime_second_end;
  const hours_of_break = state.timeSheetDetail?.hours_of_break;

  const [
    {
      explanationTypeList,
      histories,
      timesheetExplanationDetail,
      calculateInformation,
      calculateInformationLoading,
      workShiftList,
      createUpdateLoading,
      approvalSubmitting,
      approveLoading,
      rejectLoading,
      uploadFilesLoading,
      moveToDraftLoading,
      createDateInfo,
    },
    {
      calculateInformationTrigger,
      createUpdate,
      approvalSubmit,
      approve,
      reject,
      moveToDraft,
      uploadFiles,
      deleteFile,
    },
  ] = useTimesheetExplanationDetail({
    id,
  });

  // Helper function to convert mimetype to file type
  const getFileTypeFromMimetype = (mimetype: string): 'image' | 'pdf' | 'docx' => {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype === 'application/pdf') {
      return 'pdf';
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      return 'docx';
    }
    // Default to pdf if unknown
    return 'pdf';
  };

  // Reset API files loaded flag when type changes
  useEffect(() => {
    if (type === 'create') {
      setState((prev) => ({ ...prev, uploadedFiles: [] }));
    }
  }, [type, timesheetExplanationDetail]);

  // Load files from API when in edit mode
  useEffect(() => {
    if (type === 'edit' && timesheetExplanationDetail?.files && !state.apiFilesLoaded) {
      const apiFiles: UploadedFile[] = timesheetExplanationDetail.files.map((file) => ({
        id: file.id.toString(),
        name: file.name,
        type: getFileTypeFromMimetype(file.mimetype),
        uri: file.download_url,
        isFromAPI: true,
      }));
      setState((prev) => ({ ...prev, uploadedFiles: apiFiles, apiFilesLoaded: true }));
    }
  }, [type, timesheetExplanationDetail, state.apiFilesLoaded]);

  // Sync data from API to form when editing
  useEffect(() => {
    if (type === 'edit') {
      if (timesheetExplanationDetail) {
        timesheetExplanationDetail.autoFillCoefficient = false;
        timesheetExplanationDetail.autoFillHoursOfBreak = false;
        timesheetExplanationDetail.autoFillExplainedDate = false;
      }

      setState((prev) => ({ ...prev, timeSheetDetail: timesheetExplanationDetail }));
      formRef.current?.setValue('exp_name', (timesheetExplanationDetail?.exp_name ?? '') as never);
      formRef.current?.setValue(
        'work_address',
        (timesheetExplanationDetail?.work_address ?? '') as never,
      );
    }
  }, [timesheetExplanationDetail, type]);

  useEffect(() => {
    if (!calculateInformation) {
      return;
    }
    const clone = { ...calculateInformation };
    delete clone.allocated_buffer_hours;
    delete clone.salary_hours;
    delete clone.employee_name;
    delete clone.employee_code;
    delete clone.job_name;
    delete clone.id;
    delete clone.state;
    delete clone.exp_name;

    setState((prev) => {
      if (clone.coefficient === 0) {
        clone.coefficient = prev.timeSheetDetail?.coefficient || '';
      }
      if (clone.hours_of_break === 0) {
        clone.hours_of_break = prev.timeSheetDetail?.hours_of_break || '';
      }
      if (!prev.timeSheetDetail?.autoFillExplainedDate) {
        delete clone.explained_check_in;
      }
      if (!prev.timeSheetDetail?.autoFillExplainedDate) {
        delete clone.explained_check_out;
      }
      if (!prev.timeSheetDetail?.autoFillCoefficient) {
        delete clone.coefficient;
      }
      if (!prev.timeSheetDetail?.autoFillHoursOfBreak) {
        delete clone.hours_of_break;
      }
      return {
        ...prev,
        timeSheetDetail: {
          ...prev.timeSheetDetail,
          ...{
            ...clone,
          },
          autoFillExplainedDate: false,
        },
      };
    });
  }, [calculateInformation, type]);

  // useEffect(() => {
  //   if (!detail?.explanation_reason || !detail?.explained_resource_calendar_id) {
  //     return;
  //   }
  //   const tmpObject: Partial<CalculateInformation> = {};
  //   if (!detail?.explained_check_in && calculateInformation?.explained_check_in) {
  //     tmpObject.explained_check_in = calculateInformation.explained_check_in;
  //   }
  //   if (!detail?.explained_check_out && calculateInformation?.explained_check_out) {
  //     tmpObject.explained_check_out = calculateInformation.explained_check_out;
  //   }
  //   if (!Object.keys(tmpObject).length) {
  //     return;
  //   }
  //   setState((prev) => ({
  //     ...prev,
  //     timeSheetDetail: {
  //       ...prev.timeSheetDetail,
  //       ...{
  //         ...tmpObject,
  //       },
  //     },
  //   }));
  // }, [
  //   detail?.explained_check_in,
  //   detail?.explained_check_out,
  //   calculateInformation?.explained_check_in,
  //   calculateInformation?.explained_check_out,
  //   detail?.explanation_reason,
  //   detail?.explained_resource_calendar_id,
  // ]);

  // Config động cho OptionPickerModal
  const [pickerConfig, setPickerConfig] = useState<{
    data: OptionItem[];
    selectedValue?: string | number;
    title: string;
    onSelect: (item: OptionItem) => void;
  }>({
    data: [],
    selectedValue: undefined,
    title: '',
    onSelect: () => {},
  });

  // Config động cho DateTimePickerModal
  const [dateTimeConfig, setDateTimeConfig] = useState<{
    mode: 'date' | 'time' | 'datetime';
    initialValue?: Date;
    title: string;
    onConfirm: (date: Date) => void;
  }>({
    mode: 'date',
    initialValue: undefined,
    title: '',
    onConfirm: () => {},
  });

  // Config động cho TimeRangePickerModal
  const [timeRangeConfig, setTimeRangeConfig] = useState<{
    initialFromValue?: Date;
    initialToValue?: Date;
    title: string;
    onConfirm: (fromDate: Date, toDate: Date) => void;
    onDelete?: () => Promise<void> | void;
  }>({
    initialFromValue: undefined,
    initialToValue: undefined,
    title: '',
    onConfirm: () => {},
  });

  const isLocked = [
    TerminationState.WAITING,
    TerminationState.APPROVED,
    TerminationState.CANCELLED,
    TerminationState.REFUSED,
  ].includes((detail?.state || '--') as TerminationState);

  useDebouncedEffect(
    () => {
      if (!detail?.explanation_date) {
        return;
      }
      if (id) {
        if (!detail.id) {
          return;
        }
        if (isLocked) {
          return;
        }
      }
      let explainedCheckIn = '',
        explainedCheckOut = '';
      if (detail?.explanation_date && !detail.autoFillExplainedDate) {
        const explainDate = dayjs(detail?.explanation_date);
        if (detail?.explained_check_in) {
          explainedCheckIn = dayjs(detail?.explained_check_in)
            .set('date', explainDate.get('date'))
            .set('month', explainDate.get('month'))
            .set('year', explainDate.get('year'))
            .toString();
        }
        if (detail?.explained_check_out && !detail.autoFillExplainedDate) {
          const prepareDate = dayjs(detail?.explained_check_out)
            .set('date', explainDate.get('date'))
            .set('month', explainDate.get('month'))
            .set('year', explainDate.get('year'));
          explainedCheckOut = prepareDate.toString();
        }
      }
      calculateInformationTrigger({
        explanation_reason: detail?.explanation_reason ?? '',
        explanation_date: detail?.explanation_date,
        hours_of_break: detail?.hours_of_break?.toString().length
          ? +cleanNumberString(detail?.hours_of_break?.toString() || '0')
          : undefined,
        coefficient: detail?.coefficient?.toString().length
          ? +cleanNumberString(detail?.coefficient?.toString() || '0')
          : undefined,
        explained_resource_calendar_id: detail?.explained_resource_calendar_id,
        arrive_start_time: formatDateTimeForOdoo2(detail?.arrive_start_time),
        arrive_end_time: formatDateTimeForOdoo2(detail?.arrive_end_time),
        leave_start_time: formatDateTimeForOdoo2(detail?.leave_start_time),
        leave_end_time: formatDateTimeForOdoo2(detail?.leave_end_time),
        explained_check_in: formatDateTimeForOdoo2(explainedCheckIn),
        explained_check_out: formatDateTimeForOdoo2(explainedCheckOut),
        overtime_first_start: formatDateTimeForOdoo2(detail?.overtime_first_start),
        overtime_first_end: formatDateTimeForOdoo2(detail?.overtime_first_end),
        overtime_second_start: formatDateTimeForOdoo2(detail?.overtime_second_start),
        overtime_second_end: formatDateTimeForOdoo2(detail?.overtime_second_end),
      });
    },
    [
      calculateInformationTrigger,
      isLocked,
      id,
      detail?.id,
      detail?.state,
      detail?.explanation_reason,
      detail?.explanation_date,
      detail?.hours_of_break,
      detail?.coefficient,
      detail?.explained_resource_calendar_id,
      detail?.arrive_start_time,
      detail?.arrive_end_time,
      detail?.leave_start_time,
      detail?.leave_end_time,
      detail?.explained_check_in,
      detail?.explained_check_out,
      detail?.overtime_first_start,
      detail?.overtime_first_end,
      detail?.overtime_second_start,
      detail?.overtime_second_end,
    ],
    500,
  );

  const actualShift =
    timesheetExplanationDetail?.actual_resource_calendar_name ||
    calculateInformation?.actual_resource_calendar_display_name;

  // Hàm handleSubmit nhận data từ form
  const handleSubmit = (data: Partial<TimesheetExplanationDetail>) => {
    // Validation các trường bắt buộc

    if (!data.exp_name?.trim()) {
      showToast('error', 'Vui lòng nhập lý do giải trình');
      return;
    }

    if (!selectedReason) {
      showToast('error', 'Vui lòng chọn loại giải trình');
      return;
    }

    if (!selectedDate) {
      showToast('error', 'Vui lòng chọn ngày giải trình');
      return;
    }

    if (!selectedShift) {
      showToast('error', 'Vui lòng chọn ca làm việc (giải trình)');
      return;
    }

    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn tạo hoặc cập nhật giải trình công?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xác nhận',
        onPress: async () => {
          const mTimesheetExplanationDetail = state.timeSheetDetail;
          const isLate: boolean = !!(
            mTimesheetExplanationDetail?.explained_check_in && detail?.late_minutes
          );
          const isEarly = !!(
            mTimesheetExplanationDetail?.explained_check_out && detail?.early_leave_minutes
          );
          const res = await createUpdate({
            id: id,
            explanation_reason: mTimesheetExplanationDetail?.explanation_reason,
            explanation_date: timesheetExplanationDetail?.explanation_date
              ? dayjs(timesheetExplanationDetail?.explanation_date).format('YYYY-MM-DD')
              : dayjs(selectedDate).format('YYYY-MM-DD'),
            exp_name: data.exp_name || '',
            explained_resource_calendar_id:
              mTimesheetExplanationDetail?.explained_resource_calendar_id,
            arrive_start_time: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.arrive_start_time,
            ),
            late: isLate,
            early: isEarly,
            coefficient: +cleanNumberString(
              mTimesheetExplanationDetail?.coefficient?.toString() || '0',
            ),
            arrive_end_time: formatDateTimeForOdoo2(mTimesheetExplanationDetail?.arrive_end_time),
            leave_start_time: formatDateTimeForOdoo2(mTimesheetExplanationDetail?.leave_start_time),
            leave_end_time: formatDateTimeForOdoo2(mTimesheetExplanationDetail?.leave_end_time),
            explained_check_in: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.explained_check_in,
            ),
            explained_check_out: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.explained_check_out,
            ),
            work_address: data.work_address ?? '',
            overtime_first_start: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.overtime_first_start,
            ),
            overtime_first_end: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.overtime_first_end,
            ),
            overtime_second_start: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.overtime_second_start,
            ),
            overtime_second_end: formatDateTimeForOdoo2(
              mTimesheetExplanationDetail?.overtime_second_end,
            ),
            hours_of_break: +cleanNumberString(hours_of_break?.toString() || '0'),
          });

          if (res) {
            showToast(
              'success',
              timesheetExplanationDetail?.id
                ? 'Cập nhật giải trình công thành công'
                : 'Tạo giải trình công thành công',
            );

            // Upload files if there are any
            if (uploadedFiles.length > 0 && res.id) {
              const filesToUpload = uploadedFiles
                .filter((file) => file.id.startsWith('temp'))
                .map((file) => {
                  let mimeType = 'application/octet-stream';
                  if (file.type === 'image') {
                    mimeType = 'image/jpeg';
                  } else if (file.type === 'pdf') {
                    mimeType = 'application/pdf';
                  } else if (file.type === 'docx') {
                    mimeType =
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                  }

                  return {
                    uri: file.uri,
                    name: file.name,
                    type: mimeType,
                  };
                });

              if (filesToUpload.length > 0) {
                await uploadFiles({
                  res_id: res.id,
                  files: filesToUpload as any,
                });
              }
            }
            if (data.targetState === TerminationState.WAITING) {
              await approvalSubmit({ id: res.id });
            }
            goBack();
          }
        },
      },
    ]);
  };

  const handleSubmitExplanation = () => {
    handleSubmit({
      ...(formRef.current?.getValues() || {}),
      targetState: TerminationState.WAITING,
    });
  };

  const handleSubmitPress = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };
  // File picker handlers
  const handleUploadPress = () => {
    filePickerRef.current?.snapToIndex(0);
  };

  const handleSelectImage = async () => {
    filePickerRef.current?.close();
    const result = await pickImage();
    if (result) {
      const newFile: UploadedFile = {
        id: 'temp' + Date.now().toString(),
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size,
      };
      setState((prev) => ({ ...prev, uploadedFiles: [...(prev.uploadedFiles || []), newFile] }));
    }
  };

  const handleSelectDocument = async () => {
    filePickerRef.current?.close();
    const result = await pickDocument();
    if (result) {
      const newFile: UploadedFile = {
        id: 'temp' + Date.now().toString(),
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size,
      };
      setState((prev) => ({ ...prev, uploadedFiles: [...(prev.uploadedFiles || []), newFile] }));
    }
  };

  const handleSelectVideo = async () => {
    filePickerRef.current?.close();
    const result = await pickVideo();
    if (result) {
      const newFile: UploadedFile = {
        id: 'temp' + Date.now().toString(),
        name: result.name,
        type: result.type,
        uri: result.uri,
        size: result.size,
      };
      setState((prev) => ({ ...prev, uploadedFiles: [...(prev.uploadedFiles || []), newFile] }));
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (fileId.startsWith('temp')) {
      setState((prev) => ({
        ...prev,
        uploadedFiles: prev.uploadedFiles?.filter((file) => file.id !== fileId),
      }));
    } else {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa file này?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            await deleteFile({
              explanation_id: timesheetExplanationDetail?.id,
              attachment_id: Number(fileId),
            });
          },
        },
      ]);
    }
  };

  const getFileIcon = (fileType: 'image' | 'pdf' | 'docx' | 'video') => {
    switch (fileType) {
      case 'image':
        return <IcImage size={20} />;
      case 'video':
        return <IcVideo size={20} />;
      case 'pdf':
        return <IcPdf size={20} />;
      case 'docx':
        return <IcDocument size={20} />;
      default:
        return null;
    }
  };

  const renderHeader = () => {
    const title = type === 'create' ? 'Tạo giải trình công' : 'Chi tiết giải trình công';
    return (
      <Header
        title={title}
        rightAction={
          <OptionMenu>
            {id && (
              <OptionDelete
                onDelete={async () => {
                  await deleteProvider.handleDelete({
                    ticketId: timesheetExplanationDetail?.id,
                    type: TicketType.TIME_SHEET_EXPLANATION,
                  });
                  goBack();
                }}
              />
            )}
          </OptionMenu>
        }
      />
    );
  };

  const handleApprove = async () => {
    if (!timesheetExplanationDetail?.id) {
      return;
    }

    Alert.alert('Xác nhận phê duyệt', 'Bạn có chắc chắn muốn phê duyệt giải trình công này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Phê duyệt',
        onPress: async () => {
          await approve({ explanation_id: timesheetExplanationDetail.id });
        },
      },
    ]);
  };

  const handleReject = async (reason: string) => {
    if (!timesheetExplanationDetail?.id) {
      return;
    }

    try {
      await reject({ explanation_id: timesheetExplanationDetail.id, reject_reason: reason });
    } catch (error) {
      console.log('Error rejecting explanation:', error);
    } finally {
      dialogRef.current?.close();
    }
  };
  const handleMoveToDraft = async () => {
    if (!timesheetExplanationDetail?.id) {
      return;
    }

    Alert.alert(
      'Xác nhận chuyển về nháp',
      'Bạn có chắc chắn muốn chuyển giải trình công này về nháp?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Chuyển về nháp',
          style: 'destructive',
          onPress: async () => {
            await moveToDraft({ explanation_id: timesheetExplanationDetail.id });
          },
        },
      ],
    );
  };

  const renderStatusBadge = () => {
    // Không hiển thị status khi đang tạo mới
    if (type === 'create' || !timesheetExplanationDetail) {
      return null;
    }

    const state = timesheetExplanationDetail?.state || 'draft';
    const statusConfig = STATUS_COLORS[state as keyof typeof STATUS_COLORS] || STATUS_COLORS.draft;

    return (
      <View
        bg={statusConfig.bg}
        br={scale(12)}
        p={scale(16)}
        mb={verticalScale(16)}
        fd="row"
        ai="center"
        jc="space-between"
      >
        <View fd="row" ai="center" gap={scale(8)}>
          <View
            w={scale(8)}
            h={scale(8)}
            bg={statusConfig.text}
            borderRadius={scale(4)}
            style={styles.statusIndicator}
          />
          <Text fontSize={scale(14)} fontWeight="600" color={statusConfig.text}>
            Trạng thái:
          </Text>
        </View>
        <Text fontSize={scale(15)} fontWeight="700" color={statusConfig.text}>
          {timesheetExplanationDetail?.label_state}
        </Text>
      </View>
    );
  };

  const renderApprovalButtons = () => {
    if (!timesheetExplanationDetail?.buttons) {
      return null;
    }

    const buttons = timesheetExplanationDetail.buttons;
    const hasApprove = buttons.includes(TerminationButtonType.APPROVE_ACCEPT);
    const hasReject = buttons.includes(TerminationButtonType.APPROVE_REJECT);
    const hasSubmit = buttons.includes(TerminationButtonType.APPROVE_SUBMIT);
    const hasMoveToDraft = buttons.includes(TerminationButtonType.BTN_TO_DRAFT2);

    if (!hasApprove && !hasReject && !hasSubmit && !hasMoveToDraft) {
      return null;
    }

    return (
      <View fd="row" gap={scale(12)} mb={verticalScale(16)}>
        {hasReject && (
          <View f={1}>
            <Button
              onPress={() => dialogRef.current?.open()}
              style={styles.rejectBtn}
              loading={rejectLoading}
            >
              <Button.Text variant="primary">Từ chối</Button.Text>
            </Button>
          </View>
        )}
        {hasMoveToDraft && (
          <View f={1}>
            <Button
              onPress={handleMoveToDraft}
              style={styles.rejectBtn}
              loading={moveToDraftLoading}
            >
              <Button.Text variant="primary">Chuyển về nháp</Button.Text>
            </Button>
          </View>
        )}
        {hasApprove && (
          <View f={1}>
            <Button onPress={handleApprove} style={styles.approveBtn} loading={approveLoading}>
              <Button.Text variant="primary">Duyệt</Button.Text>
            </Button>
          </View>
        )}
        {hasSubmit && (
          <View f={1}>
            <Button
              variant="primary"
              disabled={
                timesheetExplanationDetail?.state === 'approved' || !detail?.exp_name?.trim()
              }
              onPress={handleSubmitExplanation}
              loading={approvalSubmitting}
            >
              <Button.Text variant="primary">Trình duyệt</Button.Text>
            </Button>
          </View>
        )}
      </View>
    );
  };

  const renderUploadSection = () => {
    return (
      <View style={styles.uploadContainer}>
        <View fd="row" ai="center" jc="space-between" mb={scale(12)}>
          <Text fontSize={16} fontWeight="600">
            Bằng chứng giải trình công<Text color="#E74C3C">*</Text>
          </Text>
        </View>

        {/* Upload Area */}
        <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7} onPress={handleUploadPress}>
          <View ai="center" gap={scale(8)}>
            <View style={styles.uploadIconContainer}>
              <IcUpload size={32} />
            </View>
            <View ai="center">
              <Text fontSize={14} color="#666" textAlign="center">
                JPEG/JPG, PNG, MP4, DOC/DOCX, PDF,... Tối đa 250MB
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <TouchableOpacity activeOpacity={1} style={styles.filesListContainer}>
            {uploadedFiles.map((file) => (
              <TouchableOpacity
                key={file.id}
                style={styles.fileItem}
                onPress={() => openMediaFile(file.uri, file.type, file.name)}
              >
                <View fd="row" ai="center" gap={scale(12)} f={1}>
                  {getFileIcon(file.type)}
                  <View f={1}>
                    <Text fontSize={14} numberOfLines={1}>
                      {file.name}
                    </Text>
                    {file.size && (
                      <Text fontSize={12} color="#999" mt={scale(2)}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteFile(file.id)}
                  style={styles.deleteButton}
                >
                  <IcTrash size={20} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderBtn = () => {
    return (
      <>
        <View fd={'row'} gap={scale(20)} mt={verticalScale(30)} mb={scale(16)}>
          <Button variant="secondary" style={styles.btn} onPress={goBack}>
            <Button.Text variant="secondary">Hủy</Button.Text>
          </Button>
          <Button
            variant="primary"
            disabled={isLocked || !detail?.exp_name?.trim()}
            style={styles.btn}
            onPress={handleSubmitPress}
            loading={createUpdateLoading || uploadFilesLoading || approvalSubmitting}
          >
            <Button.Text variant="primary">
              {type === 'create' ? 'Tạo phiếu' : 'Cập nhật'}
            </Button.Text>
          </Button>
        </View>
      </>
    );
  };

  const renderFields = () => {
    return (
      <TouchableOpacity activeOpacity={1}>
        <Form<TimesheetExplanationDetail>
          ref={formRef}
          defaultValues={{
            exp_name: timesheetExplanationDetail?.exp_name,
            work_address: timesheetExplanationDetail?.work_address,
          }}
          onSubmit={() => {
            handleSubmit({
              ...(formRef.current?.getValues() || {}),
            });
          }}
          gap={scale(10)}
        >
          {!!detail?.employee_name?.length && (
            <>
              <Input
                label="Nhân viên"
                readOnly
                value={`[${detail?.employee_code}] ${detail?.employee_name}`}
              />
              <Input label="Chức danh" readOnly value={detail?.job_name ?? '--'} />
            </>
          )}
          <Input
            placeholder="Chọn loại giải trình"
            label="Loại giải trình"
            isRequired
            onPress={() => {
              setPickerConfig({
                data: explanationTypeList || [],
                selectedValue: state.timeSheetDetail?.explanation_reason,
                title: 'Chọn lý do giải trình',
                onSelect: (item) => {
                  setState((prev) => ({
                    ...prev,
                    timeSheetDetail: {
                      ...prev.timeSheetDetail,
                      explanation_reason: item.key.toString(),
                      explanation_reason_label: item.value,
                      autoFillCoefficient: true,
                      coefficient: '',
                    },
                  }));
                },
              });
              optionPickerRef.current?.expand();
            }}
            value={state.timeSheetDetail?.explanation_reason_label}
            iconRight={<IcDropdown size={20} />}
          />
          <Form.Item
            name="exp_name"
            onChange={(val) =>
              setState((prev) => ({
                ...prev,
                timeSheetDetail: { ...prev.timeSheetDetail, exp_name: val },
              }))
            }
          >
            <Input
              placeholder="Nhập lý do giải trình"
              isRequired
              multiline={true}
              label="Lý do giải trình"
            />
          </Form.Item>
          <Input
            placeholder="Chọn ngày giải trình"
            label="Ngày giải trình"
            isRequired
            editable={true}
            value={dayjs(state.timeSheetDetail?.explanation_date).format('DD/MM/YYYY')}
            onPress={() => {
              setDateTimeConfig({
                mode: 'date',
                initialValue: dayjs(state.timeSheetDetail?.explanation_date).toDate(),
                title: 'Chọn ngày giải trình',
                onConfirm: (date) => {
                  setState((prev) => ({
                    ...prev,
                    timeSheetDetail: {
                      ...prev.timeSheetDetail,
                      autoFillExplainedDate: true,
                      autoFillCoefficient: true,
                      coefficient: '',
                      explanation_date: dayjs(date).format('YYYY-MM-DD'),
                    },
                  }));
                },
              });
              dateTimePickerRef.current?.expand();
            }}
            iconRight={<IcCalendar size={18} />}
          />
          <Input
            label="Ca làm việc thực tế"
            editable={false}
            isRequired
            value={actualShift || ''}
          />
          <Input
            label="Check-in thực tế"
            editable={false}
            isRequired
            value={
              formatDateTime(calculateInformation?.actual_check_in) ||
              formatDateTime(timesheetExplanationDetail?.actual_check_in)
            }
          />
          <Input
            label="Check-out thực tế"
            editable={false}
            isRequired
            value={
              formatDateTime(calculateInformation?.actual_check_out) ||
              formatDateTime(timesheetExplanationDetail?.actual_check_out)
            }
          />
          <Input
            label="Công thực tế"
            editable={false}
            isRequired
            value={
              calculateInformation?.actual_work?.toString() ||
              timesheetExplanationDetail?.actual_work?.toString() ||
              ''
            }
          />
          <Input
            label="Ca làm việc ( giải trình )"
            placeholder={'Chọn ca làm việc'}
            onPress={() => {
              setPickerConfig({
                data: workShiftList,
                selectedValue: state.timeSheetDetail?.explained_resource_calendar_id,
                title: 'Chọn ca làm việc',
                onSelect: (item) => {
                  setState((prev) => ({
                    ...prev,
                    timeSheetDetail: {
                      ...prev.timeSheetDetail,
                      explained_resource_calendar_id: Number(item.key),
                      explained_resource_calendar_name: item.value,
                    },
                  }));
                },
              });
              optionPickerRef.current?.expand();
            }}
            value={state.timeSheetDetail?.explained_resource_calendar_name}
            isRequired
            iconRight={<IcDropdown size={20} />}
          />
          <SectionHeading title="Giải trình công tác di chuyển (nếu có)">
            <Form.Item name="work_address">
              <Input placeholder="Địa điểm công tác" label="Địa điểm công tác" />
            </Form.Item>
            {/* <Input
            label="Địa điểm công tác"
            placeholder="Chọn địa điểm công tác"

            onPress={() => {
              setPickerConfig({
                data: workLocationList,
                selectedValue: state.timeSheetDetail?.address_explanation?.at(0)?.id,
                title: 'Chọn địa điểm công tác',
                onSelect: (item) => {
                  setState((prev) => ({
                    ...prev,
                    timeSheetDetail: {
                      ...prev.timeSheetDetail,
                      address_explanation_ids: [Number(item.key)],
                      address_explanation: [
                        {
                          id: Number(item.key),
                          value: item.value,
                        },
                      ],
                    },
                  }));
                },
              });
              optionPickerRef.current?.expand();
            }}
            value={state.timeSheetDetail?.work_address}
          /> */}
            <Input
              label="Thời gian di chuyển đến"
              placeholder="Chọn thời gian"
              value={
                timeToDestinationFrom && timeToDestinationTo
                  ? formatTimeRange(new Date(timeToDestinationFrom), new Date(timeToDestinationTo))
                  : ''
              }
              onPress={() => {
                setTimeRangeConfig({
                  initialFromValue: timeToDestinationFrom
                    ? new Date(timeToDestinationFrom)
                    : undefined,
                  initialToValue: timeToDestinationTo ? new Date(timeToDestinationTo) : undefined,
                  title: 'Chọn thời gian di chuyển đến',
                  onConfirm: (fromDate, toDate) => {
                    const mFromDate = dayjs(selectedDate)
                      .set('hour', fromDate.getHours())
                      .set('minute', fromDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    const mToDate = dayjs(selectedDate)
                      .set('hour', toDate.getHours())
                      .set('minute', toDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        arrive_start_time: mFromDate,
                        arrive_end_time: mToDate,
                      },
                    }));
                  },
                  onDelete: () => {
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        arrive_start_time: '',
                        arrive_end_time: '',
                      },
                    }));
                  },
                });
                timeRangePickerRef.current?.expand();
              }}
              iconRight={<IcCalendar size={18} />}
            />
            <Input
              label="Thời gian di chuyển về"
              placeholder="Chọn thời gian"
              value={
                timeFromDestinationFrom && timeFromDestinationTo
                  ? formatTimeRange(
                      new Date(timeFromDestinationFrom),
                      new Date(timeFromDestinationTo),
                    )
                  : ''
              }
              onPress={() => {
                setTimeRangeConfig({
                  initialFromValue: timeFromDestinationFrom
                    ? new Date(timeFromDestinationFrom)
                    : undefined,
                  initialToValue: timeFromDestinationTo
                    ? new Date(timeFromDestinationTo)
                    : undefined,
                  title: 'Chọn thời gian di chuyển về',
                  onConfirm: (fromDate, toDate) => {
                    const mFromDate = dayjs(selectedDate)
                      .set('hour', fromDate.getHours())
                      .set('minute', fromDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    const mToDate = dayjs(selectedDate)
                      .set('hour', toDate.getHours())
                      .set('minute', toDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        leave_start_time: mFromDate,
                        leave_end_time: mToDate,
                      },
                    }));
                  },
                  onDelete: () => {
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        leave_start_time: '',
                        leave_end_time: '',
                      },
                    }));
                  },
                });
                timeRangePickerRef.current?.expand();
              }}
              iconRight={<IcCalendar size={18} />}
            />
            <Input
              label="Tổng thời gian di chuyển"
              editable={false}
              value={detail?.move_time?.toFixed(2) ?? '0'}
            />
          </SectionHeading>
          <SectionHeading title="Giải trình check in/out thực tế" initialExpanded>
            <Input
              label="Check-in ( giải trình )"
              placeholder="Chọn giờ check-in"
              value={formatTime(explainedCheckIn ? new Date(explainedCheckIn) : undefined)}
              onPress={() => {
                setDateTimeConfig({
                  mode: 'time',
                  initialValue: explainedCheckIn ? new Date(explainedCheckIn) : undefined,
                  title: 'Chọn giờ check-in',
                  onConfirm: (date) => {
                    const confirmDate = dayjs(selectedDate)
                      .set('hour', date.getHours())
                      .set('minute', date.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        explained_check_in: confirmDate,
                      },
                    }));
                  },
                });
                dateTimePickerRef.current?.expand();
              }}
              iconRight={<IcCalendar size={18} />}
            />
            <Input
              label="Check-out ( giải trình )"
              placeholder="Chọn giờ check-out"
              value={formatTime(explainedCheckOut ? new Date(explainedCheckOut) : undefined)}
              onPress={() => {
                setDateTimeConfig({
                  mode: 'time',
                  initialValue: explainedCheckOut ? new Date(explainedCheckOut) : undefined,
                  title: 'Chọn giờ check-out',
                  onConfirm: (date) => {
                    const confirmDate = dayjs(selectedDate)
                      .set('hour', date.getHours())
                      .set('minute', date.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        explained_check_out: confirmDate,
                      },
                    }));
                  },
                });
                dateTimePickerRef.current?.expand();
              }}
              iconRight={<IcCalendar size={18} />}
            />

            <Input
              label="Công giải trình"
              editable={false}
              value={detail?.explanation_work?.toFixed(2) || '0'}
            />
            <Input
              label="Số phút đi muộn"
              editable={false}
              value={detail?.late_minutes?.toFixed(2) || '0'}
            />
            <Input
              label="Số phút về sớm"
              editable={false}
              value={detail?.early_leave_minutes?.toFixed(2) || '0'}
            />
          </SectionHeading>

          <SectionHeading title="Giải trình tăng ca">
            <Input
              label="Tăng ca lần 1"
              placeholder="Chọn thời gian tăng ca"
              value={formatTimeRange(
                overtime1From ? new Date(overtime1From) : undefined,
                overtime1To ? new Date(overtime1To) : undefined,
              )}
              iconRight={<IcCalendar size={18} />}
              onPress={() => {
                setTimeRangeConfig({
                  initialFromValue: overtime1From ? new Date(overtime1From) : undefined,
                  initialToValue: overtime1To ? new Date(overtime1To) : undefined,
                  title: 'Chọn thời gian tăng ca lần 1',
                  onConfirm: (fromDate, toDate) => {
                    const mFromDate = dayjs(selectedDate)
                      .set('hour', fromDate.getHours())
                      .set('minute', fromDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    const mToDate = dayjs(selectedDate)
                      .set('hour', toDate.getHours())
                      .set('minute', toDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        overtime_first_start: mFromDate,
                        overtime_first_end: mToDate,
                      },
                    }));
                  },
                });
                timeRangePickerRef.current?.expand();
              }}
            />
            <Input
              label="Tăng ca lần 2"
              placeholder="Chọn thời gian tăng ca"
              value={formatTimeRange(
                overtime2From ? new Date(overtime2From) : undefined,
                overtime2To ? new Date(overtime2To) : undefined,
              )}
              iconRight={<IcCalendar size={18} />}
              onPress={() => {
                setTimeRangeConfig({
                  initialFromValue: overtime2From ? new Date(overtime2From) : undefined,
                  initialToValue: overtime2To ? new Date(overtime2To) : undefined,
                  title: 'Chọn thời gian tăng ca lần 2',
                  onConfirm: (fromDate, toDate) => {
                    const mFromDate = dayjs(selectedDate)
                      .set('hour', fromDate.getHours())
                      .set('minute', fromDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    const mToDate = dayjs(selectedDate)
                      .set('hour', toDate.getHours())
                      .set('minute', toDate.getMinutes())
                      .format('YYYY-MM-DD HH:mm:ss');
                    setState((prev) => ({
                      ...prev,
                      timeSheetDetail: {
                        ...prev.timeSheetDetail,
                        overtime_second_start: mFromDate,
                        overtime_second_end: mToDate,
                      },
                    }));
                  },
                });
                timeRangePickerRef.current?.expand();
              }}
            />
            <Input
              label="Số giờ nghỉ giữa ca"
              value={hours_of_break?.toString()}
              onChangeText={(text) => {
                setState((prev) => ({
                  ...prev,
                  timeSheetDetail: {
                    ...prev.timeSheetDetail,
                    autoFillHoursOfBreak: false,
                    hours_of_break: cleanNumberString(text),
                  },
                }));
              }}
              keyboardType="numeric"
            />
            <Input
              label="Hệ số"
              value={detail?.coefficient?.toString()}
              onChangeText={(text) => {
                setState((prev) => ({
                  ...prev,
                  timeSheetDetail: {
                    ...prev.timeSheetDetail,
                    autoFillCoefficient: false,
                    coefficient: cleanNumberString(text),
                  },
                }));
              }}
              keyboardType="numeric"
            />
            <Input
              label="Giờ tăng ca"
              editable={false}
              value={detail?.overtime_hours?.toFixed(2) || '0'}
            />
            <Input
              label="Giờ tăng ca quy đổi"
              editable={false}
              value={detail?.overtime_hours_convert?.toFixed(2) || '0'}
            />
            {/* <Input
              label="Số giờ nghỉ bù"
              editable={false}
              value={detail?.timeoff_hours?.toFixed(2) || '0'}
            /> */}
            <Input
              label="Số giờ phân bổ nghỉ bù"
              editable={false}
              value={detail?.allocated_buffer_hours?.toFixed(2) || '0'}
            />
            <Input
              label="Số giờ phân bổ vào lương"
              editable={false}
              value={detail?.salary_hours?.toFixed(2) || '0'}
            />
          </SectionHeading>
          {detail?.id && (
            <Input label="Lý do huỷ" editable={false} value={detail?.reject_reason || '--'} />
          )}
        </Form>
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <View pb={scale(32)} p={horizontalScale(16)}>
          {renderStatusBadge()}
          {renderApprovalButtons()}
          {renderFields()}
          {renderUploadSection()}
          {createDateInfo?.data?.id && (
            <View mt={scale(12)}>
              <ReportBlock
                lines={[
                  { label: 'Người tạo', value: createDateInfo?.data.creator_name || '' },
                  {
                    label: 'Thời gian tạo',
                    value: dayjs(createDateInfo?.data.create_date).format('DD/MM/YYYY HH:mm:ss'),
                  },
                ]}
              />
            </View>
          )}
          {!!histories?.data?.approval_steps?.length && (
            <View mt={scale(16)}>
              <CardContainer>
                <View gap={scale(16)}>
                  {histories?.data?.approval_steps.map((item) => (
                    <ItemHistory
                      key={item.step_approval_id}
                      item={{
                        step_name: item.step_approval_name || '',
                        description: item.description || '',
                      }}
                    />
                  ))}
                </View>
              </CardContainer>
            </View>
          )}
          {renderBtn()}
        </View>
      </ScrollView>
    );
  };
  return (
    <Screen scrollEnabled={false}>
      {renderHeader()}
      {renderBody()}
      {calculateInformationLoading && (
        <View top={scale(112)} right={scale(0)} padding={scale(2)} position="absolute" bg={'white'}>
          <ActivityIndicator size={12} />
        </View>
      )}
      {/* Modal dùng chung cho DateTimePicker */}
      <DateTimePickerModal
        bottomSheetRef={dateTimePickerRef}
        mode={dateTimeConfig.mode}
        initialValue={dateTimeConfig.initialValue}
        title={dateTimeConfig.title}
        onConfirm={dateTimeConfig.onConfirm}
      />
      {/* Modal dùng chung cho TimeRangePicker */}
      <TimeRangePickerModal
        bottomSheetRef={timeRangePickerRef}
        title={timeRangeConfig.title}
        initialFromValue={timeRangeConfig.initialFromValue}
        initialToValue={timeRangeConfig.initialToValue}
        onConfirm={timeRangeConfig.onConfirm}
        onDelete={timeRangeConfig.onDelete}
      />
      {/* Modal dùng chung cho OptionPicker */}
      <OptionPickerModal
        bottomSheetRef={optionPickerRef}
        data={pickerConfig.data}
        selectedValue={pickerConfig.selectedValue}
        title={pickerConfig.title}
        onSelect={pickerConfig.onSelect}
        searchable
      />
      {/* File Picker Bottom Sheet */}
      <FilePickerBottomSheet
        bottomSheetRef={filePickerRef}
        onSelectImage={handleSelectImage}
        onSelectDocument={handleSelectDocument}
        onSelectVideo={handleSelectVideo}
      />
      <CancelDialog
        ref={dialogRef}
        title="Lý do từ chối"
        message="Bạn có chắc muốn từ chối đơn này không?"
        onCancel={dialogRef.current?.close}
        onConfirm={(text) => {
          handleReject(text);
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
  },
  uploadContainer: {
    marginTop: verticalScale(20),
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: scale(12),
    paddingVertical: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: '#F9FAFB',
  },
  uploadIconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filesListContainer: {
    marginTop: verticalScale(16),
    gap: scale(12),
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    gap: scale(12),
  },
  deleteButton: {
    padding: scale(8),
  },
  statusIndicator: {
    opacity: 0.8,
  },
  rejectBtn: {
    backgroundColor: getTokens().color.d_red.val,
  },
  approveBtn: {
    backgroundColor: getTokens().color.blue.val,
  },
});

export default TimesheetExplanationDetail;
