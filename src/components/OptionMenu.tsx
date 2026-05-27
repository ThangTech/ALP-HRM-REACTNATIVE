import IcEllipsisVertical from 'assets/svgs/IcEllipsisVertical';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

interface OptionMenuType {
  children?: React.ReactNode;
}

const OptionMenu = (props: OptionMenuType) => {
  if (!props.children) {
    return null;
  }
  return (
    <Menu>
      <MenuTrigger>
        <IcEllipsisVertical />
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={optionStyle.container}>{props.children}</MenuOptions>
    </Menu>
  );
};

const optionStyle = StyleSheet.create({
  container: {
    marginTop: 16,
  },
});

export default OptionMenu;
