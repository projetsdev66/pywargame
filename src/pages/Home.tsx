import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { ArrowRight, CheckCircle2, Download, RotateCcw, Upload } from 'lucide-react';
import { LevelCatalog } from '@/components/LevelCatalog';
import { LEVELS, TOTAL } from '@/levels';
import { CURRICULUM } from '@/lib/curriculum';
import { exportProgress, importProgress, type Progress } from '@/lib/progress';

export function Home({ progress, onOpen, onReset, onImport, syncMessage }: {
  progress: Progress;
  onOpen: (id: number) => void;
  onReset: () => void;
  onImport: (progress: Progress) => void;
  syncMessage?: string | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [query, setQuery] = useState('');
  const nextLevel = LEVELS.find((level) => !progress.done.includes(level.id));
  const doneCount = progress.done.length;
  const percent = Math.round((doneCount / TOTAL) * 100);
  const CURRICULUM_MODULE_COUNT = CURRICULUM.modules.length;

  return (
    <div className="curriculum-shell">
      <header className="curriculum-header">
        <a className="curriculum-brand" href="#/" aria-label="Python v9 — parcours Python">
          <span className="brand-mark" aria-hidden="true">Py</span>
          <span><strong>Python v9</strong><small>Parcours Python</small></span>
        </a>
        <span className="connection-note"><CheckCircle2 size={14} aria-hidden="true" /> Succès ! Vous êtes connecté à votre parcours.</span>
      </header>

      <main className="curriculum-main">
        {syncMessage && <aside className="sync-notice" role="status"><strong>Progression synchronisée</strong><span>{syncMessage}</span></aside>}
        <section className="curriculum-intro" aria-labelledby="curriculum-title">
          <p className="curriculum-kicker">Parcours Python</p>
          <h1 id="curriculum-title">Python</h1>
          {nextLevel && <button className="start-learning" type="button" onClick={() => onOpen(nextLevel.id)}>Commencer à apprendre <ArrowRight size={16} aria-hidden="true" /></button>}
          <p>Ce cours vous apprend les fondamentaux de Python à travers des leçons, des ateliers et des exercices interactifs.</p>
          <div className="curriculum-summary"><span>{CURRICULUM_MODULE_COUNT} cours</span><span>{TOTAL} étapes</span><span>{doneCount} achevées</span><span>{percent} %</span></div>
        </section>


        <section className="curriculum-section" aria-labelledby="modules-title">
          <h2 id="modules-title" className="courses-title">Cours</h2>
          <label className="course-search" htmlFor="curriculum-search"><Search size={16} aria-hidden="true" /><input id="curriculum-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une leçon dans le parcours" /></label>
          <LevelCatalog progress={progress} activeLevelId={nextLevel?.id} onOpen={onOpen} query={query} />
        </section>

        <details className="progress-tools">
          <summary>Gérer ma progression</summary>
          <div className="progress-tool-content"><p>Votre progression et vos codes restent dans ce navigateur. Exportez-les pour les conserver ou les déplacer.</p>
            <div className="progress-tool-actions">
              <button className="button-secondary" type="button" onClick={() => exportProgress(progress)}><Download size={15} aria-hidden="true" /> Exporter</button>
              <button className="button-secondary" type="button" onClick={() => fileRef.current?.click()}><Upload size={15} aria-hidden="true" /> Importer</button>
              <input ref={fileRef} className="visually-hidden" type="file" accept="application/json" aria-label="Choisir un fichier JSON de progression" onChange={async (event) => { const input = event.currentTarget; const file = input.files?.[0]; if (file) { try { onImport(await importProgress(file)); } catch { /* le format invalide est ignoré */ } } input.value = ''; }} />
              {confirmReset ? <div className="reset-confirmation"><span>Effacer la progression ?</span><button className="button-danger" type="button" onClick={() => { onReset(); setConfirmReset(false); }}>Confirmer</button><button className="button-quiet" type="button" onClick={() => setConfirmReset(false)}>Annuler</button></div> : <button className="button-quiet" type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={14} aria-hidden="true" /> Réinitialiser</button>}
            </div>
          </div>
        </details>
        <footer className="home-footer"><span>Python v9 · Parcours interactif</span><span>Théorie, pratique et raisonnement</span></footer>
      </main>
    </div>
  );
}
