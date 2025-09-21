'use client';

import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { userAtom, userDisplayNameAtom, authStatusAtom } from '@/features/auth/atoms/userAtom';
import { showSuccessToast } from '@/lib/toast';
import { useTodoList } from '@/features/todo/hooks/useTodoList';
import { TodoList } from '@/features/todo/components/TodoList';
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

  // Todoリストを取得
  const { todos, pageInfo, isLoading, refetch } = useTodoList();

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        maxWidth: '525px',
        margin: '0 auto 2rem auto'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{displayName}のTodoリスト</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.color = '#374151';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          ログアウト
        </button>
      </div>

      {/* Todoリスト表示 */}
      <div style={{ marginTop: '2rem' }}>
        <TodoList todos={todos} isLoading={isLoading} />
        
        {pageInfo && pageInfo.totalCnt > 0 && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            {pageInfo.totalCnt}件中 {pageInfo.firstIndex}〜{pageInfo.lastIndex}件を表示
          </div>
        )}
      </div>
    </div>
  );
}
