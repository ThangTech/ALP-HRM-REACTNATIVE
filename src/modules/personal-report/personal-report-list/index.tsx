/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { View } from 'tamagui';
import { PersonalReportListProvider, usePersonalReportListProvider } from './provider';
import { FlatList, Header, Pressable } from 'components';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import ItemPersonalReport from './components/ItemPersonalReport';
import { ListRenderItemInfo } from 'react-native';
import { PersonalReport } from 'common/model/personal-report';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { scale } from 'utils';
import { navigate } from 'navigators';
import { IcPlus } from 'assets/svgs';

type PersonalReportListProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.PersonalReportList
>;

function PersonalReportListPage(props: PersonalReportListProps) {
  return (
    <PersonalReportListProvider>
      <ViewPage {...props} />
    </PersonalReportListProvider>
  );
}

function ViewPage(props: PersonalReportListProps) {
  const provider = usePersonalReportListProvider();
  const viewType = props.route.params?.viewType ?? LeaveRegistrationViewType.ME;

  useEffect(() => {
    provider.setState((prev) => ({
      ...prev,
      viewType: viewType,
      approveStaffTransfer: viewType === LeaveRegistrationViewType.APPROVE,
    }));
  }, [viewType]);

  useFocusEffect(
    useCallback(
      () => provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() })),
      [],
    ),
  );

  function _renderItem(info: ListRenderItemInfo<PersonalReport>) {
    return <ItemPersonalReport item={info.item} viewType={viewType} />;
  }

  return (
    <View f={1}>
      <Header
        title={'Tờ trình HCNS'}
        rightAction={
          <Pressable onPress={() => navigate(RouteName.PersonalReportEditor)}>
            <IcPlus tintColor="white" size={scale(25)} />
          </Pressable>
        }
      />
      <View f={1} p={scale(16)} gap={scale(16)}>
        <OptionPicker
          value={provider.state.type}
          options={provider.state.reportOptions ?? []}
          onChange={(value) => provider.setState((prev) => ({ ...prev, type: value, offset: 0 }))}
          placeholder={'Chọn loại tờ trình HCNS'}
        />
        {provider.state.type && (
          <OptionPicker
            label="Trạng thái"
            onChange={(value) =>
              provider.setState((prev) => ({ ...prev, state: value, offset: 0 }))
            }
            value={provider.state.state}
            options={provider.mapStatus ?? []}
          />
        )}
        <FlatList
          data={provider.state.personalReports}
          renderItem={_renderItem}
          onRefresh={() =>
            provider.setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() }))
          }
          keyExtractor={(item) => `${item.id}`}
          refreshing={false}
          onLoadMore={() =>
            provider.setState((prev) => ({ ...prev, offset: prev.personalReports?.length ?? 0 }))
          }
        />
      </View>
    </View>
  );
}

export default PersonalReportListPage;
