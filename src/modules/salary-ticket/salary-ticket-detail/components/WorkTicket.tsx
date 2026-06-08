import Divider from 'modules/leave-registration/leave-report/components/divider';
import LineItem from 'modules/leave-registration/leave-report/components/line-item';
import React from 'react';
import { View } from 'tamagui';
import { formatCurrency, index2Roman, scale } from 'utils';
import RowTicket from './RowTicket';
import { useSalaryTicketDetailProvider } from '../provider';

const WorkTicket = () => {
  const provider = useSalaryTicketDetailProvider();
  const ticket = provider.salaryTicket;
  return (
    <View br={scale(16)} bc={'$reportBorderColor'} bw={1} ph={scale(16)} mt={scale(12)}>
      <RowTicket
        title={index2Roman(1) + '. ' + 'Lương chức danh, công việc'}
        titleColor="$titleTicket"
        titleWeight="500"
        valueWeight="700"
        value={formatCurrency(ticket?.social_insurance_amount || '0')}
      />
      <Divider />
      <LineItem label="Tổng lương" value={formatCurrency(ticket?.total_salary || '0')} />
      <Divider />
      <LineItem label="Công quy đổi" value={ticket?.work_conversion ?? '0'} />
      <Divider />
      <LineItem label="Lương ngày công" value={formatCurrency(ticket?.lcd || '0')} />
      <Divider />
      <LineItem label="Lương KPI" value={formatCurrency(ticket?.kpi || '0')} />
      <Divider />
      <LineItem label="Lương phụ cấp" value={formatCurrency(ticket?.TPC || '0')} />
      <Divider />
      <LineItem label="Chuyên cần" value={formatCurrency(ticket?.diligence_kpi || '0')} />
      <Divider />
      <LineItem label="Truy lĩnh" value={formatCurrency(ticket?.truylinh || '0')} />
    </View>
  );
};

export default WorkTicket;
