import React from 'react';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import { View } from 'tamagui';
import { useTerminationsProvider } from '../provider';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import { scale } from 'utils';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
interface FilterTerminationsType {
  viewType?: LeaveRegistrationViewType;
}

const FilterTerminations = (props: FilterTerminationsType) => {
  const provider = useTerminationsProvider();
  const isViewApprove = props.viewType === LeaveRegistrationViewType.APPROVE;
  return (
    <View gap={scale(12)} p={scale(16)}>
      <View fd={'row'} gap={scale(16)}>
        <DatePicker
          mode="date"
          label="Từ ngày"
          valueFormat="DD/MM/YYYY"
          value={provider.state.requestDate}
          onChange={(value) =>
            provider.setState((prev) => ({ ...prev, requestDate: value, offset: 0 }))
          }
        />
        <View f={1}>
          <DatePicker
            mode="date"
            label="Đến ngày"
            valueFormat="DD/MM/YYYY"
            value={provider.state.requestDateTo}
            onChange={(value) =>
              provider.setState((prev) => ({ ...prev, requestDateTo: value, offset: 0 }))
            }
          />
        </View>
      </View>
      {isViewApprove && (
        <View fd={'row'} gap={scale(16)}>
          <View f={1}>
            <OptionPicker
              label="Nhóm/Chi nhánh"
              onChange={(value) =>
                provider.setState((prev) => ({ ...prev, group: value, offset: 0 }))
              }
              searchable
              value={provider.state.group}
              options={provider.state.groupOptions ?? []}
            />
          </View>
          <View f={1}>
            <OptionPicker
              label="Phòng ban"
              onChange={(value) =>
                provider.setState((prev) => ({ ...prev, department: value, offset: 0 }))
              }
              searchable
              value={provider.state.department}
              options={provider.state.departmentOptions ?? []}
            />
          </View>
        </View>
      )}
      <View fd={'row'} gap={scale(12)}>
        {isViewApprove && (
          <View f={1}>
            <OptionPicker
              label="Nhân viên"
              onChange={(value) =>
                provider.setState((prev) => ({ ...prev, employee: value, offset: 0 }))
              }
              searchable
              numberOfLines={1}
              value={provider.state.employee}
              options={provider.employeeOptions ?? []}
            />
          </View>
        )}
        <View f={1}>
          <OptionPicker
            label="Trạng thái"
            onChange={(value) =>
              provider.setState((prev) => ({ ...prev, status: value, offset: 0 }))
            }
            value={provider.state.status}
            options={provider.state.statusOptions ?? []}
          />
        </View>
      </View>
    </View>
  );
};

export default FilterTerminations;
