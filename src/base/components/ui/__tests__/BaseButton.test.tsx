import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BaseButton } from '@/base/components/ui/BaseButton';

describe('BaseButton', () => {
  it('renders title', () => {
    const { getByText } = render(<BaseButton title="Continue" />);
    expect(getByText('Continue')).toBeTruthy();
  });

  it('fires onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(<BaseButton title="Continue" onPress={onPress} />);
    fireEvent.press(getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<BaseButton title="Continue" onPress={onPress} disabled />);
    fireEvent.press(getByText('Continue'));
    expect(onPress).toHaveBeenCalledTimes(0);
  });
});
