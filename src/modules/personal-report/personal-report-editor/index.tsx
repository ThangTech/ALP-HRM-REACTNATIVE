import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IcCheckbox } from 'assets/svgs';
import { LeaveRegistrationViewType } from 'common/enum/leave-registration-view-type';
import { PersonalReportType } from 'common/enum/personal-report-type';
import { Header, Input, Text } from 'components';
import { AppStackParamList, RouteName } from 'configs/navigation';
import DatePicker from 'modules/leave-registration/list/components/DatePicker';
import OptionPicker from 'modules/leave-registration/list/components/OptionPicker';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, ScrollView, View } from 'tamagui';
import { formatCurrency, scale } from 'utils';
import PersonalReportButtons from './components/PersonalReportButtons';
import { PersonalReportEditorProvider, usePersonalReportEditorProvider } from './provider';
import CardContainer from 'modules/leave-registration/detail/components/CardContainer';
import ItemHistory from 'modules/leave-registration/detail/components/ItemHistory';
import SalaryCard from './components/SalaryCard';
import { TicketType } from 'common/enum/ticket-type';
import OptionDelete from 'components/OptionDelete';
import OptionMenu from 'components/OptionMenu';
import { goBack } from 'navigators';
import { useDeleteTicket } from 'hooks/useDeleteTicket';
import { SectionHeading } from 'timesheet/screens/TimesheetExplanationDetail';
type PersonalReportEditorProps = NativeStackScreenProps<
  AppStackParamList,
  RouteName.PersonalReportEditor
>;

function PersonalReportEditorPage(props: PersonalReportEditorProps) {
  return (
    <PersonalReportEditorProvider>
      <ViewPage {...props} />
    </PersonalReportEditorProvider>
  );
}

function ViewPage(props: PersonalReportEditorProps) {
  const _id = props.route.params?.id;
  const viewType = props.route.params?.viewType ?? LeaveRegistrationViewType.ME;
  const provider = usePersonalReportEditorProvider();
  const deleteProvider = useDeleteTicket();
  const control = provider.form.control;
  const type = provider.form.watch('type');
  const hasChallenges = provider.form.watch('hasChallenges');
  const isSalaryChange = type.key === PersonalReportType.SALARY_CHANGE;

  const hasChallenge = [
    PersonalReportType.APPOINT,
    PersonalReportType.CONCURRENT_POSITION,
    PersonalReportType.TRANSFER,
    PersonalReportType.JOB_ASSIGNMENT,
  ].includes(type.key as PersonalReportType);
  const hasDivisionPicker = ![PersonalReportType.JOB_ASSIGNMENT].includes(
    type.key as PersonalReportType,
  );
  const hasStartEndDate = hasChallenges;

  const id = provider.state.id;

  useEffect(() => {
    provider.setState((prev) => ({ ...prev, id: _id, viewType: viewType }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id, viewType]);

  return (
    <View f={1}>
      <Header
        title={(id ? 'Cập nhật' : 'Tạo') + ' tờ trình HCNS'}
        rightAction={
          <OptionMenu>
            {id && (
              <OptionDelete
                onDelete={async () => {
                  await deleteProvider.handleDelete({
                    ticketId: id,
                    type: TicketType.PERSONAL_REPORT,
                  });
                  goBack();
                }}
              />
            )}
          </OptionMenu>
        }
      />
      <ScrollView f={1} automaticallyAdjustKeyboardInsets>
        <View gap={scale(16)} p={scale(16)}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <OptionPicker
                label="Loại phiếu"
                options={provider.state.typeOptions ?? []}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                disabled={!!id}
              />
            )}
          />
          <Controller
            control={control}
            name="employee"
            render={({ field }) => (
              <OptionPicker
                label="Nhân viên"
                value={field.value}
                options={provider.state.employeeOptions ?? []}
                onChange={(value) => field.onChange(value)}
                searchable
              />
            )}
          />
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <Input
                multiline
                value={field.value}
                onChangeValue={field.onChange}
                label={'Nội dung(Lý do)'}
                placeholder="Nội dung(Lý do)"
              />
            )}
          />
          <View mb={scale(-12)}>
            <SectionHeading title="Nội dung đề xuất" />
          </View>
          {hasChallenge && (
            <>
              <View fd={'row'} gap={scale(8)} ai={'center'}>
                <Text>Có thử thách</Text>
                <Controller
                  control={control}
                  name="hasChallenges"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      w={scale(28)}
                      h={scale(28)}
                    >
                      <Checkbox.Indicator>
                        <IcCheckbox />
                      </Checkbox.Indicator>
                    </Checkbox>
                  )}
                />
              </View>
              {hasStartEndDate && (
                <View fd={'row'} gap={scale(16)}>
                  <Controller
                    control={control}
                    name="from"
                    render={({ field }) => (
                      <DatePicker
                        label="Từ ngày"
                        onChange={field.onChange}
                        value={field.value}
                        mode="date"
                        valueFormat="DD/MM/YYYY"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="to"
                    render={({ field }) => (
                      <DatePicker
                        label="Đến ngày"
                        onChange={field.onChange}
                        value={field.value}
                        mode="date"
                        valueFormat="DD/MM/YYYY"
                      />
                    )}
                  />
                </View>
              )}
            </>
          )}
          <Controller
            control={control}
            name="area"
            render={({ field }) => (
              <OptionPicker
                label="Khu vực"
                placeholder="Chọn khu vực"
                searchable
                value={field.value}
                options={provider.state.areaOptions ?? []}
                onChange={field.onChange}
              />
            )}
          />
          {hasDivisionPicker && (
            <>
              <Controller
                control={control}
                name="department"
                render={({ field }) => (
                  <OptionPicker
                    label="Phòng ban"
                    placeholder="Chọn phòng ban"
                    searchable
                    value={field.value}
                    options={provider.state.departmentOptions ?? []}
                    onChange={(value) => {
                      provider.setState((prev) => ({ ...prev, departmentId: +value?.key }));
                      field.onChange(value);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="group"
                render={({ field }) => (
                  <OptionPicker
                    label="Nhóm/ Chi nhánh"
                    placeholder="Chọn nhóm/ chi nhánh"
                    searchable
                    disabled={!provider.state.departmentId}
                    value={field.value}
                    options={provider.state.groupOptions ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="job"
                render={({ field }) => (
                  <OptionPicker
                    label="Chức danh"
                    placeholder="Chọn chức danh"
                    searchable
                    value={field.value}
                    options={provider.state.jobOptions ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <OptionPicker
                    label="Chức vụ"
                    placeholder="Chọn chức vụ"
                    searchable
                    value={field.value}
                    options={provider.state.positionOptions ?? []}
                    onChange={(value) => {
                      provider.form.setValue('rank', {
                        key: value.data.level_id,
                        value: value.data.level_name,
                      });
                      field.onChange(value);
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="rank"
                render={({ field }) => (
                  <OptionPicker
                    label="Cấp bậc"
                    placeholder="Chọn cấp bậc"
                    disabled
                    value={field.value}
                    options={provider.state.rankOptions ?? []}
                    onChange={field.onChange}
                  />
                )}
              />
            </>
          )}
          {type.key === PersonalReportType.JOB_ASSIGNMENT && (
            <Controller
              control={control}
              name="jobDescription"
              render={({ field }) => (
                <Input
                  label={'Phân công công việc'}
                  placeholder={'Phân công công việc'}
                  onChangeValue={field.onChange}
                  value={field.value}
                />
              )}
            />
          )}
          {/* {type.key === PersonalReportType.CONCURRENT_POSITION && (
            <Controller
              control={control}
              name="concurrentJob"
              render={({ field }) => (
                <OptionPicker
                  label="Chức danh kiêm nhiệm"
                  searchable
                  value={field.value}
                  options={provider.state.jobOptions ?? []}
                  onChange={field.onChange}
                />
              )}
            />
          )} */}
          <Controller
            control={control}
            name="director"
            render={({ field }) => (
              <OptionPicker
                label="Quản lý trực tiếp"
                placeholder="Quản lý trực tiếp"
                searchable
                value={field.value}
                options={provider.state.directorOptions ?? []}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="manager"
            render={({ field }) => (
              <OptionPicker
                label="Quản lý cấp trên"
                placeholder="Quản lý cấp trên"
                searchable
                value={field.value}
                options={provider.state.managerOptions ?? []}
                onChange={field.onChange}
              />
            )}
          />
          {isSalaryChange && (
            <Controller
              control={control}
              name="expectAllowance"
              render={({ field }) => (
                <Input
                  keyboardType="numeric"
                  label={'Phụ cấp đề xuất'}
                  placeholder="Phụ cấp đề xuất"
                  onChangeValue={(value) => {
                    field.onChange(formatCurrency(value));
                  }}
                  value={field.value}
                />
              )}
            />
          )}
          {type.key === PersonalReportType.CONCURRENT_POSITION && (
            <Controller
              control={control}
              name="concurrentAllowance"
              render={({ field }) => (
                <Input
                  keyboardType="numeric"
                  label={'Phụ cấp kiệm nhiệm'}
                  placeholder="Phụ cấp kiệm nhiệm"
                  onChangeValue={(value) => {
                    field.onChange(formatCurrency(value));
                  }}
                  value={field.value}
                />
              )}
            />
          )}
          {type.key !== PersonalReportType.CONCURRENT_POSITION && (
            <Controller
              control={control}
              name="expectSalary"
              render={({ field }) => (
                <Input
                  keyboardType="numeric"
                  label={'Thu nhập đề xuất'}
                  placeholder="Thu nhập đề xuất"
                  onChangeValue={(value) => {
                    field.onChange(formatCurrency(value));
                  }}
                  value={field.value}
                />
              )}
            />
          )}
          <View fd={'row'} gap={scale(16)}>
            <Controller
              control={control}
              name="manufactureDate"
              render={({ field }) => (
                <DatePicker
                  label="Ngày có hiệu lực"
                  value={field.value}
                  mode="date"
                  valueFormat="DD/MM/YYYY"
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="expiredDate"
              render={({ field }) => (
                <DatePicker
                  label="Ngày hết hiệu lực"
                  mode="date"
                  valueFormat="DD/MM/YYYY"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </View>
          <Controller
            control={control}
            name="expectDepartmentHead"
            render={({ field }) => (
              <Input
                label={'Đề xuất của trưởng bộ phận'}
                placeholder={'Đề xuất của trưởng bộ phận'}
                onChangeValue={field.onChange}
                value={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="expectHumanResource"
            render={({ field }) => (
              <Input
                label={'Ý kiến của phòng HCNS'}
                placeholder={'Ý kiến của phòng HCNS'}
                onChangeValue={field.onChange}
                value={field.value}
              />
            )}
          />
          {isSalaryChange && <SalaryCard />}
          {!!provider.histories?.data?.approval_progress?.length && (
            <View mt={scale(16)}>
              <CardContainer>
                <View gap={scale(16)}>
                  {provider.histories?.data?.approval_progress.map((it) => (
                    <ItemHistory key={it.id} item={it} />
                  ))}
                </View>
              </CardContainer>
            </View>
          )}
        </View>
      </ScrollView>
      <PersonalReportButtons id={id} viewType={viewType} />
    </View>
  );
}

export default PersonalReportEditorPage;
