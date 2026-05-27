import React from 'react';
import ModalButton from 'components/base/ModalButton';
import { Controller, useForm } from 'react-hook-form';
import { Input } from 'components';
import { scale } from 'utils';
import { View } from 'tamagui';

interface CancelDialogContentType {
  placeholder?: string;
  onCancel?: () => void;
  onConfirm?: (text: string) => void;
}

interface CancelForm {
  text: string;
}

const CancelDialogContent = (props: CancelDialogContentType) => {
  const form = useForm<CancelForm>();

  return (
    <>
      <View pv={scale(16)}>
        <Controller
          name="text"
          control={form.control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <Input placeholder={props.placeholder} onChangeText={field.onChange} />
          )}
        />
      </View>
      <ModalButton
        confirmProps={{
          disabled: form.formState.isValid,
        }}
        onCancel={props.onCancel}
        onConfirm={() => props.onConfirm?.(form.getValues('text'))}
      />
    </>
  );
};

export default CancelDialogContent;
