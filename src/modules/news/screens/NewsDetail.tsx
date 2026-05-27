import RenderHtml from '@native-html/render';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Header, Text } from 'components';
import { AppStackParamList, RouteName } from 'configs/navigation';
import React from 'react';
import { Dimensions, Image, useWindowDimensions } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { scale, verticalScale } from 'utils';

const win = Dimensions.get('window');
type NewsDetailRouteProp = RouteProp<AppStackParamList, RouteName.NewsDetail>;

const NewsDetail = () => {
  const route = useRoute<NewsDetailRouteProp>();
  const { title, content, image } = route.params || {};
  const { width } = useWindowDimensions();

  return (
    <View f={1}>
      <Header title="Tin tức" />
      <ScrollView f={1} m={0}>
        <View bg={'white'} p={scale(16)}>
          {!!title && (
            <Text fontSize={scale(20)} fontWeight="700">
              {title}
            </Text>
          )}
          {!!image && (
            <View mb={verticalScale(16)}>
              <Image
                source={{ uri: image }}
                style={{ width: win.width - scale(32), height: win.width * 0.6 }}
                resizeMode="stretch"
              />
            </View>
          )}

          <RenderHtml
            contentWidth={width}
            source={{ html: content || '<p>Không có nội dung</p>' }}
            tagsStyles={{
              img: { width: '100%', height: 'auto' },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default NewsDetail;
