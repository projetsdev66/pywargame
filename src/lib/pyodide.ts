import type { LevelTest, RunResult } from '@/types/level';

let worker: Worker | null = null;
let msgId = 0;
const pending = new Map<number, (r: any) => void>();

function ensureWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../pyodide-worker.ts', import.meta.url));
    worker.onmessage = (e) => {
      const { id, ...rest } = e.data;
      const cb = pending.get(id);
      if (cb) {
        pending.delete(id);
        cb(rest);
      }
    };
  }
  return worker;
}

function killWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

const TIMEOUT_MS = 12000;
// NumPy doit être téléchargé à la première utilisation : délai plus large.
const TIMEOUT_NUMPY_MS = 90000;

async function rawRun(code: string, calls: { fn: string; args: unknown[] }[], needNumpy: boolean): Promise<any> {
  // Un worker neuf à chaque exécution : isolation totale entre les runs
  // (Pyodide et numpy restent en cache navigateur après le premier chargement).
  killWorker();
  const w = ensureWorker();
  const id = ++msgId;
  const timeout = needNumpy ? TIMEOUT_NUMPY_MS : TIMEOUT_MS;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      killWorker();
      pending.delete(id);
      resolve({ error: 'TIMEOUT', timedOut: true });
    }, timeout);
    pending.set(id, (r) => {
      clearTimeout(timer);
      resolve(r);
    });
    w.postMessage({ id, code, calls, needNumpy });
  });
}

function deepEq(a: any, b: any, tol = 0): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    if (tol > 0) return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
    return a === b || Math.abs(a - b) < 1e-12;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEq(v, b[i], tol));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => deepEq(a[k], (b as any)[k], tol));
  }
  return a === b;
}

function normalizeStdout(s: string): string {
  return s.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n+$/,'').trim();
}

export interface TestOutcome {
  test: LevelTest;
  visible: boolean;
  passed: boolean;
  detail: string; // message lisible pour l'élève
}

export async function runLevel(
  code: string,
  tests: { test: LevelTest; visible: boolean }[],
  needNumpy: boolean
): Promise<{ outcomes: TestOutcome[]; run: RunResult }> {
  const callTests = tests.filter((t) => t.test.kind === 'call');
  const hasStdout = tests.some((t) => t.test.kind === 'stdout');
  const calls = callTests.map((t) => {
    const c = t.test as Extract<LevelTest, { kind: 'call' }>;
    return { fn: c.fn, args: c.args };
  });

  const r = await rawRun(code, calls, needNumpy);
  const run: RunResult = {
    stdout: r.stdout || '',
    calls: [],
    error: r.error === 'TIMEOUT' ? undefined : r.error,
    timedOut: r.timedOut,
    cancelled: r.cancelled,
  };

  const outcomes: TestOutcome[] = [];
  if (r.timedOut) {
    for (const t of tests) outcomes.push({ ...t, passed: false, detail: '' });
    return { outcomes, run };
  }
  if (r.cancelled) {
    for (const t of tests) outcomes.push({ ...t, passed: false, detail: 'Exécution interrompue avant la fin des tests.' });
    return { outcomes, run };
  }
  if (r.error) {
    for (const t of tests) outcomes.push({ ...t, passed: false, detail: '' });
    return { outcomes, run };
  }

  let callIdx = 0;
  for (const t of tests) {
    if (t.test.kind === 'stdout') {
      const got = normalizeStdout(r.stdout || '');
      const ok = t.test.expect.some((e) => normalizeStdout(e) === got);
      outcomes.push({
        ...t,
        passed: ok,
        detail: ok
          ? ''
          : `Sortie obtenue :\n${got || '(rien n\'a été affiché)'}\n\nSortie attendue :\n${t.visible ? t.test.expect[0] : '(test caché)'}`,
      });
    } else {
      const c = t.test;
      const res = r.results?.[callIdx++];
      if (!res) {
        outcomes.push({ ...t, passed: false, detail: 'Erreur interne du test.' });
      } else if (!res.ok) {
        outcomes.push({ ...t, passed: false, detail: res.error || 'Erreur lors de l\'appel.' });
      } else {
        const ok = c.expect.some((e) => deepEq(res.got, e, c.tol || 0));
        const fmt = (v: any) => JSON.stringify(v);
        outcomes.push({
          ...t,
          passed: ok,
          detail: ok
            ? ''
            : `Entrée testée : ${c.fn}(${c.args.map((a) => fmt(a)).join(', ')})\nRésultat obtenu : ${fmt(res.got)}\nRésultat attendu : ${c.expect.map(fmt).join(' ou ')}\nPiste : vérifiez le cas limite et la valeur renvoyée par return.`,
        });
      }
    }
  }
  void hasStdout;
  return { outcomes, run };
}

export function warmup() {
  ensureWorker();
}

/** Interrompt le worker actif et libère la promesse d’exécution en attente. */
export function cancelRun() {
  for (const [id, resolve] of pending) {
    pending.delete(id);
    resolve({ error: 'CANCELLED', cancelled: true });
  }
  killWorker();
}
