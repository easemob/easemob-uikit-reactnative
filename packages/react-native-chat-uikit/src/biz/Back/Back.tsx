import * as React from 'react';

import { useColors } from '../../hook';
import { Icon } from '../../ui/Image';

/**
 * Navigation bar back button style.
 * @returns JSX.Element
 */
export function BackButton() {
  const { getColor } = useColors();
  return (
    <Icon
      name={'chevron_left'}
      style={{ width: 24, height: 24, tintColor: getColor('icon') }}
    />
  );
}
