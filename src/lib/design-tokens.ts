import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Chemin dérivé de process.cwd() (racine du projet), pas de import.meta.url : au build,
// Astro déplace les modules compilés dans dist/.prerender/chunks/, un chemin relatif à
// l'emplacement du module ne pointerait alors plus vers le vrai fichier source.
const GLOBAL_CSS_PATH = resolve(process.cwd(), 'src/styles/global.css');

let cssCache: string | null = null;

function readGlobalCss(): string {
  cssCache ??= readFileSync(GLOBAL_CSS_PATH, 'utf-8');
  return cssCache;
}

/**
 * Toutes les couleurs déclarées dans le bloc @theme de src/styles/global.css — source de
 * vérité unique. Ni le styleguide ni les tests ne recopient de valeurs hex codées en dur.
 */
export function readColorTokens(): Record<string, string> {
  const css = readGlobalCss();
  const tokens: Record<string, string> = {};
  for (const match of css.matchAll(/--color-([a-z]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens[match[1]] = match[2].toUpperCase();
  }
  return tokens;
}

export interface ThemeToken {
  name: string;
  value: string;
}

/**
 * Tokens d'une catégorie donnée (text, spacing, radius, shadow, tracking...) déclarés dans
 * @theme, dans leur ordre d'apparition. Exclut délibérément les propriétés composées comme
 * --text-2xs--line-height : leur nom contient un second "--" juste après le palier, donc
 * aucun ":" n'apparaît immédiatement après le groupe capturé et elles ne matchent pas.
 */
export function readThemeTokens(category: string): ThemeToken[] {
  const css = readGlobalCss();
  const pattern = new RegExp(`--${category}-([a-z0-9]+):\\s*([^;]+);`, 'g');
  return [...css.matchAll(pattern)].map((match) => ({ name: match[1], value: match[2].trim() }));
}
