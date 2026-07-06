import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { View } from 'tamagui';
import { Text } from 'components';
import { horizontalScale, scale, verticalScale } from 'utils';
import { IcCheckbox, IcUnCheckbox } from 'assets/svgs';
import { useSafeArea } from 'hooks';

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'shared', label: 'Được chia sẻ với tôi' },
];

export const FilterModal = ({
  isVisible,
  onClose,
  selectedFilter,
  onSelectFilter,
}: FilterModalProps) => {
  const { top } = useSafeArea();
  const headerHeight = top + verticalScale(20) * 2 + scale(22);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      style={[styles.modal, { marginTop: headerHeight }]}
      backdropOpacity={0.4}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.container} bg="$white" pt={verticalScale(20)} ph={horizontalScale(20)}>
        <Text fontSize={scale(20)} fontW="bold" mb={scale(20)}>
          Tài liệu
        </Text>

        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionRow}
            onPress={() => {
              onSelectFilter(option.id);
              onClose();
            }}
          >
            <View mr={scale(12)}>
              {selectedFilter === option.id ? (
                <IcCheckbox size={scale(24)} />
              ) : (
                <IcUnCheckbox size={scale(24)} />
              )}
            </View>
            <Text fontSize={scale(16)} color={selectedFilter === option.id ? '$black' : '$grey'}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  container: {
    width: '75%',
    height: '100%',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(15),
  },
});
