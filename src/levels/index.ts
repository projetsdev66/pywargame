// Assemblage de tous les niveaux : chaque famille génère ses variantes
// avec un hasard déterministe (même niveau à chaque visite).
import type { Level } from '@/types/level';
import { makeRng, type FamSpec } from './util';
import { PHASE1 } from './phase1';
import { PHASE2 } from './phase2';
import { PHASE3, NUMPY_KEYS } from './phase3';
import { PHASE4 } from './phase4';

export const PHASE_NAMES: Record<number, string> = {
  1: 'Les bases de Python',
  2: 'Algorithmique',
  3: 'Calcul scientifique',
  4: 'Synthèse type DS MPSI',
};

function buildPhase(fams: FamSpec[], phase: number, startId: number): Level[] {
  const out: Level[] = [];
  let id = startId;
  for (const fam of fams) {
    for (let i = 0; i < fam.count; i++) {
      const r = makeRng(id * 7919 + 13);
      const partial = fam.gen(r, i);
      out.push({ ...partial, id, phase, phaseName: PHASE_NAMES[phase] });
      id++;
    }
  }
  return out;
}

let id = 1;
const l1 = buildPhase(PHASE1, 1, id); id += l1.length;
const l2 = buildPhase(PHASE2, 2, id); id += l2.length;
const l3 = buildPhase(PHASE3, 3, id); id += l3.length;
const l4 = buildPhase(PHASE4, 4, id); id += l4.length;

export const LEVELS: Level[] = [...l1, ...l2, ...l3, ...l4];

export const NUMPY_LEVELS = new Set<number>(
  LEVELS.filter((l) => NUMPY_KEYS.has(keyOf(l))).map((l) => l.id)
);

function keyOf(l: Level): string {
  // retrouve la famille à partir du topic
  for (const fam of [...PHASE3]) if (fam.topic === l.topic) return fam.key;
  return '';
}

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function needsNumpy(l: Level): boolean {
  return NUMPY_LEVELS.has(l.id);
}

export const TOTAL = LEVELS.length;
