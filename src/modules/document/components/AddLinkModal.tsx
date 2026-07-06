import React, { useState } from 'react';
import { StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { View } from 'tamagui';
import { Text } from 'components';
import { scale, verticalScale, horizontalScale } from 'utils';
import { Input } from 'components';

interface AddLinkModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (name: string, url: string) => Promise<boolean>;
  isLoading?: boolean;
}

export const AddLinkModal = ({ isVisible, onClose, onSubmit, isLoading }: AddLinkModalProps) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSave = async () => {
    if (!name.trim() || !url.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Tên và Đường dẫn.');
      return;
    }

    // Basic URL validation
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(url.trim())) {
      Alert.alert(
        'Lỗi',
        'Đường dẫn không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://',
      );
      return;
    }

    const success = await onSubmit(name.trim(), url.trim());

    if (success) {
      // Reset state after success
      setName('');
      setUrl('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setUrl('');
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.modal}
      backdropOpacity={0.4}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      avoidKeyboard
    >
      <View bg="$white" br={scale(16)} width="100%" overflow="hidden">
        <View p={scale(20)}>
          <Text fontSize={scale(18)} fontW="600" color="$black" ta="center" mb={verticalScale(20)}>
            Liên kết
          </Text>

          <View mb={verticalScale(16)}>
            <Input
              placeholder="Tên liên kết"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>

          <View>
            <Input
              placeholder="example.com"
              value={url}
              onChangeText={setUrl}
              editable={!isLoading}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        </View>
        <View h={1} bg="#f0f0f0" w="100%" />
        <View fd="row" h={verticalScale(52)} ai="center">
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
            onPress={handleClose}
            disabled={isLoading}
          >
            <Text fontSize={scale(16)} fontW="500" color="$black">
              Huỷ
            </Text>
          </TouchableOpacity>

          <View w={1} h="100%" bg="#f0f0f0" />

          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#d32f2f" />
            ) : (
              <Text fontSize={scale(16)} fontW="600" color="$d_red">
                Xác nhận
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: horizontalScale(20),
  },
  btn: {
    minWidth: scale(80),
  },
});
