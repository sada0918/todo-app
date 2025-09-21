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
  due_ymd: string;
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
  topics_id: number | number[];  // 単一削除または一括削除
}
