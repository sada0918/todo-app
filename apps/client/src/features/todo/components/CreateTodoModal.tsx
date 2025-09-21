'use client';

import React, { useEffect } from 'react';
import { useCreateTodo } from '../hooks/useCreateTodo';
import styles from './CreateTodoModal.module.css';

interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  } = useCreateTodo(() => {
    onSuccess();
    onClose();
  });

  // モーダルが閉じられた時にフォームをリセット
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // オーバーレイクリックでモーダルを閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const subjectLength = formData.subject.length;
  const contentsLength = formData.contents.length;

  // モーダルが開いていない場合は何も表示しない
  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
      <div className={styles['modal-content']}>
        {/* ヘッダー */}
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>新しいTODOを追加</h2>
          <button
            className={styles['close-button']}
            onClick={onClose}
            aria-label="閉じる"
            type="button"
          >
            ×
          </button>
        </div>

        {/* ボディ */}
        <div className={styles['modal-body']}>
          {/* タイトル */}
          <div className={styles['form-field']}>
            <label htmlFor="subject" className={styles['form-label']}>
              タイトル
              <span className={styles['required-mark']}>*</span>
            </label>
            <input
              id="subject"
              type="text"
              className={`${styles['form-input']} ${
                errors.subject ? styles['form-input-error'] : ''
              }`}
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="例: 買い物に行く"
              maxLength={10}
            />
            {errors.subject && (
              <span className={styles['error-message']}>{errors.subject}</span>
            )}
            <div
              className={`${styles['char-counter']} ${
                subjectLength >= 10
                  ? styles['char-counter-error']
                  : subjectLength >= 8
                  ? styles['char-counter-warning']
                  : ''
              }`}
            >
              {subjectLength}/10
            </div>
          </div>

          {/* 内容 */}
          <div className={styles['form-field']}>
            <label htmlFor="contents" className={styles['form-label']}>
              内容
            </label>
            <textarea
              id="contents"
              className={`${styles['form-textarea']} ${
                errors.contents ? styles['form-textarea-error'] : ''
              }`}
              value={formData.contents}
              onChange={(e) => handleChange('contents', e.target.value)}
              placeholder="TODOの詳細を入力してください"
              maxLength={50}
            />
            {errors.contents && (
              <span className={styles['error-message']}>{errors.contents}</span>
            )}
            <div
              className={`${styles['char-counter']} ${
                contentsLength >= 50
                  ? styles['char-counter-error']
                  : contentsLength >= 45
                  ? styles['char-counter-warning']
                  : ''
              }`}
            >
              {contentsLength}/50
            </div>
          </div>

          {/* 期日 */}
          <div className={styles['form-field']}>
            <label htmlFor="due_ymd" className={styles['form-label']}>
              期日
              <span className={styles['required-mark']}>*</span>
            </label>
            <input
              id="due_ymd"
              type="date"
              className={`${styles['form-input']} ${
                errors.due_ymd ? styles['form-input-error'] : ''
              }`}
              value={formData.due_ymd}
              onChange={(e) => handleChange('due_ymd', e.target.value)}
            />
            {errors.due_ymd && (
              <span className={styles['error-message']}>{errors.due_ymd}</span>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className={styles['modal-footer']}>
          <button
            className={styles['cancel-button']}
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            キャンセル
          </button>
          <button
            className={styles['submit-button']}
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className={styles['loading-spinner']} />
                追加中...
              </>
            ) : (
              '追加'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
