import { Images } from 'assets';
import React, { ForwardedRef, forwardRef, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList as FlatListBase,
  FlatListProps,
  RefreshControl,
  ViewStyle,
  Image,
  StyleSheet,
} from 'react-native';
import { View } from 'tamagui';

import { horizontalScale, scale, verticalScale } from 'utils';
import Text from './Text';

export interface UIFlatListProps<T = any> extends FlatListProps<T> {
  loading?: boolean;
  loadingMore?: boolean;
  disableRefresh?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  refreshControlTheme?: 'dark' | 'light';
}

const FlatList = (props: UIFlatListProps, ref: ForwardedRef<FlatListBase>) => {
  const { refreshing, onRefresh, onLoadMore, loadingMore, loading } = props;
  const listRef = useRef<FlatListBase>(null);
  const lastLoadMoreTime = useRef<number>(0);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleLoadMore = useCallback(() => {
    // Add a debounce mechanism to prevent multiple calls in quick succession
    const now = Date.now();
    if (now - lastLoadMoreTime.current > 500 && onLoadMore && !loadingMore) {
      lastLoadMoreTime.current = now;
      onLoadMore();
    }
  }, [onLoadMore, loadingMore]);

  if (loading) {
    return (
      <View style={$loadingView}>
        <ActivityIndicator size="small" color={'red'} />
      </View>
    );
  }

  const renderFooterView = () => {
    if (!props.data || props.data.length === 0) {
      return null;
    }

    if (loadingMore) {
      return (
        <View style={$footerView}>
          <ActivityIndicator size="large" color={'red'} />
        </View>
      );
    }

    return null;
  };

  const renderEmptyComponent = () => {
    if (loading && props.data && props.data.length > 0) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Image source={Images.empty_data} style={styles.emptyImage} resizeMode="contain" />
        <Text fontSize={scale(16)} tx={'Không có dữ liệu'} />
      </View>
    );
  };

  return (
    <FlatListBase
      ref={ref || listRef}
      initialNumToRender={10}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={!!refreshing} onRefresh={handleRefresh} tintColor={'red'} />
      }
      onEndReached={handleLoadMore}
      ListFooterComponent={renderFooterView}
      ListEmptyComponent={renderEmptyComponent}
      onEndReachedThreshold={0.5}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
      {...props}
    />
  );
};

const $loadingView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(50),
};
const $footerView: ViewStyle = {
  width: '100%',
  height: verticalScale(50),
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingTop: verticalScale(100),
  },
  emptyImage: {
    width: horizontalScale(400),
    height: verticalScale(300),
  },
});

export default forwardRef(FlatList);
