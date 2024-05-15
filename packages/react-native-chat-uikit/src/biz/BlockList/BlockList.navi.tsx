import * as React from 'react';
import { View } from 'react-native';

import { useI18nContext } from '../../i18n';
import { TopNavigationBar, TopNavigationBarLeft } from '../TopNavigationBar';
import { BlockListNavigationBarProps } from './types';

type _BlockListNavigationBarProps = BlockListNavigationBarProps & {
  blockCount?: number;
};
export const BlockListNavigationBar = (props: _BlockListNavigationBarProps) => {
  const { customNavigationBar, onBack, blockCount } = props;
  const { tr } = useI18nContext();

  if (customNavigationBar) {
    return <>{customNavigationBar}</>;
  }

  return (
    <TopNavigationBar
      Left={
        <TopNavigationBarLeft
          onBack={onBack}
          content={tr('_uikit_block_title', blockCount)}
        />
      }
      Right={<View style={{ width: 32, height: 32 }} />}
    />
  );
};
