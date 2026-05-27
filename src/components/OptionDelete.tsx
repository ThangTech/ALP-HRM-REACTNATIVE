import React from 'react';
import { Alert } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { scale } from 'utils';

interface OptionDeleteType {
  onDelete?: () => void;
}

const OptionDelete = (props: OptionDeleteType) => {
  const handleDelete = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa phiếu này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xác nhận',
        onPress: () => props.onDelete?.(),
      },
    ]);
  };
  return (
    <>
      <MenuOption
        onSelect={handleDelete}
        text="Xoá"
        customStyles={{
          optionText: {
            paddingHorizontal: scale(16),
            paddingVertical: scale(8),
          },
        }}
      />
    </>
  );
};

export default OptionDelete;
