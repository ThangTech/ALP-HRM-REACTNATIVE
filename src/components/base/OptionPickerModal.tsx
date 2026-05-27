import React, { useCallback, useState, useMemo } from 'react';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Text } from 'components';
import { View } from 'tamagui';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { verticalScale, scale } from 'utils';
import SmartBackdrop from './SmartBackdrop';

export interface OptionItem {
  key: string | number;
  value: string; // Display label
  subtitle?: string; // Optional: Mô tả thêm
  data?: any; // Additional data for item
}

interface OptionPickerModalProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  data: OptionItem[];
  selectedValue?: string | number;
  onSelect: (item: OptionItem) => void;
  title?: string;
  searchable?: boolean;
}

const OptionPickerModal: React.FC<OptionPickerModalProps> = ({
  bottomSheetRef,
  data,
  selectedValue,
  onSelect,
  title = 'Chọn một tùy chọn',
  searchable = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const snapPoints = useMemo(() => ['45%'], []);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) {
      return data;
    }
    return data.filter((item) => item.value.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery, searchable]);

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      // Reset search khi đóng modal (index = -1)
      if (index === -1 && searchable) {
        setSearchQuery('');
      }
    },
    [searchable],
  );

  const handleSelectItem = (item: OptionItem) => {
    onSelect(item);
    bottomSheetRef.current?.close();
    if (searchable) {
      setSearchQuery(''); // Reset search sau khi chọn
    }
  };

  const renderItem = ({ item }: { item: OptionItem }) => {
    const isSelected = item.key === selectedValue;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSelectItem(item)}
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
      >
        <View fd="row" ai="center" jc="space-between" f={1}>
          <View f={1} mr={scale(12)}>
            <Text fontSize={15} fontWeight={isSelected ? '600' : '400'} color="$black">
              {item.value}
            </Text>
            {item.subtitle && (
              <Text fontSize={13} fontWeight="400" color="$grey" mt={verticalScale(4)}>
                {item.subtitle}
              </Text>
            )}
          </View>

          {/* Checkmark */}
          {isSelected && (
            <View
              w={scale(24)}
              h={scale(24)}
              ai="center"
              jc="center"
              bg="#10B981"
              borderRadius={scale(12)}
              style={styles.checkmark}
            >
              <Text fontSize={16} fontWeight="700" color="#FFFFFF">
                ✓
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View ai="center" jc="center" pv={verticalScale(40)}>
      <Text fontSize={15} fontWeight="400" color="$grey">
        Không tìm thấy kết quả
      </Text>
    </View>
  );

  const renderListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        {/* Title */}
        <View
          ph={scale(20)}
          pv={verticalScale(16)}
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Text fontSize={18} fontWeight="700" color="$black">
            {title}
          </Text>
        </View>

        {/* Search Input - Optional */}
        {searchable && (
          <View ph={scale(20)} pv={verticalScale(12)} bg="$white">
            <View style={styles.searchInputContainer}>
              <Text fontSize={16} color="$grey" mr={scale(8)}>
                🔍
              </Text>
              <BottomSheetTextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm..."
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Text fontSize={16} color="$grey">
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    ),
    [title, searchable, searchQuery],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      animateOnMount={true}
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      {/* Options List */}
      <BottomSheetFlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key.toString()}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    width: 40,
    height: 4,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: scale(14),
    color: '#000000',
    padding: 0,
    height: verticalScale(28),
  },
  clearButton: {
    padding: scale(4),
    marginLeft: scale(4),
  },
  listContainer: {
    paddingBottom: verticalScale(20),
  },
  itemContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F0FDF4',
  },
  checkmark: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default OptionPickerModal;
