import { goBack } from 'navigators';
import React, { ReactElement } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { TextStyle, View, ViewStyle } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import { Pressable, Text } from './base';
import IcBack from 'assets/svgs/IcBack';
import { useSafeArea } from 'hooks';

export type HeaderProps = {
  title?: TxKeyPath;
  isShowSafeAreaInset?: boolean;
  rightAction?: false | ReactElement;
  centerAction?: ReactElement;
  leftAction?: ReactElement;
  titleStyle?: TextStyle;
  backBtn?: boolean;
  style?: ViewStyle;
  isHome?: boolean;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};

const Header = ({ title, onPressLeft, rightAction }: HeaderProps) => {
  const { top } = useSafeArea();
  const renderLeft = () => {
    return (
      <Pressable style={styles.flex} onPress={onPressLeft || (() => goBack())}>
        <IcBack size={scale(15)} />
      </Pressable>
    );
  };

  const renderRight = () => {
    return <View style={styles.flex}>{rightAction && <View>{rightAction}</View>}</View>;
  };

  const renderHeaderDetail = () => {
    return (
      <View pv={verticalScale(20)} pt={top} fd={'row'} ai={'center'} jc={'space-between'}>
        {renderLeft()}
        <View f={10}>
          <Text fontSize={scale(22)} fontW={'600'} as={'center'} tx={title} color={'$white'} />
        </View>
        {renderRight()}
      </View>
    );
  };

  return (
    <View bg={'$d_red'}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View gap={scale(20)} ph={horizontalScale(20)} pt={verticalScale(20)}>
        {renderHeaderDetail()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginLeft: scale(15),
  },
  flex: {
    flex: 1,
  },
});

export default Header;
