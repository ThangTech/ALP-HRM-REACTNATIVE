import { View } from 'tamagui';
import { DisciplineListProvider, useDisciplineListProvider } from './provider';
import { FlatList, Header } from 'components';
import React from 'react';
import DisciplineItem from './components/DisciplineItem';
import { scale } from 'utils';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';

function DisciplineListPage() {
  return (
    <DisciplineListProvider>
      <ViewPage />
    </DisciplineListProvider>
  );
}

function ViewPage() {
  const provider = useDisciplineListProvider();
  return (
    <View f={1}>
      <Header title={'Khen thưởng & Kỷ luật'} />
      <View f={1} p={scale(16)} gap={scale(16)}>
        <OptionPicker
          options={provider.state.disciplineTypes}
          value={provider.state.disciplineType}
          onChange={(item) =>
            provider.setState((prev) => ({ ...prev, disciplineType: item, offset: 0 }))
          }
        />
        <FlatList
          data={provider.disciplines?.records}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View mb={scale(16)}>
              <DisciplineItem item={item} />
            </View>
          )}
          onRefresh={() => {
            provider.setState((prev) => ({ ...prev, offset: 0 }));
            provider.refresh();
          }}
          onLoadMore={() =>
            provider.setState((prev) => ({ ...prev, offset: prev.disciplines?.length ?? 0 }))
          }
          refreshing={false}
        />
      </View>
    </View>
  );
}

export default DisciplineListPage;
