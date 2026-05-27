/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { OptionItem, showToast } from 'components';
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { PersonalReportEditorState } from './PersonalReportEditorState';
import { PersonalReportType } from 'common/enum/personal-report-type';
import { usePersonalReportEditorApi } from './hooks/usePersonalReportEditorApi';
import dayjs from 'dayjs';
import { PersonalReport } from 'common/model/personal-report';
import { goBack } from 'navigators';
import useAppContext from 'hooks/useAppContext';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { BaseResponse } from 'common/model/base-response';
import { ApprovalProgress } from 'common/model/approval_progress';
import { formatCurrency, string2Number } from 'utils';

const PersonalReportEditorContext = createContext<PersonalReportEditorType>(null!);

interface PersonalReportEditorType {
  state: PersonalReportEditorState;
  setState: Dispatch<SetStateAction<PersonalReportEditorState>>;
  form: UseFormReturn<PersonalReportEditorForm>;
  handleButton: (data: Partial<PersonalReport>) => Promise<void>;
  handleCreate: () => Promise<void>;
  histories?: BaseResponse<ApprovalProgress>;
}

export function usePersonalReportEditorProvider() {
  return useContext(PersonalReportEditorContext);
}

export interface PersonalReportEditorForm {
  type: OptionItem;
  employee?: OptionItem;
  reason?: string;
  hasChallenges?: boolean;
  from?: Date;
  to?: Date;
  area?: OptionItem;
  division?: OptionItem;
  department?: OptionItem;
  group?: OptionItem;
  job?: OptionItem;
  position?: OptionItem;
  rank?: OptionItem;
  director?: OptionItem;
  manager?: OptionItem;
  jobDescription?: string;
  concurrentJob?: OptionItem;
  expectAllowance: string;
  concurrentAllowance: string;
  expectSalary?: string;
  manufactureDate?: Date;
  expiredDate?: Date;
  expectDepartmentHead?: string;
  expectHumanResource?: string;
}

export function PersonalReportEditorProvider({ children }: { children: ReactElement }) {
  const app = useAppContext();
  const [state, setState] = useState<PersonalReportEditorState>({
    typeOptions: [
      { key: PersonalReportType.APPOINT, value: 'Bổ nhiệm' },
      { key: PersonalReportType.CONCURRENT_POSITION, value: 'Kiêm nhiệm' },
      { key: PersonalReportType.SALARY_CHANGE, value: 'Điều chỉnh lương' },
      { key: PersonalReportType.JOB_ASSIGNMENT, value: 'Phân công công việc' },
      { key: PersonalReportType.TRANSFER, value: 'Điều chuyển' },
      { key: PersonalReportType.DISMISSAL, value: 'Miễn nhiệm' },
    ],
  });
  const form = useForm<PersonalReportEditorForm>({
    defaultValues: {
      type: state.typeOptions?.[0],
      employee: {
        key: app.user?.employee_id,
        value: `${app.user?.employee_code} - ${app.user?.name}`,
      },
    },
  });
  const personalReportEditorApi = usePersonalReportEditorApi(state);
  const areas = personalReportEditorApi.areaSwr.data;
  const departments = personalReportEditorApi.departmentSwr.data;
  const groups = personalReportEditorApi.groupSwr.data;
  const jobs = personalReportEditorApi.jobSwr.data;
  const positions = personalReportEditorApi.jobTitleSwr.data;
  const employees = personalReportEditorApi.employeeOptionsSwr.data;

  const mappingFormValues = (): Partial<PersonalReport> => {
    const formData = form.getValues();

    return {
      type: formData.type.key as string,
      employee_id: formData.employee?.key as number,
      content: formData.reason,
      is_challenge: formData.hasChallenges,
      start_date: formData.from ? dayjs(formData.from).format('YYYY-MM-DD') : undefined,
      end_date: formData.to ? dayjs(formData.to).format('YYYY-MM-DD') : undefined,
      area_category_id: formData.area?.key ? +formData.area?.key : undefined,
      department_id: formData.department?.key ? +formData.department?.key : undefined,
      group_id: formData.group?.key ? +formData.group?.key : undefined,
      job_id: formData.job?.key ? +formData.job?.key : undefined,
      job_title_id: formData.position?.key ? +formData.position?.key : undefined,
      level_id: formData.rank?.key ? +formData.rank?.key : undefined,
      parent_id: formData.director?.key ? +formData.director?.key : undefined,
      coach_id: formData.manager?.key ? +formData.manager?.key : undefined,
      work_assignment: formData.jobDescription,
      suggested_allowance: +(string2Number(formData.expectAllowance) ?? '0'),
      concurrent_allowance: +(string2Number(formData.concurrentAllowance) ?? '0'),
      salary: +(string2Number(formData.expectSalary) ?? '0'),
      effective_date: formData.manufactureDate
        ? dayjs(formData.manufactureDate).format('YYYY-MM-DD')
        : undefined,
      expiration_date: formData.expiredDate
        ? dayjs(formData.expiredDate).format('YYYY-MM-DD')
        : undefined,
      hr_note: formData.expectDepartmentHead,
      note: formData.expectHumanResource,
    } as Partial<PersonalReport>;
  };

  const handleCreate = async () => {
    try {
      setState((prev) => ({ ...prev, actionHandling: TerminationButtonType.APPROVE_ACCEPT }));
      const response = await personalReportEditorApi.createSwr.trigger({
        ...mappingFormValues(),
      });
      if (response?.id) {
        setState((prev) => ({ ...prev, id: response.id }));
      }
    } catch (error: any) {
      showToast('error', error.message ?? 'Thao tác thất bại');
    }
    setState((prev) => ({ ...prev, actionHandling: undefined }));
  };

  const handleButton = async (data: Partial<PersonalReport>) => {
    setState((prev) => ({ ...prev, actionHandling: data.button }));
    try {
      await personalReportEditorApi.updateSwr.trigger({
        ...mappingFormValues(),
        id: state.id,
        button: data.button,
      });
      goBack();
    } catch (error: any) {
      showToast('error', error.message ?? 'Thao tác thất bại');
    }
    setState((prev) => ({ ...prev, actionHandling: undefined }));
  };

  useEffect(() => {
    const data = personalReportEditorApi.detailSwr.data;
    if (!data) {
      return;
    }
    form.reset({
      type: { key: data.type, value: data.label_type },
      employee: data.employee_name
        ? { key: data.employee_id, value: `${data.employee_code} - ${data.employee_name}` }
        : undefined,
      reason: data.content,
      hasChallenges: data.is_challenge,
      from: data.start_date ? dayjs(data.start_date).toDate() : undefined,
      to: data.end_date ? dayjs(data.end_date).toDate() : undefined,
      area: data.area_category_name
        ? { key: data.area_category_id, value: data.area_category_name }
        : undefined,
      division: data.division_name
        ? { key: data.division_id, value: data.division_name }
        : undefined,
      department: data.department_name
        ? { key: data.department_id, value: data.department_name }
        : undefined,
      group: data.group_name ? { key: data.group_id, value: data.group_name } : undefined,
      job: data.job_name ? { key: data.job_id, value: data.job_name } : undefined,
      position: data.job_title_name
        ? { key: data.job_title_id, value: data.job_title_name }
        : undefined,
      rank: data.level_name ? { key: data.level_id, value: data.level_name } : undefined,
      director: data.parrent_name ? { key: data.parent_id, value: data.parrent_name } : undefined,
      manager: data.coach_name ? { key: data.coach_id, value: data.coach_name } : undefined,
      jobDescription: data.work_assignment,
      expectAllowance: formatCurrency(data.suggested_allowance).toString(),
      concurrentAllowance: formatCurrency(data.concurrent_allowance).toString(),
      expectSalary: formatCurrency(data.salary).toString(),
      manufactureDate: data.effective_date ? dayjs(data.effective_date).toDate() : undefined,
      expiredDate: data.expiration_date ? dayjs(data.expiration_date).toDate() : undefined,
      expectDepartmentHead: data.hr_note,
      expectHumanResource: data.note,
    });
    setState((prev) => ({ ...prev, detail: data, departmentId: data.department_id }));
  }, [personalReportEditorApi.detailSwr.data]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      areaOptions: areas,
      departmentOptions: departments,
      groupOptions: groups,
      jobOptions: jobs,
      positionOptions: positions,
      employeeOptions: employees,
      directorOptions: employees,
      managerOptions: employees,
    }));
  }, [areas, departments, groups, jobs, positions, employees]);
  const value = {
    state,
    setState,
    form,
    handleButton,
    handleCreate,
    histories: personalReportEditorApi.histories,
  };
  return (
    <PersonalReportEditorContext.Provider value={value}>
      {children}
    </PersonalReportEditorContext.Provider>
  );
}
