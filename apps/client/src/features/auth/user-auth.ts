import { environment } from '@/environments/environment';
import { ErrorResponse } from './interface';

// 共通の型定義
export interface Member {
  id: string;
  name1: string;
  name2: string;
  email: string;
}

// 登録用の型定義
export interface ApiRegisterData {
  name1: string;
  name2: string;
  email: string;
  login_pwd: string;
}

export interface RegisterApiResponse {
  errors?: ErrorResponse[];
  member?: Member;
  messages?: string[];
  id?: number;
}

// ログイン用の型定義
export interface ApiLoginData {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  errors?: ErrorResponse[];
  member?: Member;
  token?: string;
  expires_at?: string;
}

export interface ProfileResponse {
  errors?: ErrorResponse[];
  // 実際のレスポンスに合わせた型定義
  name1?: string;
  name2?: string;
  member_id?: number;
  group_ids?: Record<string, string>;
  expiresAt?: number;
  geo_country_code?: string;
  geo_region?: string;
  geo_conn_speed?: string;
  // 従来のmember形式との互換性のため
  member?: Member;
  status?: number;
}

// 汎用的なAPIエラークラス
export class ApiError extends Error {
  constructor(
    message: string,
    public errors: ErrorResponse[] = [],
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class RegistrationError extends ApiError {
  constructor(
    message: string,
    errors: ErrorResponse[] = [],
    statusCode?: number
  ) {
    super(message, errors, statusCode);
    this.name = 'RegistrationError';
  }
}

export class LoginError extends ApiError {
  constructor(
    message: string,
    errors: ErrorResponse[] = [],
    statusCode?: number
  ) {
    super(message, errors, statusCode);
    this.name = 'LoginError';
  }
}

/**
 * 統合されたAPIリクエスト処理
 */
async function apiRequest<T extends { errors?: ErrorResponse[] }>(
  url: string,
  options: RequestInit,
  apiErrorMessage: string,
  ErrorClass: typeof ApiError = ApiError
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
    if (error instanceof ApiError) {
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
export const register = async (postData: ApiRegisterData): Promise<RegisterApiResponse> => {
  return await apiRequest<RegisterApiResponse>(
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
  loginData: ApiLoginData
): Promise<LoginApiResponse> => {
  return await apiRequest<LoginApiResponse>(
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
