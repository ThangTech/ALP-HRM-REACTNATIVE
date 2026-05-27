import CardContainer from 'components/CardContainer';
import ReportBlock from 'modules/leave-registration/leave-report/components/report-block';
import { usePersonalReportEditorProvider } from '../provider';
import React from 'react';
import { View } from 'tamagui';
import { formatToVND, scale } from 'utils';

const SalaryCard = () => {
  const provider = usePersonalReportEditorProvider();
  const detail = provider.state.detail;
  if (!detail) {
    return null;
  }
  return (
    <CardContainer>
      <View p={scale(16)}>
        <ReportBlock
          hasExpandIcon
          defaultExpanded
          label="Cấu phần lương"
          lines={[
            {
              label: 'Lương cơ bản',
              value: `${formatToVND(detail.wage, { showSymbol: false })} đồng`,
            },
            {
              label: 'Lương hiệu suất',
              value: `${formatToVND(detail.performance_salary, { showSymbol: false })} đồng`,
            },
            {
              label: 'Hỗ trợ ăn ca',
              value: `${formatToVND(detail.shift_meal_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Hỗ trợ xăng xe',
              value: `${formatToVND(detail.fuel_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Hỗ trợ điện thoại',
              value: `${formatToVND(detail.phone_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Hỗ trợ đi lại',
              value: `${formatToVND(detail.travel_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Thưởng hiệu quả công việc',
              value: `${formatToVND(detail.performance_bonus, { showSymbol: false })} đồng`,
            },
            {
              label: 'Thu nhập thỏa thuận',
              labelWeight: 700,
              value: `${formatToVND(detail.negotiable_income, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp máy tính',
              value: `${formatToVND(detail.computer_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp CCDC khác',
              value: `${formatToVND(detail.tools_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp kiêm nhiệm',
              value: `${formatToVND(detail.concurrent_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp đặc thù',
              value: `${formatToVND(detail.special_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp thu ngân',
              value: `${formatToVND(detail.cashier_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp tăng ca',
              value: `${formatToVND(detail.overtime_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp lưu trú',
              value: `${formatToVND(detail.accommodation_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp cung đường',
              value: `${formatToVND(detail.road_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp ca đêm',
              value: `${formatToVND(detail.night_shift_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp khác 1',
              value: `${formatToVND(detail.other_one_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp khác 2',
              value: `${formatToVND(detail.other_two_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Phụ cấp khác 3',
              value: `${formatToVND(detail.other_three_allowance, { showSymbol: false })} đồng`,
            },
            {
              label: 'Tổng thu nhập',
              labelWeight: 700,
              value: `${formatToVND(detail.total_salary, { showSymbol: false })} đồng`,
            },
          ]}
        />
      </View>
    </CardContainer>
  );
};

export default SalaryCard;
