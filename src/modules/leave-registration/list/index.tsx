/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IcPlus } from 'assets/svgs';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { LeaveRegistration } from 'common/model/leave-registration';
import { FlatList, Header, OptionItem } from 'components';
import EmptyBox from 'components/EmptyBox';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, ListRenderItemInfo, Pressable } from 'react-native';
import { View } from 'tamagui';
import { scale } from 'utils';
import FilterComponent from './components/FilterComponent';
import ItemRegistration from './components/ItemRegistration';
import LeaveOverview from './components/LeaveOverview';
import { LeaveRegistrationsProvider, useLeaveRegistrationsProvider } from './provider';
import { MAP_STATUS, WAITING_ME } from 'configs/contansts';

type LeaveRegistrationsProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.LeaveRegistrations
>;

function LeaveRegistrationsPage(props: LeaveRegistrationsProps) {
  return (
    <LeaveRegistrationsProvider>
      <BottomSheetModalProvider>
        <ViewPage {...props} />
      </BottomSheetModalProvider>
    </LeaveRegistrationsProvider>
  );
}

function ViewPage(props: LeaveRegistrationsProps) {
  const provider = useLeaveRegistrationsProvider();

  useEffect(() => {
    const currentViewType = props.route.params?.viewType;
    provider.setState((prev) => ({
      ...prev,
      status:
        currentViewType === LeaveRegistrationViewType.APPROVE
          ? ({ key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME) } as OptionItem)
          : prev.status,
      viewType: currentViewType,
    }));
  }, [props.route.params?.viewType]);

  useFocusEffect(
    useCallback(
      () => provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() })),
      [],
    ),
  );

  const items = useMemo(() => {
    return [
      { id: -999 },
      ...(provider.state.items?.length ? provider.state.items : [{ id: -998 }]),
    ];
  }, [provider.state.items]);

  function renderItem(info: ListRenderItemInfo<LeaveRegistration>) {
    if (info.index === 0) {
      if (props.route.params?.viewType === LeaveRegistrationViewType.APPROVE) {
        return null;
      }
      return <LeaveOverview holidays={provider.holidays} />;
    }
    if (info.item.id === -998) {
      if (provider.isLoading) {
        return <ActivityIndicator />;
      }
      return <EmptyBox />;
    }
    return (
      <ItemRegistration
        key={info.item.id}
        viewType={props.route.params?.viewType}
        item={info.item}
      />
    );
  }

  return (
    <View f={1}>
      <Header
        title="Đăng kí nghỉ"
        rightAction={
          <Pressable onPress={() => navigate(RouteName.LeaveRegistrationEditor)}>
            <IcPlus tintColor="white" size={scale(25)} />
          </Pressable>
        }
      />
      <View p={scale(16)} f={1}>
        <FilterComponent viewType={provider.state.viewType} />
        <View pt={scale(16)} f={1}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
            refreshing={false}
            onLoadMore={() =>
              provider.setState((prev) => ({ ...prev, offset: prev.items?.length ?? 0 }))
            }
            onRefresh={() =>
              provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() }))
            }
          />
        </View>
      </View>
    </View>
  );
}

export default LeaveRegistrationsPage;
