// Progression sauvegardée dans le navigateur (localStorage) — aucun compte.
// Export / import par fichier JSON pour changer d'appareil.

const KEY = 'pywargame-progress-v1';

export interface Progress {
  done: number[]; // ids des niveaux réussis
  codes: Record<number, string>; // dernier code saisi par niveau
  hintsUsed: Record<number, number>; // indices révélés par niveau
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { done: p.done || [], codes: p.codes || {}, hintsUsed: p.hintsUsed || {} };
    }
  } catch { /* données corrompues : on repart de zéro */ }
  return { done: [], codes: {}, hintsUsed: {} };
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
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
        resolve({ done: p.done, codes: p.codes || {}, hintsUsed: p.hintsUsed || {} });
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
      if ((t.mode === 'avoid' && found) || (t.mode === 'prefer' && found)) out.push(t.advice);
    } catch { /* motif invalide : ignoré */ }
  }
  // Conseils génériques
  if (/while True/.test(code) && !/break/.test(code))
    out.push('Attention : « while True » sans « break » risque de boucler à l\'infini.');
  return out;
}
