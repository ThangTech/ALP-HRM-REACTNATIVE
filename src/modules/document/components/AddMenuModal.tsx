import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';
import { SmartBackdrop } from 'components';
import { scale, verticalScale } from 'utils';

interface AddMenuModalProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  onSelectUpload: () => void;
  onSelectAddLink: () => void;
}

export const AddMenuModal: React.FC<AddMenuModalProps> = ({
  bottomSheetRef,
  onSelectUpload,
  onSelectAddLink,
}) => {
  const snapPoints = useMemo(() => ['30%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View
          ph={scale(20)}
          pv={verticalScale(16)}
          borderBottomWidth={1}
          borderBottomColor="#f0f0f0"
        >
          <Text fontSize={18} fontWeight="700" color="$black">
            Thêm mới
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.itemContainer, styles.borderBottom]}
          activeOpacity={0.7}
          onPress={() => {
            bottomSheetRef.current?.dismiss();
            setTimeout(onSelectUpload, 300);
          }}
        >
          <View fd="row" ai="center" gap={scale(12)}>
            <Text fontSize={15} fontWeight="400" color="$black">
              Tải file lên
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemContainer}
          activeOpacity={0.7}
          onPress={() => {
            bottomSheetRef.current?.dismiss();
            setTimeout(onSelectAddLink, 300);
          }}
        >
          <View fd="row" ai="center" gap={scale(12)}>
            <Text fontSize={15} fontWeight="400" color="$black">
              Thêm liên kết
            </Text>
          </View>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: getTokens().color.white.val,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  handleIndicator: {
    backgroundColor: getTokens().color.border.val,
    width: scale(40),
    height: verticalScale(4),
    borderRadius: scale(2),
  },
  contentContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: getTokens().color.border.val,
  },
});
