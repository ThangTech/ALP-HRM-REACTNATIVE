import { Header, Text } from 'components';
import dayjs from 'dayjs';
import useAppContext from 'hooks/useAppContext';
import React from 'react';
import { HOST } from 'react-native-dotenv';
import { Image, ScrollView, View } from 'tamagui';
import ItemRow from 'user/components/ItemRow';
import OrganizationTree from 'user/components/OrganizationalChart';
import { useUser } from 'user/hooks';
import { verticalScale } from 'utils';
import { scale } from 'utils';
import { horizontalScale } from 'utils';

const JobInformation = () => {
  const { user } = useAppContext();
  const [{ dataEmployeeTree }] = useUser();

  const renderHeader = () => {
    return <Header title={'Thông tin công việc'} />;
  };

  const renderHeaderInfo = () => {
    return (
      <View
        bg={'$red500'}
        pb={verticalScale(20)}
        borderBottomLeftRadius={scale(20)}
        borderBottomRightRadius={scale(20)}
      >
        <View ph={horizontalScale(16)} pt={verticalScale(10)}>
          <View fd="row" gap={scale(12)}>
            <View position="relative">
              <Image
                source={{ uri: `${HOST}${user?.image_url}` }}
                w={horizontalScale(90)}
                h={horizontalScale(90)}
                br={scale(50)}
                bg={'$white'}
              />
            </View>
            <View f={1} pt={verticalScale(15)} gap={scale(5)}>
              <Text color={'$white'} fontSize={scale(22)} fontWeight="600">
                {user?.name}
              </Text>
              <Text color={'$white'} fontSize={scale(14)}>
                {user?.employee_code}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItemRow = () => {
    return (
      <View f={1} ph={horizontalScale(12)} pv={verticalScale(12)} gap={scale(10)}>
        <ItemRow label="Mã nhân viên cũ" value={user?.old_employee_code || ''} />
        <ItemRow label="Chức danh" value={user?.job_name || ''} />
        <ItemRow label="Phòng ban" value={user?.department_name || ''} />
        <ItemRow label="Nhóm/ chi nhánh" value={user?.group_name || ''} />
        <ItemRow label="Khu vực" value={user?.area_category_name || ''} />
        <ItemRow label="Địa chỉ làm việc" value={user?.work_location_text || ''} />
        <ItemRow label="Số điện thoại" value={user?.mobile_phone || ''} />
        <ItemRow label="Email" value={user?.work_email || ''} />
        <ItemRow
          label="Ngày vào làm"
          value={dayjs(user?.onboard_time).format('DD/MM/YYYY') || ''}
        />
        <ItemRow
          label="Ngày tiếp nhận chính thức"
          value={dayjs(user?.offical_contract_date).format('DD/MM/YYYY') || ''}
        />
      </View>
    );
  };

  const renderChart = () => {
    return (
      <View pb={verticalScale(40)} gap={scale(20)}>
        <Text fontW={'600'} fontSize={scale(22)} ta={'center'}>
          Sơ đồ tổ chức
        </Text>
        <View borderWidth={3} borderColor={'$red500'} br={scale(10)} mh={horizontalScale(12)} />
        <OrganizationTree apiData={dataEmployeeTree || []} />
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView f={1} bg={'$background'} bounces={false}>
        {renderHeaderInfo()}
        {renderItemRow()}
        {renderChart()}
      </ScrollView>
    );
  };
  return (
    <View f={1} bg={'$background'}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

export default JobInformation;
