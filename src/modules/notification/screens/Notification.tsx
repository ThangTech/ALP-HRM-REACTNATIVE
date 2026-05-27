import { useFocusEffect } from '@react-navigation/native';
import { NotificationModel } from 'common/model/notification-model';
import { FlatList, Header } from 'components';
import NotificationItem from 'notification/components/NotificationItem';
import { useNotifications } from 'notification/hooks/useNotifications';
import React from 'react';
import { ListRenderItemInfo } from 'react-native/types';
import { View } from 'tamagui';
import { scale } from 'utils';

const Notification = () => {
  const provider = useNotifications();

  useFocusEffect(
    React.useCallback(() => {
      provider.refresh();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  function _renderItem(info: ListRenderItemInfo<NotificationModel>) {
    return <NotificationItem item={info.item} />;
  }

  return (
    <View f={1}>
      <Header title={'THÔNG BÁO'} />
      <View f={1} p={scale(16)}>
        <FlatList
          data={provider.notifications?.data?.records ?? []}
          renderItem={_renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          onRefresh={() => provider.refresh()}
          refreshing={provider.isLoading}
        />
      </View>
    </View>
  );
};

export default Notification;
