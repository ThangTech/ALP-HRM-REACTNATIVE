import React from 'react';
import { TaxListRef } from 'common/model/tax';
import CardContainer from 'components/CardContainer';
import dayjs from 'dayjs';
import { LineItemType } from 'modules/leave-registration/leave-report/components/line-item';
import ReportBlock from 'modules/leave-registration/leave-report/components/report-block';
import { useMemo } from 'react';
import { Text } from 'components';
import FileViewerItem from 'components/file-upload/FileViewerItem';
import { getLocalFileType, scale } from 'utils';
import { View } from 'tamagui';

interface TaxItemType {
  item: TaxListRef;
}

const TaxItem = (props: TaxItemType) => {
  const blocks = useMemo(() => {
    const it = props.item;
    return [
      { label: 'Người phụ thuộc', value: it.name || '--' } as LineItemType,
      { label: 'Ngày sinh', value: it.date || '--' } as LineItemType,
      { label: 'Giới tính', value: it.gender_label || '--' } as LineItemType,
      { label: 'Mã số thuế NPT', value: it.tax_code || '--' } as LineItemType,
      { label: 'CCCD', value: it.id_card || '--' } as LineItemType,
      { label: 'Mối quan hệ', value: it.relationship_label || '--' } as LineItemType,
      { label: 'Số (Giấy khai sinh)', value: it.number_birth_cer || '--' } as LineItemType,
      { label: 'Quyển số', value: it.book || '--' } as LineItemType,
      { label: 'Tỉnh/Thành phố', value: it.city_place_of_birth_name || '--' } as LineItemType,
      { label: 'Xã/Phường', value: it.ward_place_of_birth_name || '--' } as LineItemType,
      {
        label: 'Giảm trừ từ (tháng)',
        value: it.start_date ? dayjs(it.start_date).format('DD/MM/YYYY') : '--',
      } as LineItemType,
      {
        label: 'Giảm trừ đến (tháng)',
        value: it.end_date ? dayjs(it.end_date).format('DD/MM/YYYY') : '--',
      } as LineItemType,
    ];
  }, [props.item]);
  return (
    <CardContainer padding={scale(16)}>
      <ReportBlock label="Thông tin người phụ thuộc" lines={blocks} />
      <Text fontW={500} fontSize={14} mt={scale(12)} mb={scale(8)}>
        Hồ sơ
      </Text>
      {!props.item.file_list.length ? (
        <Text textAlign="center">Không có hồ sơ đính kèm</Text>
      ) : (
        <View gap={scale(8)}>
          {props.item.file_list.map((file) => (
            <View bw={1} br={scale(12)} bc={'$divider'} key={file.id}>
              <FileViewerItem
                file={{
                  id: file.id?.toString(),
                  name: file.name,
                  uri: file.url,
                  type: getLocalFileType(file.mimetype),
                }}
                disabledDelete
              />
            </View>
          ))}
        </View>
      )}
    </CardContainer>
  );
};

export default TaxItem;
