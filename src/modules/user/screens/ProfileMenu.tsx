import { Header } from 'components';
import { RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import React from 'react';
import { View } from 'tamagui';
import { MenuView } from 'user/components';
import { horizontalScale, scale, verticalScale } from 'utils';
import { useRoute } from '@react-navigation/native';

const ProfileMenu = () => {
  const route = useRoute<any>();
  const employeeId: number | undefined = route?.params?.employeeId;
  const employeeName: string | undefined = route?.params?.employeeName;

  const headerTitle = employeeName ?? 'Hồ sơ cơ bản';

  const dataMenu = [
    {
      title: 'Thông tin cá nhân',
      onPress: () => navigate(RouteName.PersonalInformation, { employeeId }),
    },
    {
      title: 'Thông tin công việc',
      onPress: () => navigate(RouteName.JobInformation, { employeeId }),
    },
    {
      title: 'Hồ sơ nhân sự',
      onPress: () => navigate(RouteName.EmployeeInformation, { employeeId }),
    },
    {
      title: 'Hợp đồng',
      onPress: () => navigate(RouteName.ContractInformation, { employeeId }),
    },
  ];

  const renderHeader = () => {
    return <Header title={headerTitle} />;
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
