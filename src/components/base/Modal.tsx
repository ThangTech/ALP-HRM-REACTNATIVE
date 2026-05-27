import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'utils';
import Text from './Text';

export interface BaseModalRef {
  open: () => void;
  close: () => void;
}

interface BaseModalProps {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  styleView?: StyleProp<ViewStyle>;
  fullScreen?: boolean;
  disableBackDropPress?: boolean;
}

const BaseModal = forwardRef<BaseModalRef, BaseModalProps>(
  ({ title, children, style, disableBackDropPress, styleView }, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }));

    return (
      <Modal
        isVisible={visible}
        useNativeDriver
        onBackdropPress={disableBackDropPress ? undefined : () => setVisible(false)}
        style={style}
      >
        <View style={[styles.overlay, styleView]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.modalContainer, style]}
          >
            {title && <Text fontSize={scale(18)} fontW="bold" tx={title} textAlign="center" />}
            {children}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    paddingTop: verticalScale(10),
    paddingHorizontal: scale(20),
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    pointerEvents: 'box-none',
  },
});

export default BaseModal;
