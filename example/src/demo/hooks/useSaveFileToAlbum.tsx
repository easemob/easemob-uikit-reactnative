import * as React from 'react';

import {
  generateFileName,
  getFileExtension,
  LocalPath,
  Services,
  useSaveFile,
  uuid,
} from '../../rename.uikit';

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
  const save2 = React.useCallback(async (localPath: string) => {
    try {
      await Services.ms.saveToAlbum(LocalPath.saveToAlbum(localPath));
    } catch (error) {
      console.warn('saveToAlbum2 error', error);
    }
  }, []);
  return { saveToAlbum: save, saveToAlbum2: save2 };
}
