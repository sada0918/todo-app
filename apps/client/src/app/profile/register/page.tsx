'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterForm } from '@/features/auth/useRegisterForm';
import { InputField, SubmitButton } from '@/features/auth/form/formComponents';
import { register, RegistrationError } from '@/features/auth/user-auth';
import styles from './page.module.css';

export default function RegisterPage() {
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
  } = useRegisterForm({
    onSubmit: async (data) => {
      setApiError('');
      clearErrors(); // 既存のエラーをクリア
      try {
        const result = await register(data);

        // 成功時のメッセージがあれば一瞬表示（オプション）
        if (result.messages && result.messages.length > 0) {
          console.log('Registration success:', result.messages[0]);
        }

        // 成功時はログインページへリダイレクト
        router.push('/profile/login');
      } catch (error) {
        if (error instanceof RegistrationError) {
          // APIからのエラーを表示
          if (error.errors.length > 0) {
            // フィールド特定のエラーをフォームエラーにマップ
            const fieldErrors: Record<string, string> = {};
            const generalErrors: string[] = [];

            error.errors.forEach((e) => {
              if (e.field && ['name1', 'name2', 'email', 'login_pwd'].includes(e.field)) {
                fieldErrors[e.field] = e.message;
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
              setApiError('入力内容に問題があります。各フィールドをご確認ください。');
            }
          } else {
            setApiError(error.message);
          }
        } else {
          setApiError('予期しないエラーが発生しました');
        }
        console.error('Registration error:', error);
        throw error; // フックでも処理するためにre-throw
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>会員登録</h1>

        {apiError && (
          <div className={styles.apiError} role="alert" aria-live="polite">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <InputField
            label="姓"
            type="text"
            value={formData.name1}
            onChange={(value) => handleFieldChange('name1', value)}
            onBlur={() => handleFieldBlur('name1')}
            error={errors.name1}
            placeholder="山田"
            required
            disabled={isSubmitting}
          />

          <InputField
            label="名"
            type="text"
            value={formData.name2}
            onChange={(value) => handleFieldChange('name2', value)}
            onBlur={() => handleFieldBlur('name2')}
            error={errors.name2}
            placeholder="太郎"
            required
            disabled={isSubmitting}
          />

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
            value={formData.login_pwd}
            onChange={(value) => handleFieldChange('login_pwd', value)}
            onBlur={() => handleFieldBlur('login_pwd')}
            error={errors.login_pwd}
            placeholder="8文字以上の英数字"
            required
            disabled={isSubmitting}
          />

          <InputField
            label="パスワード確認"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => handleFieldChange('confirmPassword', value)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            error={errors.confirmPassword}
            placeholder="上記と同じパスワード"
            required
            disabled={isSubmitting}
          />

          <SubmitButton
            isLoading={isSubmitting}
            disabled={!isValid}
            className={styles.submitButton}
          >
            登録する
          </SubmitButton>
        </form>

        <div className={styles.footer}>
          <p>
            すでにアカウントをお持ちですか？{' '}
            <button
              type="button"
              onClick={() => router.push('/profile/login')}
              className={styles.linkButton}
              disabled={isSubmitting}
            >
              ログインはこちら
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
