import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View, getTokens } from 'tamagui';
import { Text } from 'components';
import Pdf from 'react-native-pdf';
import Header from 'components/Header';
import { useRoute } from '@react-navigation/native';
import { goBack } from 'navigators';
import { scale } from 'utils';

export const DocumentPdfScreen = () => {
  const route = useRoute();
  const { url, title } = (route.params as { url?: string; title?: string }) || {};
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const pdfSource = { uri: url };

  return (
    <View style={styles.container}>
      <Header title={title} onPressLeft={() => goBack()} />
      <View style={styles.pdfContainer}>
        {url ? (
          <>
            <Pdf
              source={pdfSource}
              style={styles.pdf}
              trustAllCerts={false}
              enablePaging={false}
              onLoadComplete={() => {
                setIsLoading(false);
                setHasError(false);
              }}
              onError={(error: any) => {
                const msg =
                  error?.message || error?.toString?.() || JSON.stringify(error) || 'Unknown';
                console.log('PDF Error:', msg);
                setIsLoading(false);
                setHasError(true);
                setErrorMsg(msg);
              }}
            />
            {isLoading && !hasError && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color={getTokens().color.red500.val} />
                <Text mt={scale(8)} color="$grey">
                  Đang tải PDF...
                </Text>
              </View>
            )}
            {hasError && (
              <View style={styles.overlay}>
                <Text color="$grey" textAlign="center" paddingHorizontal={scale(24)}>
                  Không thể tải file PDF.{'\n'}Vui lòng kiểm tra kết nối mạng.
                </Text>
                {__DEV__ && (
                  <Text
                    mt={scale(8)}
                    fontSize={scale(10)}
                    color="$grey"
                    textAlign="center"
                    paddingHorizontal={scale(24)}
                  >
                    {errorMsg}
                  </Text>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.overlay}>
            <Text color="$grey">Không có URL để mở.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getTokens().color.white.val,
  },
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    backgroundColor: getTokens().color.border.val,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: getTokens().color.silver.val,
  },
});
