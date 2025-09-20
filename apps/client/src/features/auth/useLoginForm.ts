import { useState, useCallback } from 'react';
import {
  LoginFormData,
  validateLoginForm,
  validateLoginField,
} from './validation';

interface UseLoginFormOptions {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleFieldChange: (field: keyof LoginFormData, value: string) => void;
  handleFieldBlur: (field: keyof LoginFormData) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  isValid: boolean;
  setFieldErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
}

/**
 * ログインフォーム用のカスタムフック
 */
export const useLoginForm = ({
  onSubmit,
}: UseLoginFormOptions): UseLoginFormReturn => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * フィールド値の変更処理
   */
  const handleFieldChange = useCallback(
    (field: keyof LoginFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // リアルタイムバリデーション（フィールドが触られた後のみ）
      if (touchedFields.has(field)) {
        const error = validateLoginField(field, value);
        setErrors((prev) => ({
          ...prev,
          [field]: error || '',
        }));
      }
    },
    [touchedFields]
  );

  /**
   * フィールドがフォーカスを失った時の処理
   */
  const handleFieldBlur = useCallback(
    (field: keyof LoginFormData) => {
      setTouchedFields((prev) => new Set([...prev, field]));
      const error = validateLoginField(field, formData[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: error || '',
      }));
    },
    [formData]
  );

  /**
   * フォーム送信処理
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // 全フィールドのバリデーション
      const validationErrors = validateLoginForm(formData);

      if (validationErrors.length > 0) {
        const errorMap: Record<string, string> = {};
        validationErrors.forEach((error) => {
          errorMap[error.field] = error.message;
        });
        setErrors(errorMap);

        // 全フィールドを「触られた」状態に
        setTouchedFields(new Set(['email', 'password']));
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit]
  );

  /**
   * 外部からフィールドエラーを設定する関数
   */
  const setFieldErrors = useCallback((newErrors: Record<string, string>) => {
    setErrors((prev) => ({ ...prev, ...newErrors }));
    
    // エラーのあるフィールドを「触られた」状態にする
    const errorFields = Object.keys(newErrors);
    setTouchedFields((prev) => new Set([...prev, ...errorFields]));
  }, []);

  /**
   * エラーをクリアする関数
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * フォームの有効性チェック
   */
  const isValid = validateLoginForm(formData).length === 0;

  return {
    formData,
    errors,
    isSubmitting,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    isValid,
    setFieldErrors,
    clearErrors,
  };
};
