import React from 'react';
import './FormComponents.css';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * 再利用可能な入力フィールドコンポーネント
 */
export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
}) => {
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className="form-field">
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''}`}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
      />
      
      {error && (
        <div id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * 送信ボタンコンポーネント
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`submit-button ${className} ${isLoading ? 'loading' : ''}`}
      aria-disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <span className="loading-spinner" aria-hidden="true" />
          登録中...
        </>
      ) : (
        children
      )}
    </button>
  );
};
