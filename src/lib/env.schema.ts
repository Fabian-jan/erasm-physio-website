import { z } from 'zod';

// Source de vérité unique pour les variables d'environnement du projet, avec leurs types.
// Toute nouvelle variable (connexion PostgreSQL, secrets d'auth, etc.) se déclare ici, jamais
// lue directement via import.meta.env/process.env ailleurs dans le code.
export const envSchema = z.object({
  // URL canonique du site (site: dans astro.config.mjs, sitemap, balises canoniques, hreflang).
  SITE_URL: z.url('doit être une URL absolue, ex. https://erasmphysio.fi'),
});

export type Env = z.infer<typeof envSchema>;

interface Issue {
  path: PropertyKey[];
  message: string;
}

export class EnvValidationError extends Error {
  constructor(issues: Issue[]) {
    const details = issues
      .map((issue) => `  - ${issue.path.join('.') || '(racine)'} : ${issue.message}`)
      .join('\n');
    super(
      `Variables d'environnement invalides ou manquantes :\n${details}\n\n` +
        `Copiez .env.example vers .env et renseignez les valeurs manquantes.`,
    );
    this.name = 'EnvValidationError';
  }
}

export function parseEnv(raw: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    throw new EnvValidationError(result.error.issues);
  }
  return result.data;
}
