import * as React from 'react';
import {
  Animated,
  ColorValue,
  StyleProp,
  // Text as RNText,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useConfigContext } from '../../config';
import { useCheckType, useColors, useGetStyleSize } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { PresetCalcTextWidth, Text } from '../../ui/Text';
import { changeOpacity, Queue } from '../../utils';
import { gGlobalBroadcastHeight } from './GlobalBroadcast.const';
import { createCompose } from './GlobalBroadcast.hooks';
import type { GlobalBroadcastTask } from './types';

/**
 * Referencing value of the `GlobalBroadcast` component.
 */
export type GlobalBroadcastRef = {
  /**
   * Push a task to the queue.
   */
  pushTask: (task: GlobalBroadcastTask) => void;
};

/**
 * Properties of the `GlobalBroadcast` component.
 */
export type GlobalBroadcastProps = {
  /**
   * Whether to display the component.
   *
   * Changing the display or hiding in this way usually does not trigger the loading and unloading of components.
   */
  visible?: boolean;
  /**
   * The speed of the animation.
   * default: 8.0.
   * Range [0, 100]
   */
  playSpeed?: number;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The style of the text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * The icon component.
   */
  icon?: React.ReactElement;
  /**
   * Callback function when the animation is finished.
   */
  onFinished?: () => void;
};

/**
 * The GlobalBroadcast component provides a floating text animation.
 *
 * Messages can be displayed in sequence through a queue.
 *
 * @param props {@link GlobalBroadcastProps}
 * @param ref {@link GlobalBroadcastRef}
 * @returns JSX.Element
 *
 * @test {@link example/src/__dev__/test_globalBroadcast.tsx}
 *
 * @example
 *
 * ```tsx
 * const ref = React.useRef<GlobalBroadcastRef>({} as any);
 * // ...
 * <GlobalBroadcast ref={ref} />
 * // ...
 * ref.current?.pushTask?.({
 *   model: {
 *     id: count.toString(),
 *     content: count.toString() + content,
 *   },
 * });
 * ```
 */
export const GlobalBroadcast = React.forwardRef<
  GlobalBroadcastRef,
  GlobalBroadcastProps
>(function (
  props: GlobalBroadcastProps,
  ref?: React.ForwardedRef<GlobalBroadcastRef>
) {
  const {
    visible = true,
    playSpeed,
    containerStyle,
    textStyle,
    onFinished,
  } = props;
  const bg = (containerStyle as any).backgroundColor as ColorValue | undefined;
  const { getViewStyleSize } = useGetStyleSize();
  const { colors, lineGradient } = usePaletteContext();
  const { getColor, getColors } = useColors({
    color: {
      light: colors.barrage.onLight[100],
      dark: colors.barrage.onDark[100],
    },
    backgroundColor: {
      light: bg ?? colors.error[7],
      dark: bg ?? colors.error[7],
    },
    backgroundColor2: {
      light: [
        bg ?? colors.error[7],
        bg ? changeOpacity(bg as string, 0) : 'hsla(203, 100%, 60%, 0)',
      ],
      dark: [
        bg ?? colors.error[7],
        bg ? changeOpacity(bg as string, 0) : 'hsla(203, 100%, 60%, 0)',
      ],
    },
    backgroundColor3: {
      light: [
        bg ? changeOpacity(bg as string, 0) : 'hsla(203, 100%, 60%, 0)',
        bg ?? colors.error[7],
      ],
      dark: [
        bg ? changeOpacity(bg as string, 0) : 'hsla(203, 100%, 60%, 0)',
        bg ?? colors.error[7],
      ],
    },
    tintColor: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const { start, end } = lineGradient.leftToRight;

  const containerSize = getViewStyleSize(containerStyle);
  const { enableCheckType } = useConfigContext();
  const { checkType } = useCheckType({ enabled: enableCheckType });
  if (containerSize?.height) {
    checkType(containerSize.height, 'number');
  }
  if (containerSize?.width) {
    checkType(containerSize.width, 'number');
  }

  const { width: winWidth } = useWindowDimensions();
  const containerWidth = (containerSize?.width ?? winWidth) as number;
  const containerHeight = (containerSize?.height ??
    gGlobalBroadcastHeight) as number;

  const [contentWidth, setContentWidth] = React.useState(0);
  const [content, setContent] = React.useState('1234567890');
  const [isShow, setIsShow] = React.useState(false);
  const isSameContent = React.useRef(false);

  const x = React.useRef(new Animated.Value(0)).current;
  const tasks: Queue<GlobalBroadcastTask> = React.useRef(
    new Queue<GlobalBroadcastTask>()
  ).current;
  const preTask = React.useRef<GlobalBroadcastTask | undefined>(undefined);
  const curTask = React.useRef<GlobalBroadcastTask | undefined>(undefined);

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        setIsShow(true);
        if (task.model.content === content) {
          isSameContent.current = true;
          execAnimating(contentWidth);
        } else {
          isSameContent.current = false;
          setContent(task.model.content);
        }
      } else {
        setIsShow(false);
        onFinished?.();
      }
    }
  };

  const execAnimating = (w: number) => {
    createCompose({
      x: x,
      startX: 0,
      endX: containerWidth - w - containerHeight * 1.5,
      contentWidth: w,
      width: containerWidth,
      speed: playSpeed,
    }).compose(() => {
      preTask.current = curTask.current;
      curTask.current = undefined;
      execTask();
    });
  };

  const pushTask = (task: GlobalBroadcastTask) => {
    tasks.enqueue(task);
    execTask();
  };

  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GlobalBroadcastTask) => {
          pushTask(task);
        },
      };
    },
    // !!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <View
      style={[
        {
          maxWidth: containerWidth,
          height: containerHeight,
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'scroll',
          paddingLeft: containerHeight + 4,
          paddingRight: containerHeight / 2,
          borderRadius: 10,
          display: visible === true && isShow === true ? 'flex' : 'none',
          backgroundColor: getColor('backgroundColor'),
        },
        containerStyle,
      ]}
    >
      <PresetCalcTextWidth
        content={content}
        textProps={{
          textType: 'small',
          paletteType: 'body',
          style: textStyle,
        }}
        onWidth={(w: number) => {
          setContentWidth(w + 1);
          if (curTask.current === undefined) {
            return;
          }
          if (isSameContent.current === true) {
            return;
          }
          execAnimating(w);
        }}
      />
      <Animated.View
        style={[
          {
            width: contentWidth,
            backgroundColor: getColor('backgroundColor'),
            transform: [{ translateX: x }],
          },
        ]}
      >
        <Text
          textType={'small'}
          paletteType={'body'}
          numberOfLines={1}
          style={[{ color: getColor('color') }, textStyle]}
        >
          {content}
        </Text>
      </Animated.View>
      <GlobalBroadcastIcon
        getColor={getColor}
        containerHeight={containerHeight}
        {...props}
      />
      <LinearGradient
        colors={getColors('backgroundColor3') as (string | number)[]}
        // colors={['hsla(350, 100%, 70%, 0)', 'red']}
        start={end}
        end={start}
        style={{
          position: 'absolute',
          height: containerHeight,
          width: containerHeight / 4,
          left: containerHeight,
        }}
      />
      <LinearGradient
        colors={getColors('backgroundColor2') as (string | number)[]}
        // colors={['red', 'hsla(350, 100%, 70%, 0)']}
        start={end}
        end={start}
        style={{
          position: 'absolute',
          height: containerHeight,
          width: containerHeight / 4,
          right: containerHeight / 2,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          height: containerHeight,
          width: containerHeight / 2,
          backgroundColor: getColor('backgroundColor'),
        }}
      />
    </View>
  );
});

const GlobalBroadcastIcon = ({
  containerHeight,
  icon,
  getColor,
}: GlobalBroadcastProps & {
  containerHeight: number;
  getColor: (key: string) => ColorValue | undefined;
}) => {
  return icon ? (
    <>{icon}</>
  ) : (
    <View
      style={{
        height: containerHeight,
        width: containerHeight,
        backgroundColor: getColor('backgroundColor'),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon
        name={'spkeaker_n_vertical_bar'}
        style={[
          {
            tintColor: getColor('tintColor'),
            height: 16,
            width: 16,
            backgroundColor: getColor('backgroundColor'),
          },
        ]}
      />
    </View>
  );
};

export type GlobalBroadcastComponent = typeof GlobalBroadcast;
