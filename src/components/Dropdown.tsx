import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable, LayoutRectangle } from 'react-native';
import { Portal } from 'react-native-portalize';
import { scale, verticalScale } from 'utils';
import { IcDropdown } from 'assets/svgs';
import { Text } from './base';

interface DropdownProps {
  options: any;
  selectedValue: any;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onSelect }) => {
  const buttonRef = useRef<View>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<LayoutRectangle | null>(null);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setPosition({ x, y: y + height, width, height });
        setIsVisible((prev) => !prev);
      });
    }
  };

  return (
    <>
      <Pressable ref={buttonRef} onPress={toggleDropdown} style={styles.btn}>
        <Text fontSize={scale(9)}>{selectedValue?.name}</Text>
        <IcDropdown />
      </Pressable>

      {isVisible && position && (
        <Portal>
          <View
            style={[styles.dropdown, { top: position.y, left: position.x, width: position.width }]}
          >
            {options?.map((option: any, index: number) => (
              <Pressable
                key={index}
                onPress={() => {
                  onSelect(option);
                  setIsVisible(false);
                }}
                style={styles.dropdownItem}
              >
                <Text fontSize={scale(9)}>{option?.name}</Text>
              </Pressable>
            ))}
          </View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scale(3),
    paddingLeft: scale(7),
    paddingRight: scale(10),
    paddingVertical: verticalScale(5),
    justifyContent: 'space-between',
    marginTop: verticalScale(5),
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: scale(5),
    elevation: 3,
    zIndex: 1000,
    paddingVertical: verticalScale(5),
    marginTop: verticalScale(25),
  },
  dropdownItem: {
    paddingLeft: scale(10),
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Dropdown;
