'use client';

import React from 'react';
import type { TodoItem } from '../types';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: TodoItem[];
  isLoading: boolean;
  selectedIds: number[];
  onSelectTodo: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteTodo: (todo: TodoItem) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isLoading,
  selectedIds,
  onSelectTodo,
  onSelectAll,
  onDeleteTodo,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>読み込み中...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Todoがありません</p>
        <p className={styles.emptyHint}>新しいTodoを追加してみましょう</p>
      </div>
    );
  }

  const allSelected = todos.length > 0 && (selectedIds?.length ?? 0) === todos.length;
  const someSelected = (selectedIds?.length ?? 0) > 0 && !allSelected;

  return (
    <div>
      {/* 一括選択 */}
      <div className={styles.bulkActions}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(input) => {
              if (input) {
                input.indeterminate = someSelected;
              }
            }}
            onChange={(e) => onSelectAll(e.target.checked)}
            className={styles.checkbox}
          />
          <span>
            {(selectedIds?.length ?? 0) > 0
              ? `${selectedIds?.length ?? 0}件選択中`
              : 'すべて選択'}
          </span>
        </label>
      </div>

      {/* Todoリスト */}
      <div className={styles.list}>
        {todos.map((todo) => (
          <TodoItemCard
            key={todo.topics_id}
            todo={todo}
            isSelected={selectedIds?.includes(todo.topics_id) ?? false}
            onSelect={onSelectTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </div>
    </div>
  );
};

interface TodoItemCardProps {
  todo: TodoItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (todo: TodoItem) => void;
}

const TodoItemCard: React.FC<TodoItemCardProps> = ({
  todo,
  isSelected,
  onSelect,
  onDelete,
}) => {
  // 期限日のフォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // HTMLタグを除去してテキストのみを取得
  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // 期限が過ぎているかチェック
  const isOverdue = new Date(todo.due_ymd) < new Date();

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.cardContent}>
        {/* チェックボックス */}
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(todo.topics_id)}
            className={styles.checkbox}
          />
        </label>

        {/* コンテンツ */}
        <div className={styles.cardMain}>
          <div className={styles.cardHeader}>
            <h3 className={styles.subject}>{todo.subject}</h3>
            <span
              className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}
            >
              期限: {formatDate(todo.due_ymd)}
            </span>
          </div>
          {todo.contents && (
            <p className={styles.contents}>{stripHtmlTags(todo.contents)}</p>
          )}
          <div className={styles.cardFooter}>
            <span className={styles.meta}>作成: {formatDate(todo.ymd)}</span>
          </div>
        </div>

        {/* 削除ボタン */}
        <button
          className={styles.deleteButton}
          onClick={() => onDelete(todo)}
          aria-label="削除"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};
