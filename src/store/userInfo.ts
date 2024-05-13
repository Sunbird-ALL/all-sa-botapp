// store.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
export interface IUserInfo {
  session_id: string | null;
  user_virtual_id: string | null;
  conversation_language: string | null;
  learning_language: string | null;
  user_id: string | null;
}

export interface ILoginUserInfo {
  conversation_language: string;
  learning_language: string;
  password: string;
  user_id: string;
}

export const userInfoAtom = atomWithStorage<IUserInfo>(
  'userInfo',
  {
    session_id: null,
    user_virtual_id: null,
    conversation_language: null,
    learning_language: null,
    user_id: null,
  },
  undefined,
  { getOnInit: true }
);

export const userCurrentStageInfo = atom('');
