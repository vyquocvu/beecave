import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { baseColors, baseTypography } from '@/base/theme';

export type BaseTextVariant = keyof typeof baseTypography;

type Props = TextProps & {
  variant?: BaseTextVariant;
  color?: string;
  style?: TextStyle | TextStyle[];
};

export function BaseText({ variant = 'body', color = baseColors.text.primary, style, ...rest }: Props) {
  return <Text {...rest} style={[baseTypography[variant], { color }, style]} />;
}
