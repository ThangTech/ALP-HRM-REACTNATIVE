import React, { forwardRef } from 'react';
import { Modal } from 'components';
import { BaseModalRef } from 'components/base/Modal';
import ModalButton from 'components/base/ModalButton';
import { Text, View } from 'tamagui';
import { scale } from 'utils';

interface ConfirmDialogType {
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}
const ConfirmDialog = forwardRef<BaseModalRef, ConfirmDialogType>((props, ref) => {
  return (
    <Modal ref={ref} disableBackDropPress title={props.title}>
      <View>
        <Text fontSize={scale(14)} pv={scale(16)} textAlign="center">
          {props.message}
        </Text>
        <ModalButton
          // confirmProps={{
          //     disabled: true,
          // }}
          onCancel={props.onCancel}
          onConfirm={props.onConfirm}
        />
      </View>
    </Modal>
  );
});

export default ConfirmDialog;
