'use client';

import React from 'react';
import type { TodoItem } from '../types';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: TodoItem[];
  isLoading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, isLoading }) => {
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

  return (
    <div className={styles.list}>
      {todos.map((todo) => (
        <TodoItemCard key={todo.topics_id} todo={todo} />
      ))}
    </div>
  );
};

interface TodoItemCardProps {
  todo: TodoItem;
}

const TodoItemCard: React.FC<TodoItemCardProps> = ({ todo }) => {
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
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.subject}>{todo.subject}</h3>
        <span
          className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}
        >
          期限: {formatDate(todo.due_ymd)}
        </span>
      </div>
      <p className={styles.contents}>{stripHtmlTags(todo.contents)}</p>
      <div className={styles.cardFooter}>
        <span className={styles.meta}>作成: {formatDate(todo.ymd)}</span>
      </div>
    </div>
  );
};
