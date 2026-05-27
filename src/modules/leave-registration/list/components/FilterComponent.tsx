import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { View } from 'tamagui';
import DatePicker from './DatePicker';
import React from 'react';
import OptionPicker from './OptionPicker';
import { scale } from 'utils';
import { useLeaveRegistrationsProvider } from '../provider';
import { WAITING_ME } from 'configs/contansts';

interface FilterComponentType {
  viewType?: LeaveRegistrationViewType;
}

const FilterComponent = (props: FilterComponentType) => {
  const provider = useLeaveRegistrationsProvider();

  return (
    <>
      <View gap={scale(10)} fd={'row'}>
        <DatePicker
          label="Từ"
          value={provider.state.fromDate}
          onChange={(value) =>
            provider.setState((prev) => ({ ...prev, fromDate: value, offset: 0 }))
          }
        />
        <DatePicker
          label="Đến"
          value={provider.state.toDate}
          onChange={(value) => provider.setState((prev) => ({ ...prev, toDate: value, offset: 0 }))}
        />
      </View>
      <View fd={'row'} gap={scale(12)}>
        {props.viewType === LeaveRegistrationViewType.APPROVE && (
          <View mt={scale(12)} f={1}>
            <OptionPicker
              value={provider.state.employee}
              label="Nhân viên"
              placeholder="Tất cả"
              numberOfLines={1}
              searchable
              options={provider.employeeOptions ?? []}
              onChange={(item) =>
                provider.setState((prev) => ({ ...prev, employee: item, offset: 0 }))
              }
            />
          </View>
        )}
        <View mt={scale(12)} f={1}>
          <OptionPicker
            value={provider.state.status}
            label="Trạng thái"
            options={
              props.viewType === LeaveRegistrationViewType.ME
                ? provider.statusMap.filter((it) => it.key !== WAITING_ME)
                : provider.statusMap
            }
            onChange={(item) => provider.setState((prev) => ({ ...prev, status: item, offset: 0 }))}
          />
        </View>
      </View>
    </>
  );
};

export default FilterComponent;
