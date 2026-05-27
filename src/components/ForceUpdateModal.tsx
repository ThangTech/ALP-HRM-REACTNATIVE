import React from 'react';
import { Modal, StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { Text } from 'components';
import { scale, verticalScale } from 'utils';

interface ForceUpdateModalProps {
  visible: boolean;
  currentVersion: string;
  minVersion: string;
  onUpdate: () => void;
}

const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  currentVersion,
  minVersion,
  onUpdate,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🚀</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Cập nhật ứng dụng</Text>

          {/* Message */}
          <Text style={styles.message}>
            Có phiên bản mới. Vui lòng cập nhật ứng dụng để tiếp tục sử dụng.
          </Text>

          {/* Version info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              Phiên bản hiện tại: <Text style={styles.versionNumber}>{currentVersion}</Text>
            </Text>
            <Text style={styles.versionText}>
              Phiên bản yêu cầu: <Text style={styles.versionNumber}>{minVersion}+</Text>
            </Text>
          </View>

          {/* Update Button */}
          <TouchableOpacity onPress={onUpdate} style={styles.updateButton} activeOpacity={0.8}>
            <Text style={styles.updateButtonText}>
              {Platform.OS === 'ios' ? 'Mở App Store' : 'Mở Google Play'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(24),
    width: '100%',
    maxWidth: scale(340),
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  icon: {
    fontSize: scale(40),
  },
  title: {
    fontSize: scale(20),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  message: {
    fontSize: scale(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: scale(22),
    marginBottom: verticalScale(16),
  },
  versionContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: scale(8),
    padding: scale(12),
    width: '100%',
    marginBottom: verticalScale(20),
  },
  versionText: {
    fontSize: scale(13),
    color: '#666666',
    textAlign: 'center',
    marginVertical: verticalScale(2),
  },
  versionNumber: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(32),
    borderRadius: scale(12),
    width: '100%',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: scale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ForceUpdateModal;
