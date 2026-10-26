import React, { useState, useCallback } from 'react';
import { View } from 'tamagui';
import { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';

const SmartBackdrop: React.FC<BottomSheetBackdropProps> = ({ animatedIndex, style, ...props }) => {
  const [touchable, setTouchable] = useState(false);

  const updateTouchability = useCallback((value: boolean) => {
    setTouchable(value);
  }, []);

  useAnimatedReaction(
    () => animatedIndex.value,
    (current, previous) => {
      if (current === previous) return;
      runOnJS(updateTouchability)(current >= 0);
    },
    [updateTouchability],
  );

  return (
    <View style={style} f={1} pointerEvents={touchable ? 'auto' : 'none'}>
      <BottomSheetBackdrop {...props} animatedIndex={animatedIndex} />
    </View>
  );
};

export default SmartBackdrop;
