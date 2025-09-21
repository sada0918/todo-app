'use client';

import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { userAtom, userDisplayNameAtom, authStatusAtom } from '@/features/auth/atoms/userAtom';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { useTodoList } from '@/features/todo/hooks/useTodoList';
import { TodoList } from '@/features/todo/components/TodoList';
import { CreateTodoModal } from '@/features/todo/components/CreateTodoModal';
import { DeleteConfirmModal } from '@/features/todo/components/DeleteConfirmModal';
import { deleteTodo, TodoApiError } from '@/features/todo/api';
import type { TodoItem } from '@/features/todo/types';
import styles from './page.module.css';

export default function TodoPage() {
  return (
    <AuthGuard>
      <TodoContent />
    </AuthGuard>
  );
}

function TodoContent() {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const displayName = useAtomValue(userDisplayNameAtom);
  const setUser = useSetAtom(userAtom);
  const setAuthStatus = useSetAtom(authStatusAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<TodoItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Todoリストを取得
  const { todos, pageInfo, isLoading, refetch } = useTodoList();

  const handleLogout = () => {
    // ユーザー情報をクリア
    setUser(null);
    setAuthStatus('unauthenticated');
    
    // トースト表示
    showSuccessToast('ログアウトしました');
    
    // ログインページへリダイレクト
    router.push('/profile/login');
  };

  // 単一のTODO選択/選択解除
  const handleSelectTodo = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // 全選択/全選択解除
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(todos.map(todo => todo.topics_id));
    } else {
      setSelectedIds([]);
    }
  };

  // 削除ボタンクリック
  const handleDeleteClick = (todo: TodoItem) => {
    setTodoToDelete(todo);
    setIsDeleteModalOpen(true);
  };

  // 一括削除ボタンクリック
  const handleBulkDeleteClick = () => {
    setTodoToDelete(null);
    setIsDeleteModalOpen(true);
  };

  // 削除確認
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      // 一括削除の場合
      if (selectedIds.length > 0 && !todoToDelete) {
        const errors: string[] = [];
        
        for (const id of selectedIds) {
          try {
            await deleteTodo({ topics_id: id });
          } catch (error) {
            if (error instanceof TodoApiError) {
              errors.push(`ID ${id}: ${error.message}`);
            } else {
              errors.push(`ID ${id}: 削除に失敗しました`);
            }
          }
        }

        if (errors.length > 0) {
          showErrorToast(`一部の削除に失敗しました: ${errors.join(', ')}`);
        } else {
          showSuccessToast(`${selectedIds.length}件のTODOを削除しました`);
        }

        setSelectedIds([]);
      } 
      // 単一削除の場合
      else if (todoToDelete) {
        await deleteTodo({ topics_id: todoToDelete.topics_id });
        showSuccessToast('TODOを削除しました');
      }

      // リスト再取得
      refetch();
      
      // モーダルを閉じる
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    } catch (error) {
      if (error instanceof TodoApiError) {
        showErrorToast(error.message);
      } else {
        showErrorToast('削除に失敗しました');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // 削除モーダルを閉じる
  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    }
  };

  return (
    <div className={styles['container']}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        maxWidth: '525px',
        margin: '0 auto 2rem auto',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', minWidth: 'fit-content' }}>{displayName}のTodoリスト</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              削除 ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            + 追加
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ログアウト
          </button>
        </div>
      </div>

      {/* Todoリスト表示 */}
      <div style={{ marginTop: '2rem' }}>
        <TodoList 
          todos={todos} 
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelectTodo={handleSelectTodo}
          onSelectAll={handleSelectAll}
          onDeleteTodo={handleDeleteClick}
        />
        
        {pageInfo && pageInfo.totalCnt > 0 && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            {pageInfo.totalCnt}件中 {pageInfo.firstIndex}〜{pageInfo.lastIndex}件を表示
          </div>
        )}
      </div>

      {/* TODO作成モーダル */}
      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />

      {/* 削除確認モーダル */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        todo={todoToDelete}
        todos={selectedIds.length > 0 && !todoToDelete ? todos.filter(t => selectedIds.includes(t.topics_id)) : undefined}
        isDeleting={isDeleting}
      />
    </div>
  );
}
