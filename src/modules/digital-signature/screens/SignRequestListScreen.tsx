import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text, Input } from 'components';

import Header from 'components/Header';
import { IcPdf, IcFilter } from 'assets/svgs';
import { scale, horizontalScale } from 'utils';
import { goBack, navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useSignRequests } from '../hooks/useSignRequests';
import { SignFilterType, SignRequest } from '../hooks/useSignRequests';
import { FilterModal } from '../components/FilterModal';
import { ItemActionModal } from '../components/ItemActionModal';

interface SignRequestItemCardProps {
  item: SignRequest;
  onPress: (item: SignRequest) => void;
}

const SignRequestItemCard = ({ item, onPress }: SignRequestItemCardProps) => {
  const signers = item.request_item_ids.map((s) => s.partner_name).join(', ');
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(item)}>
      <View
        fd="row"
        ai="center"
        f={1}
        p={scale(12)}
        bg="$white"
        br={scale(16)}
        bw={1}
        bc="#e0e0e0"
        mb={scale(12)}
      >
        <View mr={scale(12)}>
          <IcPdf size={scale(30)} />
        </View>
        <View f={1}>
          <Text fontSize={scale(15)} fontW="600" color="$black" numberOfLines={1}>
            {item.reference}
          </Text>
          {signers ? (
            <Text fontSize={scale(13)} color="$grey" numberOfLines={1} mt={scale(2)}>
              {signers}
            </Text>
          ) : null}
          <Text fontSize={scale(12)} color="$grey" mt={scale(2)}>
            {item.create_date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SignRequestListScreen = () => {
  const route = useRoute();
  const { filterType } = (route.params as { filterType: SignFilterType }) || {};

  const {
    signRequests,
    stateFilter,
    searchText,
    setSearchText,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    isRefreshing,
    loadMore,
    refresh,
    mutate,
    changeStateFilter,
  } = useSignRequests(filterType ?? 'my');

  useFocusEffect(
    useCallback(() => {
      mutate();
    }, [mutate]),
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<SignRequest | null>(null);

  const handleLoadMore = () => {
    if (!isLoadingMore && !isReachingEnd) loadMore();
  };

  const handleViewAttachments = () => {
    if (!activeItem) return;
    navigate(RouteName.SignAttachedDocs, {
      attached_documents: activeItem.attached_documents,
      title: activeItem.reference,
    });
  };

  const handlePreview = () => {
    if (!activeItem) return;
    navigate(RouteName.SignWebView, {
      sign_url: activeItem.sign_url,
      title: activeItem.reference,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <Header title="Danh sách tài liệu ký" onPressLeft={goBack} />

          <View bg="$white" pb={scale(10)}>
            <View fd="row" ai="center" ph={horizontalScale(20)} pv={scale(10)}>
              <TouchableOpacity onPress={() => setIsFilterOpen(true)}>
                <IcFilter size={scale(28)} />
              </TouchableOpacity>
              <Input
                containerStyle={{ flex: 1, marginLeft: horizontalScale(12) }}
                placeholder="Tìm kiếm..."
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
                rightAddon="clear"
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View f={1} ph={horizontalScale(20)}>
        <FlatList
          data={signRequests}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
          ListFooterComponent={
            isLoadingMore && signRequests.length > 0 ? (
              <View p={scale(20)} ai="center" jc="center">
                <ActivityIndicator size="small" color={getTokens().color.black.val} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            isLoading ? (
              <View f={1} ai="center" jc="center" mt={scale(40)}>
                <ActivityIndicator size="large" color={getTokens().color.black.val} />
              </View>
            ) : (
              <View f={1} ai="center" jc="center" mt={scale(60)}>
                <Text fontSize={scale(16)} color="$grey">
                  Không có dữ liệu
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <SignRequestItemCard
              item={item}
              onPress={(i) => {
                Keyboard.dismiss();
                setActiveItem(i);
              }}
            />
          )}
        />
      </View>

      <FilterModal
        isVisible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilter={stateFilter}
        onSelectFilter={changeStateFilter}
      />

      <ItemActionModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onViewAttachments={handleViewAttachments}
        onPreview={handlePreview}
      />
    </View>
  );
};

export default SignRequestListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getTokens().color.white.val,
  },
});
