'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { userAtom, userDisplayNameAtom, authStatusAtom } from '@/features/auth/atoms/userAtom';
import { showSuccessToast } from '@/lib/toast';
import styles from './page.module.css';

export default function TodoPage() {
  return (
    <AuthGuard>
      <TodoContent />
    </AuthGuard>
  );
}

function TodoContent() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const displayName = useAtomValue(userDisplayNameAtom);
  const setUser = useSetAtom(userAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);

  const handleLogout = () => {
    // ユーザー情報をクリア
    setUser(null);
    setAuthStatus('unauthenticated');
    
    // トースト表示
    showSuccessToast('ログアウトしました');
    
    // ログインページへリダイレクト
    router.push('/profile/login');
  };

  return (
    <div className={styles['container']}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Todo リスト</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
        >
          ログアウト
        </button>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <p>ようこそ、{displayName}さん！</p>
        {user && (
          <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <p>ユーザーID: {user.member_id}</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: '2rem' }}>
        <p>ここにTodoリストが表示されます。</p>
      </div>
    </div>
  );
}
