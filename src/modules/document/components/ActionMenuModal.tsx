import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';
import { scale } from 'utils';

interface ActionMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onActionSelect: (action: string) => void;
}

const ACTION_OPTIONS = [
  { id: 'download', label: 'Tải xuống' },
  { id: 'delete', label: 'Xoá' },
  { id: 'select_multiple', label: 'Chọn nhiều' },
];

export const ActionMenuModal = ({ isVisible, onClose, onActionSelect }: ActionMenuModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.4}
      style={styles.modal}
    >
      <View bg="$white" br={scale(16)} p={scale(10)} w="80%">
        {ACTION_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionBtn, index !== ACTION_OPTIONS.length - 1 && styles.borderBottom]}
            onPress={() => {
              onClose();
              setTimeout(() => {
                onActionSelect(option.id);
              }, 300); // Đợi modal tắt hẳn rồi mới thực thi để tránh xung đột modal khác
            }}
          >
            <Text
              fontSize={scale(16)}
              color={option.id === 'delete' ? '$d_red' : '$black'}
              fontW="500"
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionBtn: {
    paddingVertical: scale(16),
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: getTokens().color.border.val,
  },
});
