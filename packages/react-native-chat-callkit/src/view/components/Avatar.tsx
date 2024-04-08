import * as React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { hashCode } from '../../utils/utils';
// import Image from './Image';
import { IconName, LocalIcon, localLocalIcon } from './LocalIcon';

type SubComponents = {};

const AVATAR_SIZE = 56;

type AvatarProps = {
  uri: string | number;
  uriOnError?: IconName | undefined;
  size?: number | undefined;
  radius?: number | undefined;
  containerStyle?: StyleProp<ViewStyle> | undefined;
};

export const Avatar: ((props: AvatarProps) => JSX.Element) & SubComponents = ({
  uri,
  uriOnError,
  size = AVATAR_SIZE,
  radius = AVATAR_SIZE / 2,
  containerStyle,
}): JSX.Element => {
  const [loadDefault, setLoadDefault] = React.useState(false);
  const uriS = typeof uri === 'number' ? uri : { uri: uri };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: 'white',
        },
        containerStyle,
      ]}
    >
      {loadDefault ? (
        <LocalIcon name={uriOnError ?? 'default_avatar'} size={size * 1.0} />
      ) : (
        <Image
          onError={() => {
            setLoadDefault(true);
          }}
          source={uriS}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width: size, height: size }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export const AvatarMemo = React.memo(Avatar);

const avatarNames = [
  'agora_avatar_1',
  'agora_avatar_2',
  'agora_avatar_3',
  'agora_avatar_4',
  'agora_avatar_5',
  'agora_avatar_6',
  'agora_avatar_7',
  'agora_avatar_8',
  'agora_avatar_9',
  'agora_avatar_10',
  'agora_avatar_11',
  'agora_avatar_12',
] as IconName[];
const avatarNamesCount = avatarNames.length;

export function DefaultAvatar(
  props: Omit<AvatarProps, 'uri' | 'uriOnError'> & {
    userId: string;
    userAvatar?: string;
  }
): JSX.Element {
  const { userId, userAvatar, ...others } = props;
  const i = hashCode(userId);
  const index = Math.abs(i) % avatarNamesCount;
  const name = avatarNames[index] as IconName;
  const source = localLocalIcon(name) as number;
  return <Avatar uri={userAvatar ?? source} {...others} />;
}

export const DefaultAvatarMemo = React.memo(DefaultAvatar);
