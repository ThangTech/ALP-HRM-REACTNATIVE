import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'tamagui';
import { WebView } from 'react-native-webview';
import useAppContext from 'hooks/useAppContext';
import MD5 from 'crypto-js/md5';
import { Button, Text } from 'components';
import { scale, verticalScale } from 'utils';
import { useSafeArea } from 'hooks';
import { useIsFocused } from '@react-navigation/native';

const VPS_BASE_URL = 'https://www.ngoinhachungsavani.com/mobileapp_vdx.aspx';

const Vps = () => {
  const { user } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const { top } = useSafeArea();
  const webViewRef = useRef<WebView>(null);
  const focus = useIsFocused();

  const mans = user?.employee_code || '';

  useEffect(() => {
    if (focus) {
      if (webViewRef.current && vpsUrl) {
        webViewRef.current.injectJavaScript(`window.location.href = "${vpsUrl}";`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const vpsUrl = useMemo(() => {
    if (!mans) {
      return '';
    }

    const key = MD5(`Savani2025_${mans}`).toString();

    const url = `${VPS_BASE_URL}?mans=${encodeURIComponent(mans)}&key=${key}`;

    return url;
  }, [mans]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  const handleReload = useCallback(() => {
    webViewRef.current?.reload();
  }, []);

  const handleGoBack = useCallback(() => {
    webViewRef.current?.goBack();
  }, []);

  const handleGoForward = useCallback(() => {
    webViewRef.current?.goForward();
  }, []);

  const handleNavigationStateChange = useCallback((navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  }, []);

  if (!mans || !vpsUrl) {
    return (
      <View f={1} ai="center" jc="center" p="$4">
        <Text fontSize={16} fontWeight="600" textAlign="center">
          Không tìm thấy mã nhân sự. Vui lòng đăng nhập lại để tiếp tục.
        </Text>
      </View>
    );
  }

  return (
    <View f={1} pt={top}>
      {hasError ? (
        <View f={1} ai="center" jc="center" gap={scale(10)}>
          <Text fontSize={16} fontWeight="600" textAlign="center">
            Không thể tải Văn phòng số Savani
          </Text>
          <Text fontSize={14} textAlign="center">
            Vui lòng kiểm tra kết nối mạng của bạn và thử lại.
          </Text>
          <Button onPress={handleRetry}>
            <Button.Text>Thử lại</Button.Text>
          </Button>
        </View>
      ) : (
        <>
          <WebView
            ref={webViewRef}
            source={{ uri: vpsUrl }}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            onHttpError={handleError}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text mt="$2">Đang tải Văn phòng số Savani...</Text>
              </View>
            )}
          />

          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text mt="$2">Đang tải Văn phòng số Savani...</Text>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {/* Back Button */}
            <TouchableOpacity
              style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
              onPress={handleGoBack}
              activeOpacity={0.8}
              disabled={!canGoBack}
            >
              <Text style={[styles.navIcon, !canGoBack && styles.navIconDisabled]}>←</Text>
            </TouchableOpacity>

            {/* Reload Button */}
            <TouchableOpacity style={styles.navButton} onPress={handleReload} activeOpacity={0.8}>
              <Text style={styles.navIcon}>↻</Text>
            </TouchableOpacity>

            {/* Forward Button */}
            <TouchableOpacity
              style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
              onPress={handleGoForward}
              activeOpacity={0.8}
              disabled={!canGoForward}
            >
              <Text style={[styles.navIcon, !canGoForward && styles.navIconDisabled]}>→</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: scale(20),
    flexDirection: 'row',
    gap: scale(12),
    zIndex: 999,
  },
  navButton: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.5,
  },
  navIcon: {
    fontSize: scale(28),
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navIconDisabled: {
    color: '#999999',
  },
});

export default Vps;
