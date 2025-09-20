/**
 * APIエラーコードを日本語メッセージに変換するマッピング
 */

export interface ErrorCodeMapping {
  [key: string]: string;
}

/**
 * 認証関連のエラーコードマッピング
 */
export const authErrorMessages: ErrorCodeMapping = {
  // ログイン関連
  'unauthorized': 'メールアドレスまたはパスワードが正しくありません',
  'invalid_credentials': 'メールアドレスまたはパスワードが正しくありません',
  'account_locked': 'アカウントがロックされています。しばらく時間をおいてからお試しください',
  'account_disabled': 'このアカウントは無効になっています',
  'login_required': 'ログインが必要です',
  'session_expired': 'セッションが期限切れです。再度ログインしてください',

  // 登録関連
  'email_already_exists': 'このメールアドレスは既に登録されています',
  'invalid_email': 'メールアドレスの形式が正しくありません',
  'weak_password': 'パスワードが安全ではありません。より強固なパスワードを設定してください',
  'password_too_short': 'パスワードは8文字以上で入力してください',
  'invalid_name': '姓名の形式が正しくありません',
  'registration_disabled': '現在、新規登録を受け付けておりません',

  // 一般的なエラー
  'validation_error': '入力内容に問題があります',
  'server_error': 'サーバーエラーが発生しました。しばらく時間をおいてからお試しください',
  'network_error': 'ネットワークエラーが発生しました。接続を確認してください',
  'rate_limit_exceeded': 'リクエストが多すぎます。しばらく時間をおいてからお試しください',
  'maintenance': 'メンテナンス中です。しばらく時間をおいてからお試しください',
  'forbidden': 'この操作を実行する権限がありません',
  'not_found': '要求されたリソースが見つかりません',
  'conflict': '競合が発生しました。再度お試しください',

  // フィールド固有のエラー
  'required_field': 'この項目は必須です',
  'invalid_format': '形式が正しくありません',
  'field_too_long': '入力内容が長すぎます',
  'field_too_short': '入力内容が短すぎます',
};

/**
 * エラーコードを日本語メッセージに変換する関数
 * @param errorCode APIから返されるエラーコード
 * @param defaultMessage フォールバック用のデフォルトメッセージ
 * @returns 日本語のエラーメッセージ
 */
export const translateErrorMessage = (
  errorCode: string,
  defaultMessage?: string
): string => {
  const translatedMessage = authErrorMessages[errorCode];
  
  if (translatedMessage) {
    return translatedMessage;
  }

  // デフォルトメッセージが提供されている場合はそれを使用
  if (defaultMessage) {
    return defaultMessage;
  }

  // どちらもない場合は汎用的なメッセージ
  return 'エラーが発生しました。再度お試しください';
};

/**
 * 複数のエラーを日本語メッセージに変換する関数
 * @param errors APIから返されるエラーの配列
 * @returns 日本語のエラーメッセージの配列
 */
export const translateErrorMessages = (
  errors: Array<{ code?: string; message?: string; field?: string }>
): Array<{ code?: string; message: string; field?: string }> => {
  return errors.map(error => ({
    ...error,
    message: error.code 
      ? translateErrorMessage(error.code, error.message)
      : error.message || 'エラーが発生しました'
  }));
};

/**
 * フィールド固有のエラーメッセージを取得する関数
 * @param field フィールド名
 * @param errorCode エラーコード
 * @param defaultMessage デフォルトメッセージ
 * @returns フィールドに応じた日本語エラーメッセージ
 */
export const getFieldErrorMessage = (
  field: string,
  errorCode: string,
  defaultMessage?: string
): string => {
  // フィールド固有の処理
  switch (field) {
    case 'email':
      if (errorCode === 'invalid_format' || errorCode === 'invalid_email') {
        return '有効なメールアドレスを入力してください';
      }
      if (errorCode === 'email_already_exists') {
        return 'このメールアドレスは既に登録されています';
      }
      break;
    
    case 'password':
    case 'login_pwd':
      if (errorCode === 'weak_password') {
        return 'パスワードは8文字以上で、英字と数字を含む必要があります';
      }
      if (errorCode === 'password_too_short') {
        return 'パスワードは8文字以上で入力してください';
      }
      break;
    
    case 'name1':
      if (errorCode === 'required_field') {
        return '姓を入力してください';
      }
      if (errorCode === 'field_too_long') {
        return '姓は50文字以内で入力してください';
      }
      break;
    
    case 'name2':
      if (errorCode === 'required_field') {
        return '名を入力してください';
      }
      if (errorCode === 'field_too_long') {
        return '名は50文字以内で入力してください';
      }
      break;
  }

  // フィールド固有の処理がない場合は汎用的な変換を使用
  return translateErrorMessage(errorCode, defaultMessage);
};
