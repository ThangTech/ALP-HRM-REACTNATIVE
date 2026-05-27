import React from 'react';
import { TerminationEditorProvider, useTerminationEditorProvider } from './provider';
import { ScrollView, View } from 'tamagui';
import { Button, Header, Input } from 'components';
import { scale } from 'utils';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import UploadComponent from 'components/file-upload/UploadComponent';
import { goBack } from 'navigators';
import { useSafeArea } from 'hooks';

function TerminationEditorPage() {
  return (
    <TerminationEditorProvider>
      <ViewPage />
    </TerminationEditorProvider>
  );
}

function ViewPage() {
  const safeArea = useSafeArea();
  const provider = useTerminationEditorProvider();
  return (
    <View f={1}>
      <Header title={'Chi tiết đơn nghỉ'} />
      <ScrollView f={1} automaticallyAdjustKeyboardInsets>
        <View gap={scale(16)} p={scale(16)}>
          <OptionPicker
            label="Loại nghỉ"
            placeholder="Chọn loại nghỉ"
            value={provider.state.departureReason}
            onChange={(item) => provider.setState((prev) => ({ ...prev, departureReason: item }))}
            options={provider.state.departureReasonOptions ?? []}
          />
          <DatePicker
            label="Ngày nộp đơn nghỉ"
            value={provider.state.resignationDate}
            onChange={(date) => provider.setState((prev) => ({ ...prev, resignationDate: date }))}
            mode="date"
            valueFormat="DD/MM/YYYY"
          />
          <DatePicker
            label="Ngày nghỉ chính thức"
            value={provider.state.dayOff}
            onChange={(date) => provider.setState((prev) => ({ ...prev, dayOff: date }))}
            mode="date"
            valueFormat="DD/MM/YYYY"
          />
          <Input
            multiline
            label={'Nội dung đơn nghỉ'}
            placeholder="Nội dung đơn nghỉ"
            onChangeText={(text) =>
              provider.setState((prev) => ({ ...prev, content: text, showError: false }))
            }
            value={provider.state.content}
            state={provider.state.showError ? 'error' : undefined}
          />
          <OptionPicker
            label="Người nhận bàn giao"
            placeholder="Chọn người nhận bàn giao"
            searchable
            onChange={(item) => provider.setState((prev) => ({ ...prev, receiver: item }))}
            options={provider.state.employeeOptions ?? []}
            value={provider.state.receiver}
          />
          <Input
            multiline
            label={'Thông tin bàn giao'}
            placeholder="Thông tin bàn giao"
            onChangeText={(text) => provider.setState((prev) => ({ ...prev, information: text }))}
            value={provider.state.information}
          />
          <UploadComponent title="File đính kèm" hook={provider.uploadFiles} />
        </View>
      </ScrollView>
      <View
        fd={'row'}
        gap={scale(16)}
        pt={scale(12)}
        ph={scale(16)}
        pb={scale(12) + safeArea.bottom}
        bg={'white'}
      >
        <View f={1}>
          <Button onPress={goBack} variant="detractive">
            <Button.Text variant="detractive">Huỷ bỏ</Button.Text>
          </Button>
        </View>
        <View f={1}>
          <Button
            onPress={() => provider.handleSubmit()}
            variant="primary"
            disabled={provider.state.isLoading}
            loading={provider.state.isLoading}
          >
            <Button.Text variant="primary">Trình duyệt</Button.Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default TerminationEditorPage;
