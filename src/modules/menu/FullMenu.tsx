import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Images } from 'assets';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { Header, OptionItem } from 'components';
import OptionPickerModal2 from 'components/base/OptionPickerModal2';
import { RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import React, { useRef } from 'react';
import { ScrollView, View } from 'tamagui';
import { scale } from 'utils';
import MenuItem from './components/MenuItem';

export interface MenuItemType {
  icon: number;
  label: string;
  onPress: () => void;
}

const FullMenu = () => {
  const terminationOptionRef = useRef<BottomSheetModal>(null);
  const personalReportOptionRef = useRef<BottomSheetModal>(null);
  const items: Array<MenuItemType> = [
    // {icon: Images.user, label: 'Hồ sơ nhân sự', onPress: () => {}},
    // {icon: Images.work_process, label: 'Quá trình làm việc', onPress: () => {}},
    // {icon: Images.performance_evaluation, label: 'Đánh giá nhân sự', onPress: () => {}},
    {
      icon: Images.termination_management,
      label: 'Khen thưởng/Kỷ luật',
      onPress: () => {
        navigate(RouteName.DisciplineList);
      },
    },
    // {icon: Images.benefit_and_insurance, label: 'Chế đ�� phúc l��i, Bảo hiểm', onPress: () => {}},
    // {icon: Images.salary_sheet, label: 'Bảng công', onPress: () => {}},
    // {icon: Images.work_shift, label: 'Giải trình công', onPress: () => {}},
    // {icon: Images.overtime, label: 'OT', onPress: () => {}},
    {
      icon: Images.termination_management,
      label: 'Quản lý OT',
      onPress: () => {
        navigate(RouteName.Overtimes);
      },
    },
    {
      icon: Images.termination_management,
      label: 'Tờ trình HCNS',
      onPress: () => {
        personalReportOptionRef.current?.present();
      },
    },
    // {icon: Images.register_work, label: 'Đăng ký công tác', onPress: () => {}},
    // {icon: Images.salary_sheet, label: 'Phiếu lương', onPress: () => {}},
    {
      icon: Images.termination_management,
      label: 'Bảo hiểm',
      onPress: () => {
        navigate(RouteName.InsuranceMenu);
      },
    },
    {
      icon: Images.termination_management,
      label: 'Quản lý nghỉ việc',
      onPress: () => {
        terminationOptionRef.current?.present();
      },
    },
  ];
  function onTerminationOptionSelected(item: OptionItem): void {
    if (item.key === 1) {
      navigate(RouteName.Terminations, { viewType: LeaveRegistrationViewType.ME });
    }
    if (item.key === 2) {
      navigate(RouteName.Terminations, { viewType: LeaveRegistrationViewType.APPROVE });
    }
  }

  function onOptionSelected(item: OptionItem): void {
    const viewType =
      item.key === 1 ? LeaveRegistrationViewType.ME : LeaveRegistrationViewType.APPROVE;
    navigate(RouteName.PersonalReportList, { viewType });
  }

  return (
    <View f={1}>
      <Header title={'Nhân sự'} />
      <ScrollView f={1}>
        <View p={scale(16)} gap={scale(16)}>
          {items.map((item, _) => (
            <MenuItem item={item} key={item.label} />
          ))}
        </View>
      </ScrollView>
      <OptionPickerModal2
        bottomSheetRef={terminationOptionRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
          // { value: 'Nghỉ phép / Nghỉ bù', key: 3 },
        ]}
        onSelect={onTerminationOptionSelected}
      />
      <OptionPickerModal2
        bottomSheetRef={personalReportOptionRef}
        data={[
          { value: 'Danh sách của tôi', key: 1 },
          { value: 'Danh sách phê duyệt', key: 2 },
          // { value: 'Nghỉ phép / Nghỉ bù', key: 3 },
        ]}
        onSelect={onOptionSelected}
      />
    </View>
  );
};

export default FullMenu;
