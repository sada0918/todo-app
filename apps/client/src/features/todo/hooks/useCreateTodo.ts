import { useState, useCallback } from 'react';
import { createTodo, TodoApiError } from '../api';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

/**
 * フォームの状態管理用の型
 */
export interface TodoFormData {
  subject: string;
  contents: string;
  due_ymd: string;
}

/**
 * フォームのエラー状態管理用の型
 */
export interface TodoFormErrors {
  subject?: string;
  contents?: string;
  due_ymd?: string;
}

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 */
const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Todo作成フォームのカスタムフック
 */
export const useCreateTodo = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState<TodoFormData>({
    subject: '',
    contents: '',
    due_ymd: getTodayString(),
  });

  const [errors, setErrors] = useState<TodoFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * フィールドごとのバリデーション
   */
  const validateField = (name: keyof TodoFormData, value: string): string | undefined => {
    switch (name) {
      case 'subject':
        if (!value.trim()) {
          return 'タイトルは必須です';
        }
        if (value.length > 10) {
          return 'タイトルは10文字以内で入力してください';
        }
        break;

      case 'contents':
        if (value.length > 50) {
          return '内容は50文字以内で入力してください';
        }
        break;

      case 'due_ymd':
        if (!value) {
          return '期日は必須です';
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        if (selectedDate < today) {
          return '今日以降の日付を選択してください';
        }
        break;
    }
    return undefined;
  };

  /**
   * フィールド変更ハンドラ
   */
  const handleChange = (name: keyof TodoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // リアルタイムバリデーション
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  /**
   * 全フィールドのバリデーション
   */
  const validateAll = (): boolean => {
    const newErrors: TodoFormErrors = {};
    
    newErrors.subject = validateField('subject', formData.subject);
    newErrors.contents = validateField('contents', formData.contents);
    newErrors.due_ymd = validateField('due_ymd', formData.due_ymd);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  /**
   * フォーム送信ハンドラ
   */
  const handleSubmit = async () => {
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createTodo({
        subject: formData.subject,
        contents: formData.contents,
        open_flg: 1,
        ymd: getTodayString(),
        due_ymd: formData.due_ymd,
      });

      if (response.errors && response.errors.length > 0) {
        // エラーハンドリング
        const firstError = response.errors[0];
        showErrorToast(firstError.message || 'エラーが発生しました');
      } else {
        // 成功
        showSuccessToast('TODOを追加しました');
        
        // フォームリセット
        setFormData({
          subject: '',
          contents: '',
          due_ymd: getTodayString(),
        });
        setErrors({});
        
        // 成功時のコールバック
        onSuccess?.();
      }
    } catch (error) {
      if (error instanceof TodoApiError) {
        const errorMessage = error.errors?.[0]?.message || error.message;
        showErrorToast(errorMessage);
      } else {
        showErrorToast('予期しないエラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * フォームリセット
   */
  const resetForm = useCallback(() => {
    setFormData({
      subject: '',
      contents: '',
      due_ymd: getTodayString(),
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
