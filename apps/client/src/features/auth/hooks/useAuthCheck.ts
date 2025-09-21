import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { userAtom, authStatusAtom, UserInfo } from '../atoms/userAtom';
import { checkLoginStatus } from '../user-auth';
import { showAuthErrorToast } from '@/lib/toast';

/**
 * 認証チェック用カスタムフック
 * ページマウント時に自動的に認証状態をチェックし、
 * 未認証の場合はログインページにリダイレクトする
 */
export const useAuthCheck = () => {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);

  useEffect(() => {
    const checkAuth = async () => {
      // ローディング開始
      setAuthStatus('loading');

      try {
        // 認証状態をチェック
        const response = await checkLoginStatus();

        // レスポンスから直接フィールドを取得（フラット形式）
        if (response.name1 && response.name2 && response.member_id) {
          const userInfo: UserInfo = {
            name1: response.name1,
            name2: response.name2,
            member_id: response.member_id,
          };

          setUser(userInfo);
          setAuthStatus('authenticated');
        } else {
          // 必要な情報が含まれていない場合は未認証
          setUser(null);
          setAuthStatus('unauthenticated');
          showAuthErrorToast();
          router.push('/profile/login');
        }
      } catch (error) {
        // エラー時は未認証として扱う
        setUser(null);
        setAuthStatus('unauthenticated');
        showAuthErrorToast();
        router.push('/profile/login');
      }
    };

    checkAuth();
  }, [router, setUser, setAuthStatus]);
};
