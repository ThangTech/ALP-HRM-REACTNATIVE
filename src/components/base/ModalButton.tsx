import React from 'react';
import { View } from 'tamagui';
import Text from './Text';
import { scale } from 'utils';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ModalButtonType {
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmProps?: Omit<TouchableOpacityProps, 'onPress' | 'style'>;
}

const ModalButton = (props: ModalButtonType) => {
  return (
    <View fd={'row'} borderTopWidth={1} borderTopColor={'$divider'} alignItems="center">
      <View f={1}>
        <TouchableOpacity onPress={props.onCancel} style={styles.modalButton}>
          <Text fontW={500} textAlign="center">
            Huỷ
          </Text>
        </TouchableOpacity>
      </View>
      <View w={1} h={scale(48)} bg={'$divider'} />
      <View f={1}>
        <TouchableOpacity
          onPress={props.onConfirm}
          style={styles.modalButton}
          {...props.confirmProps}
        >
          <Text color={'$blue'} fontW={500} textAlign="center">
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalButton: {
    height: scale(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalButton;
