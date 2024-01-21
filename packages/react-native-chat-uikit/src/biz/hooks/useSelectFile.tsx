import { Services } from '../../services';
import { getFileExtension, LocalPath, timeoutTask, uuid } from '../../utils';
import type {
  SendFileProps,
  SendImageProps,
  SendVideoProps,
} from '../ConversationDetail/types';

export function selectOnePicture(params: {
  onResult: (params: SendImageProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  // !!! https://github.com/react-native-image-picker/react-native-image-picker/issues/1850
  timeoutTask(100, () => {
    Services.ms
      .openMediaLibrary({ selectionLimit: 1, mediaType: 'photo' })
      .then((result) => {
        if (result === undefined || result === null || result.length === 0) {
          params.onCancel?.();
          return;
        }
        params.onResult({
          localPath: LocalPath.sendImage(result[0]!.uri),
          fileSize: result[0]!.size,
          displayName: result[0]!.name,
          imageWidth: result[0]!.width ?? 0,
          imageHeight: result[0]!.height ?? 0,
          fileExtension: result[0]!.type,
          type: 'image',
        });
      })
      .catch((error) => {
        console.warn('error:', error);
        params.onError?.(error);
      });
  });
}
export function selectOneShortVideo(params: {
  convId: string;
  onResult: (params: SendVideoProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  timeoutTask(100, () => {
    Services.ms
      .openMediaLibrary({ selectionLimit: 1, mediaType: 'video' })
      .then(async (result) => {
        if (result === undefined || result === null || result.length === 0) {
          params.onCancel?.();
          return;
        }
        let thumbLocalPath;
        try {
          thumbLocalPath = await Services.ms.getVideoThumbnail({
            url: LocalPath.createImage(result[0]!.uri),
          });
        } catch (error) {
          params.onError?.(error);
          return;
        }

        let tmp = LocalPath.sendVideo(
          Services.dcs.getFileDir(params.convId, uuid())
        );

        const extension = getFileExtension(thumbLocalPath!);
        tmp = tmp + extension;
        if (thumbLocalPath) {
          await Services.ms.saveFromLocal({
            targetPath: tmp,
            localPath: thumbLocalPath,
          });
          thumbLocalPath = tmp;
        }

        params.onResult({
          localPath: LocalPath.sendVideo(result[0]!.uri),
          fileSize: result[0]!.size,
          displayName: result[0]!.name,
          videoWidth: result[0]!.width ?? 0,
          videoHeight: result[0]!.height ?? 0,
          fileExtension: result[0]!.type,
          duration: undefined,
          thumbLocalPath: LocalPath.sendImage(thumbLocalPath ?? ''),
          type: 'video',
        });
      })
      .catch((error) => {
        console.warn('error:', error);
        params.onError?.(error);
      });
  });
}

export function selectCamera(params: {
  onResult: (params: SendImageProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  timeoutTask(100, () => {
    Services.ms
      .openCamera({ cameraType: 'back', mediaType: 'photo' })
      .then(async (result) => {
        if (result === undefined || result === null) {
          params.onCancel?.();
          return;
        }
        params.onResult({
          localPath: LocalPath.sendImage(result.uri),
          fileSize: result.size,
          displayName: result.name,
          imageHeight: result.width ?? 0,
          imageWidth: result.height ?? 0,
          fileExtension: result!.type,
          type: 'image',
        });
      })
      .catch((error) => {
        console.warn('error:', error);
        params.onError?.(error);
      });
  });
}
export function selectFile(params: {
  onResult: (params: SendFileProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  timeoutTask(100, () => {
    Services.ms
      .openDocument({})
      .then((result) => {
        // !!! weird bug: Paths with % percent signs are not supported.
        // !!! iOS returns the uri string and needs to be decoded. Normally no decoding is required.
        // if (Platform.OS === 'ios') {
        //   if (result?.uri.includes('%')) {
        //     // let uri = result.uri.substring(result.uri.lastIndexOf('/'));
        //     // let uri2 = result.uri.substring(0, result.uri.lastIndexOf('/'));
        //     // result.uri = uri2 + decodeURIComponent(uri);
        //     result.uri = decodeURIComponent(result.uri);
        //   }
        // }

        if (result) {
          params.onResult({
            localPath: LocalPath.sendFile(result.uri),
            fileSize: result.size,
            displayName: result.name,
            fileExtension: result!.type,
            type: 'file',
          });
        } else {
          params.onCancel?.();
        }
      })
      .catch((error) => {
        console.warn('error:', error);
        params.onError?.(error);
      });
  });
}
