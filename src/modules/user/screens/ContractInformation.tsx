import { Header } from 'components';
import dayjs from 'dayjs';
import useAppContext from 'hooks/useAppContext';
import api from 'hooks/api';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'tamagui';
import { ExpandableInfoCard } from 'user/components';
import { useUser } from 'user/hooks';
import { formatToVND, horizontalScale, verticalScale } from 'utils';
import { useRoute } from '@react-navigation/native';

const ContractInformation = () => {
  const route = useRoute<any>();
  const employeeId: number | undefined = route?.params?.employeeId;
  const [{ dataContract }] = useUser(employeeId);
  const { user: contextUser } = useAppContext();
  const [employeeData, setEmployeeData] = useState<any>(null);
  const user = employeeId ? employeeData : contextUser;

  useEffect(() => {
    if (!employeeId) return;
    api
      .POST({
        path: '/api/models/hr-employee/execute/get_employee_infor',
        data: { kwargs: { employee_id: employeeId } },
      })
      .then((res) => {
        if (res?.data) setEmployeeData(res.data);
      })
      .catch(console.error);
  }, [employeeId]);

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
          { label: 'Phòng ban', value: user?.department_name || '' },
          { label: 'Chức danh', value: user?.job_name || '' },
        ]}
      />
    );
  };

  const renderIncome = () => {
    const calculatedTotalAllowance =
      (dataContract?.shift_meal_allowance || 0) +
      (dataContract?.fuel_allowance || 0) +
      (dataContract?.phone_allowance || 0) +
      (dataContract?.travel_allowance || 0) +
      (dataContract?.tools_allowance || 0);

    return (
      <ExpandableInfoCard
        containerStyle={{ marginTop: verticalScale(20), marginBottom: verticalScale(50) }}
        title="Thông tin thu nhập"
        fields={[
          { label: 'Lương cơ bản', value: formatToVND(dataContract?.wage) },
          { label: 'Hỗ trợ ăn ca', value: formatToVND(dataContract?.shift_meal_allowance) },
          { label: 'Hỗ trợ xăng xe', value: formatToVND(dataContract?.fuel_allowance) },
          { label: 'Hỗ trợ điện thoại', value: formatToVND(dataContract?.phone_allowance) },
          { label: 'Hỗ trợ đi lại', value: formatToVND(dataContract?.travel_allowance) },
          { label: 'Khoán ngày', value: formatToVND(dataContract?.day_rate) },
          { label: 'Lương tỉ lệ khoán', value: formatToVND(dataContract?.fixed_rate_salary) },
          { label: 'Phụ cấp khác', value: formatToVND(dataContract?.tools_allowance) },
          { label: 'Tổng phụ cấp', value: formatToVND(calculatedTotalAllowance) },
          { label: 'Thu nhập thoả thuận', value: formatToVND(dataContract?.negotiable_income) },
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
