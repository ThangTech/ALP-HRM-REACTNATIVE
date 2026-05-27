import { StyleSheet } from 'react-native';
import { getTokens } from 'tamagui';

export const globalStyle = StyleSheet.create({
  itemShadow: {
    shadowColor: '#D2D2D21A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  btnDetractive: {
    borderColor: getTokens().color.detractive.val,
    borderWidth: 1,
  },
  btnPrimary: {
    backgroundColor: getTokens().color.blue.val,
  },
  fullWidth: {
    flex: 1,
  },
});
