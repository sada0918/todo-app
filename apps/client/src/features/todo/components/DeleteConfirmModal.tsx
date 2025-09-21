'use client';

import React, { useEffect } from 'react';
import type { TodoItem } from '../types';
import styles from './DeleteConfirmModal.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todo: TodoItem | null;
  todos?: TodoItem[];
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  todo,
  todos,
  isDeleting,
}) => {
  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isDeleting, onClose]);

  // オーバーレイクリックでモーダルを閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) return null;

  const isBulkDelete = todos && todos.length > 0;

  return (
    <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
      <div className={styles['modal-content']}>
        {/* ヘッダー */}
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>
            {isBulkDelete ? '選択したTODOを削除' : 'TODOを削除'}
          </h2>
        </div>

        {/* ボディ */}
        <div className={styles['modal-body']}>
          <p className={styles['modal-message']}>
            {isBulkDelete
              ? `選択した${todos.length}件のTODOを削除してもよろしいですか？`
              : 'このTODOを削除してもよろしいですか？'}
          </p>

          {isBulkDelete ? (
            <div className={styles['bulk-delete-info']}>
              <strong>⚠️ この操作は取り消せません</strong>
            </div>
          ) : (
            todo && (
              <div className={styles['todo-info']}>
                <div className={styles['todo-subject']}>{todo.subject}</div>
                {todo.contents && (
                  <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    {todo.contents}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* フッター */}
        <div className={styles['modal-footer']}>
          <button
            className={styles['cancel-button']}
            onClick={onClose}
            disabled={isDeleting}
            type="button"
          >
            キャンセル
          </button>
          <button
            className={styles['delete-button']}
            onClick={onConfirm}
            disabled={isDeleting}
            type="button"
          >
            {isDeleting ? (
              <>
                <span className={styles['loading-spinner']} />
                削除中...
              </>
            ) : (
              '削除'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
