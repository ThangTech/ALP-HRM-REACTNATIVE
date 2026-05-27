import React from 'react';
import { SalaryTicketListProvider, useSalaryTicketListProvider } from './provider';
import { View } from 'tamagui';
import { FlatList, Header } from 'components';
import SalaryFilter from './components/SalaryFilter';
import { scale } from 'utils';
import { SalaryTicket } from 'common/model/salary-ticket';
import ItemSalaryTicket from './components/ItemSalaryTicket';
import { ListRenderItemInfo } from 'react-native';

function SalaryTicketListPage() {
  return (
    <SalaryTicketListProvider>
      <ViewPage />
    </SalaryTicketListProvider>
  );
}

function ViewPage() {
  const provider = useSalaryTicketListProvider();
  function _renderItem(info: ListRenderItemInfo<SalaryTicket>) {
    return <ItemSalaryTicket item={info.item} />;
  }

  return (
    <View f={1}>
      <Header title={'Danh sách phiếu lương'} />
      <View f={1} p={scale(16)}>
        <SalaryFilter />
        <View f={1}>
          <FlatList
            data={provider.state.items ?? []}
            keyExtractor={(item) => item.id}
            refreshing={provider.salaryTicketsLoading && provider.state.offset === 0}
            renderItem={_renderItem}
            onRefresh={() =>
              provider.setState((prev) => ({ ...prev, offset: 0, triggerReload: Date.now() }))
            }
            onLoadMore={() =>
              provider.setState((prev) => ({
                ...prev,
                offset: prev.items?.length || 0,
              }))
            }
          />
        </View>
      </View>
    </View>
  );
}

export default SalaryTicketListPage;
