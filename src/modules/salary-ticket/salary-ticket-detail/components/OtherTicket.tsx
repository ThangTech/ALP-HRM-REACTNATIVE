import Divider from 'modules/leave-registration/leave-report/components/divider';
import LineItem from 'modules/leave-registration/leave-report/components/line-item';
import React from 'react';
import { scale, index2Roman, formatCurrency } from 'utils';
import RowTicket from './RowTicket';
import { useSalaryTicketDetailProvider } from '../provider';
import { View } from 'tamagui';

const OtherTicket = () => {
  const provider = useSalaryTicketDetailProvider();
  const ticket = provider.salaryTicket;

  return (
    <View br={scale(16)} bc={'$reportBorderColor'} bw={1} ph={scale(16)} mt={scale(12)}>
      <RowTicket
        title={index2Roman(2) + '. ' + 'Tổng tiền lương'}
        titleColor="$titleTicket"
        titleWeight="500"
        valueWeight="700"
        value={formatCurrency(ticket?.real_total_salary || '0')}
      />
      <Divider />
      <RowTicket
        title={index2Roman(3) + '. ' + 'Tổng các khoản trừ'}
        titleColor="$red500"
        titleWeight="500"
        valueWeight="700"
        value={formatCurrency(ticket?.total_minus || '0')}
      />
      <Divider />
      <LineItem label="Truy thu" value={formatCurrency(ticket?.truythu || '0')} />
      <Divider />
      <LineItem label="Bảo hiểm xã hội 10,5%" value={formatCurrency(ticket?.bhxh || '0')} />
      <Divider />
      <LineItem label="Thuế thu nhập cá nhân" value={formatCurrency(ticket?.tncn || '0')} />
      <Divider />
      <LineItem label="Đoàn phí" value={formatCurrency(ticket?.doanphi || '0')} />
      <Divider />
      <RowTicket
        title={index2Roman(5) + '. ' + 'Lương thực nhận'}
        titleColor="$titleTicket"
        titleWeight="500"
        valueWeight="700"
        value={formatCurrency(ticket?.total_received || '0')}
      />
    </View>
  );
};

export default OtherTicket;
