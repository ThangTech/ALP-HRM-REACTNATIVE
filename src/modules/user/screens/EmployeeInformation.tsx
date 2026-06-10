import { Header } from 'components';
import { RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import React from 'react';
import { View } from 'tamagui';
import { MenuView } from 'user/components';
import { horizontalScale, scale, verticalScale } from 'utils';
import { useRoute } from '@react-navigation/native';

const EmployeeInformation = () => {
  const route = useRoute<any>();
  const employeeId: number | undefined = route?.params?.employeeId;

  const dataMenu = [
    {
      title: 'Hồ sơ cá nhân',
      onPress: () => navigate(RouteName.PersonalProfile, { employeeId }),
    },
    {
      title: 'Hồ sơ công ty',
      onPress: () => navigate(RouteName.CompanyProfile, { employeeId }),
    },
  ];
  const renderHeader = () => {
    return <Header title={'Hồ sơ nhân sự'} />;
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
    <View f={1}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default EmployeeInformation;
