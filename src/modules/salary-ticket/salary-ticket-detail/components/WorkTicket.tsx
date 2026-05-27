import Divider from 'modules/leave-registration/leave-report/components/divider';
import LineItem from 'modules/leave-registration/leave-report/components/line-item';
import React from 'react';
import { View } from 'tamagui';
import { formatCurrency, index2Roman, scale } from 'utils';
import RowTicket from './RowTicket';
import { useSalaryTicketDetailProvider } from '../provider';

const WorkTicket = () => {
  const provider = useSalaryTicketDetailProvider();
  return (
    <View br={scale(16)} bc={'$reportBorderColor'} bw={1} ph={scale(16)} mt={scale(12)}>
      <RowTicket
        title={index2Roman(1) + '. ' + 'Ngày công và tăng ca'}
        titleColor="$titleTicket"
        titleWeight="500"
        value={formatCurrency(provider.salaryTicket?.actual_negotiable_income || '0')}
      />
      <Divider />
      <LineItem label="Tổng công" value={provider.salaryTicket?.total_work || '0'} />
      <Divider />
      <LineItem label="Công chuẩn" value={provider.salaryTicket?.standard_work || '0'} />
      <Divider />
      <LineItem
        label="Tổng số giờ tăng ca thử việc"
        value={provider.salaryTicket?.trial_overtime_hours || '0'}
      />
      <Divider />
      <LineItem
        label="Tổng số giờ tăng ca chính thức"
        value={provider.salaryTicket?.official_overtime_hours || '0'}
      />
    </View>
  );
};

export default WorkTicket;
