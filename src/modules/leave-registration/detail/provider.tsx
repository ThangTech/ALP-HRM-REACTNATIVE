/* eslint-disable react-hooks/exhaustive-deps */
import { ApprovalProgress } from 'common/model/approval_progress';
import { BaseResponse } from 'common/model/base-response';
import { LeaveRegistration } from 'common/model/leave-registration';
import { showToast } from 'components';
import { goBack } from 'navigators';
import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLeaveRegistrationDetailApi } from './hooks/useLeaveRegistrationDetailApi';
import { LeaveRegistrationDetailState } from './LeaveRegistrationDetailState';
import { CreationModel } from 'common/model/creation-model';

const LeaveRegistrationDetailContext = createContext<LeaveRegistrationDetailType>(null!);

interface LeaveRegistrationDetailType {
  state: LeaveRegistrationDetailState;
  setState: Dispatch<SetStateAction<LeaveRegistrationDetailState>>;
  triggerUpdate: (data: Partial<LeaveRegistration>) => Promise<void>;
  histories?: BaseResponse<ApprovalProgress>;
  createDateInfo?: BaseResponse<CreationModel>;
}

export function useLeaveRegistrationDetailProvider() {
  return useContext(LeaveRegistrationDetailContext);
}

export function LeaveRegistrationDetailProvider({ children }: { children: ReactElement }) {
  const [state, setState] = useState<LeaveRegistrationDetailState>({});
  const leaveRegistrationApi = useLeaveRegistrationDetailApi(state);
  const record = leaveRegistrationApi.leaveDetailSwr.data;

  const triggerUpdate = async (data: Partial<LeaveRegistration>) => {
    try {
      await leaveRegistrationApi.updateLeaveRegistrationSwr.trigger(data);
      goBack();
    } catch (error: any) {
      showToast('error', error.message ?? 'Cập nhật đơn xin nghỉ phép thất bại');
    }
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, item: record }));
  }, [record]);

  useEffect(() => {
    if (!state.id) {
      return;
    }
    leaveRegistrationApi.leaveDetailSwr.mutate();
  }, [state.id]);

  const value = {
    state,
    setState,
    triggerUpdate,
    histories: leaveRegistrationApi.histories,
    createDateInfo: leaveRegistrationApi.createDateInfo,
  };
  return (
    <LeaveRegistrationDetailContext.Provider value={value}>
      {children}
    </LeaveRegistrationDetailContext.Provider>
  );
}
