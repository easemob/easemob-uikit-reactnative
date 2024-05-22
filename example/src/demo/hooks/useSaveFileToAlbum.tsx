import * as React from 'react';
import {
  generateFileName,
  getFileExtension,
  LocalPath,
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
  const save2 = React.useCallback((localPath: string) => {
    Services.ms.saveToAlbum(LocalPath.saveToAlbum(localPath));
  }, []);
  return { saveToAlbum: save, saveToAlbum2: save2 };
}
