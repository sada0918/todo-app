'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterForm } from '@/components/auth/useRegisterForm';
import { InputField, SubmitButton } from '@/components/auth/FormComponents';
import { register, RegistrationError } from '@/components/auth/user-auth';
import styles from './register.module.css';

const RegisterPage: React.FC = () => {
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
  } = useRegisterForm({
    onSubmit: async (data) => {
      setApiError('');
      try {
        await register(data);

        // 成功時はログインページへリダイレクト
        router.push('/register/login');
      } catch (error) {
        if (error instanceof RegistrationError) {
          // APIからのエラーを表示
          if (error.errors.length > 0) {
            setApiError(error.errors.map((e) => e.message).join(', '));
          } else {
            setApiError(error.message);
          }
        } else {
          setApiError('予期しないエラーが発生しました');
        }
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
              onClick={() => router.push('/register/login')}
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
};

export default RegisterPage;
