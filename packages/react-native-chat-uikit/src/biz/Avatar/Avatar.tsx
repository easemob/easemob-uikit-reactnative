import * as React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import {
  ChatServiceListener,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useConfigContext } from '../../config';
import { useColors, useForceUpdate, useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';
import type { StatusType } from '../types';

export type AvatarProps = DefaultIconImageProps;

/**
 * Avatar component. If the url is incorrect, does not exist, or a network error occurs
 *
 * @param props {@link DefaultIconImageProps}
 */
export function Avatar(props: AvatarProps) {
  const { size, style, localIcon, ...others } = props;
  const { cornerRadius: corner } = useThemeContext();
  const { cornerRadius } = usePaletteContext();
  const { getBorderRadius } = useGetStyleProps();
  const { personAvatar } = useConfigContext();

  return (
    <DefaultIconImage
      localIcon={
        localIcon ?? personAvatar ?? ICON_ASSETS.person_single_outline('3x')
      }
      size={size}
      style={[
        style,
        {
          borderRadius: getBorderRadius({
            height: size,
            crt: corner.avatar,
            cr: cornerRadius,
            style,
          }),
        },
      ]}
      borderRadius={getBorderRadius({
        height: size,
        crt: corner.avatar,
        cr: cornerRadius,
        style,
      })}
      {...others}
    />
  );
}

export function GroupAvatar(props: AvatarProps) {
  const { localIcon, ...others } = props;
  const { groupAvatar } = useConfigContext();
  return (
    <Avatar
      {...others}
      localIcon={localIcon ?? groupAvatar ?? ICON_ASSETS.person_double('3x')}
    />
  );
}

export type StatusAvatarProps = AvatarProps & {
  userId?: string;
  onClicked?: () => void;
  statusContainerStyle?: StyleProp<ViewStyle>;
  statusStyle?: StyleProp<ViewStyle>;
  disableStatus?: boolean;
};
export function StatusAvatar(props: StatusAvatarProps) {
  const {
    userId,
    onClicked,
    statusContainerStyle,
    statusStyle,
    url,
    disableStatus = false,
    ...others
  } = props;
  const urlRef = React.useRef<string | undefined>(url);
  const [status, setStatus] = React.useState<string>();
  const { onChangeStatus, enablePresence } = useConfigContext();
  const { updater } = useForceUpdate();
  const im = useChatContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    online: {
      light: colors.secondary[5],
      dark: colors.secondary[5],
    },
    busy: {
      light: colors.error[7],
      dark: colors.error[6],
    },
    leave: {
      light: colors.neutral[7],
      dark: colors.neutral[7],
    },
    custom: {
      light: '#FFE145',
      dark: '#FFE145',
    },
  });
  const getStatus = (status: string) => {
    if (status === 'online') {
      return getColor('online');
    } else if (status === 'busy') {
      return getColor('busy');
    } else if (status === 'leave' || status === 'offline') {
      return getColor('leave');
    } else if (status === 'custom') {
      return getColor('custom');
    }
    return getColor('custom');
  };

  const listener = React.useMemo(() => {
    return {
      onPresenceStatusChanged: (list) => {
        if (list.length > 0) {
          const user = list.find((u) => {
            return u.publisher === userId;
          });
          if (user) {
            setStatus(user.statusDescription);
            onChangeStatus?.(user.statusDescription as StatusType);
          }
        }
      },
      onFinished: (params) => {
        if (params.event === 'updateSelfInfo') {
          const ret = im.user(im.userId);
          if (ret && ret.avatarURL && ret.avatarURL.length > 0) {
            urlRef.current = ret.avatarURL;
            updater();
          }
        }
      },
    } as ChatServiceListener;
  }, [im, onChangeStatus, updater, userId]);
  useChatListener(listener);

  React.useEffect(() => {
    if (userId) {
      if (im.userId !== userId) {
        im.subPresence({ userIds: [userId] });
      }
      im.fetchPresence({
        userIds: [userId],
        onResult: (res) => {
          if (res.isOk === true) {
            const user = res.value?.find((u) => {
              return u.publisher === userId;
            });
            if (user) {
              setStatus(user.statusDescription);
              onChangeStatus?.(user.statusDescription as StatusType);
            }
          }
        },
      });
    }
    return () => {
      if (userId && im.userId !== userId) {
        im.unSubPresence({ userIds: [userId] });
      }
    };
  }, [im, onChangeStatus, userId]);

  React.useEffect(() => {
    if (url !== urlRef.current) {
      urlRef.current = url;
      updater();
    }
  }, [updater, url]);

  if (enablePresence !== true) {
    return <Avatar {...others} />;
  }

  return (
    <Pressable style={{ overflow: 'hidden' }} onPress={onClicked}>
      <Avatar url={urlRef.current} {...others} />
      {onChangeStatus ? (
        onChangeStatus?.(status as StatusType)
      ) : disableStatus === false ? (
        <View
          style={[
            {
              position: 'absolute',
              right: -1,
              bottom: -1,
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: getColor('bg'),
              justifyContent: 'center',
              alignItems: 'center',
            },
            statusContainerStyle,
          ]}
        >
          <View
            style={[
              {
                width: 7.68,
                height: 7.68,
                borderRadius: 9,
                backgroundColor: getStatus(status ?? ''),
              },
              statusStyle,
            ]}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
