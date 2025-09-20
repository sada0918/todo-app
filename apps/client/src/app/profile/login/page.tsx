'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginForm } from '@/features/auth/useLoginForm';
import { InputField, SubmitButton } from '@/features/auth/form/formComponents';
import { login, LoginError } from '@/features/auth/user-auth';
import { translateErrorMessages, getFieldErrorMessage } from '@/features/auth/errorMessages';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');

  // カスタムフックを使用してフォームロジックを管理
  const {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    isValid,
    setFieldErrors,
    clearErrors,
  } = useLoginForm({
    onSubmit: async (data) => {
      setApiError('');
      clearErrors(); // 既存のエラーをクリア
      try {
        const result = await login(data);

        // ログイン成功時のメッセージがあれば表示（オプション）
        if (result.member) {
          console.log('Login success for:', result.member.email);
        }

        // 成功時はTodoページへリダイレクト
        router.push('/profile/todo');
      } catch (error) {
        if (error instanceof LoginError) {
          // APIからのエラーを日本語に変換して表示
          if (error.errors.length > 0) {
            // エラーメッセージを日本語に変換
            const translatedErrors = translateErrorMessages(error.errors);
            
            // フィールド特定のエラーをフォームエラーにマップ
            const fieldErrors: Record<string, string> = {};
            const generalErrors: string[] = [];

            translatedErrors.forEach((e) => {
              if (e.field && ['email', 'password'].includes(e.field)) {
                // フィールド固有のエラーメッセージを取得
                const fieldMessage = e.code 
                  ? getFieldErrorMessage(e.field, e.code, e.message)
                  : e.message;
                fieldErrors[e.field] = fieldMessage;
              } else {
                generalErrors.push(e.message);
              }
            });

            // フィールドエラーをフォームに設定
            if (Object.keys(fieldErrors).length > 0) {
              setFieldErrors(fieldErrors);
            }

            // 一般的なエラーをAPIエラーとして表示
            if (generalErrors.length > 0) {
              setApiError(generalErrors.join(', '));
            } else if (Object.keys(fieldErrors).length > 0) {
              setApiError('ログイン情報をご確認ください。');
            }
          } else {
            setApiError(error.message);
          }
        } else {
          setApiError('予期しないエラーが発生しました');
        }
        console.error('Login error:', error);
        throw error; // フックでも処理するためにre-throw
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>ログイン</h1>

        {apiError && (
          <div className={styles.apiError} role="alert" aria-live="polite">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <InputField
            label="メールアドレス"
            type="email"
            value={formData.email}
            onChange={(value) => handleFieldChange('email', value)}
            onBlur={() => handleFieldBlur('email')}
            error={errors.email}
            placeholder="example@email.com"
            required
            disabled={isSubmitting}
          />

          <InputField
            label="パスワード"
            type="password"
            value={formData.password}
            onChange={(value) => handleFieldChange('password', value)}
            onBlur={() => handleFieldBlur('password')}
            error={errors.password}
            placeholder="パスワードを入力してください"
            required
            disabled={isSubmitting}
          />

          <SubmitButton
            isLoading={isSubmitting}
            disabled={!isValid}
            className={styles.submitButton}
            loadingText="ログイン中..."
          >
            ログイン
          </SubmitButton>
        </form>

        <div className={styles.footer}>
          <p>
            アカウントをお持ちでないですか？{' '}
            <button
              type="button"
              onClick={() => router.push('/profile/register')}
              className={styles.linkButton}
              disabled={isSubmitting}
            >
              会員登録はこちら
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
