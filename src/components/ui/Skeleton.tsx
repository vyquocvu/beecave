import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius } from '@/constants/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = 16, style, rounded }: SkeletonProps) {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: colors.bg.tertiary,
          borderRadius: rounded ? radius.full : radius.sm,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
