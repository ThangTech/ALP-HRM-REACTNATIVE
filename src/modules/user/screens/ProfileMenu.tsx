import { Header } from 'components';
import { RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import React from 'react';
import { View } from 'tamagui';
import { MenuView } from 'user/components';
import { horizontalScale, scale, verticalScale } from 'utils';

const ProfileMenu = () => {
  const dataMenu = [
    {
      title: 'Thông tin cá nhân',
      onPress: () => navigate(RouteName.PersonalInformation),
    },
    {
      title: 'Thông tin công việc',
      onPress: () => navigate(RouteName.JobInformation),
    },
    {
      title: 'Hồ sơ nhân sự',
      onPress: () => navigate(RouteName.EmployeeInformation),
    },
    {
      title: 'Hợp đồng',
      onPress: () => navigate(RouteName.ContractInformation),
    },
  ];
  const renderHeader = () => {
    return <Header title={'Hồ sơ cơ bản'} />;
  };

  const renderBody = () => {
    return (
      <View f={1} ph={horizontalScale(10)} pv={verticalScale(20)} gap={scale(15)}>
        {dataMenu.map((item) => (
          <MenuView key={item.title} title={item.title} onPress={item.onPress} />
        ))}
      </View>
    );
  };
  return (
    <View f={1} bg={'$background'}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default ProfileMenu;
