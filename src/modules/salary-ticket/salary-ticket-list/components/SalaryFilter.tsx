import React from 'react';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import { View } from 'tamagui';
import { useSalaryTicketListProvider } from '../provider';
import { scale } from 'utils';

const SalaryFilter = () => {
  const provider = useSalaryTicketListProvider();

  return (
    <View fd={'row'} gap={scale(12)}>
      <DatePicker
        label="Từ tháng"
        placeholder="Chọn tháng"
        valueFormat="MM/YYYY"
        mode="yearAndMonth"
        value={provider.state.dateFrom}
        onChange={(value) => provider.setState((prev) => ({ ...prev, dateFrom: value, offset: 0 }))}
      />
      <DatePicker
        label="Đến tháng"
        placeholder="Chọn tháng"
        valueFormat="MM/YYYY"
        mode="yearAndMonth"
        value={provider.state.dateTo}
        onChange={(value) => provider.setState((prev) => ({ ...prev, dateTo: value, offset: 0 }))}
      />
    </View>
  );
};

export default SalaryFilter;
