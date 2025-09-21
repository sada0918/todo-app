/**
 * 認証機能のエクスポート
 */

// Components
export { AuthGuard } from './components/AuthGuard';

// Hooks
export { useAuthCheck } from './hooks/useAuthCheck';

// Atoms
export {
  userAtom,
  authStatusAtom,
  isAuthenticatedAtom,
  userDisplayNameAtom,
  type UserInfo,
  type AuthStatus,
} from './atoms/userAtom';

// Utils
export {
  translateErrorMessage,
  translateErrorMessages,
  getFieldErrorMessage,
} from './errorMessages';

// API
export {
  login,
  register,
  checkLoginStatus,
  LoginError,
  RegistrationError,
  type ApiLoginData,
  type ApiRegisterData,
  type Member,
} from './user-auth';
