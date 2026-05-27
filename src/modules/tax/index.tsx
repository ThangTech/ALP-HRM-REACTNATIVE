import React from 'react';
import { ScrollView, View } from 'tamagui';
import { TaxProvider, useTaxProvider } from './provider';
import { Header } from 'components';
import { scale } from 'utils';
import CardContainer from 'components/CardContainer';
import ReportBlock from 'modules/leave-registration/leave-report/components/report-block';
import TaxItem from './components/TaxItem';

function TaxPage() {
  return (
    <TaxProvider>
      <ViewPage />
    </TaxProvider>
  );
}

function ViewPage() {
  const provider = useTaxProvider();

  return (
    <View f={1}>
      <Header title={'Thuế Thu Nhập Cá Nhân'} />
      <ScrollView f={1}>
        <View gap={scale(24)} p={scale(16)}>
          <CardContainer padding={scale(16)}>
            <ReportBlock
              label="Thông tin Thuế"
              lines={[
                { label: 'Tên nhân viên', value: provider.tax?.employee_name ?? '' },
                { label: 'Mã số thuế cá nhân', value: provider.tax?.tax_employee ?? '' },
                { label: 'Số người phụ thuộc', value: provider.tax?.count_child?.toString() ?? '' },
              ]}
            />
          </CardContainer>
          {provider.tax?.list_child.map((it, index) => (
            <TaxItem key={index} item={it} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TaxPage;
