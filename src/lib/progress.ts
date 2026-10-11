// Progression sauvegardée dans le navigateur (localStorage) — aucun compte.
// Chaque validation est liée à une signature du niveau pour éviter qu'un ancien
// succès reste affiché après une modification de l'énoncé ou des tests.

import { LEVELS } from '@/levels';
import type { Level } from '@/types/level';

const KEY = 'pywargame-progress-v2';
const LEGACY_KEY = 'pywargame-progress-v1';

export interface Progress {
  done: number[];
  codes: Record<number, string>;
  hintsUsed: Record<number, number>;
  signatures: Record<number, string>;
}

export interface ProgressLoadReport {
  progress: Progress;
  migratedLegacy: boolean;
  invalidatedIds: number[];
}

const emptyProgress = (): Progress => ({ done: [], codes: {}, hintsUsed: {}, signatures: {} });

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return Object.keys(item as Record<string, unknown>).sort().reduce<Record<string, unknown>>((out, key) => {
        out[key] = (item as Record<string, unknown>)[key];
        return out;
      }, {});
    }
    return item;
  });
}

// Empreinte légère et déterministe : elle ne sert pas à la sécurité, uniquement
// à détecter une modification du contenu pédagogique dans le même navigateur.
export function levelSignature(level: Level): string {
  const content = {
    title: level.title,
    topic: level.topic,
    theory: level.theory,
    statement: level.statement,
    starterCode: level.starterCode,
    hints: level.hints,
    visibleTests: level.visibleTests,
    hiddenTests: level.hiddenTests,
    solution: level.solution,
  };
  let hash = 2166136261;
  for (const char of stableJson(content)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

const currentSignatures = (): Record<number, string> =>
  Object.fromEntries(LEVELS.map((level) => [level.id, levelSignature(level)]));

function normalizeProgress(raw: Partial<Progress>): Progress {
  return {
    done: Array.isArray(raw.done) ? raw.done.filter((id): id is number => Number.isInteger(id)) : [],
    codes: raw.codes && typeof raw.codes === 'object' ? raw.codes : {},
    hintsUsed: raw.hintsUsed && typeof raw.hintsUsed === 'object' ? raw.hintsUsed : {},
    signatures: raw.signatures && typeof raw.signatures === 'object' ? raw.signatures : {},
  };
}

export function synchronizeProgress(input: Progress): ProgressLoadReport {
  const signatures = currentSignatures();
  const hasSignatures = Object.keys(input.signatures).length > 0;
  const invalidatedIds = input.done.filter((id) => !hasSignatures || input.signatures[id] !== signatures[id]);
  const invalidated = new Set(invalidatedIds);
  const progress: Progress = {
    ...input,
    done: input.done.filter((id) => !invalidated.has(id)),
    signatures: Object.fromEntries(Object.entries(input.signatures).filter(([id]) => signatures[Number(id)] !== undefined)),
  };
  return { progress, migratedLegacy: !hasSignatures && input.done.length > 0, invalidatedIds };
}

export function loadProgressReport(): ProgressLoadReport {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (raw) return synchronizeProgress(normalizeProgress(JSON.parse(raw)));
  } catch { /* données corrompues : on repart de zéro */ }
  return { progress: emptyProgress(), migratedLegacy: false, invalidatedIds: [] };
}

export function loadProgress(): Progress {
  return loadProgressReport().progress;
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
  localStorage.removeItem(LEGACY_KEY);
}

export function markLevelSolved(progress: Progress, id: number): Progress {
  const level = LEVELS.find((item) => item.id === id);
  if (!level) return progress;
  return {
    ...progress,
    done: progress.done.includes(id) ? progress.done : [...progress.done, id],
    signatures: { ...progress.signatures, [id]: levelSignature(level) },
  };
}

export function isUnlocked(done: number[], id: number): boolean {
  return id === 1 || done.includes(id) || done.includes(id - 1);
}

export function exportProgress(p: Progress) {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'progression-pywargame.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importProgress(file: File): Promise<Progress> {
  return new Promise((resolve, reject) => {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const p = JSON.parse(String(rd.result));
        if (!Array.isArray(p.done)) throw new Error('format');
        resolve(synchronizeProgress(normalizeProgress(p)).progress);
      } catch {
        reject(new Error('Fichier de progression invalide.'));
      }
    };
    rd.readAsText(file);
  });
}

// Analyse du code de l'élève : conseils d'optimisation / style selon les motifs.
export function analyseCode(code: string, tips: { pattern: string; advice: string; mode: string }[]): string[] {
  const out: string[] = [];
  for (const t of tips) {
    try {
      const found = new RegExp(t.pattern, 'm').test(code);
      if ((t.mode === 'avoid' && found) || (t.mode === 'prefer' && !found)) out.push(t.advice);
    } catch { /* motif invalide : ignoré */ }
  }
  if (/while True/.test(code) && !/break/.test(code))
    out.push('Attention : « while True » sans « break » risque de boucler à l\'infini.');
  return out;
}
