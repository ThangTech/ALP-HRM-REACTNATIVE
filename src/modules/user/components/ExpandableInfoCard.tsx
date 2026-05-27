import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import { IcDropdown } from 'assets/svgs';

export interface InfoField {
  label: string;
  value: string | number;
  isImportant?: boolean;
}

interface ExpandableInfoCardProps {
  title: string;
  fields: InfoField[];
  defaultExpanded?: boolean;
  containerStyle?: any;
}

const ExpandableInfoCard: React.FC<ExpandableInfoCardProps> = ({
  title,
  fields,
  defaultExpanded = true,
  containerStyle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View
      bg="$white"
      borderRadius={scale(25)}
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 2 }}
      shadowRadius={8}
      shadowOpacity={0.1}
      elevationAndroid={3}
      overflow="hidden"
      style={containerStyle}
    >
      {/* Header với title và icon expand/collapse */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={[
          styles.headerTouchable,
          {
            paddingHorizontal: horizontalScale(16),
            paddingVertical: verticalScale(16),
          },
        ]}
      >
        <Text fontSize={scale(18)} fontWeight="600" color="$black">
          {title}
        </Text>
        <View
          style={[
            styles.dropdownIcon,
            {
              transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
            },
          ]}
        >
          <IcDropdown />
        </View>
      </TouchableOpacity>

      {/* Content - chỉ hiển thị khi expanded */}
      {isExpanded && (
        <View>
          {fields.map((field, index) => (
            <View
              key={index}
              style={[
                index === fields.length - 1 ? styles.rowContainer : styles.rowWithBorder,
                {
                  paddingHorizontal: horizontalScale(16),
                  paddingVertical: verticalScale(12),
                },
              ]}
            >
              <Text
                fontSize={scale(16)}
                color="$black"
                fontWeight={field.isImportant ? 'bold' : '400'}
              >
                {field.label}
              </Text>
              <Text
                fontSize={scale(16)}
                fontWeight={field.isImportant ? 'bold' : '600'}
                color="$black"
              >
                {field.value}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownIcon: {
    transform: [{ rotate: '0deg' }],
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowWithBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default ExpandableInfoCard;
