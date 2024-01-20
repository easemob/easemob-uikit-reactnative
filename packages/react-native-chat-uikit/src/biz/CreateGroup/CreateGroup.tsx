import * as React from 'react';

import { ContactList } from '../ContactList';
import { useCreateGroup } from './CreateGroup.hooks';
import type { CreateGroupProps } from './types';

/**
 * Create Group Component.
 */
export function CreateGroup(props: CreateGroupProps) {
  const { onCreateGroupResultValue } = useCreateGroup(props);
  return (
    <ContactList
      contactType={'create-group'}
      onCreateGroupResultValue={onCreateGroupResultValue}
      {...props}
    />
  );
}
