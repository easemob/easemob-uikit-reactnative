import { Platform } from 'react-native';

import { Services } from '../../services';
import { getFileExtension, localUrl, uuid } from '../../utils';
import type { SendFileProps, SendImageProps, SendVideoProps } from './types';

export function selectOnePicture(params: {
  onResult: (params: SendImageProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  Services.ms
    .openMediaLibrary({ selectionLimit: 1, mediaType: 'photo' })
    .then((result) => {
      console.log('openMediaLibrary:', Platform.OS, result);
      if (result === undefined || result === null || result.length === 0) {
        params.onCancel?.();
        return;
      }
      console.log('openMediaLibrary:', Platform.OS, result[0]?.type);
      params.onResult({
        localPath: result[0]!.uri,
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
}
export function selectOneShortVideo(params: {
  convId: string;
  onResult: (params: SendVideoProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  Services.ms
    .openMediaLibrary({ selectionLimit: 1, mediaType: 'video' })
    .then(async (result) => {
      console.log('openMediaLibrary:', Platform.OS, result);
      if (result === undefined || result === null || result.length === 0) {
        params.onCancel?.();
        return;
      }
      console.log('openMediaLibrary:', Platform.OS, result[0]?.type);
      let thumbLocalPath;
      try {
        thumbLocalPath = await Services.ms.getVideoThumbnail({
          url: result[0]!.uri,
        });
      } catch (error) {
        console.warn('dev:getVideoThumbnail', error);
        params.onError?.(error);
        return;
      }

      let localPath = localUrl(Services.dcs.getFileDir(params.convId, uuid()));
      const extension = getFileExtension(thumbLocalPath!);
      localPath = localPath + extension;
      console.log('test:zuoyu:video:file:', localPath, thumbLocalPath);
      params.onResult({
        localPath: result[0]!.uri,
        fileSize: result[0]!.size,
        displayName: result[0]!.name,
        videoWidth: result[0]!.width ?? 0,
        videoHeight: result[0]!.height ?? 0,
        fileExtension: result[0]!.type,
        duration: undefined,
        thumbLocalPath: thumbLocalPath ?? '',
        type: 'video',
      });
    })
    .catch((error) => {
      console.warn('error:', error);
      params.onError?.(error);
    });
}

export function selectCamera(params: {
  onResult: (params: SendImageProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  Services.ms
    .openCamera({ cameraType: 'back', mediaType: 'photo' })
    .then(async (result) => {
      console.log('openMediaLibrary:', Platform.OS, result);
      if (result === undefined || result === null) {
        params.onCancel?.();
        return;
      }
      console.log('openMediaLibrary:', Platform.OS, result?.type);
      params.onResult({
        localPath: result.uri,
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
}
export function selectFile(params: {
  onResult: (params: SendFileProps) => void;
  onCancel?: () => void;
  onError?: (error: any) => void;
}) {
  Services.ms
    .openDocument({})
    .then((result) => {
      console.log('openDocument:', Platform.OS, result);
      if (result !== undefined && result !== null) {
        params.onResult({
          localPath: result.uri,
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
}
