import { environment } from '../environments/environment';

export const appConfig = {
  ...environment,
} as const;

// 型安全性のための型定義
export type AppConfig = typeof appConfig;
export type Environment = typeof environment;
