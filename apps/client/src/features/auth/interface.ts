// 既存のAPIとの互換性のための型定義
export type RegisterFormData = {
  name1: string;
  name2: string;
  email: string;
  login_pwd: string;
};

export type ErrorResponse = {
  message: string;
};

export type ContextTYpe = {
  isLoggedIn?: boolean;
  register: (data: RegisterFormData) => void;
  logout: VoidFunction;
  login: (email: string, password: string) => void;
};
