import { useState, useMemo, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import api from 'hooks/api';
import { useFilePicker } from 'modules/user/hooks/useFilePicker';
import { showToast } from 'components';
import useAppContext from 'hooks/useAppContext';
import { DocumentItemModel } from 'types/document';
import { mapApiTypeToDocumentType } from 'utils/fileUtils';

export interface BreadcrumbItem {
  id: number | false;
  name: string;
}

export interface CurrentFolderData {
  id: number | false;
  name: string;
  total_folder_count: number;
  total_file_count: number;
  total_url_count: number;
  limit: number;
  offset: number;
  current_page_items_count: number;
}

export interface DocumentApiResponse {
  data: {
    current_folder: CurrentFolderData;
    folders: any[];
    files: any[];
    urls: any[];
  };
}

const LIMIT = 50;

export const useDocument = () => {
  const app = useAppContext();
  const [filter, setFilter] = useState<'all' | 'shared'>('all');
  const [currentFolderId, setCurrentFolderId] = useState<number | false>(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: false, name: 'Tất cả tài liệu' },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const filePicker = useFilePicker();

  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: { combined: DocumentItemModel[]; current_folder: any } | null,
    ) => {
      if (previousPageData && previousPageData.combined.length < LIMIT) {
        return null;
      }

      return [
        'get_mobile_directory',
        {
          filter_type: filter,
          ...(currentFolderId !== false ? { folder_id: currentFolderId } : {}),
          offset: pageIndex * LIMIT,
          limit: LIMIT,
        },
        app.current_company_id,
      ];
    },
    [filter, currentFolderId, app.current_company_id],
  );

  const fetcher = async ([_key, filters]: [string, any]) => {
    try {
      const res = await api.POST<DocumentApiResponse>({
        path: '/api/models/documents-document/execute/get_mobile_directory',
        data: {
          kwargs: filters,
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });

      if (!res.data) throw new Error('No data returned from API');

      const mapItem = (item: any, itemType: 'folder' | 'binary' | 'url'): DocumentItemModel => ({
        ...item,
        attachment_id: item.attachment_id,
        originalType: itemType,
        type: mapApiTypeToDocumentType(itemType, item.mimetype),
      });

      const folders = (res.data.folders || []).map((i: any) => mapItem(i, 'folder'));
      const files = (res.data.files || []).map((i: any) => mapItem(i, 'binary'));
      const urls = (res.data.urls || []).map((i: any) => mapItem(i, 'url'));

      const combined = [...folders, ...files, ...urls];

      return {
        combined,
        current_folder: res.data.current_folder,
      };
    } catch (error) {
      console.log('Error fetching directory:', error);
      return { combined: [], current_folder: null };
    }
  };

  const { data, size, setSize, isValidating, mutate, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
  });

  const documents = useMemo(() => {
    if (!data) return [];
    return data.flatMap((page) => page.combined);
  }, [data]);

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isReachingEnd = data && (data[data.length - 1]?.combined.length ?? 0) < LIMIT;

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize((s) => s + 1);
    }
  }, [setSize, isReachingEnd, isLoadingMore]);

  const refreshData = useCallback(async () => {
    await mutate();
  }, [mutate]);

  const deleteDocuments = async (documentIds: number[]) => {
    try {
      const res = await api.POST<any>({
        path: '/api/models/documents-document/execute/move_to_trash_mobile',
        data: {
          kwargs: {
            document_ids: documentIds,
          },
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });

      if (res?.data?.status === 'error') {
        showToast('error', 'Lỗi', res?.data?.message);
        return false;
      }
      showToast('success', 'Thành công', res?.data?.message);
      refreshData();
      return true;
    } catch (error) {
      showToast('error', 'Lỗi', 'Không thể kết nối đến máy chủ.');
      return false;
    }
  };

  const handleUploadMobileFile = async (files: any[]) => {
    if (!files.length) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('res_id', currentFolderId !== false ? currentFolderId.toString() : '0');

      files.forEach((f) => {
        let mimeType = 'application/octet-stream';
        if (f.type === 'image') mimeType = 'image/jpeg';
        else if (f.type === 'video') mimeType = 'video/mp4';
        else if (f.type === 'pdf') mimeType = 'application/pdf';

        formData.append('files', {
          uri: f.uri,
          name: f.name,
          type: mimeType,
        } as any);
      });

      const res = await api.POST<any>({
        path: '/api/models/documents-document/upload_files/upload_mobile_file_multi',
        data: formData,
      });

      if (res.code === 1) {
        showToast('success', 'Thành công', res.message || 'Upload file thành công');
        refreshData();
      } else {
        showToast('error', 'Lỗi', res.message || 'Không thể tải file lên');
      }
    } catch (e: any) {
      showToast('error', 'Lỗi', 'Có lỗi xảy ra khi tải file lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateLink = async (name: string, url: string) => {
    setIsUploading(true);
    try {
      const res = await api.POST<any>({
        path: '/api/models/documents-document/execute/create_mobile_link',
        data: {
          kwargs: {
            url,
            name,
            ...(currentFolderId !== false ? { folder_id: currentFolderId } : {}),
          },
          context: {
            company_id: app.current_company_id,
            allowed_company_ids: app.current_company_id ? [app.current_company_id] : [],
          },
        },
      });

      if (res?.data?.status === 'error') {
        showToast('error', 'Lỗi', res?.data?.message || 'Không thể tạo liên kết');
        return false;
      }

      showToast('success', 'Thành công', res?.data?.message);
      refreshData();
      return true;
    } catch (e: any) {
      showToast('error', 'Lỗi', 'Có lỗi xảy ra khi tạo liên kết');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFile = async (type: 'image' | 'document' | 'video') => {
    let result;
    if (type === 'image') result = await filePicker.pickImage();
    else if (type === 'document') result = await filePicker.pickDocument();
    else if (type === 'video') result = await filePicker.pickVideo();

    if (result) {
      await handleUploadMobileFile([result]);
    }
  };

  const handleNavigateToFolder = (folderId: number, folderName: string) => {
    setCurrentFolderId(folderId);
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const handleGoToBreadcrumb = (index: number) => {
    const target = breadcrumbs[index];
    if (target) {
      setCurrentFolderId(target.id);
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
  };

  return {
    filter,
    setFilter,
    breadcrumbs,
    currentFolderId,
    documents,
    isLoading: isLoading || (isValidating && size === 1 && documents.length === 0),
    isLoadingMore: !!isLoadingMore,
    hasMore: !isReachingEnd,
    loadMore,
    isUploading,
    handleCreateLink,
    handleSelectFile,
    handleNavigateToFolder,
    handleGoToBreadcrumb,
    deleteDocuments,
  };
};
