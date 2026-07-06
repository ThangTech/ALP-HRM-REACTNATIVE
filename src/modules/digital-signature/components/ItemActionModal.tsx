import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';
import Modal from 'react-native-modal';
import { scale } from 'utils';
import { SignRequest } from '../types/sign-request';

const ACTION_OPTIONS = [
  { id: 'attachments', label: 'Xem tài liệu đính kèm' },
  { id: 'preview', label: 'Xem trước' },
];

export interface ItemActionModalProps {
  item: SignRequest | null;
  onClose: () => void;
  onViewAttachments: () => void;
  onPreview: () => void;
}

export const ItemActionModal = ({
  item,
  onClose,
  onViewAttachments,
  onPreview,
}: ItemActionModalProps) => (
  <Modal
    isVisible={!!item}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    animationIn="fadeIn"
    animationOut="fadeOut"
    backdropOpacity={0.4}
    style={styles.actionModal}
  >
    <View bg="$white" br={scale(16)} p={scale(10)} w="80%">
      {ACTION_OPTIONS.map((opt, index) => (
        <TouchableOpacity
          key={opt.id}
          style={[styles.optionBtn, index !== ACTION_OPTIONS.length - 1 && styles.borderBottom]}
          onPress={() => {
            onClose();
            setTimeout(() => {
              if (opt.id === 'attachments') onViewAttachments();
              else onPreview();
            }, 300);
          }}
        >
          <Text fontSize={scale(16)} fontW="500" color="$black">
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  actionModal: {
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
