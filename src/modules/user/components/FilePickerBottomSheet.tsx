import React, { useCallback } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text, SmartBackdrop } from 'components';
import { View } from 'tamagui';
import { StyleSheet } from 'react-native';
import { verticalScale } from 'utils';
import { IcDocs, IcImage, IcVideo } from 'assets/svgs';

interface FilePickerBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  onSelectImage: () => void;
  onSelectDocument: () => void;
  onSelectVideo?: () => void;
}

const FilePickerBottomSheet: React.FC<FilePickerBottomSheetProps> = ({
  bottomSheetRef,
  onSelectImage,
  onSelectDocument,
  onSelectVideo,
}) => {
  const snapPoints = React.useMemo(() => ['25%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
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
    </BottomSheet>
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

export default FilePickerBottomSheet;
