import { FileAttachment } from 'common/model/user-attachment';
import { Header } from 'components';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'tamagui';
import { useCompanyProfileApi } from 'user/hooks/useCompanyProfileApi';
import { scale } from 'utils';
import DocumentList from '../components/DocumentList';
import { documentCategoriesTemplate2 } from '../data/documentTemplate2';
import { DocumentCategory } from '../types/document';

const CompanyProfile = () => {
  const [documents, setDocuments] = useState<DocumentCategory[]>(documentCategoriesTemplate2);
  const companyProfileApi = useCompanyProfileApi();
  const data = companyProfileApi.fetchDocumentSwr.data;
  const handleUploadPress = (_: string) => {};

  useEffect(() => {
    if (!data) {
      return;
    }
    async function fetchDocuments() {
      for (const it of documentCategoriesTemplate2) {
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
      setDocuments([...documentCategoriesTemplate2]);
    }
    fetchDocuments();
  }, [data]);

  const renderHeader = () => {
    return <Header title={'Hồ sơ công ty'} />;
  };

  const renderBody = () => {
    return (
      <ScrollView f={1}>
        <View gap={scale(16)} p={scale(16)}>
          {documents.map((doc) => (
            <DocumentList
              key={doc.id}
              document={doc}
              isReadonly
              onUploadPress={handleUploadPress}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View f={1}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default CompanyProfile;
