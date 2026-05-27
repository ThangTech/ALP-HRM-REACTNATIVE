import { IcPlus } from 'assets/svgs';
import { OverTime } from 'common/model/over-time';
import { FlatList, Header, Pressable } from 'components';
import React from 'react';
import { ListRenderItemInfo } from 'react-native';
import { View } from 'tamagui';
import { scale } from 'utils';
import ItemOverTime from './components/ItemOverTime';
import OverTimeFilter from './components/OverTimeFilter';
import { OverTimesProvider, useOverTimesProvider } from './provider';
import { navigate } from 'navigators';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OverTimesPageProps = NativeStackScreenProps<AppStackParamList, RouteName.Overtimes>;

function OverTimesPage(props: OverTimesPageProps) {
  const params = props.route.params;
  return (
    <OverTimesProvider {...params}>
      <ViewPage />
    </OverTimesProvider>
  );
}

function ViewPage() {
  const provider = useOverTimesProvider();

  useFocusEffect(
    React.useCallback(() => {
      provider.setState((prev) => ({ ...prev, triggerRefresh: Date.now(), offset: 0 }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  function _renderItem(info: ListRenderItemInfo<OverTime>) {
    return <ItemOverTime item={info.item} viewType={provider.state.viewType} />;
  }

  return (
    <View f={1}>
      <Header
        title={'Danh sách phiếu đăng ký Tăng ca'}
        rightAction={
          <Pressable onPress={() => navigate(RouteName.OvertimeEditor)}>
            <IcPlus tintColor="white" size={scale(25)} />
          </Pressable>
        }
      />
      <View p={scale(16)} gap={scale(16)} f={1}>
        <OverTimeFilter />
        <View f={1}>
          <FlatList
            data={provider.state.items}
            keyExtractor={(item) => `${item.id}`}
            renderItem={_renderItem}
            refreshing={false}
            onRefresh={() =>
              provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() }))
            }
            onLoadMore={() =>
              provider.setState((prev) => ({ ...prev, offset: prev.items?.length ?? 0 }))
            }
          />
        </View>
      </View>
    </View>
  );
}

export default OverTimesPage;
