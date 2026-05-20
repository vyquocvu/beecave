import React from 'react';
import { useWindowDimensions, View, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { SafeArea } from '@/components/layout/SafeArea';
import { baseColors } from '@/base/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  animate?: boolean;
};

export function BaseScreen({ children, style, contentStyle, animate = true }: Props) {
  const { width } = useWindowDimensions();
  const horizontal = width >= 420 ? 20 : width >= 390 ? 18 : 16;

  return (
    <SafeArea style={{ backgroundColor: baseColors.bg.primary, ...(style ?? {}) }}>
      <View style={[{ flex: 1, paddingHorizontal: horizontal }, contentStyle]}>
        {animate ? (
          <MotiView from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }}>
            {children}
          </MotiView>
        ) : (
          children
        )}
      </View>
    </SafeArea>
  );
}
