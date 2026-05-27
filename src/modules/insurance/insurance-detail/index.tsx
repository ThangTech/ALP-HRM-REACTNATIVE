import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { InsuranceType } from 'common/enum/insurance-type';
import { Header, Text } from 'components';
import { AppStackParamList, RouteName } from 'configs/navigation';
import ReportBlock from 'modules/leave-registration/leave-report/components/report-block';
import React from 'react';
import { ScrollView, View } from 'tamagui';
import { scale, verticalScale } from 'utils';
import InsuranceItem from './components/InsuranceItem';
import { InsuranceDetailProvider, useInsuranceDetailProvider } from './provider';
import dayjs from 'dayjs';

type InsuranceDetailPageProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.InsuranceDetailPage
>;

function InsuranceDetailPage(props: InsuranceDetailPageProps) {
  return (
    <InsuranceDetailProvider type={props.route.params?.type}>
      <ViewPage {...props} />
    </InsuranceDetailProvider>
  );
}

function ViewPage(props: InsuranceDetailPageProps) {
  const provider = useInsuranceDetailProvider();
  const type = props.route.params?.type;
  const header = type === InsuranceType.SOCIAL ? 'Bảo hiểm xã hội' : 'Bảo hiểm sức khoẻ';
  return (
    <View f={1}>
      <Header title={header} />
      <ScrollView f={1}>
        <View gap={scale(16)} p={scale(16)}>
          {!provider.insurance && !provider.insuranceHealthDetail?.employee_name && (
            <View ai="center" jc="center" pv={verticalScale(40)}>
              <Text color="$grey" fontSize={scale(14)}>
                Không có dữ liệu
              </Text>
            </View>
          )}
          {!!provider.insurance && type === InsuranceType.SOCIAL && (
            <InsuranceItem type={InsuranceType.SOCIAL} item={provider.insurance} />
          )}
          {!!provider.insuranceHealthDetail?.employee_name && type === InsuranceType.HEALTH && (
            <>
              <InsuranceItem
                type={InsuranceType.HEALTH}
                insuranceOther={provider.insuranceHealthDetail}
              />
              {provider.insuranceHealthDetail?.relative_ids?.map((it) => (
                <ReportBlock
                  key={JSON.stringify(it)}
                  label="Người thân tham gia"
                  lines={[
                    { label: 'Tên người thân', value: it.name },
                    {
                      label: 'Ngày sinh',
                      value: it.birth_date.length ? dayjs(it.birth_date).format('DD/MM/YYYY') : '',
                    },
                    { label: 'Giới tính', value: it.gender_label },
                    { label: 'Mối quan hệ', value: it.relationship_label },
                    {
                      label: 'Thời gian bắt đầu',
                      value: it.start_date?.length ? dayjs(it.start_date).format('DD/MM/YYYY') : '',
                    },
                    {
                      label: 'Thời gian kết thúc',
                      value: it.end_date?.length ? dayjs(it.start_date).format('DD/MM/YYYY') : '',
                    },
                    { label: 'Đối tượng', value: it.object_label },
                    { label: 'Số điện thoại', value: it.phone },
                  ]}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default InsuranceDetailPage;
