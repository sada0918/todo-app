/**
 * 認証フォームのバリデーションスキーマ
 */

export interface RegisterFormData {
  name1: string;
  name2: string;
  email: string;
  login_pwd: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * メールアドレスの形式をチェック
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * パスワードの強度をチェック（8文字以上、英数字含む）
 */
const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 登録フォームのバリデーション
 */
export const validateRegisterForm = (data: RegisterFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // 姓のバリデーション
  if (!data.name1.trim()) {
    errors.push({ field: 'name1', message: '姓を入力してください' });
  } else if (data.name1.trim().length > 50) {
    errors.push({ field: 'name1', message: '姓は50文字以内で入力してください' });
  }

  // 名のバリデーション
  if (!data.name2.trim()) {
    errors.push({ field: 'name2', message: '名を入力してください' });
  } else if (data.name2.trim().length > 50) {
    errors.push({ field: 'name2', message: '名は50文字以内で入力してください' });
  }

  // メールアドレスのバリデーション
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'メールアドレスを入力してください' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: '有効なメールアドレスを入力してください' });
  }

  // パスワードのバリデーション
  if (!data.login_pwd) {
    errors.push({ field: 'login_pwd', message: 'パスワードを入力してください' });
  } else if (!isValidPassword(data.login_pwd)) {
    errors.push({ 
      field: 'login_pwd', 
      message: 'パスワードは8文字以上で、英字と数字を含む必要があります' 
    });
  }

  // 確認パスワードのバリデーション
  if (!data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: '確認パスワードを入力してください' });
  } else if (data.login_pwd !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'パスワードが一致しません' });
  }

  return errors;
};

/**
 * ログインフォームのバリデーション
 */
export const validateLoginForm = (data: LoginFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // メールアドレスのバリデーション
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'メールアドレスを入力してください' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: '有効なメールアドレスを入力してください' });
  }

  // パスワードのバリデーション
  if (!data.password) {
    errors.push({ field: 'password', message: 'パスワードを入力してください' });
  }

  return errors;
};

/**
 * フィールド別のリアルタイムバリデーション
 */
export const validateField = (field: keyof RegisterFormData, value: string, allData?: Partial<RegisterFormData>): string | null => {
  switch (field) {
    case 'name1':
      if (!value.trim()) return '姓を入力してください';
      if (value.trim().length > 50) return '姓は50文字以内で入力してください';
      return null;
    
    case 'name2':
      if (!value.trim()) return '名を入力してください';
      if (value.trim().length > 50) return '名は50文字以内で入力してください';
      return null;
    
    case 'email':
      if (!value.trim()) return 'メールアドレスを入力してください';
      if (!isValidEmail(value)) return '有効なメールアドレスを入力してください';
      return null;
    
    case 'login_pwd':
      if (!value) return 'パスワードを入力してください';
      if (!isValidPassword(value)) return 'パスワードは8文字以上で、英字と数字を含む必要があります';
      return null;
    
    case 'confirmPassword':
      if (!value) return '確認パスワードを入力してください';
      if (allData?.login_pwd && value !== allData.login_pwd) return 'パスワードが一致しません';
      return null;
    
    default:
      return null;
  }
};

/**
 * ログインフォーム用のフィールド別リアルタイムバリデーション
 */
export const validateLoginField = (field: keyof LoginFormData, value: string): string | null => {
  switch (field) {
    case 'email':
      if (!value.trim()) return 'メールアドレスを入力してください';
      if (!isValidEmail(value)) return '有効なメールアドレスを入力してください';
      return null;
    
    case 'password':
      if (!value) return 'パスワードを入力してください';
      return null;
    
    default:
      return null;
  }
};
