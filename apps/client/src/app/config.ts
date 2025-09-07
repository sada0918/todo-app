import { environment } from '../environments/environment';

export const appConfig = {
  ...environment,
  // アプリケーション固有の設定
  version: '1.0.0',
  defaultPageSize: 10,
  maxRetries: 3,
  timeoutMs: 5000,
} as const;

// 型安全性のための型定義
export type AppConfig = typeof appConfig;
export type Environment = typeof environment;
