import { ApprovalStatusCode } from 'common/enum/approval-status-code';
import { ApprovalProgressItem } from 'common/model/approval_progress';
import { Text } from 'components';
import React from 'react';
import { View } from 'tamagui';
import { scale } from 'utils';

interface ItemHistoryType {
  item: ApprovalProgressItem;
}

const ItemHistory = (props: ItemHistoryType) => {
  const getMainColor = () => {
    if (props.item.status_code === ApprovalStatusCode.REJECTED) {
      return '$detractive';
    }
    if (props.item.status_code === ApprovalStatusCode.APPROVED) {
      return '$approvedText';
    }
    if (props.item.status_code === ApprovalStatusCode.APPROVING) {
      return '$pendingText';
    }
    return '$black';
  };

  const getDescription = () => {
    if (props.item.status_code === ApprovalStatusCode.APPROVED) {
      return `${props.item.step_name}: ${props.item.approved_by_name ?? ''} - ${props.item.description}`;
    }
    return `${props.item.step_name}: - ${props.item.description}`;
  };

  return (
    <View fd={'row'} gap={scale(8)}>
      <View w={scale(8)} h={scale(8)} mt={scale(5)} bg={getMainColor() ?? '$grey'} br={100} />
      <View gap={scale(4)}>
        <Text c={getMainColor()} fontW={600} fontSize={scale(14)}>
          Bước duyệt
        </Text>
        {!!getDescription().length && (
          <Text c={getMainColor()} fontW={400} fontSize={scale(14)}>
            {getDescription()}
          </Text>
        )}
        {/* <Text c={'$grey'} fontW={400} fontSize={scale(14)}>
          {dayjs(props.item.created_at).format('HH:mm DD/MM/YYYY')}
        </Text> */}
      </View>
    </View>
  );
};

export default ItemHistory;
