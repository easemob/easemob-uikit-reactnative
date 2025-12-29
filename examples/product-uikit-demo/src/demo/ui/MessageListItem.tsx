import React from 'react';

import {
  ChatMessageType,
  DefaultImage,
  getImageShowSize,
  getImageThumbUrl,
  ICON_ASSETS,
  MessageContent,
  MessageContentProps,
  MessageDefaultImageProps,
  MessageImageProps,
  useColors,
  useConfigContext,
  useGetStyleProps,
  usePaletteContext,
  useThemeContext,
} from '../../rename.uikit';
import { FastImage } from './FastImage';

export function DemoMessageDefaultImage(props: MessageDefaultImageProps) {
  const {
    url,
    width,
    height,
    thumbHeight,
    thumbWidth,
    iconName,
    onError,
    containerStyle,
  } = props;
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { releaseArea } = useConfigContext();
  const { getColor } = useColors({
    thumb: {
      light: colors.neutral[7],
      dark: colors.neutral[2],
    },
    border: {
      light: colors.neutral[9],
      dark: colors.neutral[3],
    },
  });
  return (
    <DefaultImage
      FastImageComponent={FastImage}
      source={{
        uri: url,
      }}
      style={[
        {
          width: width,
          height: height,
        },
      ]}
      defaultSource={ICON_ASSETS[iconName]('3x')}
      defaultStyle={{
        width: thumbWidth,
        height: thumbHeight,
        tintColor: getColor('thumb'),
      }}
      defaultContainerStyle={{
        width: width,
        height: height,
        backgroundColor: getColor('bg'),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      onError={onError}
      containerStyle={[
        {
          borderWidth: 1,
          borderColor: getColor('border'),
          borderRadius: getBorderRadius({
            height: width + 1,
            crt:
              releaseArea === 'china' ? corner.bubble[0]! : corner.bubble[2]!,
            cr: cornerRadius,
          }),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        containerStyle,
      ]}
    />
  );
}

export function DemoMessageImage(props: MessageImageProps) {
  const { msg, maxWidth } = props;
  const [thumbUrl, setThumbUrl] = React.useState<string | undefined>(undefined);
  const { width, height } = getImageShowSize(msg, maxWidth);
  React.useEffect(() => {
    msg.status;
    getImageThumbUrl(msg)
      .then((url) => {
        setThumbUrl(url);
      })
      .catch();
  }, [msg, msg.status]);
  return (
    <DemoMessageDefaultImage
      url={thumbUrl}
      width={width}
      height={height}
      thumbWidth={64}
      thumbHeight={64}
      iconName={'img'}
    />
  );
}

export function DemoMessageContent(props: MessageContentProps) {
  const { msg, isSupport, layoutType, contentMaxWidth, ...others } = props;
  if (isSupport === true) {
    if (msg.body.type === ChatMessageType.IMAGE) {
      return (
        <DemoMessageImage
          layoutType={layoutType}
          msg={msg}
          maxWidth={contentMaxWidth}
          {...others}
        />
      );
    }
  }
  return <MessageContent {...props} />;
}
