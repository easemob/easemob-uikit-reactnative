import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Text } from '../../ui/Text';
import { TextInput } from '../../ui/TextInput';
import { TopNavigationBar } from '../TopNavigationBar';
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
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    t1: {
      light: colors.primary[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[7],
      dark: colors.neutral[6],
    },
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    save: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  const onValue = React.useCallback(
    (t: string) => {
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
            Left={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 40,
                }}
              >
                <IconButton
                  iconName={'chevron_left'}
                  style={{ width: 24, height: 24, tintColor: getColor('icon') }}
                  onPress={onBack}
                />
                <Text
                  textType={'medium'}
                  paletteType={'title'}
                  style={{
                    color: getColor('t1'),
                  }}
                >
                  {backName}
                </Text>
              </View>
            }
            Right={
              <Pressable
                disabled={disable}
                style={{}}
                onPress={() => {
                  onSave?.(value);
                }}
              >
                <Text
                  textType={'medium'}
                  paletteType={'label'}
                  style={{
                    color: getColor(disable !== true ? 'save' : 't2'),
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
            // maxLength={maxLength}
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
