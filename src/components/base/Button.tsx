import {
  styled,
  createStyledContext,
  SizeTokens,
  Text,
  withStaticProperties,
  getTokens,
} from '@tamagui/core';
import { t } from 'i18next';
import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { horizontalScale, scale, verticalScale } from 'utils';
import Pressable from './Pressable';
import { globalStyle } from 'common/styles/base';

const ButtonContext = createStyledContext({
  size: '$md' as SizeTokens,
  variant: 'primary' as 'primary' | 'secondary',
});

const LoadingIndicator = ({ color }: { color: string }) => (
  <ActivityIndicator size="small" color={color} />
);

const ButtonFrame = ({
  children,
  style,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'detractive';
}) => {
  return (
    <Pressable
      style={[
        styles.btnFrame,
        variant === 'secondary' && styles.secondary,
        variant === 'primary' && styles.primary,
        variant === 'detractive' && globalStyle.btnDetractive,
        style,
        disabled && styles.disabled,
      ]}
      onPress={loading || disabled ? undefined : onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <LoadingIndicator
          color={variant === 'secondary' ? getTokens().color.blue.val : getTokens().color.white.val}
        />
      ) : (
        children
      )}
    </Pressable>
  );
};

const ButtonText = styled(Text, {
  name: 'ButtonText',
  context: ButtonContext,
  userSelect: 'none',
  color: '$white',
  variants: {
    size: {
      '...fontSize': (name, { font }) => ({
        fontSize: font?.size?.[name] ?? scale(18),
      }),
    },
    variant: {
      primary: {
        color: '$white',
      },
      secondary: {
        color: getTokens().color.blue.val,
      },
      detractive: {
        color: getTokens().color.detractive.val,
      },
    },
  } as const,
});

const TranslatedButtonText = ({
  children,
  variant,
  fontSize = 18,
  fontWeight = '500',
}: {
  children: string;
  variant?: 'primary' | 'secondary' | 'detractive';
  fontSize?: number;
  fontWeight?: '500' | '600' | '700';
}) => {
  return (
    <ButtonText variant={variant} style={{ fontSize: scale(fontSize), fontWeight }}>
      {t(children)}
    </ButtonText>
  );
};

const ButtonIcon = (props: { children: any }) => {
  return React.cloneElement(props.children, {
    width: scale(15),
    height: scale(15),
  });
};

const Button = withStaticProperties(ButtonFrame, {
  Text: TranslatedButtonText,
  Icon: ButtonIcon,
  Props: ButtonContext.Provider,
});

const styles = StyleSheet.create({
  btnFrame: {
    minWidth: scale(100),
    minHeight: verticalScale(45),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    borderRadius: scale(20),
    paddingHorizontal: horizontalScale(5),
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: getTokens().color.blue.val,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: getTokens().color.blue.val,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
