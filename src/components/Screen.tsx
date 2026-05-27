import { ViewStyle } from '@tamagui/core';
import React from 'react';
import { KeyboardAvoidingView, Platform, Keyboard, StyleSheet, Pressable } from 'react-native';
import { YStack, ScrollView, styled } from 'tamagui';

interface BaseScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useGradient?: boolean;
  scrollEnabled?: boolean;
  keyboardVerticalOffset?: number;
}

const StyledContainer = styled(YStack, {
  flex: 1,
});

const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  style,
  scrollEnabled = true,
  keyboardVerticalOffset = 0,
}) => {
  const renderBody = <StyledContainer style={style as any}>{children}</StyledContainer>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={styles.containerScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={Keyboard.dismiss} style={styles.btn}>
            {renderBody}
          </Pressable>
        </ScrollView>
      ) : (
        <Pressable onPress={Keyboard.dismiss} style={styles.containerScroll}>
          {renderBody}
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  containerScroll: {
    flexGrow: 1,
  },
  btn: {
    flex: 1,
  },
});

export default BaseScreen;
