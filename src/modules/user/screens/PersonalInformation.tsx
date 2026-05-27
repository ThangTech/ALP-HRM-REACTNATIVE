import { Header, Input } from 'components';
import { ExpandableInfoCard } from '../components';
import React from 'react';
import { ScrollView, View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import useAppContext from 'hooks/useAppContext';
import dayjs from 'dayjs';

const PersonalInformation = () => {
  const { user } = useAppContext();
  const renderHeader = () => {
    return <Header title={'Thông tin cá nhân'} />;
  };

  const renderBaseInformation = () => {
    return (
      <View gap={scale(16)}>
        <Input
          label={'Ngày sinh'}
          value={dayjs(user?.birthday).format('DD/MM/YYYY')}
          readOnly
          isRequired
        />
        <Input label={'Số căn cước công dân'} value={user?.identification_id} readOnly />
        <Input label={'Nơi cấp'} value={user?.area_provide} readOnly isRequired multiline />
        <Input
          label={'Ngày cấp'}
          value={dayjs(user?.date_provide).format('DD/MM/YYYY')}
          readOnly
          isRequired
        />
        <Input label={'Email cá nhân'} value={user?.private_email} readOnly isRequired />
        <Input
          label={'Địa chỉ thường trú'}
          value={user?.place_of_birth}
          readOnly
          isRequired
          multiline
        />
        <Input label={'Địa chỉ hiện tại'} value={user?.address_now} readOnly isRequired multiline />
        <Input label={'Tình trạng hôn nhân'} value={user?.marital_label} readOnly isRequired />
        <Input
          label={'Số tài khoản ngân hàng'}
          value={user?.bank_account_name}
          readOnly
          isRequired
        />
        <Input label={'Chủ tài khoản'} value={user?.account_holder} readOnly isRequired />
        <Input label={'Tên ngân hàng'} value={user?.bank_name} readOnly isRequired />
      </View>
    );
  };

  const renderEmergencyContact = () => {
    return (
      <ExpandableInfoCard
        title="Liên hệ khẩn cấp"
        fields={[
          { label: 'Tên liên hệ', value: user?.emergency_contact || '' },
          { label: 'Mối quan hệ', value: user?.emergency_relation || '' },
          { label: 'Số điện thoại', value: user?.emergency_phone || '' },
        ]}
        containerStyle={{ marginTop: verticalScale(32) }}
      />
    );
  };

  const renderEducation = () => {
    return (
      <ExpandableInfoCard
        title="Giáo dục"
        fields={[
          { label: 'Trình độ học vấn', value: user?.certificate_employee || '' },
          { label: 'Trường đào tạo', value: user?.study_school || '' },
          { label: 'Chuyên ngành', value: user?.study_field || '' },
        ]}
        containerStyle={{ marginTop: verticalScale(32), marginBottom: verticalScale(50) }}
      />
    );
  };

  const renderChild = () => {
    if (!user?.children_ids || user.children_ids.length === 0) {
      return null;
    }

    // Tạo fields array từ children_ids
    const childrenFields = user.children_ids.flatMap((child, index) => [
      { label: `Con ${index + 1} - Họ và tên`, value: child.name || '' },
      { label: 'Ngày sinh', value: dayjs(child.birthday).format('DD/MM/YYYY') || '' },
      { label: 'Giới tính', value: child.gender || '' },
    ]);

    return (
      <ExpandableInfoCard
        title={`Thông tin con (${user.children_ids.length})`}
        fields={childrenFields}
        containerStyle={{ marginTop: verticalScale(32) }}
      />
    );
  };

  const renderBody = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} p={horizontalScale(16)}>
        {renderBaseInformation()}
        {renderEmergencyContact()}
        {renderChild()}
        {renderEducation()}
      </ScrollView>
    );
  };

  return (
    <View f={1}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default PersonalInformation;
