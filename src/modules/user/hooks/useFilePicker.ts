import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { FilePickerResult } from '../types/document';
import { decodeSafeFileName } from 'utils/fileUtils';

export const useFilePicker = () => {
  const pickVideo = (): Promise<FilePickerResult | null> => {
    return new Promise((resolve) => {
      const options = {
        mediaType: 'video' as MediaType,
        includeBase64: false,
        quality: 0.8 as const,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          const fileType = getFileTypeFromUri(asset.uri || '');
          resolve({
            name: decodeSafeFileName(asset.fileName) || `video_${Date.now()}.mp4`,
            type: fileType,
            uri: asset.uri || '',
            size: asset.fileSize,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  const pickImage = (): Promise<FilePickerResult | null> => {
    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8 as const,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          const fileType = getFileTypeFromUri(asset.uri || '');
          resolve({
            name: decodeSafeFileName(asset.fileName) || `image_${Date.now()}.jpg`,
            type: fileType,
            uri: asset.uri || '',
            size: asset.fileSize,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  const takeImage = (): Promise<FilePickerResult | null> => {
    return new Promise((resolve) => {
      const options: CameraOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8 as const,
        saveToPhotos: false,
      };

      launchCamera(options, (response) => {
        console.log('response', response);

        if (response.didCancel || response.errorMessage) {
          resolve(null);
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          const fileType = getFileTypeFromUri(asset.uri || '');
          resolve({
            name: decodeSafeFileName(asset.fileName) || `image_${Date.now()}.jpg`,
            type: fileType,
            uri: asset.uri || '',
            size: asset.fileSize,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  const pickDocument = (): Promise<FilePickerResult | null> => {
    return new Promise(async (resolve) => {
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
          copyTo: 'cachesDirectory',
        });

        if (result && result.length > 0) {
          const file = result[0];
          if (!file) {
            resolve(null);
            return;
          }

          const fileType = getFileTypeFromUri(file.uri);

          resolve({
            name: decodeSafeFileName(file.name) || 'document',
            type: fileType,
            uri: file.uri,
            size: file.size || undefined,
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        if (DocumentPicker.isCancel(error)) {
          resolve(null);
        } else {
          console.error('Document picker error:', error);
          resolve(null);
        }
      }
    });
  };

  const getFileTypeFromUri = (uri: string): 'image' | 'pdf' | 'docx' | 'video' => {
    const extension = uri.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return 'docx';
    } else if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'].includes(extension || '')) {
      return 'video';
    }

    // Default fallback
    return 'image';
  };

  return {
    pickVideo,
    pickImage,
    takeImage,
    pickDocument,
  };
};
