import { t } from 'i18next';
import React from 'react';
import { StyleSheet } from 'react-native';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { scale } from 'utils';

const toastConfig = {
  success: ({ text1, text2, ...props }: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text1={text1}
      text2={text2}
    />
  ),

  error: ({ text1, text2, ...props }: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.errorText1}
      text2Style={styles.errorText2}
      text1={text1}
      text2={text2}
    />
  ),
};

export const showToast = (type: 'success' | 'error', title: string, message?: string) => {
  Toast.show({
    type,
    text1: t(title),
    text2: t(message || ''),
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
  });
};

export const ToastContainer = () => <Toast config={toastConfig} />;

// ✅ Styles
const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: 'green',
    backgroundColor: 'white',
    borderRadius: scale(10),
    shadowOpacity: 0.2,
  },
  errorToast: {
    borderLeftColor: 'red',
    backgroundColor: '#ffebee',
    borderRadius: scale(10),
  },
  contentContainer: {
    paddingHorizontal: scale(15),
    // paddingVertical: scale(10),
  },
  text1: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: 'black',
  },
  text2: {
    fontSize: scale(14),
    color: 'gray',
    flexWrap: 'wrap',
  },
  errorText1: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: 'red',
  },
  errorText2: {
    fontSize: scale(14),
    color: 'darkred',
    flexWrap: 'wrap',
  },
});
