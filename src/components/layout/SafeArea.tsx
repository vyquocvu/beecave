import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

interface SafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  top?: boolean;
  bottom?: boolean;
}

export function SafeArea({ children, style, top = true, bottom = false }: SafeAreaProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.base,
        {
          paddingTop: top ? insets.top : 0,
          paddingBottom: bottom ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
});
