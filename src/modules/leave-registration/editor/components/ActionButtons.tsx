import React, { useRef } from 'react';
import { LeaveButtonType } from 'common/enum/leave-registration-status';
import { globalStyle } from 'common/styles/base';
import { Button, showToast } from 'components';
import ConfirmDialog from 'modules/leave-registration/detail/components/ConfirmDialog';
import { scale } from 'utils';
import { View } from 'tamagui';
import { BaseModalRef } from 'components/base/Modal';
import { LeaveRegistration } from 'common/model/leave-registration';
import { useSafeArea } from 'hooks';
import CancelDialog from 'modules/leave-registration/detail/components/CancelDialog';

interface ActionButtonType {
  buttons?: LeaveButtonType[];
  triggerUpdate: (data: Partial<LeaveRegistration>) => Promise<void>;
  isViewApprove?: boolean;
}

const ActionButtons = (props: ActionButtonType) => {
  const safeArea = useSafeArea();
  const dialogRef = useRef<BaseModalRef>(null);
  const dialogConfirmRef = useRef<BaseModalRef>(null);
  const dialogMoveToDraftRef = useRef<BaseModalRef>(null);
  const dialogConfirmApproveRef = useRef<BaseModalRef>(null);
  const dialogConfirmSubmitRef = useRef<BaseModalRef>(null);

  const { buttons, triggerUpdate, isViewApprove } = props;

  const _handleAction = async (data: Partial<LeaveRegistration>) => {
    try {
      await triggerUpdate(data);
    } catch (error: any) {
      showToast('error', error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      dialogRef.current?.close();
      dialogConfirmRef.current?.close();
      dialogMoveToDraftRef.current?.close();
      dialogConfirmApproveRef.current?.close();
      dialogConfirmSubmitRef.current?.close();
    }
  };
  return (
    <>
      {!!buttons?.length && (
        <View
          fd="row"
          gap={scale(16)}
          ph={scale(16)}
          pt={scale(12)}
          pb={scale(12) + safeArea.bottom}
          bg={'$white'}
        >
          {buttons?.includes(LeaveButtonType.ACTION_CANCEL) && (
            <Button
              variant="detractive"
              style={globalStyle.fullWidth}
              onPress={() => dialogConfirmRef.current?.open()}
            >
              <Button.Text variant="detractive">Huỷ đơn</Button.Text>
            </Button>
          )}
          {buttons?.includes(LeaveButtonType.APPROVAL_SET_TO_DRAFT) && (
            <Button
              variant="detractive"
              style={globalStyle.fullWidth}
              onPress={() => dialogMoveToDraftRef.current?.open()}
            >
              <Button.Text variant="detractive">
                {isViewApprove ? 'Huỷ duyệt' : 'Huỷ đơn'}
              </Button.Text>
            </Button>
          )}
          {buttons.includes(LeaveButtonType.APPROVAL_REJECT) && (
            <Button
              variant="detractive"
              style={globalStyle.fullWidth}
              onPress={() => dialogRef.current?.open()}
            >
              <Button.Text variant="detractive">Từ chối</Button.Text>
            </Button>
          )}
          {buttons.includes(LeaveButtonType.APPROVAL_ACCEPT) && (
            <Button
              variant="primary"
              style={{ ...globalStyle.btnPrimary, ...globalStyle.fullWidth }}
              onPress={() => dialogConfirmApproveRef.current?.open()}
            >
              <Button.Text>Duyệt</Button.Text>
            </Button>
          )}
          {buttons.includes(LeaveButtonType.APPROVAL_SUBMIT) && (
            <Button
              variant="primary"
              style={{ ...globalStyle.btnPrimary, ...globalStyle.fullWidth }}
              onPress={() => dialogConfirmSubmitRef.current?.open()}
            >
              <Button.Text>Trình duyệt</Button.Text>
            </Button>
          )}
        </View>
      )}
      <ConfirmDialog
        ref={dialogConfirmRef}
        title="Thông báo hủy"
        message="Bạn có chắc muốn hủy đơn này?"
        onCancel={() => dialogConfirmRef.current?.close()}
        onConfirm={() => _handleAction({ action: LeaveButtonType.ACTION_CANCEL })}
      />
      <ConfirmDialog
        ref={dialogMoveToDraftRef}
        title={isViewApprove ? 'Thông báo huỷ duyệt' : 'Thông báo huỷ đơn'}
        message={
          isViewApprove ? 'Bạn có chắc muốn huỷ duyệt đơn này?' : 'Bạn có chắc muốn huỷ đơn này?'
        }
        onCancel={() => dialogMoveToDraftRef.current?.close()}
        onConfirm={() => _handleAction({ action: LeaveButtonType.APPROVAL_SET_TO_DRAFT })}
      />
      <ConfirmDialog
        ref={dialogConfirmApproveRef}
        title="Thông báo duyệt"
        message="Bạn có chắc muốn duyệt đơn này không?"
        onCancel={() => dialogConfirmApproveRef.current?.close()}
        onConfirm={() => _handleAction({ action: LeaveButtonType.APPROVAL_ACCEPT })}
      />
      <ConfirmDialog
        ref={dialogConfirmSubmitRef}
        title="Thông báo trình duyệt"
        message="Bạn có chắc muốn trình duyệt đơn này không?"
        onCancel={() => dialogConfirmSubmitRef.current?.close()}
        onConfirm={() => _handleAction({ action: LeaveButtonType.APPROVAL_SUBMIT })}
      />
      <CancelDialog
        ref={dialogRef}
        title="Lý do từ chối"
        message="Bạn có chắc muốn từ chối đơn này không?"
        onCancel={() => dialogRef.current?.close()}
        onConfirm={(text) => {
          _handleAction({ action: LeaveButtonType.APPROVAL_REJECT, reject_reason: text });
        }}
      />
    </>
  );
};

export default ActionButtons;
