import React from 'react';
import { IcUpload, IcTrash, IcDocument, IcImage, IcPdf } from 'assets/svgs';
import { Text } from 'components';
import { Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import { UploadedFile, UseUploadFileReturn } from '../hooks/useUploadFile';

interface UploadComponentType {
  hook: UseUploadFileReturn;
  title?: string;
  isRequired?: boolean;
  disabled?: boolean;
  disabledViewFile?: boolean;
  handleDeleteFile?: (file: UploadedFile) => Promise<void>;
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
  },
  uploadContainer: {
    marginTop: verticalScale(20),
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: scale(12),
    paddingVertical: verticalScale(40),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: '#F9FAFB',
  },
  uploadIconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
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

const UploadComponent = (props: UploadComponentType) => {
  const handleUploadPress = () => {
    props.hook.filePickerRef.current?.snapToIndex(0);
  };

  const handleDeleteFile = (file: UploadedFile) => {
    if (file.id.startsWith('temp')) {
      props.hook.setUploadedFiles((prev) => prev.filter((it) => it.id !== file.id));
    } else {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa file này?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => props.handleDeleteFile?.(file),
        },
      ]);
    }
  };

  const getFileIcon = (fileType: 'image' | 'pdf' | 'docx' | 'video') => {
    switch (fileType) {
      case 'image':
        return <IcImage size={20} />;
      case 'pdf':
        return <IcPdf size={20} />;
      case 'docx':
        return <IcDocument size={20} />;
      default:
        return null;
    }
  };

  const handleOpenFile = (uri: string) => {
    Linking.openURL(uri);
  };

  return (
    <View>
      <View fd="row" ai="center" jc="space-between" mb={scale(12)}>
        <Text fontSize={16} fontWeight="600">
          {props.title}
          {props.isRequired && <Text color="#E74C3C">*</Text>}
        </Text>
      </View>

      {/* Upload Area */}
      <TouchableOpacity
        style={styles.uploadArea}
        activeOpacity={0.7}
        disabled={props.disabled}
        onPress={handleUploadPress}
      >
        <View ai="center" gap={scale(8)}>
          <View style={styles.uploadIconContainer}>
            <IcUpload size={32} />
          </View>
          <View ai="center">
            <Text fontSize={14} color="#666" textAlign="center">
              JPEG/JPG, PNG, DOC/DOCX, PDF,... Tối đa 250MB
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Uploaded Files List */}
      {props.hook.uploadedFiles.length > 0 && (
        <TouchableOpacity activeOpacity={1} style={styles.filesListContainer}>
          {props.hook.uploadedFiles.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={styles.fileItem}
              disabled={props.disabledViewFile}
              onPress={() => handleOpenFile(file.uri)}
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
              <TouchableOpacity
                disabled={props.disabled}
                onPress={() => handleDeleteFile(file)}
                style={styles.deleteButton}
              >
                <IcTrash size={20} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UploadComponent;
