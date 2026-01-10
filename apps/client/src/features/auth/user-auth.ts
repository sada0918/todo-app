import { environment } from '@/environments/environment';
import type {
  ApiError as ApiErrorType,
  UserForRegister,
  UserForLogin,
  RegisterResponse,
  LoginResponse,
  ProfileResponse,
} from './types';

// 汎用的なAPIエラークラス
export class AuthApiError extends Error {
  constructor(
    message: string,
    public errors: ApiErrorType[] = [],
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export class RegistrationError extends AuthApiError {
  constructor(
    message: string,
    errors: ApiErrorType[] = [],
    statusCode?: number
  ) {
    super(message, errors, statusCode);
    this.name = 'RegistrationError';
  }
}

export class LoginError extends AuthApiError {
  constructor(
    message: string,
    errors: ApiErrorType[] = [],
    statusCode?: number
  ) {
    super(message, errors, statusCode);
    this.name = 'LoginError';
  }
}

/**
 * 統合されたAPIリクエスト処理
 */
async function apiRequest<T extends { errors?: ApiErrorType[] }>(
  url: string,
  options: RequestInit,
  apiErrorMessage: string,
  ErrorClass: typeof AuthApiError = AuthApiError
): Promise<T> {
  try {
    const response = await fetch(url, options);

    // レスポンスがJSON形式かどうかをチェック
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!isJson) {
      // JSONでない場合（HTMLエラーページなど）
      throw new ErrorClass(
        `サーバーエラー: ${response.status}`,
        [],
        response.status
      );
    }

    // レスポンスをJSONとして解析
    const data: T = await response.json();

    // HTTPステータスが400でエラーが含まれている場合
    if (!response.ok) {
      if (data.errors && data.errors.length > 0) {
        // APIからの詳細なエラーメッセージを使用
        throw new ErrorClass(apiErrorMessage, data.errors, response.status);
      } else {
        // エラーの詳細がない場合は汎用メッセージ
        throw new ErrorClass(
          `HTTP エラー: ${response.status}`,
          [],
          response.status
        );
      }
    }

    // 200番台だがエラーが含まれている場合（一部のAPIはこの形式）
    if (data.errors && data.errors.length > 0) {
      throw new ErrorClass(apiErrorMessage, data.errors);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    console.error('API network error:', error);
    throw new ErrorClass(
      'ネットワークエラーが発生しました。再度お試しください。'
    );
  }
}

/**
 * 会員登録API呼び出し
 */
export const register = async (postData: UserForRegister): Promise<RegisterResponse> => {
  return await apiRequest<RegisterResponse>(
    `${environment.apiUrl}/rcms-api/1/member/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    },
    '登録に失敗しました',
    RegistrationError
  );
};

/**
 * ログインAPI呼び出し
 */
export const login = async (
  loginData: UserForLogin
): Promise<LoginResponse> => {
  return await apiRequest<LoginResponse>(
    `${environment.apiUrl}/rcms-api/1/login`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    },
    'ログインに失敗しました',
    LoginError
  );
};

/**
 * ログイン状態確認API呼び出し
 */
export const checkLoginStatus = async (): Promise<ProfileResponse> => {
  return await apiRequest<ProfileResponse>(
    `${environment.apiUrl}/rcms-api/1/profile`,
    {
      method: 'GET',
      credentials: 'include',
    },
    'セッションが無効です',
    LoginError
  );
};
