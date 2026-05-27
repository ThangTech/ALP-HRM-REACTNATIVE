import React from 'react';
import { GpsModel } from 'common/model/gps-model';
import { ScrollView, View } from 'tamagui';
import { Text } from 'components';
import dayjs from 'dayjs';
import { scale } from 'utils';
import IcLocation from 'assets/svgs/IcLocation';
import { Image, Linking, Pressable } from 'react-native';
import { globalStyle } from 'common/styles/base';

interface ItemGpsTrackingType {
  item: GpsModel;
}

const ItemGpsTracking = (props: ItemGpsTrackingType) => {
  return (
    <View
      mb={scale(12)}
      gap={scale(16)}
      style={globalStyle.itemShadow}
      pv={scale(12)}
      ph={scale(12)}
      bg={'white'}
      br={scale(16)}
      bc={'$divider'}
      bw={scale(1)}
    >
      <View fd={'row'}>
        <View gap={scale(2)} f={1}>
          <Text>Lý do: {props.item.reason}</Text>
          <Text>Tên địa điểm: {props.item.address_name}</Text>
          <Text>Địa chỉ chi tiết: {props.item.address_detail}</Text>
          <Text>Địa chỉ GPS: {props.item.address}</Text>
          <Text>
            Thời gian:{' '}
            {dayjs(dayjs(props.item.attendance_time, { utc: true }).toDate()).format(
              'DD/MM/YYYY HH:mm',
            )}
          </Text>
        </View>
        <View justifyContent="center" fd={'row'}>
          <Pressable
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps?q=${props.item.latitude},${props.item.longitude}`,
              )
            }
          >
            <IcLocation />
          </Pressable>
        </View>
      </View>
      <ScrollView horizontal>
        <View fd={'row'} gap={scale(12)}>
          {props.item.files?.map((file, index) => (
            <Pressable
              key={index}
              onPress={() => {
                Linking.openURL(file.download_url);
              }}
            >
              <Image
                source={{ uri: file.download_url }}
                style={{ height: scale(150), width: scale(100), borderRadius: scale(8) }}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ItemGpsTracking;
