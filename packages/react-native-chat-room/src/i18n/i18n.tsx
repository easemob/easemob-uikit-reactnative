import * as React from 'react';

import { createStringSet } from './StringSet';
import { TranslateImpl } from './Translate';
import type { I18nInit, I18nTr } from './types';

/**
 * Context of the I18n.
 */
export const I18nContext = React.createContext<I18nTr | undefined>(undefined);
I18nContext.displayName = 'UIKitI18nContext';

/**
 * Properties of the I18n context.
 */
type I18nContextProps = React.PropsWithChildren<{ value: I18nInit }>;

/**
 * The I18n context's provider.
 */
export function I18nContextProvider({ value, children }: I18nContextProps) {
  const { stringSet, languageCode, factory } = value;
  const t = new TranslateImpl({
    func: factory ?? createStringSet,
    type: languageCode,
  });
  if (stringSet) {
    t.addCustom({ stringSet, type: languageCode });
  }
  return (
    <I18nContext.Provider
      value={{ tr: t.tr.bind(t), currentLanguage: t.currentLanguage.bind(t) }}
    >
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Get the I18n context's value.
 * @returns The I18n context's value.
 */
export function useI18nContext(): I18nTr {
  const i18n = React.useContext(I18nContext);
  if (!i18n) throw Error(`${I18nContext.displayName} is not provided`);
  return i18n;
}
