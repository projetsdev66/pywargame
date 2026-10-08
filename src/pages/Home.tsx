import { useRef, useState } from 'react';
import { LEVELS, PHASE_NAMES, TOTAL } from '@/levels';
import { exportProgress, importProgress, isUnlocked, type Progress } from '@/lib/progress';
import { Lock, Check, Download, Upload, RotateCcw, Play } from 'lucide-react';

// Recherche insensible à la casse et aux accents
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const PHASE_COLORS: Record<number, { bg: string; chip: string; bar: string }> = {
  1: { bg: 'from-emerald-400 to-teal-500', chip: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500' },
  2: { bg: 'from-indigo-400 to-violet-500', chip: 'bg-indigo-100 text-indigo-800', bar: 'bg-indigo-500' },
  3: { bg: 'from-amber-400 to-orange-500', chip: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500' },
  4: { bg: 'from-rose-400 to-pink-500', chip: 'bg-rose-100 text-rose-800', bar: 'bg-rose-500' },
};

export function Home({
  progress,
  onOpen,
  onReset,
  onImport,
}: {
  progress: Progress;
  onOpen: (id: number) => void;
  onReset: () => void;
  onImport: (p: Progress) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [query, setQuery] = useState('');
  const pct = Math.round((progress.done.length / TOTAL) * 100);
  // Premier niveau non réussi : il est forcément débloqué (déblocage linéaire)
  const nextLevel = LEVELS.find((l) => !progress.done.includes(l.id));
  const q = norm(query.trim());
  const results = q.length >= 2 ? LEVELS.filter((l) => norm(`${l.title} ${l.topic}`).includes(q)).slice(0, 30) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      {/* En-tête */}
      <header className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-6 sm:p-10 text-white shadow-xl mt-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🐍</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">PyWargame</h1>
            <p className="text-indigo-100 text-sm sm:text-base">Apprendre Python niveau par niveau — des bases aux sujets de MPSI</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium text-indigo-100 mb-1.5">
            <span>{progress.done.length} / {TOTAL} niveaux réussis</span>
            <span>{pct} %</span>
          </div>
          <div className="h-3 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {nextLevel && (
          <button
            onClick={() => onOpen(nextLevel.id)}
            className="mt-5 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-indigo-700 shadow-lg hover:bg-indigo-50 transition min-h-[48px]"
          >
            <Play size={18} /> {progress.done.length === 0 ? 'Commencer' : 'Continuer'} — niveau {nextLevel.id}
          </button>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => exportProgress(progress)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition min-h-[44px]">
            <Download size={16} /> Exporter ma progression
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition min-h-[44px]">
            <Upload size={16} /> Importer
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) { try { onImport(await importProgress(f)); } catch (err: any) { alert(err.message); } }
              e.target.value = '';
            }} />
          {confirmReset ? (
            <button onClick={() => { onReset(); setConfirmReset(false); }} className="flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold hover:bg-red-400 transition min-h-[44px]">
              Confirmer la remise à zéro ?
            </button>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition min-h-[44px]">
              <RotateCcw size={16} /> Réinitialiser
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-indigo-200">Progression enregistrée dans ce navigateur. Pensez à exporter pour changer d'appareil.</p>
      </header>

      {/* Recherche */}
      <div className="mt-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un niveau"
          placeholder="Rechercher un niveau (ex. boucle, liste, récursivité…)"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {q.length >= 2 && (
          <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
            {results.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500">Aucun niveau trouvé.</li>
            ) : (
              results.map((l) => {
                const unlocked = isUnlocked(progress.done, l.id);
                return (
                  <li key={l.id}>
                    <button
                      disabled={!unlocked}
                      onClick={() => onOpen(l.id)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm min-h-[44px] ${unlocked ? 'hover:bg-slate-50' : 'text-slate-300 cursor-not-allowed'}`}
                    >
                      <span className="w-10 shrink-0 font-bold">{l.id}</span>
                      <span className="min-w-0 flex-1 truncate">{l.title}</span>
                      {progress.done.includes(l.id) ? <Check size={16} className="text-emerald-600" /> : !unlocked && <Lock size={14} />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>

      {/* Phases */}
      {[1, 2, 3, 4].map((ph) => {
        const lv = LEVELS.filter((l) => l.phase === ph);
        const done = lv.filter((l) => progress.done.includes(l.id)).length;
        const c = PHASE_COLORS[ph];
        const topics = [...new Set(lv.map((l) => l.topic))];
        return (
          <section key={ph} className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Phase {ph} — {PHASE_NAMES[ph]}</h2>
                <p className="text-sm text-slate-500">{done}/{lv.length} réussis</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.chip}`}>{lv.length} niveaux</span>
            </div>
            <div className="space-y-6">
              {topics.map((topic) => {
                const tl = lv.filter((l) => l.topic === topic);
                return (
                  <div key={topic} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-3">{topic}</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {tl.map((l) => {
                        const isDone = progress.done.includes(l.id);
                        const unlocked = isUnlocked(progress.done, l.id);
                        return (
                          <button
                            key={l.id}
                            disabled={!unlocked}
                            onClick={() => onOpen(l.id)}
                            title={`${l.id}. ${l.title}`}
                            aria-label={isDone ? `Niveau ${l.id}, réussi` : unlocked ? `Niveau ${l.id}` : `Niveau ${l.id}, verrouillé`}
                            className={`flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition
                              ${isDone ? `${c.bar} text-white shadow` : unlocked ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 ring-1 ring-slate-200' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                          >
                            {isDone ? <Check size={16} /> : unlocked ? l.id : <Lock size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
