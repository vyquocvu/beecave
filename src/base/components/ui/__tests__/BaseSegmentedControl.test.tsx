import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BaseSegmentedControl } from '@/base/components/ui/BaseSegmentedControl';

describe('BaseSegmentedControl', () => {
  it('changes value on press', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <BaseSegmentedControl
        items={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
        ]}
        value="a"
        onChange={onChange}
      />,
    );

    fireEvent.press(getByText('B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
