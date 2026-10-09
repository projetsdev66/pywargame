export interface TestCall {
  kind: 'call';
  fn: string;
  args: unknown[];
  expect: unknown[]; // liste des résultats acceptés (plusieurs codes peuvent être justes)
  tol?: number; // tolérance numérique éventuelle
}

export interface TestStdout {
  kind: 'stdout';
  expect: string[]; // sorties acceptées (normalisées)
}

export type LevelTest = TestCall | TestStdout;

export interface Tip {
  pattern: string; // expression régulière (chaîne)
  advice: string; // conseil affiché si le motif est trouvé (ou absent selon mode)
  mode: 'avoid' | 'prefer';
}

export interface Level {
  id: number;
  phase: number;
  phaseName: string;
  topic: string;
  title: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes?: number;
  skills?: string[];
  prerequisites?: string[];
  theory: string; // markdown simplifié (``` pour blocs de code)
  statement: string;
  starterCode: string; // zone à compléter : commentaires uniquement, pas de solution
  hints: string[]; // 2 à 3 indices progressifs
  visibleTests: LevelTest[];
  hiddenTests: LevelTest[];
  solution: string; // correction commentée, révélée après réussite
  tips: Tip[]; // analyse du code : conseils d'optimisation / bonnes pratiques
}

export interface RunResult {
  stdout: string;
  calls: { ok: boolean; got: unknown; error?: string }[];
  error?: string; // erreur Python lisible
  timedOut?: boolean;
}
