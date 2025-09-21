/**
 * Todo関連の型定義
 */

/**
 * Todoアイテムの型（必要なフィールドのみ）
 */
export interface TodoItem {
  topics_id: number;
  subject: string;
  contents: string;
  due_ymd: string;
  ymd: string;
  inst_ymdhi: string;
  update_ymdhi: string;
}

/**
 * ページネーション情報
 */
export interface PageInfo {
  totalCnt: number;
  perPage: number;
  totalPageCnt: number;
  pageNo: number;
  firstIndex: number;
  lastIndex: number;
}

/**
 * TodoリストのAPIレスポンス
 */
export interface TodoListResponse {
  errors?: Array<{ code?: string; message?: string }>;
  messages?: string[];
  list: TodoItem[];
  pageInfo: PageInfo;
}

/**
 * Todo作成時の入力データ
 */
export interface CreateTodoInput {
  subject: string;
  contents: string;
  open_flg: number;
  ymd: string;
  due_ymd: string;
}

/**
 * Todo作成APIのレスポンス
 */
export interface CreateTodoResponse {
  errors?: Array<{ code?: string; message?: string; field?: string }>;
  messages?: string[];
  id?: number;
}

/**
 * Todo更新時の入力データ
 */
export interface UpdateTodoInput {
  topics_id: number;
  subject?: string;
  contents?: string;
  due_ymd?: string;
}

/**
 * Todo削除時のパラメータ
 */
export interface DeleteTodoParams {
  topics_id: number;
}

/**
 * Todo削除APIのレスポンス
 */
export interface DeleteTodoResponse {
  errors?: Array<{ code?: string; message?: string; field?: string }>;
  messages?: string[];
}
