import * as React from 'react';
import {
  generateFileName,
  getFileExtension,
  Services,
  useSaveFile,
  uuid,
} from 'react-native-chat-uikit';

export function useSaveFileToAlbum() {
  const { getDocumentPath } = useSaveFile();
  const save = React.useCallback(
    async (localPath: string) => {
      const ext = getFileExtension(localPath);
      const fileName = generateFileName(uuid(), ext);
      const targetPath = getDocumentPath() + '/' + fileName;
      try {
        await Services.ms.saveFromLocal({
          targetPath: targetPath,
          localPath: localPath,
        });
      } catch (error) {
        console.warn('saveToAlbum error', error);
      }
    },
    [getDocumentPath]
  );
  return { saveToAlbum: save };
}
