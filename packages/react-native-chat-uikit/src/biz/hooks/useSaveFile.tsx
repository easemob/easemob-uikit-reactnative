import * as React from 'react';

import { Services } from '../../services';

export function useSaveFile() {
  const getCachePath = React.useCallback(() => {
    return Services.ms.getDirs().CacheDir;
  }, []);
  const getDocumentPath = React.useCallback(() => {
    return Services.ms.getDirs().DocumentDir;
  }, []);
  const saveFile = React.useCallback(
    async (params: { targetPath: string; localPath: string }) => {
      return Services.ms.saveFromLocal(params);
    },
    []
  );
  return {
    getCachePath,
    getDocumentPath,
    saveFile,
  };
}
