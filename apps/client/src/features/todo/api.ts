import { environment } from '@/environments/environment';
import type {
  TodoListResponse,
  CreateTodoInput,
  UpdateTodoInput,
  DeleteTodoParams,
} from './types';

/**
 * TodoリストAPI呼び出しのエラークラス
 */
export class TodoApiError extends Error {
  constructor(
    message: string,
    public errors: Array<{ code?: string; message?: string }> = [],
    public statusCode?: number
  ) {
    super(message);
    this.name = 'TodoApiError';
  }
}

/**
 * 汎用的なAPIリクエスト処理（Todo用）
 */
async function todoApiRequest<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!isJson) {
      throw new TodoApiError(
        `サーバーエラー: ${response.status}`,
        [],
        response.status
      );
    }

    const data: T = await response.json();

    if (!response.ok) {
      const errorData = data as any;
      if (errorData.errors && errorData.errors.length > 0) {
        throw new TodoApiError(
          'APIエラーが発生しました',
          errorData.errors,
          response.status
        );
      } else {
        throw new TodoApiError(
          `HTTP エラー: ${response.status}`,
          [],
          response.status
        );
      }
    }

    return data;
  } catch (error) {
    if (error instanceof TodoApiError) {
      throw error;
    }

    console.error('API network error:', error);
    throw new TodoApiError(
      'ネットワークエラーが発生しました。再度お試しください。'
    );
  }
}

/**
 * Todoリストを取得
 */
export const fetchTodoList = async (
  pageNo: number = 1
): Promise<TodoListResponse> => {
  return await todoApiRequest<TodoListResponse>(
    `${environment.apiUrl}/rcms-api/3/todos?pageNo=${pageNo}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Todoを作成（未実装）
 */
export const createTodo = async (
  input: CreateTodoInput
): Promise<{ topics_id: number }> => {
  // TODO: 実装予定
  throw new Error('Not implemented yet');
};

/**
 * Todoを更新（未実装）
 */
export const updateTodo = async (
  input: UpdateTodoInput
): Promise<{ topics_id: number }> => {
  // TODO: 実装予定
  throw new Error('Not implemented yet');
};

/**
 * Todoを削除（単一または一括）（未実装）
 */
export const deleteTodo = async (
  params: DeleteTodoParams
): Promise<{ deleted_ids: number[] }> => {
  // TODO: 実装予定
  throw new Error('Not implemented yet');
};
