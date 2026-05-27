import { Header } from 'components';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Tabs, Text, View } from 'tamagui';
import LeaveReportPage from '../index';
import { getTokens } from 'tamagui';
import LeaveReportDetailPage from '../leave-report-detail';

const LeaveReportRootPage = () => {
  const [selectedTab, setSelectedTab] = useState('tab1');
  return (
    <View f={1}>
      <Header title={'Nghỉ phép/Nghỉ bù'} />
      <View f={1}>
        <View h={50}>
          <Tabs defaultValue="tab1" flexDirection="column" onValueChange={setSelectedTab}>
            <Tabs.List h={50}>
              <Tabs.Tab
                value="tab1"
                f={1}
                focusStyle={styles.tabFocus}
                bg={'$white'}
                unstyled
                alignItems="center"
                justifyContent="center"
              >
                <Text style={selectedTab === 'tab1' ? styles.tabTextFocus : styles.tabText}>
                  Ngày phép / Ngày bù
                </Text>
              </Tabs.Tab>
              <Tabs.Tab
                value="tab2"
                f={1}
                focusStyle={styles.tabFocus}
                bg={'$white'}
                unstyled
                alignItems="center"
                justifyContent="center"
              >
                <Text style={selectedTab === 'tab2' ? styles.tabTextFocus : styles.tabText}>
                  Thông tin chi tiết
                </Text>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </View>
        <View f={1} bg={'$bgLeave'}>
          {selectedTab === 'tab1' ? <LeaveReportPage /> : <LeaveReportDetailPage />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    borderBottomColor: '$grey',
    borderBottomWidth: 2,
    backgroundColor: '$white',
  },
  tabFocus: {
    borderBottomColor: '$secondary',
    borderBottomWidth: 2,
    backgroundColor: '$white',
  },
  tabText: {
    fontSize: 14,
  },
  tabTextFocus: {
    fontSize: 14,
    color: getTokens().color.secondary.val,
    fontWeight: 600,
  },
});

export default LeaveReportRootPage;
