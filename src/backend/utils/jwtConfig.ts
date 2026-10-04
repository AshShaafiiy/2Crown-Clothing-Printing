export function loadJwtConfig(env: NodeJS.ProcessEnv): string {
  return env.JWT_SECRET || 'super-secret-development-key';
}

export function isPeriodicPattern(value: string): boolean {
  // Detect even truncated repetitions, not just evenly divisible blocks.
  for (let period = 1; period <= value.length / 2; period++) {
    if ([...value].every((char, index) => char === value[index % period])) return true;
  }
  return false;
}

export function isPredictableDecodedPayload(secret: string): boolean {
  const bytes = Buffer.from(secret, 'hex');
  // A generated 32-byte key should not be an encoded printable phrase.
  if ([...bytes].every(byte => byte >= 32 && byte <= 126)) return true;
  return [1, -1].some(step => [...bytes].slice(1).every((byte, i) => byte === ((bytes[i] + step + 256) % 256)));
}

export function isKnownWeakSecret(secret: string): boolean {
  return secret.toLowerCase() === '7b5a8f2e9c1d4a6b3f0e8d7c5b4a9f2e1d0c3b2a5f4e7d8c9b0a1f2e3d4c5b6a';
}

export function validateJwtSecret(secret: string | undefined, environment: string): void {
  if (environment !== 'production') return;
  if (!secret || !secret.trim()) throw new Error('FATAL: JWT_SECRET is missing or empty in production.');
  if (!/^[a-fA-F0-9]{64}$/.test(secret)) throw new Error('FATAL: JWT_SECRET must be exactly 64 hexadecimal characters in production.');
  if (isKnownWeakSecret(secret) || isPeriodicPattern(secret.toLowerCase()) || isPredictableDecodedPayload(secret)) {
    throw new Error('FATAL: JWT_SECRET is a weak or repeating pattern. Generate 32 cryptographically random bytes.');
  }
}
