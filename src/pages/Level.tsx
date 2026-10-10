import { useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, Lightbulb, Play, RotateCcw, Square } from 'lucide-react';
import type { Level } from '@/types/level';
import { getLevel, LEVELS, needsNumpy, TOTAL } from '@/levels';
import { findSessionForLevel } from '@/lib/catalog';
import { cancelRun, runLevel, type TestOutcome } from '@/lib/pyodide';
import { analyseCode, type Progress } from '@/lib/progress';
import { Markdown } from '@/components/Markdown';

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
  const [executionKind, setExecutionKind] = useState<'run' | 'validate'>('run');
  const [executionSummary, setExecutionSummary] = useState<{ durationMs: number; status: 'success' | 'error' | 'cancelled' } | null>(null);
  const [executionNotice, setExecutionNotice] = useState<string | null>(null);
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
      ...level.visibleTests.map((test) => ({ test, visible: true })),
      ...level.hiddenTests.map((test) => ({ test, visible: false })),
    ],
    [level],
  );
  const familyLevels = useMemo(
    () => LEVELS.filter((item) => item.phase === level.phase && item.topic === level.topic),
    [level.phase, level.topic],
  );
  const session = useMemo(
    () => findSessionForLevel(familyLevels, level.id),
    [familyLevels, level.id],
  );

  const execute = async (validate: boolean) => {
    setExecutionKind(validate ? 'validate' : 'run');
    setRunning(true);
    const startedAt = performance.now();
    setPyError(null);
    setOutcomes(null);
    setStdout(null);
    setExecutionSummary(null);
    setExecutionNotice(null);
    onSaveCode(level.id, code);
    try {
      const tests = validate ? allTests : [];
      const { outcomes: results, run } = await runLevel(code, tests, needsNumpy(level));
      const durationMs = Math.round(performance.now() - startedAt);
      setExecutionSummary({ durationMs, status: run.cancelled ? 'cancelled' : (run.timedOut || run.error ? 'error' : 'success') });
      setStdout(run.stdout || '');
      if (run.cancelled) {
        setExecutionNotice('Exécution arrêtée à votre demande. Le code n’a pas été considéré comme validé.');
      } else if (run.timedOut) {
        setPyError(`Temps dépassé : votre code a mis plus de ${needsNumpy(level) ? 90 : 12} secondes. Vérifiez les boucles (risque de boucle infinie).`);
      } else if (run.error) {
        setPyError(run.error);
      }
      if (validate) {
        setOutcomes(results);
        const allPassed = !run.timedOut && !run.error && results.every((result) => result.passed);
        if (allPassed) {
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

  const stopExecution = () => {
    if (!running) return;
    cancelRun();
  };

  const visibleOutcomes = outcomes?.filter((outcome) => outcome.visible) ?? [];
  const hiddenOutcomes = outcomes?.filter((outcome) => !outcome.visible) ?? [];
  const hiddenPassed = hiddenOutcomes.filter((outcome) => outcome.passed).length;
  const passed = outcomes?.filter((outcome) => outcome.passed).length ?? 0;
  const next = getLevel(level.id + 1);
  const hintStages = ['Comprendre', 'Choisir la méthode', 'Écrire le pseudo-code', 'Coder'];

  return (
    <div className="level-shell">
      <nav className="level-topbar" aria-label="Navigation du défi">
        <button className="back-link" type="button" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Retour au parcours
        </button>
        <div className="topbar-context">
          <span>Phase {level.phase}</span>
          <span aria-hidden="true">/</span>
          <span>{level.topic}</span>
        </div>
        <div className="topbar-controls">
          {solved && <span className="solved-marker"><CheckCircle2 size={16} aria-hidden="true" /> Réussi</span>}
          {level.id > 1 && (
            <button className="button-secondary compact-button" type="button" onClick={() => onOpen(level.id - 1)} aria-label={`Ouvrir le niveau ${level.id - 1}`}>
              <ArrowLeft size={14} aria-hidden="true" /> {level.id - 1}
            </button>
          )}
        </div>
      </nav>

      <main className="level-main">
        <header className="level-heading">
          <nav className="lesson-breadcrumb" aria-label="Fil d’Ariane">
            <span>{level.phaseName}</span>
            <span aria-hidden="true">/</span>
            <span>{level.topic}</span>
            <span aria-hidden="true">/</span>
            <span>Séance {session?.number ?? 1}</span>
            <span aria-hidden="true">/</span>
            <span>Défi {level.id}</span>
          </nav>
          <div className="level-title-row">
            <div>
              <p className="level-overline">PYTHON · NIVEAU {String(level.id).padStart(3, '0')} / {TOTAL}</p>
              <h1>{level.title}</h1>
              <p className="level-subtitle">{level.phaseName} <span aria-hidden="true">·</span> {level.topic}</p>
              <div className="level-learning-meta" aria-label="Informations pédagogiques">
                <span className="learning-pill">Difficulté {level.difficulty ?? 1}/5</span>
                <span className="learning-pill">{level.estimatedMinutes ?? 8} min</span>
                {(level.skills ?? []).map((skill) => <span className="learning-pill" key={skill}>{skill}</span>)}
              </div>
            </div>
            <span className={`level-status ${solved ? 'is-solved' : ''}`}>
              {solved ? <><CheckCircle2 size={16} aria-hidden="true" /> Réussi</> : `Séance ${session?.number ?? 1}`}
            </span>
          </div>
        </header>

        <div className="level-workspace">
          <div className="lesson-column">
            <section className="theory-block" aria-labelledby="theory-title">
              <button
                className="theory-toggle"
                type="button"
                aria-expanded={showTheory}
                aria-controls="theory-content"
                onClick={() => setShowTheory((visible) => !visible)}
              >
                <span className="section-label"><BookOpen size={16} aria-hidden="true" /> Repère de cours</span>
                <span className="theory-toggle-action">{showTheory ? 'Réduire' : 'Afficher'} <ChevronDown className={showTheory ? 'chevron-open' : ''} size={16} aria-hidden="true" /></span>
              </button>
              {showTheory && <div className="theory-content" id="theory-content"><Markdown text={level.theory} /></div>}
            </section>

            <section className="statement-block" aria-labelledby="statement-title">
              <p className="section-label">À résoudre</p>
              <h2 id="statement-title">Énoncé</h2>
              <Markdown text={level.statement} />
            </section>

            {hintsShown > 0 && (
              <section className="hints-block" aria-label="Indices révélés">
                <p className="section-label"><Lightbulb size={15} aria-hidden="true" /> Indices consultés</p>
                {level.hints.slice(0, hintsShown).map((hint, index) => (
                  <div className="hint-entry" key={index}>
                    <span className="hint-number">{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{hintStages[index] ?? `Indice ${index + 1}`}</strong><Markdown text={hint} /></div>
                  </div>
                ))}
              </section>
            )}
          </div>

          <section className="code-lab" data-running={running ? 'true' : 'false'} aria-busy={running} aria-labelledby="code-title">
            <div className="lab-heading">
              <div>
                <p className="section-label">Atelier Python</p>
                <h2 id="code-title">Votre code</h2>
              </div>
              <button
                className="button-quiet reset-code-button"
                type="button"
                onClick={() => { setCode(level.starterCode); onSaveCode(level.id, level.starterCode); }}
              >
                <RotateCcw size={14} aria-hidden="true" /> Code de départ
              </button>
            </div>
            <div
              className="code-editor"
              onKeyDownCapture={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!running) void execute(true);
                }
              }}
            >
              <CodeMirror
                value={code}
                height="300px"
                extensions={[python()]}
                onChange={(value) => { setCode(value); onSaveCode(level.id, value); }}
                theme="light"
                aria-label="Votre code Python"
                basicSetup={{ lineNumbers: true, autocompletion: true, indentOnInput: true }}
              />
            </div>
            <p className="editor-shortcut">Raccourci : Ctrl/⌘ + Entrée pour valider.</p>
            <div className="lab-actions">
              <button className="button-secondary" type="button" onClick={() => void execute(false)} disabled={running}>
                <Play size={15} aria-hidden="true" /> {running && executionKind === 'run' ? 'Exécution…' : 'Exécuter'}
              </button>
              <button className="button-primary" type="button" onClick={() => void execute(true)} disabled={running}>
                <Check size={16} aria-hidden="true" /> {running && executionKind === 'validate' ? 'Validation…' : 'Valider'}
              </button>
              {running && <button className="button-danger stop-button" type="button" onClick={stopExecution}><Square size={14} aria-hidden="true" /> Arrêter</button>}
              <button
                className="button-hint"
                type="button"
                onClick={() => onUseHint(level.id, Math.min(hintsShown + 1, level.hints.length))}
                disabled={hintsShown >= level.hints.length}
              >
                <Lightbulb size={15} aria-hidden="true" /> {hintsShown < level.hints.length ? `Indice ${hintStages[hintsShown] ?? hintsShown + 1}` : 'Tous les indices'} <span>{hintsShown}/{level.hints.length}</span>
              </button>
            </div>
            <p className="test-count-note">Validation : {level.visibleTests.length} tests visibles, {level.hiddenTests.length} tests supplémentaires.</p>
            {running && <p className="execution-status" role="status" aria-live="polite"><span className="execution-spinner" aria-hidden="true" />{executionKind === 'validate' ? 'Exécution des tests en cours…' : 'Votre code Python est en cours d’exécution…'} Le premier chargement peut prendre quelques secondes.</p>}

            {(executionSummary || executionNotice || stdout !== null) && (
              <section className="execution-console" aria-labelledby="console-title" aria-live="polite">
                <div className="console-heading">
                  <h3 id="console-title">Console d’exécution</h3>
                  {executionSummary && <span className={`console-status ${executionSummary.status}`}>{executionSummary.status === 'success' ? 'Terminée' : executionSummary.status === 'cancelled' ? 'Arrêtée' : 'Avec erreur'} · {(executionSummary.durationMs / 1000).toFixed(2)} s</span>}
                </div>
                <pre>{stdout || '(aucune sortie affichée)'}</pre>
                {executionNotice && <p className="console-notice">{executionNotice}</p>}
              </section>
            )}

            {pyError && (
              <section className="error-block" role="alert" aria-labelledby="error-title">
                <h3 id="error-title">Diagnostic Python</h3>
                <p className="error-intro">Lisez d’abord le type d’erreur, puis l’emplacement et la question corrective.</p>
                <pre>{pyError}</pre>
              </section>
            )}

            {outcomes && (
              <section className="test-results" aria-labelledby="results-title" aria-live="polite">
                <div className="results-heading">
                  <h3 id="results-title">Résultats</h3>
                  <span>{passed} / {outcomes.length} réussis</span>
                </div>
                <ul>
                  {visibleOutcomes.map((outcome, index) => (
                    <li className={outcome.passed ? 'test-row passed' : 'test-row failed'} key={index}>
                      <span className="test-state-icon" aria-hidden="true">{outcome.passed ? '✓' : '×'}</span>
                      <div>
                        <strong>Test visible {index + 1}</strong>
                        {!outcome.passed && outcome.detail && <pre>{outcome.detail}</pre>}
                      </div>
                    </li>
                  ))}
                  {hiddenOutcomes.length > 0 && (
                    <li className={`test-row ${hiddenPassed === hiddenOutcomes.length ? 'passed' : 'failed'}`} key="additional-tests">
                      <span className="test-state-icon" aria-hidden="true">{hiddenPassed === hiddenOutcomes.length ? '✓' : '×'}</span>
                      <div>
                        <strong>Tests supplémentaires</strong>
                        <p>{hiddenPassed} / {hiddenOutcomes.length} réussis.</p>
                        {hiddenPassed < hiddenOutcomes.length && <p>Au moins un cas supplémentaire ne passe pas. Les détails de ces tests ne sont pas affichés ; vérifiez les cas limites.</p>}
                      </div>
                    </li>
                  )}
                </ul>
              </section>
            )}
          </section>
        </div>

        {solved && (
          <section className="success-panel" aria-labelledby="success-title" aria-live="polite">
            <div className="success-heading">
              <CheckCircle2 size={20} aria-hidden="true" />
              <div>
                <p className="section-label">Défi validé</p>
                <h2 id="success-title">Niveau réussi.</h2>
                <p>Le niveau suivant est maintenant accessible. Vous pouvez comparer votre solution avec la correction commentée.</p>
              </div>
              {next && (
                <button className="button-primary" type="button" onClick={() => onOpen(next.id)}>
                  Niveau {next.id} <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            {tips.length > 0 && (
              <div className="tips-panel">
                <p className="section-label">À retenir sur votre code</p>
                <ul>{tips.map((tip, index) => <li key={index}>{tip}</li>)}</ul>
              </div>
            )}

            <div className="solution-panel">
              <button
                className="solution-toggle"
                type="button"
                aria-expanded={showSolution}
                aria-controls="solution-content"
                onClick={() => setShowSolution((visible) => !visible)}
              >
                <span>Correction commentée</span>
                <ChevronDown className={showSolution ? 'chevron-open' : ''} size={17} aria-hidden="true" />
              </button>
              {showSolution && <pre className="solution-code" id="solution-content">{level.solution}</pre>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
