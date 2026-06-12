import api from 'hooks/api';
import { PersonalReportEditorState } from '../PersonalReportEditorState';
import { PersonalReport } from 'common/model/personal-report';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import useAppContext from 'hooks/useAppContext';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { OptionItem } from 'components';
import { BaseResponse } from 'common/model/base-response';
import { ApprovalProgress } from 'common/model/approval_progress';

export const usePersonalReportEditorApi = (state: PersonalReportEditorState) => {
  const app = useAppContext();
  const fetchDetail = async (): Promise<PersonalReport | undefined> => {
    if (!state?.id) {
      return;
    }
    const response = await api.POST({
      path: '/api/models/staff-transfer/execute/get_staff_transfer_details',
      data: {
        kwargs: {
          id: state?.id,
        },
      },
    });
    return response.data.records[0];
  };

  const _fetchHistory = async (): Promise<BaseResponse<ApprovalProgress> | undefined> => {
    if (!state?.id) {
      return;
    }
    const response = await api.POST<BaseResponse<ApprovalProgress>>({
      path: '/api/models/staff-transfer/execute/get_staff_transfer_approval_progress',
      data: {
        kwargs: {
          id: state?.id,
        },
      },
    });
    return response;
  };

  const fetchEmployee = async (): Promise<OptionItem[]> => {
    const response = await api.POST<BaseResponse<{ id: number; display_name: string }[]>>({
      path: '/api/models/hr-employee/execute/get_list_employee_infor',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    return response.data?.map((it) => ({ key: it.id, value: it.display_name })) || [];
  };

  const groupFetcher = async (): Promise<OptionItem[]> => {
    if (!state.departmentId) {
      return [];
    }
    const res = await api.POST({
      path: '/api/models/sv-employee-group/execute/get_infor_employee_group',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
      }));
      return temp;
    }
    return [];
  };

  const areaFetcher = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/area-category/execute/get_infor_area_category',
      data: {},
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
      }));
      return temp;
    }
    return [];
  };

  const jobFetcher = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/hr-job/execute/get_infor_job',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
      }));
      return temp;
    }
    return [];
  };

  const jobTitleFetcher = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/hr-job-title/execute/get_infor_job_title',
      data: {},
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
        data: item,
      }));
      return temp;
    }
    return [];
  };

  const departmentFetcher = async (): Promise<OptionItem[]> => {
    const res = await api.POST({
      path: '/api/models/hr-department/execute/get_infor_employee_department',
      data: {
        context: {
          company_id: app.current_company_id,
          allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
        },
      },
    });
    if (res?.data) {
      const temp = res.data.map((item: any) => ({
        key: item.id.toString(),
        value: item.name,
      }));
      return temp;
    }
    return [];
  };

  const create = async (
    _: any,
    { arg }: { arg: Partial<PersonalReport> },
  ): Promise<PersonalReport> => {
    const response = await api.POST({
      path: '/api/models/staff-transfer/execute/create_or_update_staff_transfer',
      data: {
        kwargs: {
          id: arg?.id,
          ...arg,
        },
      },
    });
    return response.data;
  };

  const handleAction = async (_: any, { arg }: { arg: Partial<PersonalReport> }) => {
    let path = '/api/models/staff-transfer/execute/app_approval_submit';
    if (arg.button === TerminationButtonType.APPROVE_ACCEPT) {
      path = '/api/models/staff-transfer/execute/app_approval_accept';
    } else if (arg.button === TerminationButtonType.APPROVE_REJECT) {
      path = '/api/models/staff-transfer/execute/app_approval_reject';
    } else if (arg.button === TerminationButtonType.BTN_TO_DRAFT) {
      path = '/api/models/staff-transfer/execute/app_draft';
    } else if (arg.button === TerminationButtonType.BTN_CANCEL) {
      path = '/api/models/staff-transfer/execute/app_cancel';
    }
    await api.POST({
      path: '/api/models/staff-transfer/execute/create_or_update_staff_transfer',
      data: {
        kwargs: {
          id: arg?.id,
          ...arg,
          button: undefined,
        },
      },
    });
    const response = await api.POST({
      path: path,
      data: {
        kwargs: {
          id: state?.id,
          ...arg,
          button: undefined,
        },
      },
    });
    return response.data;
  };

  const detailSwr = useSWR(['get_staff_transfer_details', state.id], fetchDetail);
  const { data: histories } = useSWR(
    ['get_staff_transfer_approval_progress', state.id],
    _fetchHistory,
  );
  const employeeOptionsSwr = useSWR(
    ['get_list_employee_infor', app.current_company_id],
    fetchEmployee,
  );
  const areaSwr = useSWR(['get_infor_area_category'], areaFetcher);
  const jobTitleSwr = useSWR(['get_infor_job_title'], jobTitleFetcher);
  const departmentSwr = useSWR(['get_infor_employee_department'], departmentFetcher);
  const groupSwr = useSWR(['get_infor_employee_group', state.departmentId], groupFetcher);
  const jobSwr = useSWR(['get_infor_employee_group'], jobFetcher);

  const createSwr = useSWRMutation(['get_staff_transfer_details'], create);
  const updateSwr = useSWRMutation(['get_staff_transfer_details', state.id], handleAction);

  return {
    detailSwr,
    updateSwr,
    createSwr,
    employeeOptionsSwr,
    areaSwr,
    jobTitleSwr,
    departmentSwr,
    groupSwr,
    jobSwr,
    histories,
  };
};
