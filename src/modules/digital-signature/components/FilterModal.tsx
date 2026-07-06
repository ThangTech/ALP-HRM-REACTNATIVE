import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';
import { Text } from 'components';
import Modal from 'react-native-modal';
import { IcCheckbox, IcUnCheckbox } from 'assets/svgs';
import { scale, horizontalScale, verticalScale } from 'utils';
import { useSafeArea } from 'hooks';
import { StateFilter } from '../hooks/useSignRequests';

interface FilterOption {
  id: StateFilter | 'all';
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'sent', label: 'Chưa ký' },
  { id: 'signed', label: 'Đã ký' },
];

export interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedFilter: StateFilter | undefined;
  onSelectFilter: (filter: StateFilter | undefined) => void;
}

export const FilterModal = ({
  isVisible,
  onClose,
  selectedFilter,
  onSelectFilter,
}: FilterModalProps) => {
  const { top } = useSafeArea();
  const headerHeight = top + verticalScale(20) * 2 + scale(22);
  const activeId: FilterOption['id'] = selectedFilter ?? 'all';

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      style={[styles.filterModal, { marginTop: headerHeight }]}
      backdropOpacity={0.4}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
    >
      <View
        style={styles.filterContainer}
        bg="$white"
        pt={verticalScale(20)}
        ph={horizontalScale(20)}
      >
        <Text fontSize={scale(20)} fontW="bold" mb={scale(20)}>
          Lọc trạng thái
        </Text>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionRow}
            onPress={() => {
              onSelectFilter(option.id === 'all' ? undefined : (option.id as StateFilter));
              onClose();
            }}
          >
            <View mr={scale(12)}>
              {activeId === option.id ? (
                <IcCheckbox size={scale(24)} />
              ) : (
                <IcUnCheckbox size={scale(24)} />
              )}
            </View>
            <Text fontSize={scale(16)} color={activeId === option.id ? '$black' : '$grey'}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filterModal: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  filterContainer: {
    width: '75%',
    height: '100%',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(15),
  },
});
