import { Images } from 'assets';
import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { SuggestionModel } from 'common/model/suggestion-model';
import { globalStyle } from 'common/styles/base';
import { Text } from 'components';
import { SUGGESTION_BG_COLOR, SUGGESTION_TEXT, SUGGESTION_TEXT_COLOR } from 'configs/contansts';
import { RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import { navigate } from 'navigators';
import React from 'react';
import { Image, Pressable } from 'react-native';
import { View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';

interface ItemSuggestionType {
  item: SuggestionModel;
  viewType?: SuggestionViewType;
}

const ItemSuggestion = (props: ItemSuggestionType) => {
  return (
    <Pressable
      onPress={() =>
        navigate(RouteName.Suggestion, {
          id: props.item.id,
          viewType: props.viewType,
        })
      }
    >
      <View
        style={globalStyle.itemShadow}
        pv={scale(12)}
        ph={scale(16)}
        mb={12}
        borderRadius={scale(16)}
        fd={'row'}
        gap={scale(8)}
        bg={'white'}
        ai={'center'}
      >
        <Image source={Images.ic_gop_y} style={{ width: scale(32), height: scale(32) }} />
        <View f={1}>
          <Text fontSize={scale(14)} fontWeight={600}>
            {props.item.name}
          </Text>
          <Text fontSize={scale(12)} color="$d_light">
            {dayjs(props.item.create_date).format('DD/MM/YYYY')}
          </Text>
        </View>
        <View>
          <Text
            ph={horizontalScale(8)}
            pv={verticalScale(1)}
            borderRadius={scale(4)}
            fontSize={scale(12)}
            fontWeight="500"
            bg={SUGGESTION_BG_COLOR.get(props.item.stage_code)}
            color={SUGGESTION_TEXT_COLOR.get(props.item.stage_code)}
          >
            {SUGGESTION_TEXT.get(props.item.stage_code)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemSuggestion;
