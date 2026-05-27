import React from 'react';
import { ScrollView, View } from 'tamagui';
import { TimesheetFilterProvider, useTimesheetFilterProvider } from './provider';
import { Button, Header } from 'components';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import { scale } from 'utils';
import { useSafeArea } from 'hooks';

function TimesheetFilterPage() {
  return (
    <TimesheetFilterProvider>
      <ViewPage />
    </TimesheetFilterProvider>
  );
}

function ViewPage() {
  const safeArea = useSafeArea();
  const provider = useTimesheetFilterProvider();
  return (
    <View f={1}>
      <Header title={'Bảng công nhân viên'} />
      <ScrollView f={1}>
        <View gap={scale(16)} p={scale(16)}>
          <OptionPicker
            label="Nhân viên"
            placeholder="Chọn nhân viên"
            value={provider.state.employee}
            options={[]}
            onChange={(value) => provider.setState((prev) => ({ ...prev, employee: value }))}
          />
          <OptionPicker
            label="Chức danh"
            placeholder="Chức danh"
            value={provider.state.employee}
            options={[]}
            disabled
            onChange={(_) => {}}
          />
          <OptionPicker
            label="Nhóm/ Chi nhánh"
            placeholder="Nhóm/ Chi nhánh"
            value={provider.state.group}
            options={[]}
            disabled
            onChange={(_) => {}}
          />
          <OptionPicker
            label="Phòng ban"
            placeholder="Phòng ban"
            value={provider.state.group}
            options={[]}
            disabled
            onChange={(_) => {}}
          />
          <OptionPicker
            label="Khu vực"
            placeholder="Khu vực"
            value={provider.state.group}
            options={[]}
            disabled
            onChange={(_) => {}}
          />
          <OptionPicker
            label="Nhân viên quản lý trực tiếp"
            placeholder="Nhân viên quản lý trực tiếp"
            value={provider.state.group}
            options={[]}
            disabled
            onChange={(_) => {}}
          />
        </View>
      </ScrollView>
      <View
        fd={'row'}
        bg={'$white'}
        gap={scale(16)}
        pt={scale(12)}
        pb={scale(12) + safeArea.bottom}
        ph={scale(16)}
      >
        <View f={1}>
          <Button variant="detractive">
            <Button.Text variant="detractive">Xoá bộ lọc</Button.Text>
          </Button>
        </View>
        <View f={1}>
          <Button variant="primary">
            <Button.Text variant="primary">Áp dụng</Button.Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default TimesheetFilterPage;
