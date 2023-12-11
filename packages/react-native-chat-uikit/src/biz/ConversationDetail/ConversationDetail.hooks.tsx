import * as React from 'react';

import { useChatContext } from '../../chat';
import { usePermissions } from '../../hook';
import type { ConversationDetailProps } from './types';
import { useCreateConversationDirectory } from './useCreateConversationDirectory';

export function useConversationDetail(props: ConversationDetailProps) {
  const { convId, convType, testMode } = props;
  const permissionsRef = React.useRef(false);
  usePermissions({
    onResult: (isSuccess) => {
      console.log('test:zuoyu:permissions:', isSuccess);
      permissionsRef.current = isSuccess;
    },
  });
  const { createDirectoryIfNotExisted } = useCreateConversationDirectory();
  const im = useChatContext();

  const setConversation = React.useCallback(async () => {
    const conv = await im.getConversation({
      convId,
      convType,
      createIfNotExist: true,
    });
    if (conv) {
      im.setCurrentConversation({ conv });
    }
  }, [convId, convType, im]);

  React.useEffect(() => {
    const conv = im.getCurrentConversation();
    if (conv === undefined || conv.convId !== convId) {
      if (testMode === 'only-ui') {
        im.setCurrentConversation({ conv: { convId, convType } });
      } else {
        setConversation().then(() => {
          // todo: ready
        });
      }
    }
  }, [convId, convType, im, setConversation, testMode]);

  React.useEffect(() => {
    createDirectoryIfNotExisted(convId);
  }, [convId, createDirectoryIfNotExisted]);

  return {};
}
