import { atom } from 'jotai';

/**
 * ユーザー情報の型定義
 */
export interface UserInfo {
  name1: string;
  name2: string;
  member_id: number;
}

/**
 * 認証状態の型定義
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

/**
 * ユーザー情報のAtom
 * ログイン中のユーザー情報を保持
 */
export const userAtom = atom<UserInfo | null>(null);

/**
 * 認証状態のAtom
 * 認証チェックの進行状況を管理
 */
export const authStatusAtom = atom<AuthStatus>('idle');

/**
 * Derived atom: ログイン状態を返す
 */
export const isAuthenticatedAtom = atom((get) => {
  const status = get(authStatusAtom);
  return status === 'authenticated';
});

/**
 * Derived atom: ユーザーの表示名を返す
 */
export const userDisplayNameAtom = atom((get) => {
  const user = get(userAtom);
  if (!user) return '';
  return `${user.name1} ${user.name2}`;
});
