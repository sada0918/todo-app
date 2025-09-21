import { useState, useEffect, useCallback } from 'react';
import { fetchTodoList, TodoApiError } from '../api';
import type { TodoItem, PageInfo } from '../types';
import { showErrorToast } from '@/lib/toast';

interface UseTodoListReturn {
  todos: TodoItem[];
  pageInfo: PageInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadPage: (pageNo: number) => Promise<void>;
}

/**
 * Todoリスト取得用カスタムフック
 */
export const useTodoList = (): UseTodoListReturn => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async (pageNo: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchTodoList(pageNo);
      setTodos(response.list);
      setPageInfo(response.pageInfo);
    } catch (err) {
      const errorMessage =
        err instanceof TodoApiError
          ? err.message
          : 'Todoの取得に失敗しました';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回マウント時にTodoリストを取得
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // リフレッチ用の関数
  const refetch = useCallback(async () => {
    const currentPage = pageInfo?.pageNo || 1;
    await loadTodos(currentPage);
  }, [pageInfo?.pageNo, loadTodos]);

  // ページ読み込み用の関数
  const loadPage = useCallback(
    async (pageNo: number) => {
      await loadTodos(pageNo);
    },
    [loadTodos]
  );

  return {
    todos,
    pageInfo,
    isLoading,
    error,
    refetch,
    loadPage,
  };
};
