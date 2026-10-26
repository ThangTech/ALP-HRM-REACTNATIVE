import { FlatList, Pressable } from 'components';
import React, { useCallback, useMemo } from 'react';
import { Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { scale, verticalScale } from 'utils';
import { getTokens, View } from 'tamagui';

export interface TableData {
  [key: string]: any;
}

export type ColumnDefinition<T extends TableData> = {
  key: string;
  label: string;
  isImportant?: boolean;
  render?: (value: any, item: T, updateValue?: (newValue: string) => void) => React.ReactNode;
};

export interface TableProps<T extends TableData> {
  columns: ColumnDefinition<T>[];
  data: T[];
  onRowPress?: (item: T) => void;
  onUpdateValue?: (item: T, key: string, newValue: string) => void;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface TableRowProps<T extends Record<string, any>> {
  item: T;
  columns: ColumnDefinition<T>[];
  onRowPress?: (item: T) => void;
  onUpdateValue?: (item: T, key: string, newValue: string) => void;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  onUpdateValue,
  onRowPress,
  onLoadMore,
  loadingMore,
  loading,
  refreshing,
  onRefresh,
  style,
}: TableProps<T>) => {
  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <TableRow
        item={item}
        columns={columns}
        onRowPress={onRowPress}
        onUpdateValue={onUpdateValue}
      />
    ),
    [columns, onRowPress, onUpdateValue],
  );

  // Check if there's more data to load
  const hasMoreData = useMemo(() => {
    // If there's no onLoadMore function, there's no more data to load
    if (!onLoadMore) {
      return false;
    }

    // If we're already loading more data, don't load more
    if (loadingMore) {
      return false;
    }

    // If we have data, we can load more
    return data && data.length > 0;
  }, [data, loadingMore, onLoadMore]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerRow}>
        {columns.map((col) => (
          <View key={col.key} style={styles.headerCell} f={col.key === 'state' ? 1.5 : 1}>
            <Text style={styles.headerText}>{col.label}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        onEndReached={hasMoreData ? onLoadMore : undefined}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        loading={loading}
        removeClippedSubviews={true}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={getTokens().color.blue800.val} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const TableRow = <T extends Record<string, any>>({
  item,
  columns,
  onRowPress,
  onUpdateValue,
}: TableRowProps<T>) => {
  return (
    <Pressable style={[styles.row]} onPress={() => onRowPress?.(item)}>
      {columns.map((col: ColumnDefinition<T>) => (
        <View key={col.key} style={styles.cellContainer} f={col.key === 'state' ? 1.5 : 1}>
          {col.render ? (
            col.render(item[col.key], item, (newValue: string) =>
              onUpdateValue?.(item, col.key, newValue),
            )
          ) : (
            <Text
              style={[styles.cellText, col.isImportant && styles.importantText]}
              numberOfLines={0}
            >
              {item[col.key] ?? '-'}
            </Text>
          )}
        </View>
      ))}
    </Pressable>
  );
};

const ItemSeparator = () => <View mv={scale(0)} btw={0.5} bc={'$grey'} />;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: verticalScale(0) },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: getTokens().color.grey_blue.val,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(5),
  },
  row: {
    flexDirection: 'row',
    paddingVertical: verticalScale(15),
    alignItems: 'flex-start',
    paddingHorizontal: scale(5),
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  cellContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    flexWrap: 'wrap',
    flexShrink: 1,
    textAlign: 'center',
  },
  importantText: {
    fontWeight: 'bold',
    fontSize: scale(8),
    color: getTokens().color.$black.val,
  },
  loadingContainer: {
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
});

export default Table as <T extends TableData>(props: TableProps<T>) => React.ReactElement;
