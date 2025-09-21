/**
 * トースト通知のユーティリティ関数
 * react-hot-toast のラッパー
 */

import toast from 'react-hot-toast';

type ToastOptions = {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
};

/**
 * エラートースト表示
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, options);
};

/**
 * 成功トースト表示
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, options);
};

/**
 * 情報トースト表示
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast(message, options);
};

/**
 * 認証エラー用のトースト（事前定義メッセージ）
 */
export const showAuthErrorToast = () => {
  showErrorToast('ログインセッションが切れました。再度ログインしてください。', {
    duration: 4000,
  });
};

/**
 * ログイン成功用のトースト
 */
export const showLoginSuccessToast = (userName?: string) => {
  const message = userName 
    ? `${userName}さん、ようこそ！` 
    : 'ログインしました';
  showSuccessToast(message, {
    duration: 3000,
  });
};
