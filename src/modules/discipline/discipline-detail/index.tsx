import React from 'react';
import { globalStyle } from 'common/styles/base';
import { Header, OptionItem, Text } from 'components';
import { ScrollView, View } from 'tamagui';
import { getLocalFileType, scale } from 'utils';
import { DisciplineDetailProvider, useDisciplineDetailProvider } from './provider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, RouteName } from 'configs/navigation';
import dayjs from 'dayjs';
import FileViewerItem from 'components/file-upload/FileViewerItem';
type DisciplineDetailProps = NativeStackScreenProps<AppStackParamList, RouteName.DisciplineDetail>;

function DisciplineDetailPage(props: DisciplineDetailProps) {
  return (
    <DisciplineDetailProvider id={props.route.params?.id}>
      <ViewPage />
    </DisciplineDetailProvider>
  );
}

function ViewPage() {
  const provider = useDisciplineDetailProvider();
  const blocks: OptionItem[] = [
    { key: 'Loại quyết định', value: provider.discipline?.label_type ?? '' },
    { key: 'Hình thức', value: provider.discipline?.type_reward_name ?? '' },
    { key: 'Đối tượng áp dụng', value: provider.discipline?.label_object ?? '' },
    { key: 'Áp dụng cho', value: provider.discipline?.getObjectDescription() ?? '' },
    {
      key: 'Ngày có hiệu lực',
      value: dayjs(provider.discipline?.effective_date).format('DD/MM/YYYY'),
    },
    { key: 'Tính vào lương', value: provider.discipline?.is_in_salary ? 'Có' : 'Không' },
    { key: 'Giá trị thưởng phạt', value: provider.discipline?.value?.toLocaleString() ?? '0' },
    { key: 'Nội dung, lý do\n(Khen thưởng/xử phạt)', value: provider.discipline?.content ?? '' },
  ];

  return (
    <View f={1}>
      <Header title={'Thông tin Khen thưởng & Kỷ luật'} />
      <ScrollView f={1}>
        <View p={scale(16)} gap={scale(16)}>
          <View
            bg={'$white'}
            gap={scale(16)}
            bw={1}
            bc={'$reportBorderColor'}
            br={scale(16)}
            style={globalStyle.itemShadow}
            ph={scale(16)}
            pv={scale(20)}
          >
            <Text fontSize={scale(14)}>Thông tin Khen thưởng & Kỷ luật</Text>
            <View br={scale(16)} bw={1} bc={'$reportBorderColor'} ph={scale(16)} pb={scale(16)}>
              {blocks.map((block, index) => (
                <View
                  key={block.key}
                  fd={'row'}
                  pv={scale(12)}
                  gap={scale(8)}
                  justifyContent="space-between"
                  bbc={'$reportBorderColor'}
                  bbw={index === blocks.length - 1 ? 0 : 1}
                >
                  <Text fontSize={scale(14)} fontW={400}>
                    {block.key}
                  </Text>
                  <Text fontSize={scale(14)} fontW={600}>
                    {block.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          {!!provider.discipline?.files?.length && (
            <>
              <Text fontSize={scale(14)}>File đính kèm</Text>
              {provider.discipline?.files?.map((it) => (
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
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default DisciplineDetailPage;
