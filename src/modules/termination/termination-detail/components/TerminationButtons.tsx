import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { TerminationButtonType } from 'common/enum/termination-button-type';
import { Button } from 'components';
import { BaseModalRef } from 'components/base/Modal';
import { useSafeArea } from 'hooks';
import CancelDialog from 'modules/leave-registration/detail/components/CancelDialog';
import ConfirmDialog from 'modules/leave-registration/detail/components/ConfirmDialog';
import React, { useMemo, useRef } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';
import { useTerminationDetailProvider } from '../provider';

interface TerminationButtonsType {
  viewType: LeaveRegistrationViewType;
}

const TerminationButtons = (props: TerminationButtonsType) => {
  const safeArea = useSafeArea();
  const provider = useTerminationDetailProvider();
  const termination = provider.state.termination;
  const mButtons = termination?.buttons;
  const isViewMe = props.viewType === LeaveRegistrationViewType.ME;
  const dialogRef = useRef<BaseModalRef>(null);
  const dialogConfirmRef = useRef<BaseModalRef>(null);
  const dialogConfirmApproveRef = useRef<BaseModalRef>(null);
  const dialogConfirmSubmitRef = useRef<BaseModalRef>(null);

  const buttons = useMemo(() => {
    if (!mButtons?.length) {
      return [];
    }
    if (isViewMe) {
      return mButtons?.filter((it) =>
        [TerminationButtonType.BTN_CANCEL, TerminationButtonType.APPROVE_SUBMIT].includes(it),
      );
    }
    return mButtons?.filter(
      (it) =>
        ![TerminationButtonType.BTN_CANCEL, TerminationButtonType.APPROVE_SUBMIT].includes(it),
    );
  }, [mButtons, isViewMe]);

  const hasButton = (buttonType: TerminationButtonType) => {
    return buttons.includes(buttonType);
  };

  if (!buttons.length) {
    return null;
  }

  return (
    <>
      <View
        bg={'$white'}
        pt={scale(12)}
        pb={scale(12) + safeArea.bottom}
        ph={scale(16)}
        gap={scale(16)}
        fd={'row'}
      >
        {hasButton(TerminationButtonType.APPROVE_REJECT) && (
          <View f={1}>
            <Button
              variant="detractive"
              onPress={() => dialogRef.current?.open()}
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
              onPress={() => dialogConfirmRef.current?.open()}
              disabled={!!provider.state.actionHandling}
              loading={provider.state.actionHandling === TerminationButtonType.BTN_CANCEL}
            >
              <Button.Text variant="detractive">Huỷ phiếu</Button.Text>
            </Button>
          </View>
        )}
        {hasButton(TerminationButtonType.APPROVE_SUBMIT) && (
          <View f={1}>
            <Button
              variant="primary"
              onPress={() => dialogConfirmSubmitRef.current?.open()}
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
              onPress={() => dialogConfirmApproveRef.current?.open()}
              disabled={!!provider.state.actionHandling}
              loading={provider.state.actionHandling === TerminationButtonType.APPROVE_ACCEPT}
            >
              <Button.Text variant="primary">Duyệt</Button.Text>
            </Button>
          </View>
        )}
      </View>
      <ConfirmDialog
        ref={dialogConfirmRef}
        title="Thông báo hủy"
        message="Bạn có chắc muốn hủy đơn này?"
        onCancel={() => dialogConfirmRef.current?.close()}
        onConfirm={() => provider.handleButton({ button: TerminationButtonType.BTN_CANCEL })}
      />
      <ConfirmDialog
        ref={dialogConfirmApproveRef}
        title="Thông báo duyệt"
        message="Bạn có chắc muốn duyệt đơn này không?"
        onCancel={() => dialogConfirmApproveRef.current?.close()}
        onConfirm={() => provider.handleButton({ button: TerminationButtonType.APPROVE_ACCEPT })}
      />
      <ConfirmDialog
        ref={dialogConfirmSubmitRef}
        title="Thông báo trình duyệt"
        message="Bạn có chắc muốn trình duyệt đơn này không?"
        onCancel={() => dialogConfirmSubmitRef.current?.close()}
        onConfirm={() => provider.handleButton({ button: TerminationButtonType.APPROVE_SUBMIT })}
      />
      <CancelDialog
        ref={dialogRef}
        title="Lý do từ chối"
        message="Bạn có chắc muốn từ chối đơn này không?"
        onCancel={() => {
          dialogRef.current?.close();
        }}
        onConfirm={(text) => {
          provider.handleButton({
            button: TerminationButtonType.APPROVE_REJECT,
            reject_reason: text,
          });
        }}
      />
    </>
  );
};

export default TerminationButtons;
