import React, { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import {
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  FlatList,
  RefreshControl,
} from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';

import Header from 'components/Header';
import {
  IcPlus,
  IcArrowRight,
  IcImage,
  IcFolder,
  IcDocs,
  IcExcel,
  IcPdf,
  IcLink,
  IcVideo,
  IcFilter,
  IcCheck,
} from 'assets/svgs';
import { scale, horizontalScale } from 'utils';
import { FilterModal, ActionMenuModal, AddMenuModal, AddLinkModal } from '../components';
import FilePickerBottomSheet2 from 'components/FilePickerBottomSheet2';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useDocument, BreadcrumbItem } from '../hooks/useDocument';
import { DocumentType, DocumentItemModel } from 'types/document';
import { useFileViewer } from 'hooks/useFileViewer';
import { FileViewerOverlay } from 'components';
import { goBack } from 'navigators';

interface DocumentHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onFilterPress: () => void;
  onBreadcrumbPress: (index: number) => void;
  isSelectionMode?: boolean;
  selectedCount?: number;
  onClearSelection?: () => void;
  onDeleteMultiple?: () => void;
}

const DocumentHeader = ({
  breadcrumbs,
  onFilterPress,
  onBreadcrumbPress,
  isSelectionMode,
  selectedCount = 0,
  onClearSelection,
  onDeleteMultiple,
}: DocumentHeaderProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View bg="$white" pb={scale(10)}>
      <View fd="row" ai="center" jc="space-between" ph={horizontalScale(20)} pv={scale(10)}>
        <TouchableOpacity onPress={onFilterPress}>
          <IcFilter size={scale(28)} />
        </TouchableOpacity>

        {isSelectionMode && (
          <View fd="row" ai="center">
            <Text fontSize={scale(14)} fontW="bold" color="$black" mr={scale(10)}>
              Đã chọn: {selectedCount}
            </Text>

            <TouchableOpacity onPress={onClearSelection} style={{ marginRight: scale(15) }}>
              <Text fontSize={scale(14)} color="$grey" fontW="600">
                Hủy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onDeleteMultiple} disabled={selectedCount === 0}>
              <Text
                fontSize={scale(14)}
                color={selectedCount > 0 ? '$red500' : '$l_Grey'}
                fontW="bold"
              >
                Xoá
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View fd="row" ai="center" ph={horizontalScale(20)} mt={scale(5)} jc="space-between">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.id || 'root'}>
              <TouchableOpacity onPress={() => onBreadcrumbPress(index)}>
                <Text
                  fontSize={scale(14)}
                  fontW={index === breadcrumbs.length - 1 ? 'bold' : '400'}
                  color={index === breadcrumbs.length - 1 ? '$black' : '$grey'}
                >
                  {crumb.name}
                </Text>
              </TouchableOpacity>
              {index < breadcrumbs.length - 1 && (
                <View mh={scale(5)}>
                  <IcArrowRight size={scale(14)} />
                </View>
              )}
            </Fragment>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

interface DocumentItemProps {
  item: DocumentItemModel;
  onPress: (item: DocumentItemModel) => void;
  onLongPress: (item: DocumentItemModel) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
}

const getIconForType = (type: DocumentType) => {
  const size = scale(30);

  switch (type) {
    case DocumentType.FOLDER:
      return <IcFolder size={size} />;
    case DocumentType.PDF:
      return <IcPdf size={size} />;
    case DocumentType.WORD:
      return <IcDocs size={size} />;
    case DocumentType.EXCEL:
      return <IcExcel size={size} />;
    case DocumentType.IMAGE:
      return <IcImage size={size} />;
    case DocumentType.VIDEO:
      return <IcVideo size={size} />;
    case DocumentType.LINK:
      return <IcLink size={size} />;
    default:
      return <IcDocs size={size} />;
  }
};

const DocumentItem = ({
  item,
  onPress,
  onLongPress,
  isSelectionMode,
  isSelected,
}: DocumentItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
    >
      <View
        fd="row"
        ai="center"
        f={1}
        p={scale(12)}
        bg={isSelected ? '$blue50' : '$white'}
        br={scale(16)}
        bw={1}
        bc={isSelected ? '$blue500' : '$border'}
        mb={scale(12)}
      >
        {isSelectionMode && (
          <View mr={scale(12)}>
            <View
              w={scale(20)}
              h={scale(20)}
              br={scale(10)}
              bw={1}
              bc={isSelected ? '$blue500' : '$grey_blue'}
              bg={isSelected ? '$blue500' : 'transparent'}
              ai="center"
              jc="center"
            >
              {isSelected && <IcCheck size={scale(12)} tintColor={getTokens().color.white.val} />}
            </View>
          </View>
        )}

        <View mr={scale(12)}>{getIconForType(item.type)}</View>

        <View f={1}>
          <Text fontSize={scale(15)} fontW="600" color="$black" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const DocumentListScreen = () => {
  const state = useDocument();
  const { isViewing, isDownloading, handlePressFile, downloadDocument } = useFileViewer({
    onOpenFolder: state.handleNavigateToFolder,
  });
  const filePickerRef = useRef<BottomSheetModal>(null);
  const addMenuRef = useRef<BottomSheetModal>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<DocumentItemModel | undefined>(undefined);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  }, []);

  const openActionMenu = (item: DocumentItemModel) => {
    if (!isSelectionMode) {
      setActiveItem(item);
      setIsActionMenuOpen(true);
    }
  };

  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setActiveItem(undefined);
  };

  const { breadcrumbs, handleGoToBreadcrumb } = state;

  const handleBack = useCallback(() => {
    if (isSelectionMode) {
      clearSelection();
      return true;
    }
    if (breadcrumbs.length > 1) {
      // Đang ở trong thư mục con -> lùi 1 cấp
      handleGoToBreadcrumb(breadcrumbs.length - 2);
      return true; // Ngăn hành vi mặc định của phím back vật lý
    }
    // Ở gốc -> Cho phép hành vi mặc định
    return false;
  }, [breadcrumbs, handleGoToBreadcrumb, isSelectionMode, clearSelection]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, [handleBack]);

  const handleHeaderBack = () => {
    const handled = handleBack();
    if (!handled) {
      goBack(); // Ở gốc thì gọi hàm thoát screen
    }
  };

  const handlePressItem = (item: DocumentItemModel) => {
    if (isSelectionMode) {
      toggleSelection(item.id);
    } else {
      handlePressFile(item);
    }
  };

  const handleActionSelect = async (action: string) => {
    const itemName = activeItem?.name || 'Tài liệu đã chọn';

    switch (action) {
      case 'download':
        if (activeItem) downloadDocument(activeItem);
        break;
      case 'delete':
        Alert.alert('Xoá', `Bạn có chắc muốn xoá ${itemName}?`, [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xoá',
            style: 'destructive',
            onPress: async () => {
              if (activeItem?.id) {
                const success = await state.deleteDocuments([activeItem.id]);
                if (success) closeActionMenu();
              }
            },
          },
        ]);
        break;
      case 'select_multiple':
        setIsSelectionMode(true);
        if (activeItem?.id) {
          setSelectedIds([activeItem.id]);
        }
        closeActionMenu();
        break;
    }
  };

  const handleDeleteMultiple = () => {
    Alert.alert('Xoá', `Bạn có chắc muốn xoá ${selectedIds.length} tài liệu đã chọn?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          const success = await state.deleteDocuments(selectedIds);
          if (success) clearSelection();
        },
      },
    ]);
  };

  const renderHeaderRight = () => (
    <TouchableOpacity onPress={() => addMenuRef.current?.present()}>
      <IcPlus size={scale(15)} tintColor="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Tài Liệu" rightAction={renderHeaderRight()} onPressLeft={handleHeaderBack} />

      <DocumentHeader
        breadcrumbs={state.breadcrumbs}
        onFilterPress={() => setIsFilterOpen(true)}
        onBreadcrumbPress={state.handleGoToBreadcrumb}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.length}
        onClearSelection={clearSelection}
        onDeleteMultiple={handleDeleteMultiple}
      />

      <View f={1} ph={horizontalScale(20)}>
        <FlatList
          data={state.documents}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={state.isRefreshing} onRefresh={state.refresh} />
          }
          onEndReached={state.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            state.isLoadingMore && state.documents.length > 0 ? (
              <View p={scale(20)} ai="center" jc="center">
                <ActivityIndicator size="small" color={getTokens().color.black.val} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            state.isLoading ? (
              <View f={1} ai="center" jc="center" mt={scale(40)}>
                <ActivityIndicator size="large" color={getTokens().color.black.val} />
              </View>
            ) : (
              <View f={1} ai="center" jc="center" mt={scale(60)}>
                <Text fontSize={scale(16)} color="$grey">
                  Không có dữ liệu
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <DocumentItem
              item={item}
              onPress={handlePressItem}
              onLongPress={openActionMenu}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(item.id)}
            />
          )}
        />
      </View>

      <FilterModal
        isVisible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilter={state.filter}
        onSelectFilter={(f) => state.setFilter(f as any)}
      />

      <ActionMenuModal
        isVisible={isActionMenuOpen}
        onClose={closeActionMenu}
        onActionSelect={handleActionSelect}
      />

      <AddMenuModal
        bottomSheetRef={addMenuRef}
        onSelectUpload={() => filePickerRef.current?.present()}
        onSelectAddLink={() => setIsAddLinkOpen(true)}
      />

      <AddLinkModal
        isVisible={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        onSubmit={state.handleCreateLink}
        isLoading={state.isUploading}
      />

      <FilePickerBottomSheet2
        bottomSheetRef={filePickerRef}
        onSelectImage={() => {
          filePickerRef.current?.dismiss();
          state.handleSelectFile('image');
        }}
        onSelectDocument={() => {
          filePickerRef.current?.dismiss();
          state.handleSelectFile('document');
        }}
        onSelectVideo={() => {
          filePickerRef.current?.dismiss();
          state.handleSelectFile('video');
        }}
      />

      <FileViewerOverlay isViewing={isViewing} isDownloading={isDownloading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getTokens().color.white.val,
  },
});
