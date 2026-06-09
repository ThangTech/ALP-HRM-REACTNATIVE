import React, { useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Pressable, SmartBackdrop, Text } from 'components';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { getTokens, View } from 'tamagui';
import { horizontalScale, scale, verticalScale } from 'utils';
import { AllowedCompany } from 'user/hooks/useAllowedCompaniesApi';

interface SwitchCompanyBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  companies: AllowedCompany[];
  currentCompanyId?: number;
  loading?: boolean;
  onSelect: (companyId: number) => void;
}

const SwitchCompanyBottomSheet: React.FC<SwitchCompanyBottomSheetProps> = ({
  bottomSheetRef,
  companies,
  currentCompanyId,
  loading,
  onSelect,
}) => {
  const snapPoints = useMemo(() => ['60%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <SmartBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  const handleSelect = (companyId: number) => {
    onSelect(companyId);
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.container}>
        <Text fontSize={scale(18)} fontWeight="700" mb={verticalScale(12)}>
          Chọn công ty
        </Text>

        {loading && companies.length === 0 ? (
          <View f={1} ai="center" jc="center" pv={verticalScale(24)}>
            <ActivityIndicator color={getTokens().color.red500.val} />
          </View>
        ) : companies.length === 0 ? (
          <View f={1} ai="center" jc="center" pv={verticalScale(24)}>
            <Text color="$grey">Không có công ty nào</Text>
          </View>
        ) : (
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <View gap={verticalScale(10)} pb={verticalScale(8)}>
              {companies.map((company) => {
                const selected = currentCompanyId === company.id;
                return (
                  <Pressable
                    key={company.id}
                    style={[styles.item, selected && styles.itemSelected]}
                    onPress={() => handleSelect(company.id)}
                  >
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && <View style={styles.radioInner} />}
                    </View>
                    <View f={1} gap={scale(2)}>
                      <Text
                        fontSize={scale(14)}
                        fontWeight={selected ? '700' : '400'}
                        color="$black"
                      >
                        {company.name}
                      </Text>
                      {!!company.code && (
                        <Text fontSize={scale(12)} color="$grey">
                          {company.code}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </BottomSheetScrollView>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderRadius: scale(12),
    borderColor: getTokens().color.border.val,
    backgroundColor: 'white',
  },
  itemSelected: {
    borderColor: getTokens().color.red500.val,
    backgroundColor: '#FFF5F5',
  },
  radio: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: getTokens().color.grey.val,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: getTokens().color.red500.val,
  },
  radioInner: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: getTokens().color.red500.val,
  },
});

export default SwitchCompanyBottomSheet;
