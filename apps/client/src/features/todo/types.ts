/**
 * Todo関連の型定義
 * ユースケース別に型を分離し、DRY原則に基づいて管理
 */

// =============================================================================
// Base Types - すべての型のベースとなる基本定義
// =============================================================================

/**
 * Todoの全フィールドを含むベース型
 * - データベースから取得される完全なTodoオブジェクトの構造
 * - 他の型はこのベース型から派生させる
 */
export interface TodoBase {
  topics_id: number;      // Todo ID（システム生成）
  subject: string;        // 件名
  contents: string;       // 内容
  due_ymd: string;        // 期日 (YYYY-MM-DD)
  ymd: string;            // 日付 (YYYY-MM-DD)
  inst_ymdhi: string;     // 作成日時 (YYYY-MM-DD HH:MM)
  update_ymdhi: string;   // 更新日時 (YYYY-MM-DD HH:MM)
  open_flg: number;       // 公開フラグ (0: 非公開, 1: 公開)
}

/**
 * Todoの識別に使用するフィールド
 */
export type TodoIdentifier = Pick<TodoBase, 'topics_id'>;

// =============================================================================
// Use Case: 閲覧 (Read)
// =============================================================================

/**
 * Todo閲覧時の型
 * - APIから取得したTodoアイテムをUIに表示する際に使用
 * - すべてのフィールドが必須（サーバーから取得されるため）
 * - 読み取り専用として扱う
 *
 * @example
 * const todo: TodoForRead = {
 *   topics_id: 1,
 *   subject: "プロジェクト仕様書作成",
 *   contents: "詳細な仕様書を作成する",
 *   due_ymd: "2026-01-15",
 *   ymd: "2026-01-10",
 *   inst_ymdhi: "2026-01-10 10:00",
 *   update_ymdhi: "2026-01-10 10:00",
 *   open_flg: 1
 * };
 */
export type TodoForRead = Readonly<TodoBase>;

/**
 * Todo一覧表示用の型
 * - 一覧表示に必要な最小限のフィールドのみ
 * - パフォーマンスとセキュリティのため、必要な情報だけを公開
 */
export type TodoListItem = Readonly<
  Pick<TodoBase, 'topics_id' | 'subject' | 'contents' | 'due_ymd' | 'ymd' | 'inst_ymdhi' | 'update_ymdhi'>
>;

// =============================================================================
// Use Case: 作成 (Create)
// =============================================================================

/**
 * Todo作成時の入力データ型
 * - ユーザーが入力する必須フィールドのみ
 * - IDや日時はサーバー側で自動生成されるため不要
 * - open_flgはデフォルト値を持つ
 *
 * @example
 * const input: TodoForCreate = {
 *   subject: "新しいタスク",
 *   contents: "詳細な説明",
 *   open_flg: 1,
 *   ymd: "2026-01-10",
 *   due_ymd: "2026-01-15"
 * };
 */
export type TodoForCreate = Pick<
  TodoBase,
  'subject' | 'contents' | 'open_flg' | 'ymd' | 'due_ymd'
>;

// =============================================================================
// Use Case: 更新 (Update)
// =============================================================================

/**
 * Todo更新時の入力データ型
 * - IDは必須（どのTodoを更新するか特定）
 * - 他のフィールドは部分的に更新可能（Partial）
 * - システム生成フィールド（日時）は更新不可
 *
 * @example
 * // 件名だけ更新
 * const update1: TodoForUpdate = {
 *   topics_id: 1,
 *   subject: "更新された件名"
 * };
 *
 * // 複数フィールドを更新
 * const update2: TodoForUpdate = {
 *   topics_id: 1,
 *   subject: "更新された件名",
 *   contents: "更新された内容",
 *   due_ymd: "2026-01-20"
 * };
 */
export type TodoForUpdate = TodoIdentifier &
  Partial<Pick<TodoBase, 'subject' | 'contents' | 'due_ymd' | 'ymd' | 'open_flg'>>;

// =============================================================================
// Use Case: 削除 (Delete)
// =============================================================================

/**
 * 複数Todo削除時のパラメータ型
 * - バッチ削除に使用
 * - 単一削除の場合は TodoIdentifier を直接使用
 *
 * @example
 * // 単一削除
 * const deleteOne: TodoIdentifier = { topics_id: 1 };
 *
 * // バッチ削除
 * const batchDelete: TodoForBatchDelete = {
 *   topics_ids: [1, 2, 3]
 * };
 */
export interface TodoForBatchDelete {
  topics_ids: number[];
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * APIエラーの型
 */
export interface ApiError {
  code?: string;
  message?: string;
  field?: string;
}

/**
 * 基本的なAPIレスポンスの型
 */
export interface BaseApiResponse {
  errors?: ApiError[];
  messages?: string[];
}

/**
 * Todo作成APIのレスポンス
 */
export interface CreateTodoResponse extends BaseApiResponse {
  id?: number;  // 作成されたTodoのID
}

/**
 * Todo更新APIのレスポンス
 */
export interface UpdateTodoResponse extends BaseApiResponse {
  topics_id?: number;  // 更新されたTodoのID
}

/**
 * TodoリストAPIのレスポンス
 */
export interface TodoListResponse extends BaseApiResponse {
  list: TodoListItem[];
  pageInfo: PageInfo;
}

// =============================================================================
// Pagination Types
// =============================================================================

/**
 * ページネーション情報
 */
export interface PageInfo {
  totalCnt: number;       // 総件数
  perPage: number;        // 1ページあたりの件数
  totalPageCnt: number;   // 総ページ数
  pageNo: number;         // 現在のページ番号
  firstIndex: number;     // 最初のインデックス
  lastIndex: number;      // 最後のインデックス
}

