import { useState, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { showToast } from 'components';
import api from 'hooks/api';
import env from 'configs/env';
import { BaseFileItem, DocumentType } from 'types/document';
import {
  getFileType,
  getOrDownloadCachedFile,
  openLocalFile,
  downloadAndroid,
} from 'utils/fileUtils';

export interface UseFileViewerOptions {
  onOpenFolder?: (id: number, name: string) => void;
  enableDownload?: boolean;
}

let hasClearedCache = false;

export const useFileViewer = (options?: UseFileViewerOptions) => {
  const [isViewing, setIsViewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!hasClearedCache) {
      hasClearedCache = true;
      // Xoá toàn bộ thư mục rác
      const RNFS = require('react-native-fs');
      RNFS.unlink(`${RNFS.CachesDirectoryPath}/documents`).catch(() => {});
    }
  }, []);

  const viewDocument = async (item: BaseFileItem) => {
    await downloadOrViewDocument(item, 'view');
  };

  const downloadDocument = async (item: BaseFileItem) => {
    if (options?.enableDownload === false) {
      showToast('error', 'Lỗi', 'Không hỗ trợ tải xuống file ở mục này.');
      return;
    }
    await downloadOrViewDocument(item, 'download');
  };

  const downloadOrViewDocument = async (
    item: BaseFileItem | undefined,
    mode: 'view' | 'download',
  ) => {
    if (!item?.url_download) {
      showToast(
        'error',
        'Lỗi',
        'Không tìm thấy đường dẫn tải file. Hiện tại chỉ hỗ trợ tải xuống file dạng pdf, docs, excel, image, video.',
      );
      return;
    }

    mode === 'view' ? setIsViewing(true) : setIsDownloading(true);

    try {
      const url = `${env.apiUrl}${item.url_download}`;
      const token = api.getToken();

      // Android giao cho DownloadManager của HĐH xử lý
      if (mode === 'download' && Platform.OS === 'android') {
        try {
          await downloadAndroid(item, url, token);
          showToast('success', 'Đang tải', 'Kiểm tra thanh thông báo để xem tiến trình tải.');
        } catch (e) {
          showToast('error', 'Lỗi', 'Không thể tải file xuống thiết bị.');
        }
        return;
      }

      // View (cả 2 HĐH) + Download (iOS) tải về cache rồi mở bằng ứng dụng thứ 3
      const filePath = await getOrDownloadCachedFile(item, url, token);

      try {
        await openLocalFile(item, filePath);
      } catch (e) {
        showToast(
          'error',
          'Lỗi',
          'Không thể mở file, có thể thiết bị thiếu ứng dụng hỗ trợ định dạng này.',
        );
      }
    } catch (error) {
      showToast('error', 'Lỗi', `Không thể ${mode === 'view' ? 'mở' : 'tải xuống'} file này.`);
    } finally {
      setIsViewing(false);
      setIsDownloading(false);
    }
  };

  const handlePressFile = (item: BaseFileItem) => {
    const type = getFileType(item);

    if (type === DocumentType.FOLDER) {
      options?.onOpenFolder?.(item.id as number, item.name || '');
    } else if (type === DocumentType.LINK && item.url) {
      Linking.openURL(item.url).catch(() => {
        showToast('error', 'Lỗi', 'Không thể mở liên kết này.');
      });
    } else {
      viewDocument(item);
    }
  };

  return {
    isViewing,
    isDownloading,
    viewDocument,
    downloadDocument,
    handlePressFile,
  };
};
