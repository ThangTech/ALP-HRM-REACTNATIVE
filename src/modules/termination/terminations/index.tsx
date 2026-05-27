/* eslint-disable react-hooks/exhaustive-deps */
import { Termination } from 'common/model/termination';
import { FlatList, Header } from 'components';
import React, { useCallback, useEffect } from 'react';
import { ListRenderItemInfo, Pressable } from 'react-native';
import { View } from 'tamagui';
import { scale } from 'utils';
import FilterTerminations from './components/FilterTerminations';
import ItemTermination from './components/ItemTermination';
import { TerminationsProvider, useTerminationsProvider } from './provider';
import { useFocusEffect } from '@react-navigation/native';
import { IcPlus } from 'assets/svgs';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { MAP_STATUS, WAITING_ME } from 'configs/contansts';

type TerminationsPageProps = NativeStackScreenProps<AppStackParamList, RouteName.Terminations>;

function TerminationsPage(props: TerminationsPageProps) {
  return (
    <TerminationsProvider>
      <ViewPage {...props} />
    </TerminationsProvider>
  );
}

function ViewPage(props: TerminationsPageProps) {
  const provider = useTerminationsProvider();
  const viewType = props.route.params?.viewType ?? LeaveRegistrationViewType.ME;

  useEffect(() => {
    provider.setState((prev) => ({
      ...prev,
      status:
        viewType === LeaveRegistrationViewType.APPROVE
          ? { key: WAITING_ME, value: MAP_STATUS.get(WAITING_ME)! }
          : prev.status,
      viewType,
      offset: 0,
    }));
  }, [viewType]);

  useFocusEffect(
    useCallback(
      () => provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() })),
      [],
    ),
  );

  function renderItem(info: ListRenderItemInfo<Termination>) {
    return <ItemTermination item={info.item} viewType={viewType} />;
  }

  return (
    <View f={1}>
      <Header
        title={'Quản lý nghỉ việc'}
        rightAction={
          <Pressable onPress={() => navigate(RouteName.TerminationEditor)}>
            <IcPlus tintColor="white" size={scale(25)} />
          </Pressable>
        }
      />
      <FilterTerminations viewType={viewType} />
      <View p={scale(16)} f={1}>
        <FlatList
          data={provider.state.terminations}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          refreshing={false}
          onRefresh={() =>
            provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() }))
          }
          onLoadMore={() =>
            provider.setState((prev) => ({ ...prev, offset: prev.terminations?.length ?? 0 }))
          }
        />
      </View>
    </View>
  );
}

export default TerminationsPage;
