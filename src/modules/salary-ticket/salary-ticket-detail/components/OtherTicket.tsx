import Divider from 'modules/leave-registration/leave-report/components/divider';
import React, { Fragment } from 'react';
import { scale, index2Roman, formatCurrency } from 'utils';
import RowTicket from './RowTicket';
import { useSalaryTicketDetailProvider } from '../provider';
import { View } from 'tamagui';

const OtherTicket = () => {
  const provider = useSalaryTicketDetailProvider();
  const hasBonus = true || Number(provider.salaryTicket?.total_bonus || 0) > 0;
  const dynamicRoman = (index: number) => {
    if (index < 3) {
      return index2Roman(index);
    }
    return index2Roman(index + (hasBonus ? 1 : 0));
  };

  const blocks = [
    {
      title: index2Roman(2) + '. ' + 'Thu nhập thỏa thuận theo ngày công',
      value: formatCurrency(provider.salaryTicket?.actual_negotiable_income || '0'),
    },
    ...(hasBonus
      ? [
          {
            title: index2Roman(3) + '. ' + 'Các khoản thưởng',
            value: formatCurrency(provider.salaryTicket?.total_bonus || '0'),
          },
        ]
      : []),
    {
      title: dynamicRoman(3) + '. ' + 'Các khoản thu nhập khác',
      value: formatCurrency(provider.salaryTicket?.total_other_allowance || '0'),
    },
    {
      title: dynamicRoman(4) + '. ' + `Tổng thu nhập (${dynamicRoman(2)}+${dynamicRoman(3)})`,
      value: formatCurrency(provider.salaryTicket?.total_month_income || '0'),
    },
    {
      title: dynamicRoman(5) + '. ' + 'Tổng thu nhập tính thuế',
      value: formatCurrency(provider.salaryTicket?.tax_cal_total || '0'),
    },
    {
      title: dynamicRoman(6) + '. ' + 'Các khoản trích trừ',
      value: formatCurrency(provider.salaryTicket?.total_minus || '0'),
    },
    {
      title: dynamicRoman(7) + '. ' + `Thực nhận (${dynamicRoman(4)}-${dynamicRoman(6)})`,
      value: formatCurrency(provider.salaryTicket?.total_received || '0'),
    },
    {
      title: dynamicRoman(8) + '. ' + 'Tạm giữ lương',
      value: formatCurrency(provider.salaryTicket?.hold_salary || '0'),
    },
    {
      title: dynamicRoman(9) + '. ' + 'Thực chi',
      value: formatCurrency(provider.salaryTicket?.actual_spent || '0'),
    },
  ];

  return (
    <View br={scale(16)} bc={'$reportBorderColor'} bw={1} ph={scale(16)} mt={scale(12)}>
      {blocks.map((block, index) => (
        <Fragment key={block.title}>
          <RowTicket
            title={block.title}
            titleColor="$titleTicket"
            titleWeight="500"
            value={block.value}
          />
          {index === blocks.length - 1 ? null : <Divider />}
        </Fragment>
      ))}
    </View>
  );
};

export default OtherTicket;
