import { type UIKitError, useI18nContext } from '../../rename.uikit';

export function useOnFinishedParser() {
  const { tr } = useI18nContext();
  const parseFinished = (eventType: string) => {
    switch (eventType) {
      case 'copyGroupId':
        return tr('_demo_copyGroupId');
      case 'copyUserId':
        return tr('_demo_copyUserId');
      case 'imageSaved':
        return tr('_demo_imageSaved');
      case 'videoSaved':
        return tr('_demo_videoSaved');
      case 'fetchPinnedMessagesResult':
        return tr('_demo_fetchPinnedMessagesResult');

      default:
        break;
    }
    return undefined;
  };
  return {
    parseFinished,
  };
}

export function useOnErrorParser() {
  const parseError = (error: UIKitError) => {
    return error.toString();
  };
  return {
    parseError,
  };
}
