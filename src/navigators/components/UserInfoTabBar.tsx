import { Dropdown, Text } from 'components';
import useAppContext from 'hooks/useAppContext';
import React from 'react';
import { Image, View } from 'tamagui';
import { scale } from 'utils';

const UserInfoTabBar = () => {
  const { user, setUser, setFactory } = useAppContext();

  const onChangeCompany = (company: any) => {
    if (!user) {
      return;
    }
    // console.log(company);
    setUser({ ...user, company: company });
    setFactory(company?.is_veston ? 'veston' : 'somi');
  };

  return (
    <View alignItems="center">
      <Image
        width={scale(90)}
        height={scale(90)}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
        }}
      />

      <View pt={scale(5)} justifyContent="center" alignItems="center" gap={scale(10)}>
        <Text fontSize={scale(13)} color={'$white'} tx={user?.name} />
        <Text fontSize={scale(10)} color={'$white'} tx={`ID: ${user?.id}`} />
        <Dropdown
          options={user?.companyList}
          selectedValue={user?.company ?? user?.companyList?.[0]}
          onSelect={onChangeCompany}
        />
      </View>
    </View>
  );
};

export default UserInfoTabBar;
