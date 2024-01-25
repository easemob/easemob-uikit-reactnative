import { ErrorCode, UIKitError } from '../../error';
import { FontStyles, IconStyles, useThemeContext } from '../../theme';
import {
  ButtonColors,
  ButtonSize,
  ButtonStateColor,
  ButtonStateColorType,
  usePaletteContext,
} from '../../theme';
import type { ButtonProps } from './Button';

export const useGetButtonSizeStyle = (
  props: ButtonProps
): {
  button: ButtonSize;
  text: FontStyles;
  icon: IconStyles;
} => {
  const { button } = useThemeContext();
  const { sizesType, contentType } = props;
  type RetType = ReturnType<typeof useGetButtonSizeStyle>;

  const trimming = (params: RetType) => {
    const ret = params;
    switch (contentType) {
      case 'only-icon':
        ret.button.paddingHorizontal = ret.button.paddingVertical;
        break;
      case 'icon-text':
      case 'only-text':
      case 'text-icon':
        break;

      default:
        break;
    }
    return ret;
  };

  switch (sizesType) {
    case 'small':
      return button.size.small as RetType;
    case 'middle':
      return button.size.middle as RetType;
    case 'large':
      return trimming(button.size.large as RetType);

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `ButtonSizesType: ${sizesType}`,
  });
};
export const useGetButtonStyle = (
  props: ButtonProps
): {
  state: ButtonStateColor;
} => {
  const { buttonStyle } = props;
  const { button } = useThemeContext();
  switch (buttonStyle) {
    case 'borderButton':
      return button.style.borderButton;
    case 'commonButton':
      return button.style.commonButton;
    case 'textButton1':
      return button.style.textButton1;
    case 'textButton2':
      return button.style.textButton2;
    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `ButtonStyleType: ${buttonStyle}`,
  });
};
export const useGetButtonStateStyle = (props: ButtonProps): ButtonColors => {
  const { disabled } = props;
  const stateType: ButtonStateColorType =
    disabled === true ? 'disabled' : 'enabled';
  const { state } = useGetButtonStyle(props);
  switch (stateType) {
    case 'disabled':
      return state.disabled;
    case 'enabled':
      return state.enabled;

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `ButtonStateColorType: ${stateType}`,
  });
};
export const useGetButtonRadiusStyle = (props: ButtonProps) => {
  const { radiusType } = props;
  const { button } = useThemeContext();
  const { cornerRadius } = usePaletteContext();
  switch (radiusType) {
    case 'extraSmall':
      return cornerRadius.extraSmall;
    case 'small':
      return cornerRadius.small;
    case 'medium':
      return cornerRadius.medium;
    case 'large':
      return button.size.large.button.height as number;

    default:
      break;
  }
  return undefined;
};
