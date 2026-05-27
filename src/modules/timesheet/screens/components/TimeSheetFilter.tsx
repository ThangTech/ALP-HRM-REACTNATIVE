import { OptionItem } from 'components';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import React from 'react';
import { useTimeSheetFilter } from 'timesheet/hooks/useTimeSheetFilter';

interface TimeSheetFilterType {
  selectedEmployee?: OptionItem;
  onChange: (value: OptionItem) => void;
}

const TimeSheetFilter = (props: TimeSheetFilterType) => {
  const provider = useTimeSheetFilter();

  return (
    <>
      <OptionPicker
        value={props.selectedEmployee}
        options={provider.employeeOptions || []}
        placeholder="Chọn nhân viên"
        onChange={props.onChange}
        searchable
      />
    </>
  );
};

export default TimeSheetFilter;
