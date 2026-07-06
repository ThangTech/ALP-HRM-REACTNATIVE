import { Linking, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';

export const openMediaFile = async (uri: string, fileType?: string, fileName?: string) => {
  if (Platform.OS === 'ios' && fileType === 'video') {
    try {
      const safeFileName = (fileName || 'video').replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const localPath = `${RNFS.CachesDirectoryPath}/${safeFileName}`;

      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: localPath,
      }).promise;

      await ReactNativeBlobUtil.ios.previewDocument(localPath);
    } catch (error) {
      console.warn('Lỗi tải/mở video iOS:', error);
      Linking.openURL(uri);
    }
  } else {
    Linking.openURL(uri);
  }
};
