import React, { useEffect, useState } from 'react';

export const StorybookScreen = () => {
  const [screen, setScreen] = useState<React.ReactNode | null>(null);
  useEffect(() => {
    const StorybookUI = require('../../../.storybook.config').default;
    setScreen(<StorybookUI />);
  }, []);
  return <>{screen}</>;
};
