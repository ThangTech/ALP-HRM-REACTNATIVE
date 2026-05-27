import React from 'react';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import { View } from 'tamagui';
import { useOverTimesProvider } from '../provider';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import { scale } from 'utils';
import { WAITING_ME } from 'configs/contansts';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';

const OverTimeFilter = () => {
  const provider = useOverTimesProvider();
  return (
    <>
      <View fd={'row'} gap={scale(16)}>
        <DatePicker
          label="Từ"
          value={provider.state.from}
          mode="date"
          valueFormat="DD/MM/YYYY"
          onChange={(value) => provider.setState((prev) => ({ ...prev, from: value, offset: 0 }))}
        />
        <DatePicker
          label="Đến"
          value={provider.state.to}
          mode="date"
          valueFormat="DD/MM/YYYY"
          onChange={(value) => provider.setState((prev) => ({ ...prev, to: value, offset: 0 }))}
        />
      </View>
      <View fd={'row'} gap={scale(16)}>
        {provider.state.viewType === LeaveRegistrationViewType.APPROVE && (
          <View flex={1}>
            <OptionPicker
              label="Nhân viên"
              placeholder="Chọn nhân viên"
              searchable
              onChange={(item) =>
                provider.setState((prev) => ({ ...prev, employee: item, offset: 0 }))
              }
              value={provider.state.employee}
              options={provider.employeeOptions ?? []}
            />
          </View>
        )}
        <View flex={1}>
          <OptionPicker
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            onChange={(item) => provider.setState((prev) => ({ ...prev, state: item, offset: 0 }))}
            value={provider.state.state}
            options={
              provider.state.viewType === LeaveRegistrationViewType.ME
                ? (provider.state.stateOptions ?? []).filter((it) => it.key !== WAITING_ME)
                : (provider.state.stateOptions ?? [])
            }
          />
        </View>
      </View>
    </>
  );
};

export default OverTimeFilter;
