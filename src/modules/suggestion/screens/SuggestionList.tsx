import React, { useCallback, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import { SuggestionListState } from './SuggestionListState';
import { useState } from 'react';
import dayjs from 'dayjs';
import { View } from 'tamagui';
import { FlatList, Header, Pressable } from 'components';
import { IcPlus } from 'assets/svgs';
import { navigate } from 'navigators';
import { scale } from 'utils';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import { useSuggestions } from '../hooks/useSuggestions';
import { SuggestionModel } from 'common/model/suggestion-model';
import { ListRenderItemInfo } from 'react-native';
import ItemSuggestion from '../components/ItemSuggestion';
import { SuggestionViewType } from 'common/enum/suggestion-view-type';
import { useFocusEffect } from '@react-navigation/native';

type SuggestionListProps = NativeStackScreenProps<AppStackParamList, RouteName.SuggestionList>;
const SuggestionList = (props: SuggestionListProps) => {
  const params = props.route.params;
  const [state, setState] = useState<SuggestionListState>({
    type: params?.viewType || SuggestionViewType.SUGGESTION,
    from: dayjs().subtract(30, 'day').toDate(),
    to: dayjs().add(1, 'day').toDate(),
    offset: 0,
    limit: 20,
  });
  const provider = useSuggestions(state);
  const naming = params?.viewType === SuggestionViewType.COMMENT ? 'góp ý' : 'đề xuất';

  useFocusEffect(
    useCallback(() => setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() })), []),
  );

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      offset: 0,
      items:
        state.offset === 0
          ? provider.suggestions?.data?.records || []
          : [...(prev.items || []), ...(provider.suggestions?.data?.records || [])],
    }));
  }, [provider.suggestions?.data?.records, state.offset]);

  function _renderItem(info: ListRenderItemInfo<SuggestionModel>) {
    return <ItemSuggestion item={info.item} viewType={params?.viewType} />;
  }

  return (
    <View f={1}>
      <Header
        title={`Danh sách ${naming} của tôi`}
        rightAction={
          <Pressable onPress={() => navigate(RouteName.Suggestion, { viewType: state.type })}>
            <IcPlus tintColor="white" size={scale(25)} />
          </Pressable>
        }
      />
      <View fd={'row'} gap={scale(12)} p={scale(16)}>
        <DatePicker
          mode="date"
          onChange={(value) => setState((prev) => ({ ...prev, from: value }))}
          value={state.from}
          label="Từ"
          valueFormat="DD/MM/YYYY"
        />
        <DatePicker
          mode="date"
          onChange={(value) => setState((prev) => ({ ...prev, to: value }))}
          value={state.to}
          label="Đến"
          valueFormat="DD/MM/YYYY"
        />
      </View>
      <View p={scale(16)} f={1}>
        <FlatList
          data={state.items || []}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id}
          refreshing={provider.isLoadingSuggestions}
          onRefresh={() => setState((prev) => ({ ...prev, offset: 0, triggerRefresh: Date.now() }))}
          onLoadMore={() => setState((prev) => ({ ...prev, offset: prev.items?.length || 0 }))}
        />
      </View>
    </View>
  );
};

export default SuggestionList;
