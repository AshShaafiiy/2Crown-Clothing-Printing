export const MIN_PASSWORD_LENGTH = 8;

export function evaluatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isStrongEnough: boolean;
} {
  if (!password) {
    return { score: 0, feedback: [], isStrongEnough: false };
  }

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= MIN_PASSWORD_LENGTH) {
    score += 1;
  } else {
    feedback.push(`At least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one lowercase letter');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character');
  }

  const finalScore = Math.min(score, 4);
  const isStrongEnough = password.length >= MIN_PASSWORD_LENGTH && finalScore >= 3;

  return {
    score: finalScore,
    feedback,
    isStrongEnough
  };
}
