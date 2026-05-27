import React from 'react';
import { StyleSheet } from 'react-native';
import Text from './Text';

interface InputErrorMessageType {
  message?: string;
}

const InputErrorMessage = (props: InputErrorMessageType) => {
  if (!props.message?.length) {
    return null;
  }
  return <Text style={styles.errorText}>{props.message}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default InputErrorMessage;
