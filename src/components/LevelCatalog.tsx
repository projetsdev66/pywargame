import { useState } from 'react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { LEVELS, PHASE_NAMES } from '@/levels';
import { isUnlocked, type Progress } from '@/lib/progress';
import { groupIntoSessions } from '@/lib/catalog';

const PHASES = Object.keys(PHASE_NAMES).map(Number);

function toggleItem<T>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}

function phaseLabel(phase: number): string {
  return `phase-${phase}`;
}

interface LevelCatalogProps {
  progress: Progress;
  activeLevelId?: number;
  onOpen: (id: number) => void;
}

export function LevelCatalog({ progress, activeLevelId, onOpen }: LevelCatalogProps) {
  const activeLevel = activeLevelId === undefined
    ? undefined
    : LEVELS.find((level) => level.id === activeLevelId);
  const activePhase = activeLevel?.phase ?? null;
  const activeFamilyKey = activeLevel ? `${activeLevel.phase}:${activeLevel.topic}` : null;
  const [openPhases, setOpenPhases] = useState<number[]>(() => [activePhase ?? 1]);
  const [openFamilies, setOpenFamilies] = useState<string[]>(() =>
    activeFamilyKey ? [activeFamilyKey] : [],
  );

  return (
    <div className="phase-catalog">
      {PHASES.map((phase) => {
        const phaseLevels = LEVELS.filter((level) => level.phase === phase);
        const phaseDone = phaseLevels.filter((level) => progress.done.includes(level.id)).length;
        const phasePercent = phaseLevels.length === 0
          ? 0
          : Math.round((phaseDone / phaseLevels.length) * 100);
        const phaseExpanded = openPhases.includes(phase);
        const topics = [...new Set(phaseLevels.map((level) => level.topic))];
        const panelId = `${phaseLabel(phase)}-families`;

        return (
          <section className="phase-section" data-phase={phase} key={phase}>
            <button
              className="phase-toggle"
              type="button"
              aria-expanded={phaseExpanded}
              aria-controls={panelId}
              onClick={() => setOpenPhases((current) => toggleItem(current, phase))}
            >
              <span className="phase-number">0{phase}</span>
              <span className="phase-heading">
                <span className="phase-name">{PHASE_NAMES[phase]}</span>
                <span className="phase-count">{phaseLevels.length} défis · {topics.length} familles</span>
              </span>
              <span className="phase-stat">
                <span>{phaseDone} / {phaseLevels.length} réussis</span>
                <span className="phase-meter" aria-hidden="true">
                  <span style={{ width: `${phasePercent}%` }} />
                </span>
              </span>
              <ChevronDown className="disclosure-icon" size={18} aria-hidden="true" />
            </button>

            {phaseExpanded && (
              <div className="phase-families" id={panelId}>
                {topics.map((topic, familyIndex) => {
                  const familyLevels = phaseLevels.filter((level) => level.topic === topic);
                  const sessions = groupIntoSessions(familyLevels);
                  const familyDone = familyLevels.filter((level) => progress.done.includes(level.id)).length;
                  const familyKey = `${phase}:${topic}`;
                  const familyExpanded = openFamilies.includes(familyKey);
                  const familyPanelId = `${phaseLabel(phase)}-family-${familyIndex + 1}`;
                  const familyNext = familyLevels.find((level) => !progress.done.includes(level.id));

                  return (
                    <section className="family-section" data-phase={phase} key={familyKey}>
                      <button
                        className="family-toggle"
                        type="button"
                        aria-expanded={familyExpanded}
                        aria-controls={familyPanelId}
                        onClick={() => setOpenFamilies((current) => toggleItem(current, familyKey))}
                      >
                        <span className="family-index">{String(familyIndex + 1).padStart(2, '0')}</span>
                        <span className="family-heading">
                          <span className="family-name">{topic}</span>
                          <span className="family-detail">
                            {familyLevels.length} défis · {sessions.length} séances
                            {familyNext && activeLevelId === familyNext.id ? ` · à reprendre : ${familyNext.title}` : ''}
                          </span>
                        </span>
                        <span className="family-progress">{familyDone}/{familyLevels.length}</span>
                        <ChevronDown className="disclosure-icon" size={16} aria-hidden="true" />
                      </button>

                      {familyExpanded && (
                        <div className="family-sessions" id={familyPanelId}>
                          {sessions.map((session) => {
                            const sessionDone = session.levels.filter((level) => progress.done.includes(level.id)).length;
                            const sessionId = `${familyPanelId}-session-${session.number}`;

                            return (
                              <section className="session-section" aria-labelledby={`${sessionId}-title`} key={session.number}>
                                <header className="session-heading">
                                  <div>
                                    <h4 id={`${sessionId}-title`}>Séance {String(session.number).padStart(2, '0')}</h4>
                                    <p>Défis {session.start}–{session.end}</p>
                                  </div>
                                  <span>{sessionDone}/{session.levels.length} réussis</span>
                                </header>
                                <ul className="session-levels">
                                  {session.levels.map((level) => {
                                    const completed = progress.done.includes(level.id);
                                    const unlocked = isUnlocked(progress.done, level.id);
                                    const current = level.id === activeLevelId && !completed;
                                    const state = completed ? 'done' : current ? 'current' : unlocked ? 'open' : 'locked';
                                    const stateLabel = completed ? 'réussi' : current ? 'à reprendre' : unlocked ? 'disponible' : 'verrouillé';

                                    return (
                                      <li key={level.id}>
                                        <button
                                          className="level-node"
                                          data-state={state}
                                          type="button"
                                          disabled={!unlocked}
                                          aria-current={current ? 'step' : undefined}
                                          aria-label={`Niveau ${level.id} : ${level.title}, ${stateLabel}`}
                                          title={`Niveau ${level.id} — ${level.title}`}
                                          onClick={() => onOpen(level.id)}
                                        >
                                          <span className="level-node-number">{level.id}</span>
                                          <span className="level-node-title">
                                            {level.title}
                                            <small className="level-node-meta">Difficulté {level.difficulty ?? 1}/5 · {level.estimatedMinutes ?? 8} min</small>
                                          </span>
                                          <span className="level-node-state">
                                            {completed ? <Check size={14} aria-hidden="true" /> : !unlocked ? <Lock size={13} aria-hidden="true" /> : null}
                                            <span>{stateLabel}</span>
                                          </span>
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </section>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
