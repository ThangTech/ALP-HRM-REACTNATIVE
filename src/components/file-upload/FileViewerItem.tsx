import { IcDocument, IcImage, IcPdf, IcTrash, IcVideo } from 'assets/svgs';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { horizontalScale, scale, verticalScale, openMediaFile } from 'utils';
import { UploadedFile } from './useUploadFile';
import { Text } from 'components';
import { View } from 'tamagui';

interface FileViewerItemType {
  file: UploadedFile;
  disabled?: boolean;
  disabledDelete?: boolean;
  handleDeleteFile?: (file: UploadedFile) => void;
}

const FileViewerItem = (props: FileViewerItemType) => {
  const file = props.file;
  const getFileIcon = (fileType: 'image' | 'pdf' | 'docx' | 'video') => {
    switch (fileType) {
      case 'image':
        return <IcImage size={20} />;
      case 'video':
        return <IcVideo size={20} />;
      case 'pdf':
        return <IcPdf size={20} />;
      case 'docx':
        return <IcDocument size={20} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      key={file.id}
      style={styles.fileItem}
      disabled={props.disabled}
      onPress={() => openMediaFile(file.uri, file.type, file.name)}
    >
      <View fd="row" ai="center" gap={scale(12)} f={1}>
        {getFileIcon(file.type)}
        <View f={1}>
          <Text fontSize={14} numberOfLines={1}>
            {file.name}
          </Text>
          {file.size && (
            <Text fontSize={12} color="#999" mt={scale(2)}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          )}
        </View>
      </View>
      {!(props.disabledDelete ?? props.disabled) && (
        <TouchableOpacity
          onPress={() => props.handleDeleteFile?.(file)}
          style={styles.deleteButton}
        >
          <IcTrash size={20} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: scale(12),
    paddingVertical: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: '#F9FAFB',
  },
  filesListContainer: {
    marginTop: verticalScale(16),
    gap: scale(12),
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    gap: scale(12),
  },
  deleteButton: {
    padding: scale(8),
  },
});

export default FileViewerItem;
