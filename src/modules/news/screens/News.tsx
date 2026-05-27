import { NewModel } from 'common/enum/new-model';
import { Screen } from 'components';
import { RouteName } from 'configs/navigation';
import { useSafeArea } from 'hooks';
import { navigate } from 'navigators';
import { useNewsApi } from 'news/hooks/useNewsApi';
import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, YStack } from 'tamagui';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // 48 = padding (16) * 2 + gap (16)

const News = () => {
  const { top } = useSafeArea();
  const newsApi = useNewsApi();
  const renderNewsItem = ({ item }: { item: NewModel }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.7}
      onPress={() =>
        navigate(RouteName.NewsDetail, {
          id: item.id.toString(),
          title: item.title,
          image: item.cover_image_url,
          content: item.app_content,
        })
      }
    >
      <YStack gap={12}>
        <Image source={{ uri: item.cover_image_url }} style={styles.image} resizeMode="cover" />
        <Text fontSize={14} fontWeight="600" numberOfLines={3}>
          {item.title}
        </Text>
      </YStack>
    </TouchableOpacity>
  );

  return (
    <Screen style={{ paddingTop: top }} scrollEnabled={false}>
      <FlatList
        data={newsApi.news?.data || []}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.7,
    borderRadius: 12,
  },
});

export default News;
