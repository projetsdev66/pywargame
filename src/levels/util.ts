// Utilitaires pour les générateurs de niveaux : hasard reproductible, formatage Python.
import type { Level } from '@/types/level';

export type RNG = () => number;

// Générateur pseudo-aléatoire déterministe (mulberry32) : les niveaux sont
// identiques à chaque chargement, sans stockage externe.
export function makeRng(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ri = (r: RNG, min: number, max: number) => min + Math.floor(r() * (max - min + 1));
export const pick = <T,>(r: RNG, arr: T[]): T => arr[Math.floor(r() * arr.length)];
export const intArr = (r: RNG, n: number, min: number, max: number) =>
  Array.from({ length: n }, () => ri(r, min, max));

// Représentation Python d'une valeur JS (pour les énoncés et les corrections)
export function py(v: any): string {
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) return `[${v.map(py).join(', ')}]`;
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (v === null) return 'None';
  if (v && typeof v === 'object')
    return `{${Object.entries(v).map(([k, x]) => `${py(k)}: ${py(x)}`).join(', ')}}`;
  return String(v);
}

export interface FamSpec {
  key: string;
  topic: string;
  count: number;
  gen: (r: RNG, i: number) => Omit<Level, 'id' | 'phase' | 'phaseName'>;
}

// Complément commun injecté dans chaque fiche : il harmonise les 540 cours
// sans modifier les exercices générés ni révéler directement leur solution.
export function enrichTheory(theory: string, phase: number, topic: string): string {
  const phaseAdvice: Record<number, string> = {
    1: 'Commencez par traduire chaque verbe de l’énoncé en une instruction Python, puis vérifiez les types des valeurs manipulées.',
    2: 'Écrivez l’invariant de la boucle en une phrase : que représente exactement l’accumulateur après chaque tour ?',
    3: 'Identifiez les dimensions, le type numérique et la tolérance attendue avant de calculer ; vérifiez ensuite un petit cas à la main.',
    4: 'Découpez le problème en sous-fonctions ou étapes simples, puis testez séparément un cas nominal et un cas limite.',
    5: 'Repérez l’outil Python demandé, construisez un exemple minimal, puis vérifiez le comportement lorsque l’entrée est vide, invalide ou à la borne.',
  };
  const advice = phaseAdvice[phase] ?? 'Décomposez le problème, testez un exemple simple et vérifiez les cas limites.';
  return `${theory}

### Méthode MPSI
**Notion travaillée :** ${topic}. ${advice}

### Points de vigilance
- Distinguez toujours la valeur renvoyée de la valeur affichée avec \`print()\`.
- Vérifiez les bornes : liste vide, premier ou dernier indice, valeur nulle et égalités.
- Préférez une solution lisible avant de chercher à la raccourcir ; le nom des variables doit rendre l’algorithme compréhensible.

### Auto-vérification
Avant de valider, essayez mentalement un cas simple, un cas limite et un cas qui ne suit pas le chemin principal. Si le résultat est faux, lisez d’abord la première erreur signalée et localisez la ligne concernée.`;
}

// Gabarit de code de départ : uniquement des commentaires + un « pass ».
// L'élève écrit son code lui-même, guidé par les commentaires.
export function starterFn(signature: string, todo: string[]): string {
  const lines = todo.map((t) => `    # ${t}`).join('\n');
  return `${signature}\n    # À vous de jouer ! Complétez le corps de la fonction.\n${lines}\n    # Effacez la ligne « pass » et écrivez votre code.\n    pass\n`;
}

export function starterPrint(todo: string[]): string {
  const lines = todo.map((t) => `# ${t}`).join('\n');
  return `# À vous de jouer ! Écrivez votre programme ci-dessous.\n${lines}\n`;
}
