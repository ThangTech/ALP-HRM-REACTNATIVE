import React from 'react';
import { HolidayCode } from 'common/enum/holiday-code';
import { HolidayUnit } from 'common/enum/holiday-unit';
import { Holiday } from 'common/model/leave-registration';
import { Text } from 'components';
import { useMemo } from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';
import CardContainer from 'components/CardContainer';

interface LeaveOverviewType {
  holidays: Array<Holiday>;
}

const LeaveOverview = (props: LeaveOverviewType) => {
  const overview = useMemo(() => {
    const map = new Map<HolidayCode, Holiday>();
    for (const it of props.holidays) {
      if (!it.code) {
        continue;
      }
      map.set(it.code, it);
    }
    return map;
  }, [props.holidays]);

  const getUsedDisplay = (item?: Holiday) => {
    if (item?.unit === HolidayUnit.DAYS) {
      return `${item?.used_days ?? '--'} ngày`;
    }
    return `${item?.used_hours ?? '--'} giờ`;
  };

  const getRemainingDisplay = (item?: Holiday) => {
    if (item?.unit === HolidayUnit.DAYS) {
      return `${item?.remaining_days ?? '--'} ngày`;
    }
    return `${item?.remaining_hours ?? '--'} giờ`;
  };

  const firstBlock = [
    { label: 'Nghỉ phép năm', code: HolidayCode.PAID_LEAVE },
    { label: 'Nghỉ bù OT', code: HolidayCode.COMPENSATORY_LEAVE },
  ];

  // const secondBlock = [
  //   { label: 'Nghỉ không lương', code: HolidayCode.UNPAID_LEAVE },
  //   { label: 'Nghỉ khác', code: HolidayCode.OTHER },
  // ];

  return (
    <View gap={scale(8)} mb={scale(16)}>
      <View fd={'row'} gap={scale(8)}>
        {firstBlock.map((item) => (
          <View f={1} key={item.code}>
            <CardContainer>
              <View p={scale(10)} alignItems="center" f={1}>
                <Text fontSize={scale(14)} color={'$black'}>
                  {item.label}
                </Text>
                <View fd={'row'} gap={scale(4)}>
                  <Text fontSize={scale(14)} fontWeight="bold" color={'#9F9F9F'}>
                    {'Đã dùng\nCòn lại'}
                  </Text>
                  <Text fontSize={scale(14)} color={'$detractive'} fontW={'bold'}>
                    {`${getUsedDisplay(overview.get(item.code))}\n${getRemainingDisplay(overview.get(item.code))}`}
                  </Text>
                </View>
              </View>
            </CardContainer>
          </View>
        ))}
      </View>
      {/* <View fd={'row'} gap={scale(8)}>
        {secondBlock.map((item) => (
          <View f={1} key={item.code}>
            <CardContainer>
              <View p={scale(10)} alignItems="center" f={1}>
                <Text fontSize={scale(14)} color={'$black'}>
                  {item.label}
                </Text>
                <View fd={'row'} gap={scale(4)}>
                  <Text fontSize={scale(14)} fontWeight="bold" color={'$detractive'}>
                    {'Đã dùng'}
                  </Text>
                  <Text fontSize={scale(14)} color={'$detractive'} fontW={'bold'}>
                    {`${getUsedDisplay(overview.get(item.code))}`}
                  </Text>
                </View>
              </View>
            </CardContainer>
          </View>
        ))}
      </View> */}
    </View>
  );
};

export default LeaveOverview;
