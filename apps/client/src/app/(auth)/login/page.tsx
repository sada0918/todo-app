'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          color: '#22c55e', 
          marginBottom: '1rem',
          fontSize: '1.5rem'
        }}>
          🎉 会員登録完了！
        </h1>
        
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '2rem' 
        }}>
          登録が正常に完了しました。<br/>
          ログイン画面の実装はこれからです。
        </p>

        <button
          onClick={() => router.push('/register')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          登録画面に戻る
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
