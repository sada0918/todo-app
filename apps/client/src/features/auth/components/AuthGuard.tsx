'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import { authStatusAtom } from '../atoms/userAtom';
import { useAuthCheck } from '../hooks/useAuthCheck';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 認証ガードコンポーネント
 * 認証が必要なページをラップして使用
 * 
 * @example
 * ```tsx
 * export default function TodoPage() {
 *   return (
 *     <AuthGuard>
 *       <div>Todo Content</div>
 *     </AuthGuard>
 *   );
 * }
 * ```
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const authStatus = useAtomValue(authStatusAtom);
  
  // 認証チェックを実行
  useAuthCheck();

  // ローディング中の表示
  if (authStatus === 'loading' || authStatus === 'idle') {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>読み込み中...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (authStatus === 'unauthenticated') {
    return null;
  }

  // 認証済みの場合のみchildrenを表示
  return <>{children}</>;
};
