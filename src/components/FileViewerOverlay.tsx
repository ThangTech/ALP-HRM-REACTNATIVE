import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'tamagui';
import { scale } from 'utils';

export interface FileViewerOverlayProps {
  isViewing: boolean;
  isDownloading: boolean;
}

export const FileViewerOverlay: React.FC<FileViewerOverlayProps> = ({
  isViewing,
  isDownloading,
}) => {
  if (!isViewing && !isDownloading) return null;

  return (
    <View
      pos="absolute"
      t={0}
      b={0}
      l={0}
      r={0}
      ai="center"
      jc="center"
      bg="rgba(0,0,0,0.4)"
      zIndex={999}
    >
      <View bg="$white" p={scale(20)} br={scale(12)} ai="center" jc="center">
        <ActivityIndicator size="large" color="#000" />
        <Text mt={scale(10)} fontSize={scale(14)} fontWeight="500">
          {isViewing ? 'Đang mở file...' : 'Đang tải file...'}
        </Text>
      </View>
    </View>
  );
};
