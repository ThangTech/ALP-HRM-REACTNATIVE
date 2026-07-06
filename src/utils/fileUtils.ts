import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { navigate } from 'navigators';
import { RouteName } from 'configs/navigation';
import { BaseFileItem, DocumentType } from 'types/document';

export const getFileType = (item: BaseFileItem): DocumentType => {
  if (item.type && Object.values(DocumentType).includes(item.type as DocumentType)) {
    return item.type as DocumentType;
  }

  const mime = item.mimetype?.toLowerCase() || '';
  if (!mime) return DocumentType.UNKNOWN;

  if (mime === 'application/pdf') return DocumentType.PDF;

  if (
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'application/msword' ||
    mime === 'application/rtf' ||
    mime === 'text/plain'
  ) {
    return DocumentType.WORD;
  }

  if (
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mime === 'application/vnd.ms-excel' ||
    mime === 'text/csv'
  ) {
    return DocumentType.EXCEL;
  }

  if (mime.startsWith('image/')) return DocumentType.IMAGE;
  if (mime.startsWith('video/')) return DocumentType.VIDEO;

  return DocumentType.UNKNOWN;
};

export const getMimeType = (item: BaseFileItem): string => {
  return item.mimetype || 'application/octet-stream';
};

export const mapApiTypeToDocumentType = (apiType: string, mimetype?: string): DocumentType => {
  if (apiType === 'folder') return DocumentType.FOLDER;
  if (apiType === 'url') return DocumentType.LINK;
  if (apiType === 'binary' && mimetype) {
    return getFileType({ mimetype });
  }
  return DocumentType.UNKNOWN;
};

export const downloadAndroid = async (
  item: BaseFileItem,
  url: string,
  token: string,
): Promise<void> => {
  const dirs = ReactNativeBlobUtil.fs.dirs;
  const fileName = decodeURIComponent(item.name || 'document_file');
  await ReactNativeBlobUtil.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: fileName,
      description: 'Đang tải file xuống...',
      mime: getMimeType(item),
      mediaScannable: true,
      path: `${dirs.DownloadDir}/${fileName}`,
    },
  }).fetch('GET', url, { Authorization: `Bearer ${token}` });
};

export const getOrDownloadCachedFile = async (
  item: BaseFileItem,
  url: string,
  token: string,
): Promise<string> => {
  const fileName = decodeURIComponent(item.name || 'document_file');
  const uniqueId = item.attachment_id || item.id;
  const uniqueFileName = `${uniqueId}_${fileName}`;
  const dirPath = `${RNFS.CachesDirectoryPath}/documents`;
  const filePath = `${dirPath}/${uniqueFileName}`;

  const isDirExists = await RNFS.exists(dirPath);
  if (!isDirExists) {
    await RNFS.mkdir(dirPath);
  }

  const fileExists = await RNFS.exists(filePath);

  if (!fileExists) {
    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: filePath,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).promise;

      if (downloadResult.statusCode !== 200) {
        await RNFS.unlink(filePath).catch(() => {});
        throw new Error('Tải file thất bại, status = ' + downloadResult.statusCode);
      }
    } catch (err) {
      await RNFS.unlink(filePath).catch(() => {});
      throw err;
    }
  }

  return filePath;
};

export const openLocalFile = async (item: BaseFileItem, filePath: string): Promise<void> => {
  const isPdf = getFileType(item) === DocumentType.PDF;

  if (isPdf) {
    navigate(RouteName.DocumentPdf, { url: `file://${filePath}`, title: item.name || '' });
    return;
  }

  if (Platform.OS === 'android') {
    let mimeType = getMimeType(item);
    const fileType = getFileType(item);

    // Android mặc định không nhận diện tốt chuẩn video/quicktime (.mov) của Apple.
    if (fileType === DocumentType.VIDEO) mimeType = 'video/*';
    await ReactNativeBlobUtil.android.actionViewIntent(filePath, mimeType);
  } else {
    await ReactNativeBlobUtil.ios.previewDocument(filePath);
  }
};
