import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';

import Header from 'components/Header';
import { IcPdf, IcDocs, IcExcel, IcImage } from 'assets/svgs';
import { scale, horizontalScale } from 'utils';
import { goBack } from 'navigators';
import { useRoute } from '@react-navigation/native';
import { useFileViewer } from 'hooks/useFileViewer';
import { FileViewerOverlay } from 'components';
import { DocumentType } from 'types/document';
import { getFileType } from 'utils/fileUtils';
import { SignAttachedDocument, SignAttachment } from '../hooks/useSignRequests';

const flattenAttachments = (attachedDocs: SignAttachedDocument[]): SignAttachment[] =>
  attachedDocs.flatMap((group) => group.attachments || []);

const getAttachmentIcon = (attachment: SignAttachment) => {
  const size = scale(32);
  const item = {
    name: attachment.name,
    mimetype: attachment.mimetype,
  };
  const type = getFileType(item);

  switch (type) {
    case DocumentType.PDF:
      return <IcPdf size={size} />;
    case DocumentType.WORD:
      return <IcDocs size={size} />;
    case DocumentType.EXCEL:
      return <IcExcel size={size} />;
    case DocumentType.IMAGE:
      return <IcImage size={size} />;
    default:
      return <IcDocs size={size} />;
  }
};

interface AttachmentItemProps {
  attachment: SignAttachment;
  onPress: (attachment: SignAttachment) => void;
}

const AttachmentItem = ({ attachment, onPress }: AttachmentItemProps) => (
  <TouchableOpacity activeOpacity={0.75} onPress={() => onPress(attachment)}>
    <View
      fd="row"
      ai="center"
      bg="$white"
      br={scale(14)}
      bw={1}
      bc="#E8E8E8"
      mb={scale(12)}
      p={scale(14)}
    >
      <View mr={scale(14)}>{getAttachmentIcon(attachment)}</View>
      <View f={1}>
        <Text fontSize={scale(14)} fontW="500" color="$black" numberOfLines={2}>
          {attachment.name}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AttachedDocsScreen = () => {
  const route = useRoute();
  const { attached_documents, title } =
    (route.params as {
      attached_documents: SignAttachedDocument[];
      title?: string;
    }) || {};

  const { isViewing, isDownloading, handlePressFile } = useFileViewer({
    enableDownload: false,
  });

  const attachments = flattenAttachments(attached_documents || []);

  const handlePressAttachment = (attachment: SignAttachment) => {
    handlePressFile({
      id: attachment.attachment_id,
      attachment_id: attachment.attachment_id,
      name: attachment.name,
      mimetype: attachment.mimetype,
      url: attachment.url,
      url_download: attachment.url_download,
    });
  };

  return (
    <View style={styles.container}>
      <Header title={title} onPressLeft={goBack} />

      <View f={1} ph={horizontalScale(20)} pt={scale(12)}>
        <FlatList
          data={attachments}
          keyExtractor={(item) => String(item.attachment_id)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View f={1} ai="center" jc="center" mt={scale(80)}>
              <Text fontSize={scale(16)} color="#808080">
                Không có tài liệu đính kèm
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <AttachmentItem attachment={item} onPress={handlePressAttachment} />
          )}
        />
      </View>

      <FileViewerOverlay isViewing={isViewing} isDownloading={isDownloading} />
    </View>
  );
};

export default AttachedDocsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getTokens().color.silver.val,
  },
});
