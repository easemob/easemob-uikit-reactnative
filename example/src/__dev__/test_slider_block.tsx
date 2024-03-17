import { default as Slider } from '@react-native-community/slider';
import * as React from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';
import {
  Container,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SlideBlock() {
  const [color, setColor] = React.useState('red');
  return (
    <SafeAreaView>
      <View style={{ height: 100 }} />
      <MySlider
        height={40}
        width={300}
        min={0}
        max={255}
        defaultValue={100}
        step={100}
        onChange={(process) => {
          console.log('process', process);
          setColor(`rgba(${process * 255}, 0, 0, 1)`);
        }}
        maximumTrackTintColor="#dcdbdb"
        minimumTrackTintColor="#577bff"
        processHeight={5}
        thumbImage={require('../../assets/logo.png')}
        thumbSize={30}
      />
      <View style={{ height: 100 }} />
      <View style={{}}>
        <Slider
          minimumValue={0}
          maximumValue={255}
          step={0}
          minimumTrackTintColor={'red'}
          // value={50}
          style={{
            height: 10,
            width: '80%',
          }}
          onValueChange={(value) => {
            console.log('value', value);
            setColor(`rgba(${value}, 0, 0, 1)`);
          }}
        />
      </View>
      <View style={{ height: 100, width: 100, backgroundColor: color }} />
    </SafeAreaView>
  );
}

export default function TestSliderBlock() {
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
    >
      <SlideBlock />
    </Container>
  );
}

////// End of file //////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ScreenWidth = Dimensions.get('window').width;

type Props = {
  height?: number; // 控件高度
  width?: number; // 控件宽度
  maximumTrackTintColor?: string; // 进度条背景颜色
  minimumTrackTintColor?: string; // 进度条进度部分颜色
  onChange?: (process: number) => void; // 进度值发生改变时的回调
  onAfterChange?: Function; // 拖动结束时的回调
  defaultValue: number; // 默认的进度值
  min: number; // 进度范围最小值
  max: number; // 进度范围最大值
  step: number; // 步长（进度变化的最小单位）
  disabled?: boolean; // 是否可以拖动
  thumbSize: number; // 滑块的尺寸
  thumbImage?: number; // 滑块的图片
  processHeight?: number; // 进度条高度
};

export class MySlider extends React.PureComponent<Props> {
  static defaultProps = {
    height: 60,
    width: ScreenWidth,
    onChange: () => {},
    onAfterChange: () => {},
    defaultValue: 0,
    disabled: false,
    thumbSize: 30,
    thumbImage: undefined,
    maximumTrackTintColor: '#dcdbdb',
    minimumTrackTintColor: '#577BFF',
    processHeight: 7,
    min: 0,
    max: 100,
    step: 1,
  } as Props;

  state = {
    process: 0,
    processWidth: 0,
  };
  watcher: any;

  constructor(props: Props) {
    super(props);
    this._onPanResponderGrant = this._onPanResponderGrant.bind(this);
    this._onPanResponderEnd = this._onPanResponderEnd.bind(this);
    this._onPanResponderMove = this._onPanResponderMove.bind(this);
  }

  componentWillMount() {
    this.watcher = PanResponder.create({
      // 建立监视器
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this._onPanResponderGrant, // 按下
      onPanResponderMove: this._onPanResponderMove, // 移动
      onPanResponderEnd: this._onPanResponderEnd, // 结束
    });
    const { defaultValue, min, max, thumbSize, width } = this.props;
    const process = defaultValue / (max - min);
    console.log(
      'componentWillMount',
      process,
      defaultValue,
      max,
      min,
      thumbSize,
      this.props.width
    );
    const w = width ?? ScreenWidth;

    this.setState({
      process,
      processWidth: w - thumbSize,
    });
  }

  _onPanResponderGrant(
    _e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) {
    const { thumbSize } = this.props;
    const { processWidth } = this.state;

    const process = (gestureState.x0 - thumbSize / 2) / processWidth;
    console.log(
      '_onPanResponderGrant',
      process,
      gestureState.x0,
      thumbSize,
      processWidth
    );

    this._changeProcess(process);
  }

  _onPanResponderMove(
    _e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) {
    const { thumbSize } = this.props;
    const { processWidth } = this.state;

    const process =
      (gestureState.x0 - thumbSize / 2 + gestureState.dx) / processWidth;

    this._changeProcess(process);
  }

  _onPanResponderEnd(
    _e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) {
    const { onAfterChange } = this.props;
    onAfterChange?.(gestureState.x0);
  }

  _changeProcess(changeProcess: number) {
    // 判断滑动开关
    const { disabled } = this.props;

    if (disabled) return;

    const { onChange } = this.props;
    const { process } = this.state;

    if (changeProcess >= 0 && changeProcess <= 1) {
      onChange?.(changeProcess);

      if (process !== changeProcess) {
        this.setState({
          process: changeProcess,
        });
      }
    }
  }

  _getThumbView() {
    const { thumbImage, thumbSize } = this.props;
    const { process, processWidth } = this.state;

    if (thumbImage) {
      return (
        <Image
          style={{
            width: thumbSize,
            height: thumbSize,
            position: 'absolute',
            left: process * processWidth,
          }}
          source={thumbImage}
        />
      );
    }

    return (
      <View
        style={{
          width: thumbSize,
          height: thumbSize,
          position: 'absolute',
          left: process * processWidth,
          borderRadius: thumbSize / 2,
          backgroundColor: '#808080',
        }}
      />
    );
  }

  render() {
    const {
      height,
      width,
      maximumTrackTintColor,
      minimumTrackTintColor,
      thumbSize,
      processHeight,
    } = this.props;
    const { process, processWidth } = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            height,
            width,
          },
        ]}
        {...this.watcher.panHandlers}
      >
        <View
          style={{
            backgroundColor: minimumTrackTintColor,
            width: process * processWidth,
            height: processHeight,
            marginLeft: thumbSize / 2,
          }}
        />

        <View
          style={{
            backgroundColor: maximumTrackTintColor,
            flex: 1,
            height: processHeight,
            marginRight: thumbSize / 2,
          }}
        />

        {this._getThumbView()}
      </View>
    );
  }
}
