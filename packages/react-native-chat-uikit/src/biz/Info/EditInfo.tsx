import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import { useColors, useGetStyleProps } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Text } from '../../ui/Text';
import { TextInput } from '../../ui/TextInput';
import { TopNavigationBar, TopNavigationBarLeft } from '../TopNavigationBar';
import type { EditInfoProps } from './types';

/**
 * Edit Info Component.
 */
export function EditInfo(props: EditInfoProps) {
  const {
    containerStyle,
    onBack,
    backName,
    saveName,
    maxLength = 128,
    initialData,
    onSave,
    navigationBarVisible,
    customNavigationBar,
  } = props;
  const {} = useI18nContext();
  const inputRef = React.useRef<RNTextInput>(null);
  const [value, setValue] = React.useState<string>(initialData);
  const [count, setCount] = React.useState<number>(initialData?.length ?? 0);
  const [disable, setDisable] = React.useState<boolean>(false);
  const { style, cornerRadius: corner } = useThemeContext();
  const { cornerRadius, colors } = usePaletteContext();
  const { getBorderRadius } = useGetStyleProps();
  const { getColor } = useColors({
    t1: {
      light: colors.primary[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
  });

  const onValue = React.useCallback(
    (t: string) => {
      // if (t.length > maxLength) {
      //   return;
      // }
      if (initialData === t) {
        setDisable(true);
      } else {
        setDisable(false);
      }
      setCount(t.length);
      setValue(t);
    },
    [initialData]
  );

  React.useEffect(() => {
    setValue(initialData);
    setDisable(true);
    setCount(initialData?.length ?? 0);
  }, [initialData]);

  return (
    <View
      style={[
        {
          flexGrow: 1,
          // paddingHorizontal: 12,
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={<TopNavigationBarLeft onBack={onBack} content={backName} />}
            Right={
              <Pressable
                disabled={disable}
                style={{ paddingHorizontal: 16 }}
                onPress={() => {
                  onSave?.(value);
                }}
              >
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  style={{
                    color: getColor(disable !== true ? 'enable' : 't2'),
                  }}
                >
                  {saveName}
                </Text>
              </Pressable>
            }
          />
        )
      ) : null}
      <KeyboardAvoidingView style={{ paddingHorizontal: 12 }}>
        <View
          style={{
            paddingBottom: 22,
            backgroundColor: getColor('bg2'),
            borderRadius: getBorderRadius({
              height: 36,
              crt: corner.avatar,
              cr: cornerRadius,
              style: containerStyle,
            }),
          }}
        >
          <TextInput
            ref={inputRef}
            numberOfLines={10}
            multiline={true}
            unitHeight={Platform.OS === 'ios' ? 20 : 20}
            autoFocus={true}
            style={{
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 22,
              // fontFamily: fontFamily,
              color: getColor('t1'),
              // backgroundColor: 'green',
            }}
            containerStyle={{
              marginBottom: 13,
              marginLeft: 16,
              marginRight: 16,
              marginTop: 13,
              // width: '100%',
              minHeight: 36,
              maxHeight: 200,
            }}
            // onFocus={onFocus}
            // onBlur={onBlur}
            onChangeText={onValue}
            value={value}
            keyboardAppearance={style === 'light' ? 'light' : 'dark'}
            maxLength={maxLength}
            statistics={{
              maxCount: maxLength,
              count: count,
            }}
          />
        </View>
      </KeyboardAvoidingView>
      {/* <View
        style={{
          // width: '100%',
          alignItems: 'flex-end',
          marginHorizontal: 12,
          paddingHorizontal: 8,
          backgroundColor: getColor('bg2'),
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <Text
          textType={'large'}
          paletteType={'body'}
          style={{ color: getColor('t2') }}
        >
          {`${count}/${maxLength}`}
        </Text>
      </View> */}
      <View
        style={{ flexGrow: 1, backgroundColor: getColor('bg') }}
        onTouchEnd={() => {
          inputRef.current?.blur();
        }}
      />
    </View>
  );
}
