import React, { useRef } from 'react';
import { Modal } from 'components';
import { ScrollView, View } from 'tamagui';
import { LeaveReportProvider } from './provider';
import { scale } from 'utils';
import Divider from './components/divider';
import LineItem from './components/line-item';
import ReportBlock from './components/report-block';
import LeaveReportDetail from './leave-report-detail';
import { BaseModalRef } from 'components/base/Modal';
import { globalStyle } from 'common/styles/base';

function LeaveReportPage() {
  return (
    <LeaveReportProvider>
      <ViewPage />
    </LeaveReportProvider>
  );
}

function ViewPage() {
  // const provider = useLeaveReportProvider();
  const dialogRef = useRef<BaseModalRef>(null);

  return (
    <View>
      <ScrollView>
        <View p={scale(16)}>
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
            <ReportBlock
              label="Ngày phép tồn năm trước"
              lines={[
                { dotColor: '$grey', label: 'Nghỉ phép', value: '20' },
                {
                  dotColor: '$orange',
                  labelColor: '$orange',
                  valueColor: '$orange',
                  label: 'Nghỉ bù',
                  value: '00',
                },
                { dotColor: '$expiry', label: 'Hạn sử dụng', valueColor: '$expiry', value: '00' },
              ]}
            />
            <Divider />
            <ReportBlock
              label="Ngày phép năm nay"
              lines={[
                { dotColor: '$grey', label: 'Đã sử dụng', value: '20' },
                {
                  dotColor: '$blue3',
                  labelColor: '$blue3',
                  valueColor: '$blue3',
                  label: 'Còn được sử dụng',
                  value: '00',
                },
                {
                  dotColor: '$expiry',
                  valueColor: '$expiry',
                  label: 'Hạn sử dụng',
                  value: '31/03/2026',
                },
              ]}
            />
            <Divider />
            <View borderWidth={1} bc={'$reportBorderColor'} br={scale(16)} ph={scale(16)}>
              <LineItem
                label="Tổng số ngày phép còn được sử dụng: "
                value="10"
                valueColor="$orange"
              />
              <Divider />
              <LineItem
                label="Tổng số ngày phép chưa được phê duyệt: "
                value="10"
                valueColor="$expiry"
              />
            </View>
            {/* <Button variant="secondary" onPress={dialogRef.current?.open}>
              <Button.Text variant='secondary'>Xem chi tiết</Button.Text>
            </Button> */}
          </View>
          <View
            mt={scale(16)}
            gap={scale(16)}
            ph={scale(16)}
            pv={scale(20)}
            bg={'$white'}
            br={scale(16)}
            style={globalStyle.itemShadow}
            bc={'$reportBorderColor'}
            bw={1}
          >
            <ReportBlock
              label="Giờ bù tồn năm trước"
              lines={[
                { dotColor: '$grey', label: 'Đã sử dụng', value: '8' },
                {
                  dotColor: '$orange',
                  labelColor: '$orange',
                  valueColor: '$orange',
                  label: 'Còn được sử dụng',
                  value: '8',
                },
                { dotColor: '$expiry', label: 'Hạn sử dụng', value: '8' },
              ]}
            />
            <Divider />
            <ReportBlock
              label="Giờ bù tồn năm nay"
              lines={[
                { dotColor: '$grey', label: 'Đã sử dụng', value: '8' },
                {
                  dotColor: '$blue3',
                  labelColor: '$blue3',
                  valueColor: '$blue3',
                  label: 'Còn được sử dụng',
                  value: '8',
                },
                { dotColor: '$expiry', label: 'Hạn sử dụng', value: '8' },
              ]}
            />
          </View>
        </View>
      </ScrollView>
      <Modal ref={dialogRef}>
        <LeaveReportDetail onClose={dialogRef.current?.close} />
      </Modal>
    </View>
  );
}

export default LeaveReportPage;
