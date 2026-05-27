import React from 'react';
import { Text } from 'components';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';

const TimeInterval = () => {
  const [time, setTime] = useState<dayjs.Dayjs>(dayjs());
  const ref = useRef<any>(null);

  const dayOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  useEffect(() => {
    if (ref.current) {
      clearInterval(ref.current);
    }
    ref.current = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
      }
    };
  }, []);
  return (
    <View gap={scale(10)}>
      <Text justifyContent="center" fontSize={scale(16)} textAlign="center">
        {dayOfWeek[time?.day()]}, ngày {time.format('DD/MM/YYYY')}
      </Text>
      <Text fontSize={scale(32)} textAlign="center">
        {time.format('HH:mm')}
      </Text>
    </View>
  );
};

export default TimeInterval;
