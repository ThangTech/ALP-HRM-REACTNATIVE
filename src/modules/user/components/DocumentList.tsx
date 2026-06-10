import { IcUpload } from 'assets/svgs';
import FileViewerItem from 'components/file-upload/FileViewerItem';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import { DocumentCategory } from '../types/document';

interface DocumentListProps {
  document: DocumentCategory;
  onUploadPress?: (categoryId: string) => void;
  isReadonly?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ document, isReadonly, onUploadPress }) => {
  const [files, setFiles] = useState<UploadedFile[]>(document.displayFiles ?? []);

  function handleDeleteFile(file: UploadedFile): void {
    file.isDeleted = true;
    setFiles(document.files?.filter((it) => !it.isDeleted) ?? []);
  }

  useEffect(() => {
    setFiles(document.files?.filter((it) => !it.isDeleted) ?? []);
  }, [document.files]);

  return (
    <View>
      <View key={document.id} style={styles.documentItem}>
        <View style={styles.documentContent}>
          <View style={styles.documentInfo}>
            <Text fontSize={16} fontWeight="500">
              {document.title}
            </Text>
          </View>

          {!isReadonly && onUploadPress && (
            <View fd="row" ai="center" gap={12}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  onUploadPress(document.id);
                }}
              >
                <IcUpload size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {!!files.length && (
        <View gap={scale(8)} mt={8}>
          {files?.map((it) => (
            <FileViewerItem
              key={it.id}
              file={it}
              disabledDelete={isReadonly}
              handleDeleteFile={handleDeleteFile}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scale(10),
    paddingTop: verticalScale(10),
  },
  documentItem: {
    backgroundColor: 'white',
    // borderWidth: 1,
    borderRadius: scale(16),
    paddingHorizontal: verticalScale(16),
    paddingVertical: verticalScale(20),
  },
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentInfo: {
    flex: 1,
    marginRight: horizontalScale(12),
  },
  actionButton: {
    borderRadius: scale(10),
  },
});

export default DocumentList;
