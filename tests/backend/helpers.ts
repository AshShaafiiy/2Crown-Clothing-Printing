export async function getFirebaseIdToken(email: string, password: string = 'password123'): Promise<string> {
  // If the password is intentionally wrong for test failures, prefix with invalid-
  if (password === 'wrong' || password === 'wrongpassword') {
    return 'invalid-token-for-' + email;
  }
  // Otherwise, return a mock token string that we will intercept in setup.ts
  return email + ':' + password;
}
