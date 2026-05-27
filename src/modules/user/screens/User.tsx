import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { IcPencil } from 'assets/svgs';
import IcRightArrow from 'assets/svgs/IcRightArrow';
import { Button, Input, Modal, Pressable, Text, showToast, SmartBackdrop } from 'components';
import { BaseModalRef } from 'components/base/Modal';
import { UploadedFile } from 'components/file-upload/useUploadFile';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import { useSafeArea, useRemoteConfig } from 'hooks';
import api from 'hooks/api';
import useAppContext from 'hooks/useAppContext';
import { navigate, resetRoot } from 'navigators';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, StatusBar, StyleSheet } from 'react-native';
import { HOST } from 'react-native-dotenv';
import { Image, ScrollView, View, getTokens } from 'tamagui';
import ItemRow from 'user/components/ItemRow';
import { useEmployeeAvatarApi } from 'user/hooks/useEmployeeAvatarApi';
import { useFilePicker } from 'user/hooks/useFilePicker';
import { FilePickerResult } from 'user/types/document';
import { horizontalScale, scale, verticalScale } from 'utils';
import messaging from '@react-native-firebase/messaging';

const User = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const deleteAccountDialogRef = useRef<BaseModalRef>(null);
  const { top } = useSafeArea();
  const { user, setUser } = useAppContext();
  const [avatarUrl, _setAvatarUrl] = useState<string>(`${HOST}${user?.image_url}?t=${Date.now()}`);
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const snapPoints = useMemo(() => ['30%'], []);
  const filePicker = useFilePicker();
  const employeeAvatarApi = useEmployeeAvatarApi();
  const { showHiddenFeatures } = useRemoteConfig();

  const openSheet = () => sheetRef.current?.expand();
  const closeSheet = () => sheetRef.current?.close();

  const onChooseFromLibrary = async () => {
    const result = await filePicker.pickImage();
    if (!result) {
      return;
    }
    uploadImage(result);
  };

  const onOpenCamera = async () => {
    const result = await filePicker.takeImage();
    if (!result) {
      return;
    }
    uploadImage(result);
  };

  const uploadImage = async (file: FilePickerResult) => {
    try {
      await employeeAvatarApi.update({
        employeeId: user?.employee_id,
        file: {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as UploadedFile,
      });
      const path = `/employee/avatar/${user?.employee_id}?t=${Date.now()}`;
      _setAvatarUrl(`${HOST}${path}`);
      setUser({
        ...user,
        image_url: path,
      } as User);
      closeSheet();
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi cập nhật ảnh đại diện');
    }
  };

  const onLogout = async () => {
    await messaging().deleteToken();
    await setUser({
      name: '',
      employee_id: 0,
      employee_code: '',
      old_employee_code: '',
      job_id: 0,
      job_name: '',
      group_id: 0,
      group_name: '',
      department_id: 0,
      department_name: '',
      area_category_id: 0,
      area_category_name: '',
      work_location_text: '',
      mobile_phone: '',
      work_email: '',
      onboard_time: '',
      offical_contract_date: '',
      parent: [],
      child: [],
      birthday: '',
      identification_id: '',
      area_provide: '',
      date_provide: '',
      private_email: '',
      place_of_birth: '',
      address_now: '',
      bank_account_name: '',
      account_holder: '',
      bank_id: 0,
      bank_name: '',
      emergency_contact: '',
      emergency_relation: '',
      marital: '',
      marital_label: '',
      count_children: 0,
      children_ids: [],
      certificate_employee: '',
      study_school: '',
      study_field: '',
      image_url: '',
      emergency_phone: '',
      access_staff_transfer: false,
    });
    resetRoot({ index: 0, routes: [{ name: RouteName.Login }] });
  };

  const renderHeader = () => {
    return (
      <View bg={'$blue'} pb={verticalScale(20)}>
        <StatusBar backgroundColor={getTokens().color.blue.val} />
        <View ph={horizontalScale(16)} pt={verticalScale(20) + top}>
          <View fd="row" gap={scale(12)}>
            <View position="relative">
              <View w={horizontalScale(90)} h={horizontalScale(90)} br={scale(50)} bg={'$white'}>
                <Image
                  source={{
                    uri: avatarUrl,
                  }}
                  w={horizontalScale(90)}
                  h={horizontalScale(90)}
                  br={scale(50)}
                  bg={'$white'}
                />
              </View>
              <Pressable style={styles.editBadge} onPress={openSheet}>
                <IcPencil size={scale(16)} />
              </Pressable>
            </View>
            <View f={1} pt={verticalScale(15)} gap={scale(5)}>
              <Text color={'$white'} fontSize={scale(24)} fontWeight="bold">
                {user?.name}
              </Text>
              <Text color={'$white'} fontSize={scale(14)}>
                Mã nhân viên: {user?.employee_code}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  const renderBody = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} f={1} bg={'$bg'}>
        <View f={1} pt={verticalScale(12)} ph={horizontalScale(12)} gap={scale(10)}>
          <ItemRow label="Mã nhân viên cũ" value={user?.old_employee_code || ''} />
          <ItemRow label="Chức danh" value={user?.job_name || ''} />
          <ItemRow label="Nhóm / chi nhánh" value={user?.group_name || ''} />
          <ItemRow label="Phòng ban" value={user?.department_name || ''} />
          <ItemRow label="Khu vực" value={user?.area_category_name || ''} />
          <ItemRow label="Địa điểm làm việc" value={user?.work_location_text || ''} />
          <ItemRow label="Số điện thoại" value={user?.mobile_phone || ''} />
          <ItemRow label="Email" value={user?.work_email || ''} />
          <ItemRow label="Ngày vào" value={dayjs(user?.onboard_time).format('DD/MM/YYYY') || ''} />
          <ItemRow
            label="Ngày tiếp nhận chính thức"
            value={dayjs(user?.offical_contract_date).format('DD/MM/YYYY') || ''}
          />

          <Pressable style={styles.itemRow} onPress={() => navigate(RouteName.ChangePassword)}>
            <Text fontWeight="700">Đổi mật khẩu</Text>
            <IcRightArrow size={scale(12)} />
          </Pressable>

          {showHiddenFeatures && (
            <Pressable
              style={styles.itemRow}
              onPress={() => {
                Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xoá tài khoản?', [
                  { text: 'Hủy', style: 'cancel' },
                  {
                    text: 'Xác nhận',
                    onPress: async () => {
                      deleteAccountDialogRef.current?.open();
                    },
                  },
                ]);
              }}
            >
              <Text fontWeight="700" color={'red'}>
                Xoá tài khoản
              </Text>
            </Pressable>
          )}
        </View>

        <Button style={styles.logoutBtn} onPress={onLogout}>
          <Button.Text>Đăng xuất</Button.Text>
        </Button>
      </ScrollView>
    );
  };

  async function handleDeleteAccount(): Promise<void> {
    try {
      console.log('pwd', pwd);
      setLoading(true);
      await api.POST({
        path: '/api/models/res-users/execute/app_delete_account',
        data: {
          kwargs: {
            pass_wd: pwd,
          },
        },
      });
      deleteAccountDialogRef.current?.close();
      showToast('success', 'Xoá tài khoản thành công');
      setTimeout(() => {
        onLogout();
      }, 500);
    } catch (error: any) {
      showToast('error', error.message || 'Xảy ra lỗi khi xoá tài khoản');
      setLoading(false);
    }
  }

  return (
    <View f={1}>
      {renderHeader()}
      <View f={1} bg={'$bg'}>
        {renderBody()}
      </View>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text fontSize={scale(18)} fontWeight="700" mb={verticalScale(10)}>
            Chọn ảnh đại diện
          </Text>
          <Pressable style={styles.sheetBtn} onPress={onChooseFromLibrary}>
            <Text>Chọn từ thư viện</Text>
          </Pressable>
          <Pressable style={styles.sheetBtn} onPress={onOpenCamera}>
            <Text>Chụp ảnh</Text>
          </Pressable>
          <Pressable style={styles.sheetCancel} onPress={closeSheet}>
            <Text color={'$blue'} fontWeight="700">
              Hủy
            </Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
      <Modal ref={deleteAccountDialogRef} title="Mật khẩu hiện tại">
        <View gap={scale(16)} pv={scale(16)}>
          <Input onChangeText={setPwd} isPassword placeholder={'Nhập mật khẩu'} />
          <View fd={'row'} gap={scale(16)}>
            <Button
              style={styles.cancelButton}
              onPress={() => deleteAccountDialogRef.current?.close()}
              disabled={loading}
            >
              <Text color={'red'} fontSize={scale(18)}>
                Huỷ
              </Text>
            </Button>
            <Button
              variant="primary"
              style={{ flex: 1 }}
              onPress={handleDeleteAccount}
              disabled={!pwd.length || loading}
            >
              <Button.Text>Xác nhận xoá</Button.Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: horizontalScale(14),
    borderWidth: 1,
    borderRadius: scale(20),
    borderColor: getTokens().color.border.val,
    backgroundColor: 'white',
  },
  changePassword: {
    marginTop: verticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: scale(6),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
  },
  logoutBtn: {
    marginTop: verticalScale(10),
    marginHorizontal: horizontalScale(12),
    marginBottom: verticalScale(12),
  },
  editBadge: {
    position: 'absolute',
    right: -scale(2),
    bottom: -scale(2),
    backgroundColor: getTokens().color.white.val,
    borderRadius: scale(12),
    padding: scale(6),
  },
  sheetContent: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    gap: scale(8),
  },
  sheetBtn: {
    borderWidth: 1,
    borderColor: getTokens().color.border.val,
    borderRadius: scale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: getTokens().color.grey_blue.val,
  },
  sheetCancel: {
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  cancelButton: {
    borderColor: 'red',
    color: 'red',
    borderWidth: 1,
    borderRadius: 24,
    backgroundColor: 'transparent',
    flex: 1,
  },
});

export default User;
