import { Header } from 'components';
import { RouteName } from 'configs/navigation';
import { navigate } from 'navigators';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView, View } from 'tamagui';
import { Text } from 'components';
import { useEmployeeListApi } from 'user/hooks/useEmployeeListApi';
import { horizontalScale, scale, verticalScale } from 'utils';

const EmployeeList = () => {
  const { fetchEmployeeList, employees, loading } = useEmployeeListApi();

  useEffect(() => {
    fetchEmployeeList();
  }, [fetchEmployeeList]);

  const renderHeader = () => {
    return <Header title={'Danh sách nhân viên'} />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View f={1} ai={'center'} jc={'center'} pt={verticalScale(60)}>
        <Text fontSize={scale(15)} color={'$grey'} ta={'center'}>
          Bạn không có quyền truy cập tài liệu này
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
        <View f={1} ai={'center'} jc={'center'}>
          <ActivityIndicator size="large" color="#E53935" />
        </View>
      );
    }

    if (employees.length === 0) {
      return renderEmpty();
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} f={1}>
        <View ph={horizontalScale(16)} pv={verticalScale(12)} gap={scale(10)}>
          {employees.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={styles.itemContainer}
              onPress={() =>
                navigate(RouteName.Profile, {
                  employeeId: item.id,
                  employeeName: item.display_name,
                })
              }
            >
              <Text fontSize={scale(15)} color={'$black'} f={1}>
                {item.display_name}
              </Text>
              <Text fontSize={scale(18)} color={'$grey'}>
                {'›'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: scale(12),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default EmployeeList;
