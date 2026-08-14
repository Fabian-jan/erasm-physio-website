import { describe, expect, it } from 'vitest';
import { EnvValidationError, parseEnv } from '../../src/lib/env.schema';

describe('parseEnv', () => {
  it('accepte des variables valides et renvoie un objet typé', () => {
    const env = parseEnv({ SITE_URL: 'https://erasmphysio.fi' });
    expect(env.SITE_URL).toBe('https://erasmphysio.fi');
  });

  it('rejette une variable manquante avec un message citant son nom', () => {
    expect(() => parseEnv({})).toThrow(EnvValidationError);
    try {
      parseEnv({});
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(EnvValidationError);
      expect((error as Error).message).toContain('SITE_URL');
      expect((error as Error).message).toContain('.env.example');
    }
  });

  it('rejette une variable présente mais invalide (URL malformée)', () => {
    expect(() => parseEnv({ SITE_URL: 'pas-une-url' })).toThrow(EnvValidationError);
  });
});
