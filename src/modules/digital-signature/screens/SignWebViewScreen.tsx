import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, BackHandler } from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';
import WebView from 'react-native-webview';
import Header from 'components/Header';
import { useRoute } from '@react-navigation/native';
import { goBack } from 'navigators';
import { scale } from 'utils';
import { useSafeArea } from 'hooks';

const SignWebViewScreen = () => {
  const safeArea = useSafeArea();
  const route = useRoute();
  const { sign_url, title } = (route.params as { sign_url?: string; title?: string }) || {};

  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Normalize http → https để tránh 301 redirect gây onError trong WebView
  const normalizedUrl = sign_url?.replace(/^http:\/\//i, 'https://') ?? '';
  const hasValidUrl = !!normalizedUrl.trim();

  const handleBackPress = useCallback(() => {
    canGoBack && webViewRef.current ? webViewRef.current.goBack() : goBack();
    return true;
  }, [canGoBack]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <View style={styles.container} pb={safeArea.bottom}>
      <Header title={title} onPressLeft={handleBackPress} />

      {hasValidUrl ? (
        <View style={styles.webViewContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: normalizedUrl }}
            style={styles.webView}
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
            onLoadStart={() => {
              setIsLoading(true);
              setHasError(false);
            }}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            startInLoadingState={false}
          />

          {isLoading && !hasError && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color={getTokens().color.red500.val} />
              <Text mt={scale(8)} color="$grey" fontSize={scale(14)}>
                Đang tải tài liệu...
              </Text>
            </View>
          )}

          {hasError && (
            <View style={styles.overlay}>
              <Text color="$grey" textAlign="center" paddingHorizontal={scale(24)}>
                Không thể tải trang ký số.{'\n'}Vui lòng kiểm tra kết nối mạng.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text fontSize={scale(16)} color="$grey" ta="center" ph={scale(24)}>
            Không có dữ liệu ký
          </Text>
        </View>
      )}
    </View>
  );
};

export default SignWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getTokens().color.white.val,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getTokens().color.silver.val,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
