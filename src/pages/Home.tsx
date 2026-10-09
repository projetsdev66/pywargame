import { useRef, useState } from 'react';
import { ArrowRight, Check, Download, Lock, RotateCcw, Search, Upload } from 'lucide-react';
import { LevelCatalog } from '@/components/LevelCatalog';
import { LEVELS, PHASE_NAMES, TOTAL } from '@/levels';
import { findSessionForLevel } from '@/lib/catalog';
import { exportProgress, importProgress, isUnlocked, type Progress } from '@/lib/progress';

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function Home({
  progress,
  onOpen,
  onReset,
  onImport,
}: {
  progress: Progress;
  onOpen: (id: number) => void;
  onReset: () => void;
  onImport: (progress: Progress) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [query, setQuery] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const doneCount = progress.done.length;
  const percent = Math.min(100, Math.round((doneCount / TOTAL) * 100));
  const nextLevel = LEVELS.find((level) => !progress.done.includes(level.id));
  const normalizedQuery = normalize(query.trim());
  const results = normalizedQuery.length >= 2
    ? LEVELS.filter((level) => normalize(`${level.title} ${level.topic}`).includes(normalizedQuery)).slice(0, 30)
    : [];

  return (
    <div className="home-shell">
      <header className="home-header">
        <a className="brand-lockup" href="#/" aria-label="PyWargame — accueil du parcours">
          <span className="brand-mark" aria-hidden="true">PW</span>
          <span className="brand-copy">
            <span className="brand-name">PyWargame</span>
            <span className="brand-caption">Python · parcours MPSI</span>
          </span>
        </a>
        <span className="header-note">Un cahier de pratique, niveau par niveau</span>
      </header>

      <main className="home-main">
        <section className="home-intro" aria-labelledby="home-title">
          <p className="eyebrow"><span className="eyebrow-rule" /> Du premier calcul aux problèmes de MPSI</p>
          <h1 id="home-title">Lire. Essayer.<br /><em>Comprendre.</em></h1>
          <p className="intro-copy">
            {TOTAL} défis pour travailler Python progressivement, des fondamentaux aux compléments MPSI.
            Chaque niveau se lance directement dans le navigateur.
          </p>
        </section>

        <section className="resume-panel" aria-labelledby="resume-title">
          <div className="resume-topline">
            <span>Votre parcours</span>
            <span>{Object.keys(PHASE_NAMES).length} phases <span aria-hidden="true">·</span> {TOTAL} défis</span>
          </div>
          <div className="resume-main">
            <div className="resume-copy">
              {nextLevel ? (
                <>
                  <p className="resume-kicker">{doneCount === 0 ? 'Point de départ' : 'À poursuivre'} · Phase {nextLevel.phase}</p>
                  <h2 id="resume-title">{nextLevel.title}</h2>
                  <p className="resume-context">{nextLevel.phaseName} <span aria-hidden="true">/</span> {nextLevel.topic} <span aria-hidden="true">/</span> Niveau {nextLevel.id}</p>
                </>
              ) : (
                <>
                  <p className="resume-kicker">Parcours terminé</p>
                  <h2 id="resume-title">Les {TOTAL} défis sont réussis.</h2>
                  <p className="resume-context">Vous pouvez rouvrir les niveaux déjà validés depuis le catalogue.</p>
                </>
              )}
            </div>
            {nextLevel && (
              <button className="button-primary resume-button" type="button" onClick={() => onOpen(nextLevel.id)}>
                <span>{doneCount === 0 ? 'Commencer' : 'Continuer'}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="progress-summary">
            <div
              className="progress-track"
              role="progressbar"
              aria-label={`Progression dans les ${TOTAL} défis`}
              aria-valuemin={0}
              aria-valuemax={TOTAL}
              aria-valuenow={doneCount}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <div className="progress-caption">
              <span>{doneCount} / {TOTAL} niveaux réussis</span>
              <span>{percent} %</span>
            </div>
          </div>
        </section>

        <section className="search-section" aria-labelledby="search-title">
          <div className="section-intro compact-intro">
            <p className="eyebrow">Retrouver une notion</p>
            <h2 id="search-title">Chercher dans le parcours</h2>
          </div>
          <label className="search-control" htmlFor="level-search">
            <Search size={18} aria-hidden="true" />
            <input
              id="level-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex. boucle, liste, récursivité…"
              autoComplete="off"
            />
          </label>
          <p className="search-hint">Recherche par intitulé ou thème ; deux caractères minimum.</p>

          {normalizedQuery.length >= 2 && (
            <div className="search-results" role="region" aria-label="Résultats de recherche" aria-live="polite">
              {results.length === 0 ? (
                <p className="search-empty">Aucun niveau ne correspond à « {query.trim()} ».</p>
              ) : (
                <>
                  {results.map((level) => {
                    const familyLevels = LEVELS.filter((item) => item.phase === level.phase && item.topic === level.topic);
                    const session = findSessionForLevel(familyLevels, level.id);
                    const completed = progress.done.includes(level.id);
                    const unlocked = isUnlocked(progress.done, level.id);
                    const state = completed ? 'done' : unlocked ? 'open' : 'locked';
                    const stateLabel = completed ? 'Réussi' : unlocked ? 'Disponible' : 'Verrouillé';

                    return (
                      <div className="search-result-row" key={level.id}>
                        <button
                          className="search-result"
                          type="button"
                          disabled={!unlocked}
                          onClick={() => onOpen(level.id)}
                          aria-label={`Niveau ${level.id}, ${level.title}. ${stateLabel}. ${level.phaseName}, ${level.topic}, séance ${session?.number ?? 1}.`}
                        >
                          <span className="search-result-number">{level.id}</span>
                          <span className="search-result-copy">
                            <span className="search-result-context">{level.phaseName} <span aria-hidden="true">/</span> {level.topic} <span aria-hidden="true">/</span> Séance {session?.number ?? 1}</span>
                            <span className="search-result-title">{level.title}</span>
                          </span>
                          <span className="search-result-state" data-state={state}>
                            {completed ? <Check size={15} aria-hidden="true" /> : !unlocked ? <Lock size={14} aria-hidden="true" /> : null}
                            {stateLabel}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                  {results.length === 30 && <p className="search-limit">30 premiers résultats affichés. Affinez la recherche pour réduire la liste.</p>}
                </>
              )}
            </div>
          )}
        </section>

        <section className="catalog-section" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">Sommaire</p>
              <h2 id="catalog-title">Le parcours complet</h2>
            </div>
            <p className="catalog-guidance">Les défis sont regroupés par phase, thème et petites séances. Le prochain niveau accessible est ouvert automatiquement.</p>
          </div>
          <LevelCatalog progress={progress} activeLevelId={nextLevel?.id} onOpen={onOpen} />
        </section>

        <details className="progress-tools">
          <summary>Gérer ou transférer ma progression</summary>
          <div className="progress-tool-content">
            <p>La progression est enregistrée dans ce navigateur. Exportez-la pour la conserver ou la déplacer sur un autre appareil.</p>
            <div className="progress-tool-actions">
              <button className="button-secondary" type="button" onClick={() => exportProgress(progress)}>
                <Download size={16} aria-hidden="true" /> Exporter en JSON
              </button>
              <button className="button-secondary" type="button" onClick={() => fileRef.current?.click()}>
                <Upload size={16} aria-hidden="true" /> Importer un fichier
              </button>
              <input
                ref={fileRef}
                className="visually-hidden"
                type="file"
                accept="application/json"
                aria-label="Choisir un fichier JSON de progression"
                onChange={async (event) => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  if (file) {
                    try {
                      onImport(await importProgress(file));
                      setImportError(null);
                    } catch (error: unknown) {
                      setImportError(error instanceof Error ? error.message : 'Impossible de lire ce fichier de progression.');
                    }
                  }
                  input.value = '';
                }}
              />
              {confirmReset ? (
                <div className="reset-confirmation" role="group" aria-label="Confirmer la remise à zéro">
                  <span>Effacer la progression locale ?</span>
                  <button className="button-danger" type="button" onClick={() => { onReset(); setConfirmReset(false); }}>
                    Confirmer
                  </button>
                  <button className="button-quiet" type="button" onClick={() => setConfirmReset(false)}>
                    Annuler
                  </button>
                </div>
              ) : (
                <button className="button-quiet" type="button" onClick={() => setConfirmReset(true)}>
                  <RotateCcw size={15} aria-hidden="true" /> Réinitialiser
                </button>
              )}
            </div>
            {importError && <p className="inline-error" role="alert">{importError}</p>}
          </div>
        </details>

        <footer className="home-footer">
          <span>PyWargame <span aria-hidden="true">·</span> Python pour la MPSI</span>
          <span>Votre code s’exécute dans le navigateur.</span>
        </footer>
      </main>
    </div>
  );
}
