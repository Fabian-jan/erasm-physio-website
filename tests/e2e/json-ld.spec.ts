import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { loadEnv } from 'vite';
import { parseEnv } from '../../src/lib/env.schema';

// Même résolution que astro.config.mjs : c'est la source de vérité de l'origine réellement
// utilisée pour CE build (dist/ doit déjà exister — voir helpers/routes.ts). En local et en CI,
// SITE_URL vaut délibérément http://localhost:4321 (CLAUDE.md, "Pièges connus") ; l'assertion
// ci-dessous reste valable dans les deux cas, elle ne bannit pas "localhost" en dur — elle vérifie
// que le JSON-LD reflète bien SITE_URL, quelle que soit sa valeur. C'est ce qui aurait attrapé
// une régression vers une URL localhost figée si elle survenait sur le build de production
// (Vercel, où SITE_URL est la vraie URL du site).
const env = parseEnv(loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''));
const expectedOrigin = new URL(env.SITE_URL).origin;

const DIST_DIR = join(process.cwd(), 'dist');

function collectHtmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory()
      ? collectHtmlFiles(fullPath)
      : entry.endsWith('.html')
        ? [fullPath]
        : [];
  });
}

interface JsonLdWithUrl {
  url: unknown;
  [key: string]: unknown;
}

function extractJsonLdBlocks(html: string): JsonLdWithUrl[] {
  const blocks: JsonLdWithUrl[] = [];
  const pattern = /<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs;
  for (const match of html.matchAll(pattern)) {
    const parsed = JSON.parse(match[1]);
    if (typeof parsed === 'object' && parsed !== null && 'url' in parsed) {
      blocks.push(parsed as JsonLdWithUrl);
    }
  }
  return blocks;
}

test.describe('données structurées JSON-LD', () => {
  test("chaque URL de JSON-LD porte l'origine de SITE_URL — jamais une valeur figée", async () => {
    const htmlFiles = collectHtmlFiles(DIST_DIR);
    const allBlocks = htmlFiles.flatMap((file) => extractJsonLdBlocks(readFileSync(file, 'utf-8')));

    // Garde-fou contre un test qui ne trouverait plus rien à vérifier (JSON-LD supprimé par
    // erreur) : au moins les 3 pages "zone d'intervention" doivent en porter un aujourd'hui.
    expect(
      allBlocks.length,
      'aucun bloc JSON-LD trouvé dans dist/ — build cassé ou régression',
    ).toBeGreaterThan(0);

    for (const block of allBlocks) {
      expect(
        typeof block.url,
        `url JSON-LD absente ou de type invalide : ${JSON.stringify(block)}`,
      ).toBe('string');
      const actualOrigin = new URL(block.url as string).origin;
      expect(
        actualOrigin,
        `URL JSON-LD "${block.url}" a une origine différente de SITE_URL (${expectedOrigin}) — ` +
          `en production, ça veut dire une URL localhost qui fuite dans les données structurées.`,
      ).toBe(expectedOrigin);
    }
  });
});
