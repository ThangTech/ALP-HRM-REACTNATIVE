import React, { useMemo } from 'react';
import { useSafeArea } from 'hooks';
import { View } from 'tamagui';
import { scale } from 'utils';
import { usePersonalReportEditorProvider } from '../provider';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { Button } from 'components';
import { goBack } from 'navigators';

interface PersonalReportButtonsType {
  id?: number;
  viewType: LeaveRegistrationViewType;
}

const PersonalReportButtons = (props: PersonalReportButtonsType) => {
  const safeArea = useSafeArea();
  const provider = usePersonalReportEditorProvider();
  const mButtons = provider.state.detail?.buttons;
  const buttons = useMemo(() => {
    return mButtons || [];
  }, [mButtons]);

  const hasButton = (buttonType: TerminationButtonType) => {
    return buttons.includes(buttonType);
  };

  if (!buttons.length && props.id) {
    return null;
  }

  return (
    <View
      fd={'row'}
      bg={'$white'}
      gap={scale(16)}
      pt={scale(12)}
      pb={scale(12) + safeArea.bottom}
      ph={scale(16)}
    >
      {!props.id && (
        <View f={1}>
          <Button
            variant="detractive"
            onPress={() => goBack()}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.APPROVE_REJECT}
          >
            <Button.Text variant="detractive">Huỷ</Button.Text>
          </Button>
        </View>
      )}
      {hasButton(TerminationButtonType.APPROVE_REJECT) && (
        <View f={1}>
          <Button
            variant="detractive"
            onPress={() => provider.handleButton({ button: TerminationButtonType.APPROVE_REJECT })}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.APPROVE_REJECT}
          >
            <Button.Text variant="detractive">Từ chối</Button.Text>
          </Button>
        </View>
      )}
      {hasButton(TerminationButtonType.BTN_CANCEL) && (
        <View f={1}>
          <Button
            variant="detractive"
            onPress={() => provider.handleButton({ button: TerminationButtonType.BTN_CANCEL })}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.BTN_CANCEL}
          >
            <Button.Text variant="detractive">Huỷ phiếu</Button.Text>
          </Button>
        </View>
      )}
      {hasButton(TerminationButtonType.BTN_TO_DRAFT) && (
        <View f={1}>
          <Button
            variant="detractive"
            onPress={() => provider.handleButton({ button: TerminationButtonType.BTN_TO_DRAFT })}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.BTN_TO_DRAFT}
          >
            <Button.Text variant="detractive">Chuyển về nháp</Button.Text>
          </Button>
        </View>
      )}
      {hasButton(TerminationButtonType.APPROVE_SUBMIT) && (
        <View f={1}>
          <Button
            variant="primary"
            onPress={() => provider.handleButton({ button: TerminationButtonType.APPROVE_SUBMIT })}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.APPROVE_SUBMIT}
          >
            <Button.Text variant="primary">Trình duyệt</Button.Text>
          </Button>
        </View>
      )}
      {hasButton(TerminationButtonType.APPROVE_ACCEPT) && (
        <View f={1}>
          <Button
            variant="primary"
            onPress={() => provider.handleButton({ button: TerminationButtonType.APPROVE_ACCEPT })}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.APPROVE_ACCEPT}
          >
            <Button.Text variant="primary">Duyệt</Button.Text>
          </Button>
        </View>
      )}
      {!props.id && (
        <View f={1}>
          <Button
            variant="primary"
            onPress={() => provider.handleCreate()}
            disabled={!!provider.state.actionHandling}
            loading={provider.state.actionHandling === TerminationButtonType.APPROVE_ACCEPT}
          >
            <Button.Text variant="primary">Tạo mới</Button.Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default PersonalReportButtons;
