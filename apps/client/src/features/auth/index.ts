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
} from './atoms/userAtom';

// Types
export type {
  UserInfo,
  AuthStatus,
  UserBase,
  UserForRegister,
  UserForLogin,
  ApiError,
  RegisterResponse,
  LoginResponse,
  ProfileResponse,
} from './types';

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
  AuthApiError,
} from './user-auth';
