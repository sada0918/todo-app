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
        console.log('🔍 認証チェック開始...');
        const response = await checkLoginStatus();
        console.log('✅ 認証チェック成功:', response);

        // レスポンスから直接フィールドを取得（フラット形式）
        if (response.name1 && response.name2 && response.member_id) {
          const userInfo: UserInfo = {
            name1: response.name1,
            name2: response.name2,
            member_id: response.member_id,
          };

          console.log('👤 ユーザー情報を保存:', userInfo);
          setUser(userInfo);
          setAuthStatus('authenticated');
        } else {
          // 必要な情報が含まれていない場合は未認証
          console.warn('⚠️ レスポンスに必要な情報が含まれていません:', response);
          setUser(null);
          setAuthStatus('unauthenticated');
          showAuthErrorToast();
          router.push('/profile/login');
        }
      } catch (error) {
        // エラー時は未認証として扱う
        console.error('❌ 認証チェック失敗:', error);
        console.error('エラー詳細:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
        setUser(null);
        setAuthStatus('unauthenticated');
        showAuthErrorToast();
        router.push('/profile/login');
      }
    };

    checkAuth();
  }, [router, setUser, setAuthStatus]);
};
