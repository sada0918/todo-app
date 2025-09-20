import { environment } from '@/environments/environment';
import { ErrorResponse } from './interface';

// 元のinterface.tsのRegisterFormDataと区別するため、APIに送信する用の型を定義
export interface ApiRegisterData {
  name1: string;
  name2: string;
  email: string;
  login_pwd: string;
}

export interface RegisterApiResponse {
  errors?: ErrorResponse[];
  member?: {
    id: string;
    name1: string;
    name2: string;
    email: string;
  };
}

export class RegistrationError extends Error {
  constructor(
    message: string,
    public errors: ErrorResponse[] = [],
    public statusCode?: number
  ) {
    super(message);
    this.name = 'RegistrationError';
  }
}

/**
 * 会員登録API呼び出し
 */
export const register = async (postData: ApiRegisterData): Promise<void> => {
  try {
    const response = await fetch(
      environment.apiUrl + '/rcms-api/1/member/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      throw new RegistrationError(
        `HTTP エラー: ${response.status}`,
        [],
        response.status
      );
    }

    const data: RegisterApiResponse = await response.json();

    // APIからのエラーレスポンス処理
    if (data.errors && data.errors.length > 0) {
      throw new RegistrationError(
        'バリデーションエラーが発生しました',
        data.errors
      );
    }

    // 成功時の処理は呼び出し元で行う
  } catch (error) {
    if (error instanceof RegistrationError) {
      throw error;
    }
    
    // ネットワークエラーなどの予期しないエラー
    console.error('Registration network error:', error);
    throw new RegistrationError('ネットワークエラーが発生しました。再度お試しください。');
  }
};
