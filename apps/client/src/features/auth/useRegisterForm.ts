import { useState, useCallback } from 'react';
import {
  RegisterFormData,
  validateRegisterForm,
  validateField,
} from './validation';

interface UseRegisterFormOptions {
  onSubmit: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>;
}

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleFieldChange: (field: keyof RegisterFormData, value: string) => void;
  handleFieldBlur: (field: keyof RegisterFormData) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  isValid: boolean;
  setFieldErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
}

/**
 * 登録フォーム用のカスタムフック
 */
export const useRegisterForm = ({
  onSubmit,
}: UseRegisterFormOptions): UseRegisterFormReturn => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name1: '',
    name2: '',
    email: '',
    login_pwd: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * フィールド値の変更処理
   */
  const handleFieldChange = useCallback(
    (field: keyof RegisterFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // リアルタイムバリデーション（フィールドが触られた後のみ）
      if (touchedFields.has(field)) {
        const error = validateField(field, value, formData);
        setErrors((prev) => ({
          ...prev,
          [field]: error || '',
        }));
      }
    },
    [formData, touchedFields]
  );

  /**
   * フィールドがフォーカスを失った時の処理
   */
  const handleFieldBlur = useCallback(
    (field: keyof RegisterFormData) => {
      setTouchedFields((prev) => new Set([...prev, field]));
      const error = validateField(field, formData[field], formData);
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
      const validationErrors = validateRegisterForm(formData);

      if (validationErrors.length > 0) {
        const errorMap: Record<string, string> = {};
        validationErrors.forEach((error) => {
          errorMap[error.field] = error.message;
        });
        setErrors(errorMap);

        // 全フィールドを「触られた」状態に
        setTouchedFields(
          new Set(['name1', 'name2', 'email', 'login_pwd', 'confirmPassword'])
        );
        return;
      }

      setIsSubmitting(true);
      try {
        // confirmPasswordはAPIに送信しない
        const { confirmPassword, ...apiData } = formData;
        await onSubmit(apiData);
      } catch (error) {
        console.error('Registration error:', error);
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
  const isValid = validateRegisterForm(formData).length === 0;

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
