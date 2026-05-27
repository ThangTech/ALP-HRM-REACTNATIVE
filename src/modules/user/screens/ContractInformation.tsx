import { Header } from 'components';
import dayjs from 'dayjs';
import React from 'react';
import { ScrollView, View } from 'tamagui';
import { ExpandableInfoCard } from 'user/components';
import { useUser } from 'user/hooks';
import { formatToVND, horizontalScale, verticalScale } from 'utils';

const ContractInformation = () => {
  const [{ dataContract }] = useUser();

  const renderHeader = () => {
    return <Header title={'Hợp đồng'} />;
  };

  const renderContract = () => {
    return (
      <ExpandableInfoCard
        title="Thông tin hợp đồng"
        fields={[
          { label: 'Loại hợp đồng', value: dataContract?.contract_type_name || '' },
          {
            label: 'Ngày bắt đầu hợp đồng',
            value: dataContract?.date_start
              ? dayjs(dataContract?.date_start).format('DD/MM/YYYY')
              : '',
          },
          { label: 'Thời hạn hợp đồng', value: dataContract?.time_contract || '' },
          {
            label: 'Ngày hết hạn hợp đồng',
            value: dataContract?.date_end ? dayjs(dataContract?.date_end).format('DD/MM/YYYY') : '',
          },
        ]}
      />
    );
  };

  const renderIncome = () => {
    return (
      <ExpandableInfoCard
        containerStyle={{ marginTop: verticalScale(20), marginBottom: verticalScale(50) }}
        title="Thông tin thu nhập"
        fields={[
          { label: 'Lương cơ bản', value: formatToVND(dataContract?.wage) },
          { label: 'Lương hiệu suất', value: formatToVND(dataContract?.performance_salary) },
          { label: 'Hỗ trợ ăn ca', value: formatToVND(dataContract?.shift_meal_allowance) },
          { label: 'Hỗ trợ xăng xe', value: formatToVND(dataContract?.fuel_allowance) },
          { label: 'Hỗ trợ điện thoại', value: formatToVND(dataContract?.phone_allowance) },
          { label: 'Hỗ trợ đi lại', value: formatToVND(dataContract?.travel_allowance) },
          {
            label: 'Thưởng hiệu quả công việc',
            value: formatToVND(dataContract?.performance_bonus),
          },
          { label: 'Thu nhập thỏa thuận', value: formatToVND(dataContract?.negotiable_income) },
          { label: 'Phụ cấp máy tính', value: formatToVND(dataContract?.computer_allowance) },
          { label: 'Phụ cấp CCDC khác', value: formatToVND(dataContract?.tools_allowance) },
          { label: 'Phụ cấp kiêm nhiệm', value: formatToVND(dataContract?.concurrent_allowance) },
          { label: 'Phụ cấp đặc thù', value: formatToVND(dataContract?.special_allowance) },
          { label: 'Phụ cấp thu ngân', value: formatToVND(dataContract?.cashier_allowance) },
          { label: 'Phụ cấp tăng ca', value: formatToVND(dataContract?.overtime_allowance) },
          { label: 'Phụ cấp lưu trú', value: formatToVND(dataContract?.accommodation_allowance) },
          { label: 'Phụ cấp cung đường', value: formatToVND(dataContract?.road_allowance) },
          { label: 'Phụ cấp ca đêm', value: formatToVND(dataContract?.nigth_shift_allowance) },
          { label: 'Phụ cấp khác 1', value: formatToVND(dataContract?.other_one_allowance) },
          { label: 'Phụ cấp khác 2', value: formatToVND(dataContract?.other_two_allowance) },
          { label: 'Phụ cấp khác 3', value: formatToVND(dataContract?.other_three_allowance) },
          {
            label: 'Tổng thu nhập',
            value: formatToVND(dataContract?.total_salary),
            isImportant: true,
          },
        ]}
      />
    );
  };

  const renderBody = () => {
    return (
      <ScrollView
        ph={horizontalScale(16)}
        showsVerticalScrollIndicator={false}
        pt={verticalScale(20)}
      >
        {renderContract()}
        {renderIncome()}
      </ScrollView>
    );
  };

  return (
    <View f={1}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default ContractInformation;
