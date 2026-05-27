import { Button } from 'components';
import BaseModal, { BaseModalRef } from 'components/base/Modal';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'tamagui';
import { horizontalScale, verticalScale } from 'utils';

interface ItemButton {
  label: string;
  onPress: () => void;
}

interface OptionTestModalProps {
  title: string;
  items: ItemButton[];
}

const OptionTestModal = forwardRef<BaseModalRef, OptionTestModalProps>(({ title, items }, ref) => {
  const modalRef = useRef<BaseModalRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.open(),
    close: () => modalRef.current?.close(),
  }));

  const onPressItem = (item: ItemButton) => {
    item.onPress();
    modalRef.current?.close();
  };

  return (
    <BaseModal ref={modalRef} title={title}>
      <View width={'100%'}>
        {items.map((item, index) => (
          <Button key={index} style={styles.btn} onPress={() => onPressItem(item)}>
            <Button.Text>{item.label}</Button.Text>
          </Button>
        ))}
      </View>
    </BaseModal>
  );
});

const styles = StyleSheet.create({
  btn: {
    marginTop: verticalScale(30),
    paddingHorizontal: horizontalScale(20),
  },
});

export default OptionTestModal;
