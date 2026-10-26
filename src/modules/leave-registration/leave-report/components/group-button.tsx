import React from 'react';
import { Button, OptionItem, Text } from 'components';
import { View } from 'tamagui';
import { scale } from 'utils';

interface GroupButtonType {
  value: string;
  buttons: OptionItem[];
  onChange: (option: OptionItem) => void;
}

const GroupButton = (props: GroupButtonType) => {
  function handleChange(option: OptionItem): void {
    props.onChange(option);
  }
  return (
    <View br={scale(16)} overflow="hidden" bw={1} bc={'$secondary'}>
      {props.buttons.map((button, index) => {
        const isActivated = props.value === button.key;
        return (
          <Button
            variant="secondary"
            onPress={() => handleChange(button)}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              backgroundColor: isActivated ? '$secondary' : '$white',
              borderTopLeftRadius: index === 0 ? scale(16) : 0,
              borderBottomLeftRadius: index === 0 ? scale(16) : 0,
              borderTopRightRadius: index === props.buttons.length - 1 ? scale(16) : 0,
              borderBottomRightRadius: index === props.buttons.length - 1 ? scale(16) : 0,
            }}
          >
            <Text fontW={isActivated ? 500 : 300} color={isActivated ? '$white' : undefined}>
              {button.value}
            </Text>
          </Button>
        );
      })}
    </View>
  );
};

export default GroupButton;
