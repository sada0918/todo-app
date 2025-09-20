// 既存のAPIとの互換性のための型定義
export type ErrorResponse = {
  code: string;
  message: string;
  field: string;
};

export type ContextTYpe = {
  isLoggedIn?: boolean;
  register: (data: { name1: string; name2: string; email: string; login_pwd: string }) => void;
  logout: VoidFunction;
  login: (email: string, password: string) => void;
};
