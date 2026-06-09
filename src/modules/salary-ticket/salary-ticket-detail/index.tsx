import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from 'components';
import CardContainer from 'components/CardContainer';
// import FileViewerItem from 'components/file-upload/FileViewerItem';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { useSafeArea } from 'hooks';
import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { View } from 'tamagui';
import { scale } from 'utils';
// import { getLocalFileType } from 'utils';
import OtherTicket from './components/OtherTicket';
import RowTicket from './components/RowTicket';
import WorkTicket from './components/WorkTicket';
import { SalaryTicketDetailProvider, useSalaryTicketDetailProvider } from './provider';

type SalaryTicketDetailPageProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.SalaryTicketDetail
>;

function SalaryTicketDetailPage(props: SalaryTicketDetailPageProps) {
  const params = props.route.params;
  return (
    <SalaryTicketDetailProvider id={params?.id ?? 0}>
      <ViewPage />
    </SalaryTicketDetailProvider>
  );
}

function ViewPage() {
  const provider = useSalaryTicketDetailProvider();
  const safeArea = useSafeArea();
  return (
    <View f={1}>
      <Header title={'Chi tiết phiếu Lương'} />
      <View f={1}>
        {provider.isLoading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            <View p={scale(16)} gap={scale(12)} paddingBottom={scale(16) + safeArea.bottom}>
              <CardContainer padding={scale(16)}>
                <RowTicket
                  title="Họ và tên"
                  value={provider.salaryTicket?.employee_name || ''}
                  pv={5}
                />
                <RowTicket
                  title="Mã nhân viên"
                  value={provider.salaryTicket?.employee_code || ''}
                  pv={5}
                />
                <RowTicket title="Chức vụ" value={provider.salaryTicket?.job_name || ''} pv={5} />
                <WorkTicket />
                <OtherTicket />
              </CardContainer>
              {/* {!!provider.salaryTicket?.files?.length && (
                <>
                  <Text fontSize={scale(14)}>Phiếu lương PDF </Text>
                  {provider.salaryTicket?.files?.map((it) => (
                    <FileViewerItem
                      file={{
                        id: it.id.toString(),
                        name: it.name,
                        type: getLocalFileType(it.mimetype),
                        uri: it.download_url,
                      }}
                      disabledDelete
                    />
                  ))}
                </>
              )} */}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

export default SalaryTicketDetailPage;
