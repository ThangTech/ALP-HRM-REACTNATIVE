import { Input, Modal } from 'components';
import InputErrorMessage from 'components/base/InputErrorMessage';
import { BaseModalRef } from 'components/base/Modal';
import ModalButton from 'components/base/ModalButton';
import React, { forwardRef } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';

interface CancelDialogType {
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: (text: string) => void;
}
const CancelDialog = forwardRef<BaseModalRef, CancelDialogType>((props, ref) => {
  const [text, setText] = React.useState('');
  const [error, setError] = React.useState<string | undefined>(undefined);
  return (
    <Modal ref={ref} disableBackDropPress title={props.title}>
      <View>
        <View pv={scale(16)} gap={2}>
          <Input
            multiline
            borderWidth={1}
            borderColor="$border"
            elevation={0}
            placeholder="Nhập lý do từ chối..."
            errorMessage={error}
            onChangeValue={(value) => {
              setText(value);
              if (value.trim()) {
                setError(undefined);
              }
            }}
          />
          {error?.length && <InputErrorMessage message={'Vui lòng nhập lý do từ chối'} />}
        </View>
        <ModalButton
          // confirmProps={{
          //     disabled: true,
          // }}
          onCancel={() => {
            console.log('props.onCancel', props.onCancel);

            props.onCancel?.();
          }}
          onConfirm={() => {
            if (!text.trim()) {
              setError('Vui lòng nhập lý do từ chối');
              return;
            }
            props.onConfirm?.(text);
          }}
        />
      </View>
    </Modal>
  );
});

export default CancelDialog;
