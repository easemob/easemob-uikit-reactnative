import * as React from 'react';
import {
  EmitterSubscription,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ICON_ASSETS } from '../../assets';
import {
  ChatServiceListener,
  DisconnectReasonType,
  PresenceUtil,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useConfigContext } from '../../config';
import { useEventEmitter } from '../../dispatch';
import { useColors, useForceUpdate, useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';
import type { StatusType } from '../types';
import { AvatarStatus } from './AvatarStatus';
import { gEventAvatarStatus } from './const';

export type AvatarProps = DefaultIconImageProps;

/**
 * Avatar component.
 *
 * If the url fails to load, the default avatar is displayed. The default avatar can be customized by setting `Config.personAvatar`.
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
        localIcon ??
        personAvatar ??
        ICON_ASSETS.singleavatars_fill_onlight('3x')
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

/**
 * Group avatar component.
 *
 * If the url fails to load, the default avatar is displayed. The default avatar can be customized by setting `Config.groupAvatar`.
 */
export function GroupAvatar(props: AvatarProps) {
  const { localIcon, ...others } = props;
  const { groupAvatar } = useConfigContext();
  return (
    <Avatar
      {...others}
      localIcon={
        localIcon ?? groupAvatar ?? ICON_ASSETS.groupavatar_fill_onlight('3x')
      }
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

/**
 * Status avatar component.
 *
 * Compared with ordinary avatar components, it has custom status. The `presence` service needs to be activated.
 */
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
  const parentSize = props.size;
  const childrenPaddingSize =
    parentSize >= 100 ? 4 : parentSize >= 50 ? 3 : parentSize >= 40 ? 2.5 : 2;
  const scale =
    parentSize >= 100
      ? 100 / 26
      : parentSize >= 50
      ? 50 / 16
      : parentSize >= 40
      ? 40 / 12
      : 32 / 11.68;
  const urlRef = React.useRef<string | undefined>(url);
  const [status, setStatus] = React.useState<string>('');
  const { AvatarStatusRender, enablePresence } = useConfigContext();
  const { updater } = useForceUpdate();
  const { cornerRadius } = useThemeContext();
  const { avatar: avatarCornerRadius } = cornerRadius;
  const { emitAvatarStatusEvent } = useAvatarStatus();
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
  const getStatusColor = (status: string) => {
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

  const onStatusChanged = React.useCallback(
    (description: string) => {
      setStatus(description);
      emitAvatarStatusEvent({
        status: description as StatusType,
      });
    },
    [emitAvatarStatusEvent]
  );

  const listener = React.useMemo(() => {
    return {
      onPresenceStatusChanged: (list) => {
        if (list.length > 0) {
          const user = list.find((u) => {
            return u.publisher === userId;
          });
          if (user) {
            onStatusChanged(PresenceUtil.convertFromProtocol(user));
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
      onConnected: () => {
        if (userId) {
          im.fetchPresence({
            userIds: [userId],
            onResult: (res) => {
              if (res.isOk === true) {
                onStatusChanged(res.value?.get(userId) ?? 'offline');
              }
            },
          });
        }
      },
      onDisconnected: (reason: DisconnectReasonType) => {
        if (reason === DisconnectReasonType.others) {
          onStatusChanged('offline');
        }
      },
    } as ChatServiceListener;
  }, [im, onStatusChanged, updater, userId]);
  useChatListener(listener);

  React.useEffect(() => {
    if (userId) {
      if (im.userId !== userId) {
        im.loginState().then((state) => {
          if (state === 'logged') {
            im.subPresence({ userIds: [userId] });
          }
        });
      }
      im.fetchPresence({
        userIds: [userId],
        onResult: (res) => {
          if (res.isOk === true) {
            onStatusChanged(res.value?.get(userId) ?? 'offline');
          }
        },
      });
    }
    return () => {
      if (userId && im.userId !== userId) {
        im.loginState().then((state) => {
          if (state === 'logged') {
            im.unSubPresence({ userIds: [userId] });
          }
        });
      }
    };
  }, [im, onStatusChanged, userId]);

  React.useEffect(() => {
    if (url !== urlRef.current && url && url.length > 0) {
      urlRef.current = url;
      updater();
    }
  }, [updater, url]);

  if (enablePresence !== true) {
    return <Avatar url={urlRef.current} {...others} />;
  }

  return (
    <Pressable style={{ overflow: 'hidden' }} onPress={onClicked}>
      <Avatar url={urlRef.current} {...others} />
      {disableStatus === false ? (
        <AvatarStatus
          parentSize={parentSize}
          childrenPaddingSize={childrenPaddingSize}
          scale={scale}
          containerStyle={statusContainerStyle}
          style={[{ backgroundColor: getStatusColor(status) }, statusStyle]}
          positionStyle={
            avatarCornerRadius === 'extraLarge'
              ? 'bottomRight1'
              : 'bottomRight2'
          }
          status={status}
          AvatarStatusRender={AvatarStatusRender}
        />
      ) : null}
    </Pressable>
  );
}

export function useAvatarStatus() {
  const { addEventListener, removeEventListenerBySub, emitEvent } =
    useEventEmitter();
  const _addListener = React.useCallback(
    (listener: (params: { status: StatusType }) => void) => {
      return addEventListener(gEventAvatarStatus, listener);
    },
    [addEventListener]
  );
  const _removeListener = React.useCallback(
    (sub: EmitterSubscription) => {
      removeEventListenerBySub(gEventAvatarStatus, sub);
    },
    [removeEventListenerBySub]
  );
  const _emitEvent = React.useCallback(
    (...params: any[]) => {
      emitEvent(gEventAvatarStatus, ...params);
    },
    [emitEvent]
  );
  return {
    emitAvatarStatusEvent: _emitEvent,
    addAvatarStatusListener: _addListener,
    removeAvatarStatusListener: _removeListener,
  };
}
