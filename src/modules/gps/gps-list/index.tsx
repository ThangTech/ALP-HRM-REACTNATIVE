import React, { useCallback } from 'react';
import { View } from 'tamagui';
import { GpsListProvider, useGpsListProvider } from './provider';
import { FlatList, Header } from 'components';
import { ListRenderItemInfo, Pressable } from 'react-native';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import { IcPlus } from 'assets/svgs';
import { useFocusEffect } from '@react-navigation/native';
import { GpsModel } from 'common/model/gps-model';
import ItemGpsTracking from './components/ItemGpsTracking';
import { scale } from 'utils';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';

function GpsListPage() {
  return (
    <GpsListProvider>
      <ViewPage />
    </GpsListProvider>
  );
}

function ViewPage() {
  const provider = useGpsListProvider();

  useFocusEffect(
    useCallback(() => {
      provider.setState((prev) => ({ ...prev, offset: 0, triggerFetch: Date.now() }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  function _renderItem(info: ListRenderItemInfo<GpsModel>) {
    return <ItemGpsTracking item={info.item} />;
  }

  return (
    <View f={1}>
      <Header
        title={'Lịch sử'}
        rightAction={
          <Pressable onPress={() => navigate(RouteName.GpsTracking)}>
            <IcPlus tintColor="white" size={24} />
          </Pressable>
        }
      />
      <View f={1} p={scale(16)}>
        <View fd={'row'} gap={scale(12)}>
          <DatePicker
            value={provider.state.from}
            onChange={(date) =>
              provider.setState((prev) => ({
                ...prev,
                from: date,
                offset: 0,
                triggerRefresh: Date.now(),
              }))
            }
            placeholder="Từ ngày"
            valueFormat="DD/MM/YYYY"
            label="Từ ngày"
          />
          <DatePicker
            value={provider.state.to}
            onChange={(date) =>
              provider.setState((prev) => ({
                ...prev,
                to: date,
                offset: 0,
                triggerRefresh: Date.now(),
              }))
            }
            placeholder="Đến ngày"
            valueFormat="DD/MM/YYYY"
            label="Đến ngày"
          />
        </View>
        <View f={1} mt={scale(16)}>
          <FlatList
            data={provider.state.items}
            keyExtractor={(item) => `${item.id}`}
            renderItem={_renderItem}
            refreshing={provider.state.offset === 0 && provider.isLoadingGpsList}
            onRefresh={() =>
              provider.setState((prev) => ({ ...prev, offset: 0, triggerFetch: Date.now() }))
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

export default GpsListPage;
