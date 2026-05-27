import React from 'react';
import { LeaveReportDetailProvider } from './provider';
import { ScrollView, View } from 'tamagui';
import { Button, Text } from 'components';
import { globalStyle } from 'common/styles/base';
import { scale } from 'utils';
import Divider from '../components/divider';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import IcRightArrow from 'assets/svgs/IcRightArrow';
import ReportBlock from '../components/report-block';

function LeaveReportDetailPage() {
  return (
    <LeaveReportDetailProvider>
      <ViewPage />
    </LeaveReportDetailProvider>
  );
}

function ViewPage() {
  return (
    <View>
      <ScrollView>
        <View p={scale(16)} gap={scale(16)}>
          <View
            gap={scale(16)}
            ph={scale(16)}
            pv={scale(20)}
            bg={'$white'}
            br={scale(16)}
            style={globalStyle.itemShadow}
            bc={'$reportBorderColor'}
            bw={1}
          >
            <Text>Kiểm tra số ngày phép / Số ngày nghỉ bù phát sinh/ Đã sử dụng</Text>
            <Divider />
            <View fd={'row'} gap={scale(10)}>
              <DatePicker label="Từ ngày" onChange={(_value) => {}} />
              <DatePicker label="Đến ngày" onChange={(_value) => {}} />
            </View>
            <Button variant="primary">
              <Button.Text variant="primary">Tìm kiếm</Button.Text>
            </Button>
          </View>
          <View
            gap={scale(16)}
            ph={scale(16)}
            pv={scale(20)}
            bg={'$white'}
            br={scale(16)}
            style={globalStyle.itemShadow}
            bc={'$reportBorderColor'}
            bw={1}
          >
            <View fd={'row'}>
              <Text f={1}>Ngày phép năm</Text>
              <View style={{ rotate: '-90deg', height: scale(24) }}>
                <IcRightArrow size={scale(10)} />
              </View>
            </View>
            <Divider />
            <Text fontW={700}>06/2025</Text>
            <ReportBlock
              lines={[
                { label: 'Số ngày phép phát sinh', value: '20' },
                {
                  label: 'Số ngày phép đã sử dụng',
                  value: '00',
                },
                { label: 'Ngày sử dụng', value: '00' },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default LeaveReportDetailPage;
