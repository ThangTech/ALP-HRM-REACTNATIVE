import { StackProps } from '@tamagui/core';
import { ParseKeys, t } from 'i18next';
import React, { ReactElement, useState, useCallback, useMemo, forwardRef } from 'react';
import { View, Text, Input as InputBase, InputProps } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import Pressable from './Pressable';
import { IcHidePassword, IcShowPassword } from 'assets/svgs';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface InputBaseProps extends InputProps {
  Icon?: ReactElement; // Deprecated: use leftIcon instead
  leftIcon?: ReactElement;
  iconRight?: ReactElement;
  placeholder?: TxKeyPath;
  label?: TxKeyPath;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  onChangeValue?: (text: string) => void; // For React Hook Form compatibility
  containerStyle?: StackProps;
  isPassword?: boolean;
  errorMessage?: string;
  onIconRightPress?: () => void;
  onPress?: () => void;
  showLabel?: boolean;
  state?: 'error' | 'success' | 'default'; // For form validation state
  /** convert formatted text to value */
  parse?: (text: string) => string;
  /** change the display of value */
  format?: (text: string) => string;
  pattern?: RegExp;
  rightAddon?: 'clear' | React.ReactElement;
  isRequired?: boolean;
  editable?: boolean;
  borderWidth?: number;
  borderColor?: string;
  elevation?: number;
  floatingLabel?: boolean;
  activeBorderColor?: string;
}

const Input = React.memo(
  forwardRef<InputBase, InputBaseProps>(
    (
      {
        Icon,
        leftIcon,
        containerStyle,
        placeholder,
        label,
        iconRight,
        isPassword,
        errorMessage,
        onIconRightPress,
        onPress,
        showLabel = true,
        onChangeText,
        onChangeValue,
        state,
        value,
        defaultValue,
        format,
        parse,
        pattern,
        rightAddon,
        isRequired = false,
        editable = true,
        borderWidth,
        borderColor,
        elevation,
        floatingLabel,
        activeBorderColor = '$blue',
        ...restProps
      },
      ref,
    ) => {
      const [secureText, setSecureText] = useState(isPassword);
      const [isFocused, setIsFocused] = useState(false);
      const { onFocus, onBlur, ...otherProps } = restProps;

      const toggleSecureText = useCallback(() => setSecureText((prev) => !prev), []);

      // Logic từ code gốc - format/parse text
      const initValue = value || defaultValue;
      const [text, setText] = useState(
        format && initValue !== undefined ? format(initValue) : initValue,
      );
      // Update text when value or defaultValue changes
      React.useEffect(() => {
        const v = value || defaultValue;
        setText(v);
      }, [value, defaultValue]);

      const onChange = useCallback(
        (v?: string) => {
          setText(v);
          const parsedValue = parse && v ? parse(v) : v;
          if (parsedValue && parsedValue === value) {
            return;
          }

          onChangeText?.(parsedValue || '');
          onChangeValue?.(parsedValue || '');
        },
        [parse, value, onChangeText, onChangeValue],
      );

      const handleKeyPress = useCallback(
        (e: any) => {
          const key = e.nativeEvent.key;
          // TODO: this currently not works yet, related: https://github.com/facebook/react-native/issues/23578
          if (pattern && key !== 'Backspace' && key !== 'Enter' && !key.match(pattern)) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        [pattern],
      );

      const clearText = useCallback(() => {
        onChange(undefined);
      }, [onChange]);

      // Handle text change - prioritize onChangeValue for React Hook Form
      const handleTextChange = useCallback(
        (inputText: string) => {
          if (onChangeValue) {
            onChangeValue(inputText);
          } else if (onChangeText) {
            onChangeText(inputText);
          }
        },
        [onChangeValue, onChangeText],
      );

      const handleFocus = useCallback(
        (e: any) => {
          setIsFocused(true);
          onFocus?.(e);
        },
        [onFocus],
      );

      const handleBlur = useCallback(
        (e: any) => {
          setIsFocused(false);
          onBlur?.(e);
        },
        [onBlur],
      );

      // Use leftIcon if provided, otherwise fallback to Icon for backward compatibility
      const LeftIcon = leftIcon || Icon;

      const RightIcon = useMemo(() => {
        if (isPassword) {
          return (
            <Pressable onPress={toggleSecureText}>
              {secureText ? <IcShowPassword size={24} /> : <IcHidePassword size={24} />}
            </Pressable>
          );
        }

        // Hỗ trợ rightAddon = 'clear'
        if (rightAddon === 'clear' && editable && text) {
          return (
            <Pressable hitSlop={10} onPress={clearText}>
              {/* Có thể thay bằng icon X từ assets nếu có */}
              <Text color="$textMuted" fontSize={scale(16)}>
                ×
              </Text>
            </Pressable>
          );
        }

        return iconRight ? <Pressable onPress={onIconRightPress}>{iconRight}</Pressable> : null;
      }, [
        iconRight,
        isPassword,
        secureText,
        toggleSecureText,
        onIconRightPress,
        rightAddon,
        editable,
        text,
        clearText,
      ]);

      // Determine error state
      const hasError = errorMessage || state === 'error';
      const isFloating = isFocused || !!text;

      return (
        <View {...containerStyle}>
          {showLabel && label && !floatingLabel && (
            <Text color="$black" fontSize={scale(16)} fontWeight="500" mb={verticalScale(12)}>
              {t(label as ParseKeys)}
              {isRequired && <Text color="$m_red">*</Text>}
            </Text>
          )}
          <TouchableOpacity style={{}} activeOpacity={onPress ? 0.7 : 1} onPress={onPress}>
            <View
              flexDirection="row"
              alignItems={otherProps.multiline ? 'flex-start' : 'center'}
              borderRadius={scale(25)}
              bg={!editable ? '#D9D9D9' : '$white'}
              ph={horizontalScale(16)}
              pv={otherProps.multiline ? verticalScale(10) : undefined}
              shadowColor={'$shadowColor'}
              shadowOffset={{ width: 0, height: 2 }}
              shadowRadius={4}
              shadowOpacity={0.1}
              elevationAndroid={elevation ?? 3}
              borderWidth={hasError || floatingLabel || borderWidth ? 1 : 0}
              borderColor={
                hasError
                  ? '$m_red'
                  : floatingLabel
                    ? isFloating
                      ? activeBorderColor
                      : '#E5E5E5'
                    : borderColor || 'transparent'
              }
              // height={otherProps.multiline ? verticalScale(90) : verticalScale(45)}
              minHeight={verticalScale(45)}
            >
              {LeftIcon && <View mr={horizontalScale(12)}>{LeftIcon}</View>}

              {onPress ? (
                <View flex={1} jc="center" minHeight={verticalScale(45)}>
                  <Text
                    fontSize={scale(16)}
                    color={value ? '$black' : '$textMuted'}
                    numberOfLines={otherProps.multiline ? undefined : 1}
                  >
                    {value || placeholder}
                  </Text>
                </View>
              ) : (
                <InputBase
                  ref={ref}
                  flex={1}
                  fontSize={scale(16)}
                  minHeight={verticalScale(45)}
                  pv={0}
                  borderWidth={0}
                  backgroundColor={'transparent'}
                  disableFullscreenUI
                  secureTextEntry={secureText}
                  placeholder={placeholder ? t(placeholder as ParseKeys) : undefined}
                  value={format || parse ? text : value}
                  onChangeText={format || parse ? onChange : handleTextChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  editable={editable && !onPress}
                  pointerEvents={onPress ? 'none' : 'auto'}
                  height={'auto'}
                  {...otherProps}
                />
              )}

              {RightIcon && <View ml={horizontalScale(8)}>{RightIcon}</View>}
            </View>

            {floatingLabel && label && isFloating && (
              <View
                position="absolute"
                top={-scale(8)}
                left={scale(16)}
                bg="$white"
                paddingHorizontal={scale(4)}
              >
                <Text color={hasError ? '$m_red' : activeBorderColor} fontSize={scale(12)}>
                  {t(label as ParseKeys)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    },
  ),
);

Input.displayName = 'Input';

export default Input;
