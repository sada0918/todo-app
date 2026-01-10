/**
 * Auth関連の型定義
 * ユースケース別に型を分離し、DRY原則に基づいて管理
 */

// =============================================================================
// Base Types - すべての型のベースとなる基本定義
// =============================================================================

/**
 * ユーザーの全フィールドを含むベース型
 * - データベースから取得される完全なユーザーオブジェクトの構造
 */
export interface UserBase {
  member_id: number;    // ユーザーID（システム生成）
  name1: string;        // 姓
  name2: string;        // 名
  email: string;        // メールアドレス
}

/**
 * 認証状態の型定義
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

// =============================================================================
// Use Case: 認証状態管理 (State)
// =============================================================================

/**
 * Jotai atom用のユーザー情報型
 * - アプリケーション内で保持するユーザー情報
 * - emailは不要（セキュリティ上、メモリに保持しない）
 */
export type UserInfo = Pick<UserBase, 'member_id' | 'name1' | 'name2'>;

// =============================================================================
// Use Case: 新規登録 (Register)
// =============================================================================

/**
 * 新規登録時の入力データ型
 * - ユーザーが入力する必須フィールド
 * - member_idはサーバー側で自動生成されるため不要
 *
 * @example
 * const input: UserForRegister = {
 *   name1: "山田",
 *   name2: "太郎",
 *   email: "yamada@example.com",
 *   login_pwd: "SecureP@ss123"
 * };
 */
export interface UserForRegister {
  name1: string;
  name2: string;
  email: string;
  login_pwd: string;  // APIフィールド名に合わせる
}

// =============================================================================
// Use Case: ログイン (Login)
// =============================================================================

/**
 * ログイン時の入力データ型
 * - 認証に必要な最小限の情報
 *
 * @example
 * const credentials: UserForLogin = {
 *   email: "yamada@example.com",
 *   password: "SecureP@ss123"
 * };
 */
export interface UserForLogin {
  email: string;
  password: string;
}

// =============================================================================
// Use Case: プロフィール取得 (Profile)
// =============================================================================

/**
 * プロフィールAPIレスポンスの拡張データ
 * - Kuroco APIから返される追加情報
 */
export interface ProfileExtendedData {
  group_ids?: Record<string, string>;
  expiresAt?: number;
  geo_country_code?: string;
  geo_region?: string;
  geo_conn_speed?: string;
  status?: number;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * APIエラーの型
 */
export interface ApiError {
  code: string;
  message: string;
  field: string;
}

/**
 * 基本的なAPIレスポンスの型
 */
export interface BaseApiResponse {
  errors?: ApiError[];
  messages?: string[];
}

/**
 * 新規登録APIのレスポンス
 */
export interface RegisterResponse extends BaseApiResponse {
  member?: UserBase;
  id?: number;
}

/**
 * ログインAPIのレスポンス
 */
export interface LoginResponse extends BaseApiResponse {
  member?: UserBase;
  token?: string;
  expires_at?: string;
}

/**
 * プロフィール取得APIのレスポンス
 * - 直接フィールドで返す形式と member オブジェクトの両方に対応
 */
export interface ProfileResponse extends BaseApiResponse, ProfileExtendedData {
  // 直接返される形式
  name1?: string;
  name2?: string;
  member_id?: number;
  // member オブジェクト形式（後方互換性）
  member?: UserBase;
}

