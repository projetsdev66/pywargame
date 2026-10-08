import { useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { ArrowLeft, ArrowRight, Play, CheckCircle2, Lightbulb, RotateCcw, BookOpen, ChevronDown } from 'lucide-react';
import type { Level } from '@/types/level';
import { needsNumpy, getLevel } from '@/levels';
import { runLevel, type TestOutcome } from '@/lib/pyodide';
import { analyseCode, type Progress } from '@/lib/progress';
import { Markdown } from '@/components/Markdown';

const PHASE_BADGE: Record<number, string> = {
  1: 'bg-emerald-100 text-emerald-800',
  2: 'bg-indigo-100 text-indigo-800',
  3: 'bg-amber-100 text-amber-800',
  4: 'bg-rose-100 text-rose-800',
};

export function LevelPage({
  level,
  progress,
  onBack,
  onSolved,
  onSaveCode,
  onUseHint,
  onOpen,
}: {
  level: Level;
  progress: Progress;
  onBack: () => void;
  onSolved: (id: number) => void;
  onSaveCode: (id: number, code: string) => void;
  onUseHint: (id: number, n: number) => void;
  onOpen: (id: number) => void;
}) {
  const [code, setCode] = useState(progress.codes[level.id] ?? level.starterCode);
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState<string | null>(null);
  const [pyError, setPyError] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null);
  const [solved, setSolved] = useState(progress.done.includes(level.id));
  const [showTheory, setShowTheory] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const hintsShown = progress.hintsUsed[level.id] ?? 0;

  const allTests = useMemo(
    () => [
      ...level.visibleTests.map((t) => ({ test: t, visible: true })),
      ...level.hiddenTests.map((t) => ({ test: t, visible: false })),
    ],
    [level]
  );

  const execute = async (validate: boolean) => {
    setRunning(true);
    setPyError(null);
    setOutcomes(null);
    setStdout(null);
    onSaveCode(level.id, code);
    try {
      const tests = validate ? allTests : [];
      const { outcomes: oc, run } = await runLevel(code, tests, needsNumpy(level));
      setStdout(run.stdout || '');
      if (run.timedOut) {
        setPyError(`⏱️ Temps dépassé : votre code a mis plus de ${needsNumpy(level) ? 90 : 12} secondes. Vérifiez les boucles (risque de boucle infinie).`);
      } else if (run.error) {
        setPyError(run.error);
      }
      if (validate) {
        setOutcomes(oc);
        const allOk = !run.timedOut && !run.error && oc.every((o) => o.passed);
        if (allOk) {
          setSolved(true);
          onSolved(level.id);
          setTips(analyseCode(code, level.tips));
          setShowSolution(true);
        }
      }
    } finally {
      setRunning(false);
    }
  };

  const passed = outcomes?.filter((o) => o.passed).length ?? 0;
  const next = getLevel(level.id + 1);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20">
      {/* Barre supérieure */}
      <div className="sticky top-0 z-10 -mx-4 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 min-h-[44px]">
          <ArrowLeft size={16} /> Niveaux
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900">Niveau {level.id}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PHASE_BADGE[level.phase]}`}>{level.phaseName}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{level.topic}</span>
          </div>
          <h1 className="truncate text-sm text-slate-500">{level.title}</h1>
        </div>
        {solved && <span className="flex items-center gap-1 text-emerald-600 text-sm font-semibold"><CheckCircle2 size={18} /> Réussi</span>}
      </div>

      {/* Théorie */}
      <section className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 overflow-hidden">
        <button onClick={() => setShowTheory(!showTheory)} className="flex w-full items-center justify-between px-5 py-3 text-left font-semibold text-indigo-900 min-h-[44px]">
          <span className="flex items-center gap-2"><BookOpen size={18} /> Théorie à lire</span>
          <ChevronDown size={18} className={`transition-transform ${showTheory ? 'rotate-180' : ''}`} />
        </button>
        {showTheory && <div className="px-5 pb-5"><Markdown text={level.theory} /></div>}
      </section>

      {/* Énoncé */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-900 mb-2">Énoncé</h2>
        <Markdown text={level.statement} />
      </section>

      {/* Éditeur */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h2 className="font-bold text-slate-900">Votre code</h2>
          <button
            onClick={() => { setCode(level.starterCode); onSaveCode(level.id, level.starterCode); }}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 min-h-[36px]"
          >
            <RotateCcw size={14} /> Code de départ
          </button>
        </div>
        <div
          className="overflow-hidden rounded-xl ring-1 ring-slate-200"
          // Ctrl/Cmd + Entrée = Valider (capturé avant CodeMirror pour ne pas insérer de ligne)
          onKeyDownCapture={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              if (!running) void execute(true);
            }
          }}
        >
          <CodeMirror
            value={code}
            height="260px"
            extensions={[python()]}
            onChange={(v) => { setCode(v); onSaveCode(level.id, v); }}
            theme="light"
            basicSetup={{ lineNumbers: true, autocompletion: true, indentOnInput: true }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => execute(false)}
            disabled={running}
            className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition min-h-[44px]"
          >
            <Play size={16} /> Exécuter
          </button>
          <button
            onClick={() => execute(true)}
            disabled={running}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 font-semibold text-white shadow hover:opacity-90 disabled:opacity-50 transition min-h-[44px]"
          >
            <CheckCircle2 size={16} /> Valider ({level.visibleTests.length} tests visibles + {level.hiddenTests.length} cachés)
          </button>
          <button
            onClick={() => onUseHint(level.id, Math.min(hintsShown + 1, level.hints.length))}
            disabled={hintsShown >= level.hints.length}
            className="flex items-center gap-2 rounded-xl bg-amber-100 px-5 py-2.5 font-semibold text-amber-800 hover:bg-amber-200 disabled:opacity-40 transition min-h-[44px]"
          >
            <Lightbulb size={16} /> Indice ({hintsShown}/{level.hints.length})
          </button>
        </div>
        {running && <p className="mt-3 text-sm text-slate-500 animate-pulse">Exécution en cours… (première fois : chargement de Python, ~5 s)</p>}
      </section>

      {/* Indices révélés */}
      {hintsShown > 0 && (
        <section className="mt-4 space-y-2">
          {level.hints.slice(0, hintsShown).map((h, i) => (
            <div key={i} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <span className="font-semibold">Indice {i + 1} :</span> <Markdown text={h} />
            </div>
          ))}
        </section>
      )}

      {/* Sortie */}
      {stdout !== null && stdout !== '' && (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-2">Sortie de votre programme</h2>
          <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-[13px] text-slate-100">{stdout}</pre>
        </section>
      )}

      {/* Erreur Python */}
      {pyError && (
        <section className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <h2 className="font-bold text-red-800 mb-2">Erreur Python</h2>
          <pre className="overflow-x-auto font-mono text-[13px] whitespace-pre-wrap text-red-700">{pyError}</pre>
        </section>
      )}

      {/* Résultats des tests */}
      {outcomes && (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Tests : {passed}/{outcomes.length} réussis {passed === outcomes.length ? '🎉' : ''}
          </h2>
          <ul className="mt-3 space-y-2">
            {outcomes.map((o, i) => (
              <li key={i} className={`rounded-xl px-4 py-3 text-sm ${o.passed ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                <div className="font-semibold">
                  {o.passed ? '✔' : '✘'} Test {i + 1} {o.visible ? '' : '(caché)'}
                </div>
                {!o.passed && o.detail && <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{o.detail}</pre>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Succès : conseils + correction */}
      {solved && (
        <section className="mt-4 space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow">
            <h2 className="text-lg font-bold">Niveau réussi ! 🎉</h2>
            <p className="text-emerald-50 text-sm mt-1">Le niveau suivant est débloqué. Comparez votre code avec la correction ci-dessous.</p>
            {next && (
              <button onClick={() => onOpen(next.id)} className="mt-3 flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-emerald-700 hover:bg-emerald-50 transition min-h-[44px]">
                Niveau {next.id} <ArrowRight size={16} />
              </button>
            )}
          </div>

          {tips.length > 0 && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
              <h2 className="font-bold text-violet-900 mb-2">💡 Conseils sur votre code</h2>
              <ul className="space-y-2 text-sm text-violet-800">
                {tips.map((t, i) => <li key={i} className="flex gap-2"><span>→</span><span>{t}</span></li>)}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <button onClick={() => setShowSolution(!showSolution)} className="font-bold text-slate-900 flex items-center gap-2 min-h-[44px]">
              <ChevronDown size={18} className={`transition-transform ${showSolution ? 'rotate-180' : ''}`} /> Correction commentée
            </button>
            {showSolution && (
              <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-[13px] leading-relaxed text-emerald-200">{level.solution}</pre>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
