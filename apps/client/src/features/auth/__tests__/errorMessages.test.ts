import { translateErrorMessage, translateErrorMessages, getFieldErrorMessage } from '../errorMessages';

/**
 * エラーメッセージ変換のテスト関数
 */
export const testErrorMessageTranslation = () => {
  console.log('🧪 エラーメッセージ変換テストを開始...');

  // 1. 単一のエラーコード変換テスト
  console.log('\n📝 単一エラーコード変換テスト:');
  console.log('unauthorized:', translateErrorMessage('unauthorized'));
  console.log('invalid_credentials:', translateErrorMessage('invalid_credentials'));
  console.log('email_already_exists:', translateErrorMessage('email_already_exists'));
  console.log('unknown_error:', translateErrorMessage('unknown_error', 'デフォルトメッセージ'));

  // 2. 複数エラーの変換テスト（あなたのAPIレスポンス形式）
  console.log('\n📝 複数エラー変換テスト:');
  const apiErrors = [
    { code: 'unauthorized', message: 'Invalid credentials' },
    { code: 'email_already_exists', message: 'Email already exists', field: 'email' },
    { code: 'weak_password', message: 'Password is too weak', field: 'password' }
  ];
  
  const translatedErrors = translateErrorMessages(apiErrors);
  console.log('変換前:', apiErrors);
  console.log('変換後:', translatedErrors);

  // 3. フィールド固有のエラーメッセージテスト
  console.log('\n📝 フィールド固有エラーメッセージテスト:');
  console.log('email + invalid_email:', getFieldErrorMessage('email', 'invalid_email'));
  console.log('password + weak_password:', getFieldErrorMessage('password', 'weak_password'));
  console.log('name1 + required_field:', getFieldErrorMessage('name1', 'required_field'));

  // 4. あなたの実際のAPIレスポンス形式でのテスト
  console.log('\n📝 実際のAPIレスポンス形式テスト:');
  const actualApiResponse = {
    errors: [
      { code: 'unauthorized', message: 'Invalid credentials' }
    ],
    status: 1
  };
  
  const translatedActualErrors = translateErrorMessages(actualApiResponse.errors);
  console.log('実際のAPIレスポンス:', actualApiResponse);
  console.log('変換後:', translatedActualErrors);

  console.log('\n✅ エラーメッセージ変換テスト完了!');
};

/**
 * ブラウザのコンソールでテストを実行するためのグローバル関数
 */
if (typeof window !== 'undefined') {
  (window as any).testErrorTranslation = testErrorMessageTranslation;
}
