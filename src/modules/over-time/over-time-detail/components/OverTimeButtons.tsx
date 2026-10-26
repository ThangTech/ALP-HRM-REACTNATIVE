import React from 'react';
import { View } from 'tamagui';
import { useOverTimeDetailProvider } from '../provider';
import { useSafeArea } from 'hooks';
import { scale } from 'utils';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { Button } from 'components';

const OverTimeButtons = () => {
  const safeArea = useSafeArea();
  const provider = useOverTimeDetailProvider();

  const isViewMe = provider.state.viewType === LeaveRegistrationViewType.ME;
  const isViewApprove = provider.state.viewType === LeaveRegistrationViewType.APPROVE;

  const hasButton = (buttonType: any): boolean => {
    return !!provider.state.detail?.buttons?.includes(buttonType);
  };

  if (!provider.state.detail?.buttons?.length) {
    return null;
  }

  return (
    <View pt={scale(12)} pb={scale(12) + safeArea.bottom} ph={scale(16)}>
      {isViewMe && hasButton(TerminationButtonType.BTN_CANCEL) && (
        <Button variant="detractive">
          <Button.Text variant="detractive">Huỷ phiếu</Button.Text>
        </Button>
      )}
      {isViewMe && hasButton(TerminationButtonType.BTN_TO_DRAFT) && (
        <Button variant="detractive">
          <Button.Text variant="detractive">Chuyển về nháp</Button.Text>
        </Button>
      )}
      {isViewMe && hasButton(TerminationButtonType.APPROVE_REJECT) && (
        <Button variant="detractive">
          <Button.Text variant="detractive">Từ chối</Button.Text>
        </Button>
      )}
      {isViewMe && hasButton(TerminationButtonType.APPROVE_SUBMIT) && (
        <Button variant="detractive">
          <Button.Text variant="detractive">Trình duyệt</Button.Text>
        </Button>
      )}
      {isViewApprove && hasButton(TerminationButtonType.APPROVE_ACCEPT) && (
        <Button variant="detractive">
          <Button.Text variant="detractive">Duyệt</Button.Text>
        </Button>
      )}
    </View>
  );
};

export default OverTimeButtons;
