import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { IcDocs, IcImage, IcVideo } from 'assets/svgs';
import { Button, Text, SmartBackdrop } from 'components';
import React, { RefObject, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'tamagui';
import { verticalScale } from 'utils';

interface FilePickerBottomSheet2Props {
  bottomSheetRef: RefObject<BottomSheetModal>;
  onSelectImage: () => void;
  onSelectDocument: () => void;
  onSelectVideo?: () => void;
}

const FilePickerBottomSheet2: React.FC<FilePickerBottomSheet2Props> = ({
  bottomSheetRef,
  onSelectImage,
  onSelectDocument,
  onSelectVideo,
}) => {
  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      // backgroundStyle={styles.bottomSheetBackground}
      // handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View p={verticalScale(20)} gap={verticalScale(16)}>
          <Text fontSize={16} fontWeight="600">
            Chọn loại tài liệu
          </Text>

          <View gap={verticalScale(12)}>
            <Button variant="secondary" onPress={onSelectImage} style={styles.optionButton}>
              <View fd="row" ai="center" gap={12}>
                <IcImage size={20} />
                <Button.Text variant="secondary">Upload file ảnh</Button.Text>
              </View>
            </Button>

            <Button variant="secondary" onPress={onSelectDocument} style={styles.optionButton}>
              <View fd="row" ai="center" gap={12}>
                <IcDocs size={20} />
                <Button.Text variant="secondary">Upload file tài liệu</Button.Text>
              </View>
            </Button>

            {onSelectVideo && (
              <Button variant="secondary" onPress={onSelectVideo} style={styles.optionButton}>
                <View fd="row" ai="center" gap={12}>
                  <IcVideo size={20} />
                  <Button.Text variant="secondary">Upload video</Button.Text>
                </View>
              </Button>
            )}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
  },
  handleIndicator: {
    backgroundColor: '#DEE2E6',
  },
  contentContainer: {
    flex: 1,
  },
  optionButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default FilePickerBottomSheet2;
