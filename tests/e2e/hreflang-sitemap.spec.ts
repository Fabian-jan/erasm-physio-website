import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { expect, test } from '@playwright/test';
import { loadEnv } from 'vite';
import { parseEnv } from '../../src/lib/env.schema';

// Même résolution que astro.config.mjs et json-ld.spec.ts : l'origine réellement utilisée pour
// CE build (dist/ doit déjà exister — voir helpers/routes.ts).
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

function toRoute(htmlFile: string): string {
  const relPath = relative(DIST_DIR, htmlFile).split(sep).join('/');
  return '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
}

interface HreflangLink {
  code: string;
  href: string;
}

function extractHreflangLinks(html: string): HreflangLink[] {
  const pattern = /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g;
  return [...html.matchAll(pattern)].map(([, code, href]) => ({ code, href }));
}

function extractLang(html: string): string {
  const match = html.match(/<html lang="([^"]+)">/);
  if (!match) throw new Error(`pas de <html lang="..."> trouvé — build cassé`);
  return match[1];
}

// Même mécanisme que noindex dans BaseLayout.astro : c'est la source de vérité de "cette page
// ne doit pas être indexée", donc du même mouvement, ni exiger de hreflang ni figurer au sitemap.
function isNoindex(html: string): boolean {
  return html.includes('<meta name="robots" content="noindex, nofollow">');
}

interface Page {
  route: string;
  url: string;
  noindex: boolean;
  lang: string;
  hreflangLinks: HreflangLink[];
}

const pages: Page[] = collectHtmlFiles(DIST_DIR).map((file) => {
  const html = readFileSync(file, 'utf-8');
  const route = toRoute(file);
  return {
    route,
    url: new URL(route, expectedOrigin).href,
    noindex: isNoindex(html),
    lang: extractLang(html),
    hreflangLinks: extractHreflangLinks(html),
  };
});

function parseSitemapUrls(): Set<string> {
  const indexXml = readFileSync(join(DIST_DIR, 'sitemap-index.xml'), 'utf-8');
  const sitemapFiles = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
  expect(
    sitemapFiles.length,
    'sitemap-index.xml ne référence aucun fichier de sitemap',
  ).toBeGreaterThan(0);

  const urls = new Set<string>();
  for (const sitemapUrl of sitemapFiles) {
    const filename = new URL(sitemapUrl).pathname.replace(/^\//, '');
    const xml = readFileSync(join(DIST_DIR, filename), 'utf-8');
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(loc);
  }
  return urls;
}

test.describe('hreflang réciproques', () => {
  test("chaque page publiée déclare fi + en + sv + x-default, s'auto-référence, et chaque cible renvoie vers elle", async () => {
    const publishedPages = pages.filter((p) => !p.noindex);
    // Garde-fou contre un test qui ne trouverait plus rien à vérifier (routing cassé, dist/ vide).
    expect(publishedPages.length, 'aucune page publiée trouvée dans dist/').toBeGreaterThan(0);

    const urlToPage = new Map(pages.map((p) => [p.url, p]));

    for (const page of publishedPages) {
      const codes = page.hreflangLinks.map((l) => l.code).sort();
      expect(
        codes,
        `${page.route} : jeu de hreflang incomplet — attendu fi/en/sv/x-default, trouvé ${JSON.stringify(codes)}`,
      ).toEqual(['en', 'fi', 'sv', 'x-default']);

      const selfLink = page.hreflangLinks.find((l) => l.href === page.url);
      expect(
        selfLink,
        `${page.route} : aucune balise hreflang ne s'auto-référence vers ${page.url}`,
      ).toBeDefined();
      expect(
        selfLink?.code,
        `${page.route} : le hreflang qui s'auto-référence porte le code "${selfLink?.code}" au lieu de "${page.lang}"`,
      ).toBe(page.lang);

      const fiLink = page.hreflangLinks.find((l) => l.code === 'fi');
      const defaultLink = page.hreflangLinks.find((l) => l.code === 'x-default');
      expect(
        defaultLink?.href,
        `${page.route} : x-default (${defaultLink?.href}) ne pointe pas vers la version fi (${fiLink?.href})`,
      ).toBe(fiLink?.href);

      for (const link of page.hreflangLinks.filter((l) => l.code !== 'x-default')) {
        const target = urlToPage.get(link.href);
        expect(
          target,
          `${page.route} : hreflang "${link.code}" pointe vers ${link.href}, absent de dist/`,
        ).toBeDefined();
        expect(
          target?.noindex,
          `${page.route} : hreflang "${link.code}" pointe vers ${link.href}, qui est noindex`,
        ).toBe(false);

        const backLink = target?.hreflangLinks.find((l) => l.href === page.url);
        expect(
          backLink,
          `réciprocité rompue : ${target?.route} ne renvoie pas de hreflang vers ${page.route} (${page.url})`,
        ).toBeDefined();
      }
    }
  });

  test('les pages noindex (styleguide, 404) ne portent aucune balise hreflang', async () => {
    const noindexPages = pages.filter((p) => p.noindex);
    expect(
      noindexPages.length,
      'aucune page noindex trouvée — le garde-fou ci-dessus perd son contraste',
    ).toBeGreaterThan(0);

    for (const page of noindexPages) {
      expect(
        page.hreflangLinks,
        `${page.route} est noindex mais porte des balises hreflang`,
      ).toHaveLength(0);
    }
  });
});

test.describe('sitemap.xml', () => {
  test('couvre exactement les pages publiées — aucune page noindex, aucune page manquante', async () => {
    const sitemapUrls = parseSitemapUrls();
    expect(sitemapUrls.size, 'sitemap vide — build cassé ou régression').toBeGreaterThan(0);

    for (const page of pages) {
      if (page.noindex) {
        expect(
          sitemapUrls.has(page.url),
          `${page.route} est noindex mais apparaît dans le sitemap`,
        ).toBe(false);
      } else {
        expect(sitemapUrls.has(page.url), `${page.route} est publiée mais absente du sitemap`).toBe(
          true,
        );
      }
    }
  });
});
