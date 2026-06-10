import BottomSheet from '@gorhom/bottom-sheet';
import { FileAttachment } from 'common/model/user-attachment';
import { Button, Header, showToast } from 'components';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import useAppContext from 'hooks/useAppContext';
import { goBack } from 'navigators';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { usePersonalProfileApi } from 'user/hooks/usePersonalProfileApi';
import { horizontalScale, scale, verticalScale } from 'utils';
import { FilePickerBottomSheet } from '../components';
import DocumentList from '../components/DocumentList';
import { documentCategoriesTemplate } from '../data/documentTemplate';
import { useFilePicker } from '../hooks/useFilePicker';
import { DocumentCategory } from '../types/document';
import { useRoute } from '@react-navigation/native';

const PersonalProfile = () => {
  const route = useRoute<any>();
  const employeeId: number | undefined = route?.params?.employeeId;
  const isReadonly = !!employeeId;

  const { user } = useAppContext();
  const [documents, setDocuments] = useState<DocumentCategory[]>(documentCategoriesTemplate);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { pickImage, pickDocument } = useFilePicker();
  const personalProfileApi = usePersonalProfileApi(employeeId);

  const handleUploadPress = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleSelectImage = async () => {
    bottomSheetRef.current?.close();

    const result = await pickImage();
    if (result && selectedCategoryId) {
      const newFile: UploadedFile = {
        id: `temp${Date.now()}`,
        name: result.name,
        type: result.type as 'image' | 'pdf' | 'docx',
        uri: result.uri,
        size: result.size,
      };

      setDocuments((prev) =>
        prev.map((doc) => {
          return doc.id === selectedCategoryId
            ? { ...doc, files: [...(doc.files ?? []), newFile] }
            : doc;
        }),
      );
    }
    setSelectedCategoryId(null);
  };

  const handleSelectDocument = async () => {
    bottomSheetRef.current?.close();

    const result = await pickDocument();
    if (result && selectedCategoryId) {
      const newFile: UploadedFile = {
        id: `temp${Date.now()}`,
        name: result.name,
        type: result.type as 'image' | 'pdf' | 'docx',
        uri: result.uri,
        size: result.size,
      };

      setDocuments((prev) =>
        prev.map((doc) => {
          return doc.id === selectedCategoryId
            ? { ...doc, files: [...(doc.files ?? []), newFile] }
            : doc;
        }),
      );
    }
    setSelectedCategoryId(null);
  };

  async function handleApiDeleteFile(document: DocumentCategory, file: UploadedFile) {
    try {
      await personalProfileApi.handleFileActionSwr.trigger({
        action: 'delete',
        document,
        file,
        employeeId: user?.employee_id,
      });
      showToast('success', `Xoá file ${document.title} thành công`);
    } catch (error) {
      // showToast('error', 'Error deleting file');
    }
  }

  async function handleApiUploadFiles(document: DocumentCategory, files: UploadedFile[]) {
    try {
      await personalProfileApi.handleFileActionSwr.trigger({
        action: 'upload',
        document,
        files,
        employeeId: user?.employee_id,
      });
      showToast('success', `Tải lên file ${document.title} thành công`);
    } catch (error) {
      console.error(error);

      // showToast('error', 'Error deleting file');
    }
  }

  const handleSave = async () => {
    setLoading(true);
    for (const doc of documents) {
      const deletedFiles: UploadedFile[] = [],
        pendingUploadFiles: UploadedFile[] = [];
      for (const file of doc.files ?? []) {
        if (file.isDeleted) {
          if (!file.id.startsWith('temp')) {
            deletedFiles.push(file);
          }
        } else {
          if (file.id.startsWith('temp')) {
            pendingUploadFiles.push(file);
          }
        }
      }
      if (deletedFiles.length) {
        for (const it of deletedFiles) {
          await handleApiDeleteFile(doc, it);
        }
      }
      if (pendingUploadFiles.length) {
        await handleApiUploadFiles(doc, pendingUploadFiles);
      }
    }
    setLoading(false);
    showToast('success', 'Lưu thành công');
    goBack();
  };

  const handleCancel = () => {
    setDocuments(documentCategoriesTemplate);
  };

  useEffect(() => {
    async function fetchDocuments() {
      const data = personalProfileApi.fetchDocumentsSwr.data;
      if (!data) {
        return;
      }
      for (const it of documentCategoriesTemplate) {
        const item = (data?.attachments as any)[it.id] as FileAttachment;
        if (item?.label) {
          it.title = item?.label;
        }
        it.files = item?.files.map(
          (it) =>
            ({
              ...it,
              id: it.id.toString(),
              type: it.mimetype.startsWith('image')
                ? 'image'
                : it.mimetype.includes('pdf')
                  ? 'pdf'
                  : 'docx',
              uri: it.download_url,
              size: it.file_size,
            }) as UploadedFile,
        );
      }
      setDocuments([...documentCategoriesTemplate]);
    }
    fetchDocuments();
  }, [personalProfileApi.fetchDocumentsSwr.data]);

  const renderHeader = () => {
    return <Header title={'Hồ sơ cá nhân'} />;
  };

  const renderBody = () => {
    return (
      <ScrollView f={1} paddingHorizontal={horizontalScale(16)}>
        <View gap={scale(16)} pv={scale(16)}>
          {documents.map((doc) => (
            <DocumentList
              key={doc.id}
              document={doc}
              onUploadPress={isReadonly ? undefined : handleUploadPress}
              isReadonly={isReadonly}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderFooter = () => {
    if (isReadonly) return null;
    return (
      <View fd={'row'} p={verticalScale(20)} gap={10} bg={'$white'}>
        <Button style={styles.btn} variant="secondary" onPress={handleCancel} disabled={loading}>
          <Button.Text variant="secondary">Huỷ</Button.Text>
        </Button>
        <Button style={[styles.btn]} onPress={handleSave} loading={loading}>
          <Button.Text>Lưu</Button.Text>
        </Button>
      </View>
    );
  };

  return (
    <View f={1}>
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
      <FilePickerBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSelectImage={handleSelectImage}
        onSelectDocument={handleSelectDocument}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default PersonalProfile;
