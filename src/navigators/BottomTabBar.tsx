import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  BottomTabBarProps as RNBottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { TabRouterOptions } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

import { IconProps } from 'assets/svgs';
import { Pressable, Text, SmartBackdrop } from 'components/base';
import { PressableProps } from 'components/base/Pressable';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { useSafeArea } from 'hooks';
import { View, getTokens } from 'tamagui';
import { scale, verticalScale } from 'utils';
import { navigate } from './navigationUtilities';
import { useProfile } from 'hooks/useProfile';

type TabStackItem<T extends RouteName> = Pick<TabItemProps, 'title'> & {
  icon: React.ComponentType<IconProps>;
  routeName: T;
  iconProps?: IconProps;
  component?: React.ComponentType<any>;
  initParams?: AppStackParamList[T];
  isPopup?: boolean;
};

export type BottomTabBarProps = {
  initialRouteName?: string;
  tintColorActive?: string;
} & Omit<TabBarProps, keyof RNBottomTabBarProps> &
  TabRouterOptions;

const BottomTabBar = ({ initialRouteName, tabs, backBehavior, ...rest }: BottomTabBarProps) => {
  const renderTabBar = (props: RNBottomTabBarProps) => <TabBar tabs={tabs} {...props} {...rest} />;
  const Tab = createBottomTabNavigator();
  useProfile();

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      tabBar={renderTabBar}
      backBehavior={backBehavior}
      screenOptions={{
        headerShown: false,
        // tabBarPosition: 'left',
      }}
    >
      {tabs
        .filter((t) => t.component)
        .map((t) => (
          <Tab.Screen
            key={t.routeName}
            name={t.routeName}
            component={t.component!}
            initialParams={t.initParams}
            options={{ tabBarStyle: { display: 'none' } }}
          />
        ))}
    </Tab.Navigator>
  );
};

interface TabBarProps extends RNBottomTabBarProps {
  tabs: TabStackItem<RouteName>[];
  iconSize?: number;
  noActiveIndicatior?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

function TabBar({ state, navigation, tabs, noActiveIndicatior }: TabBarProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { bottom } = useSafeArea();
  const snapPoints = useMemo(() => ['25%'], []);

  const handleSheetOpen = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <SmartBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleOptionPress = useCallback(
    (action: 'leave' | 'overtime') => {
      handleSheetClose();
      if (action === 'leave') {
        navigate(RouteName.LeaveRegistrationEditor, { date: new Date().toString() });
      } else if (action === 'overtime') {
        navigate(RouteName.OvertimeEditor);
      }
    },
    [handleSheetClose],
  );

  const renderTab = (tab: TabBarProps['tabs'][number], index: number) => {
    const { routeName, icon: Icon, title, iconProps, initParams, isPopup } = tabs[index]!;
    const route = state.routes.find((r) => r.name === routeName);
    const isActive = state.routes[state.index]?.name === routeName;

    const onPress = () => {
      if (isPopup) {
        handleSheetOpen();
        return;
      }

      if (!route) {
        return navigation
          .getParent()
          ?.navigate({ name: routeName as any, merge: true, params: initParams });
      }

      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isActive && !event.defaultPrevented) {
        navigation.navigate({ name: route.name, merge: true, params: undefined });
      }
    };

    const onLongPress = () => {
      if (!route) {
        return;
      }

      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <TabItem
        onPress={onPress}
        onLongPress={onLongPress}
        title={title}
        icon={
          <Icon
            size={isPopup ? 50 : 30}
            style={[isPopup && { marginTop: scale(-10) }, $iconView]}
            tintColor={isActive ? getTokens().color.blue700.val : getTokens().color.grey.val}
            {...iconProps}
          />
        }
        key={routeName}
        isActive={isActive}
        noActiveIndicatior={noActiveIndicatior}
      />
    );
  };

  return (
    <>
      <View fd={'row'} bg={'$white'} bc={'$border'} btw={1} pb={bottom - scale(15)}>
        <View f={1} fd={'row'} pv={verticalScale(10)}>
          {tabs.map(renderTab)}
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: getTokens().color.white.val }}
      >
        <BottomSheetView style={$bottomSheetContent}>
          <Text fontSize={scale(18)} fontW="600" mb={verticalScale(20)}>
            Tạo đơn
          </Text>

          <TouchableOpacity
            style={$optionItem}
            onPress={() => handleOptionPress('leave')}
            activeOpacity={0.7}
          >
            <Text fontSize={scale(16)} fontW="400">
              Đăng ký nghỉ phép
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={$optionItem}
            onPress={() => handleOptionPress('overtime')}
            activeOpacity={0.7}
          >
            <Text fontSize={scale(16)} fontW="400">
              Đăng ký OT
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

interface TabItemProps extends PressableProps {
  icon: React.ReactElement;
  title: TxKeyPath;
  isActive?: boolean;
  noActiveIndicatior?: boolean;
}

const TabItem = ({ icon, title, isActive, ...rest }: TabItemProps) => (
  <Pressable style={$tabItem} {...rest}>
    {icon}
    <Text
      pt={verticalScale(5)}
      tx={title}
      c={isActive ? getTokens().color.blue700.val : getTokens().color.grey.val}
      fontSize={scale(12)}
      fontW={'400'}
    />
  </Pressable>
);

const $tabItem: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: scale(10),
};

const $iconView: ViewStyle = {
  // marginTop: moderateScale(7),
};

const $bottomSheetContent: ViewStyle = {
  paddingHorizontal: scale(20),
  paddingTop: verticalScale(10),
  paddingBottom: verticalScale(20),
};

const $optionItem: ViewStyle = {
  paddingVertical: verticalScale(15),
  paddingHorizontal: scale(15),
  borderRadius: 8,
  backgroundColor: '#f5f5f5',
  marginBottom: verticalScale(10),
};

export default BottomTabBar;
