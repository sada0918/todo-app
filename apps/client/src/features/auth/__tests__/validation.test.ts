import { validateRegisterForm, validateField } from '../validation';

describe('validateRegisterForm', () => {
  const validData = {
    name1: '山田',
    name2: '太郎',
    email: 'test@example.com',
    login_pwd: 'password123',
    confirmPassword: 'password123',
  };

  test('有効なデータの場合、エラーが返されない', () => {
    const errors = validateRegisterForm(validData);
    expect(errors).toHaveLength(0);
  });

  test('姓が空の場合、エラーが返される', () => {
    const data = { ...validData, name1: '' };
    const errors = validateRegisterForm(data);
    expect(errors).toContainEqual({
      field: 'name1',
      message: '姓を入力してください'
    });
  });

  test('無効なメールアドレスの場合、エラーが返される', () => {
    const data = { ...validData, email: 'invalid-email' };
    const errors = validateRegisterForm(data);
    expect(errors).toContainEqual({
      field: 'email',
      message: '有効なメールアドレスを入力してください'
    });
  });

  test('パスワードが弱い場合、エラーが返される', () => {
    const data = { ...validData, login_pwd: '123' };
    const errors = validateRegisterForm(data);
    expect(errors).toContainEqual({
      field: 'login_pwd',
      message: 'パスワードは8文字以上で、英字と数字を含む必要があります'
    });
  });

  test('確認パスワードが一致しない場合、エラーが返される', () => {
    const data = { ...validData, confirmPassword: 'different' };
    const errors = validateRegisterForm(data);
    expect(errors).toContainEqual({
      field: 'confirmPassword',
      message: 'パスワードが一致しません'
    });
  });
});

describe('validateField', () => {
  test('有効なメールアドレスの場合、nullが返される', () => {
    const result = validateField('email', 'test@example.com');
    expect(result).toBeNull();
  });

  test('無効なメールアドレスの場合、エラーメッセージが返される', () => {
    const result = validateField('email', 'invalid');
    expect(result).toBe('有効なメールアドレスを入力してください');
  });

  test('確認パスワードが元のパスワードと一致する場合、nullが返される', () => {
    const allData = { login_pwd: 'password123' };
    const result = validateField('confirmPassword', 'password123', allData);
    expect(result).toBeNull();
  });
});
