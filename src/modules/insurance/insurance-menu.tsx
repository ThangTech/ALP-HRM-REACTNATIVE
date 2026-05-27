import { Images } from 'assets';
import { InsuranceType } from 'common/enum/insurance-type';
import { Header } from 'components';
import { RouteName } from 'configs/navigation';
import MenuItem from 'modules/menu/components/MenuItem';
import { MenuItemType } from 'modules/menu/FullMenu';
import { navigate } from 'navigators';
import React from 'react';
import { ScrollView, View } from 'tamagui';
import { scale } from 'utils';

const InsuranceMenu = () => {
  const items: Array<MenuItemType> = [
    {
      icon: Images.social_insurance,
      label: 'Bảo hiểm xã hội',
      onPress: () => {
        navigate(RouteName.InsuranceDetailPage, { type: InsuranceType.SOCIAL });
      },
    },
    {
      icon: Images.healthy_insurance,
      label: 'Bảo hiểm sức khoẻ',
      onPress: () => {
        navigate(RouteName.InsuranceDetailPage, { type: InsuranceType.HEALTH });
      },
    },
  ];

  return (
    <View f={1}>
      <Header title={'Bảo hiểm'} />
      <ScrollView f={1}>
        <View p={scale(16)} gap={scale(16)}>
          {items.map((item, _) => (
            <MenuItem item={item} key={item.label} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default InsuranceMenu;
