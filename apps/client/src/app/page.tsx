import Link from 'next/link';
import { appConfig } from './config';
import styles from './page.module.css';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          {/* ヒーローセクション */}
          <div id="welcome">
            <h1>
              <span>ようこそ</span>
              {appConfig.appName} へ
            </h1>
            <p className={styles.subtitle}>
              シンプルで使いやすいタスク管理アプリ
            </p>
          </div>

          {/* 機能紹介 */}
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <h3>簡単にタスク管理</h3>
              <p>
                直感的なインターフェースでタスクの追加・編集・完了ができます
              </p>
            </div>

            <div className={styles.featureCard}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <h3>優先順位設定</h3>
              <p>タスクに優先度を設定して、重要なことに集中できます</p>
            </div>

            <div className={styles.featureCard}>
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.featureIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3>安全なデータ管理</h3>
              <p>ユーザー認証により、あなたのタスクを安全に保護します</p>
            </div>
          </div>

          {/* CTA セクション */}
          <div className={styles.ctaSection}>
            <h2>今すぐ始めましょう</h2>
            <p>アカウントを作成して、タスク管理を始めましょう</p>

            <div className={styles.ctaButtons}>
              <Link href="/profile/register" className={styles.primaryButton}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                新規登録
              </Link>

              <Link href="/profile/login" className={styles.secondaryButton}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
