import * as React from 'react';
import {
  Container,
  createDefaultStringSet,
  LanguageCode,
  StringSet,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';

import { createStringSetCn, createStringSetEn } from '../demo/common';
import { LoginV2Screen } from '../demo/screens/LoginV2Screen';
import { SplashScreen } from '../demo/screens/SplashScreen';

export function Splash() {
  return <SplashScreen navigation={{} as any} route={{} as any} />;
}

export function LoginV2() {
  return <LoginV2Screen navigation={{} as any} route={{} as any} />;
}

export default function TestSplash() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
      onInitLanguageSet={() => {
        const ret = (
          language: LanguageCode,
          _defaultSet: StringSet
        ): StringSet => {
          const d = createDefaultStringSet(language);
          if (language === 'zh-Hans') {
            return {
              ...d,
              ...createStringSetCn(),
            };
          } else if (language === 'en') {
            return {
              ...d,
              ...createStringSetEn(),
            };
          }
          return d;
        };
        return ret;
      }}
    >
      <LoginV2 />
    </Container>
  );
}
