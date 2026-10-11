import { useState } from 'react';
import { Check, ChevronDown, Circle, Lock } from 'lucide-react';
import { LEVELS, PHASE_NAMES } from '@/levels';
import { isUnlocked, type Progress } from '@/lib/progress';
import type { Level } from '@/types/level';

const PHASES = Object.keys(PHASE_NAMES).map(Number);
type LessonKind = 'Théorie' | 'Atelier' | 'Laboratoire' | 'Critique' | 'Quiz';

function kindFor(level: Level, phase: number, index: number): LessonKind {
  const title = `${level.title} ${level.topic}`.toLowerCase();
  if (phase === 4 || title.includes('synthèse')) return 'Critique';
  if (phase === 5 && (index % 4 === 0 || title.includes('quiz'))) return 'Quiz';
  if (phase === 3) return title.includes('numpy') || title.includes('courbe') ? 'Laboratoire' : 'Théorie';
  if (phase === 2) return index % 4 === 0 ? 'Théorie' : 'Laboratoire';
  return index % 5 === 0 ? 'Théorie' : 'Atelier';
}

function slug(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
}

function topicGroups(phase: number, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const levels = LEVELS.filter((level) => level.phase === phase);
  const topics = [...new Set(levels.map((level) => level.topic))];
  return topics.map((topic, topicIndex) => ({
    key: `${phase}:${topic}`,
    title: topic,
    levels: levels.filter((level) => level.topic === topic),
    topicIndex,
  })).map((group) => ({
    ...group,
    levels: group.levels.filter((level, index) => !normalizedQuery || `${level.title} ${level.topic}`.toLowerCase().includes(normalizedQuery) || group.title.toLowerCase().includes(normalizedQuery) || index === 0),
  })).filter((group) => group.levels.length > 0);
}

interface LevelCatalogProps {
  progress: Progress;
  activeLevelId?: number;
  onOpen: (id: number) => void;
  query?: string;
}

export function LevelCatalog({ progress, activeLevelId, onOpen, query = '' }: LevelCatalogProps) {
  const activeLevel = LEVELS.find((level) => level.id === activeLevelId);
  const [openModules, setOpenModules] = useState<number[]>(() => [activeLevel?.phase ?? 1]);
  const [openTopics, setOpenTopics] = useState<string[]>(() => activeLevel ? [`${activeLevel.phase}:${activeLevel.topic}`] : []);
  const toggle = <T,>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];

  return (
    <div className="curriculum-list">
      {PHASES.map((phase) => {
        const phaseLevels = LEVELS.filter((level) => level.phase === phase);
        const done = phaseLevels.filter((level) => progress.done.includes(level.id)).length;
        const moduleOpen = openModules.includes(phase);
        const groups = topicGroups(phase, query);
        const moduleId = `module-${phase}`;
        return (
          <section className="curriculum-module" key={phase}>
            <button className="module-row" type="button" aria-expanded={moduleOpen} aria-controls={moduleId} onClick={() => setOpenModules((items) => toggle(items, phase))}>
              <ChevronDown className={`module-chevron ${moduleOpen ? 'is-open' : ''}`} size={18} aria-hidden="true" />
              <Circle className="module-radio" size={17} aria-hidden="true" />
              <span className="module-title">{PHASE_NAMES[phase]}</span>
              <span className="module-count">{done} sur {phaseLevels.length} étapes achevées</span>
            </button>
            {moduleOpen && <div className="module-lessons" id={moduleId}>
              {groups.map((group) => {
                const topicDone = group.levels.filter((level) => progress.done.includes(level.id)).length;
                const topicOpen = openTopics.includes(group.key);
                const topicId = `topic-${slug(group.key)}`;
                return (
                  <section className="curriculum-topic" key={group.key}>
                    <button className="topic-row" type="button" aria-expanded={topicOpen} aria-controls={topicId} onClick={() => setOpenTopics((items) => toggle(items, group.key))}>
                      <ChevronDown className={`lesson-chevron ${topicOpen ? 'is-open' : ''}`} size={15} aria-hidden="true" />
                      <span className="lesson-radio" aria-hidden="true" />
                      <span className="lesson-title">{group.title}</span>
                      <span className="lesson-count">{topicDone}/{group.levels.length}</span>
                    </button>
                    {topicOpen && <div className="level-list" id={topicId}>
                      {group.levels.map((level, index) => {
                        const completed = progress.done.includes(level.id);
                        const unlocked = isUnlocked(progress.done, level.id);
                        const current = level.id === activeLevelId && !completed;
                        const kind = kindFor(level, phase, group.topicIndex + index);
                        return (
                          <button className="level-row" data-state={completed ? 'done' : current ? 'current' : unlocked ? 'open' : 'locked'} key={level.id} type="button" disabled={!unlocked} aria-current={current ? 'step' : undefined} onClick={() => onOpen(level.id)}>
                            <span className="level-radio" aria-hidden="true">{completed ? <Check size={12} /> : !unlocked ? <Lock size={11} /> : <Circle size={12} />}</span>
                            <span className="level-row-copy"><span className="level-row-title">{level.title}</span><span className="level-row-meta">Niveau {level.id} · {completed ? 'Terminé' : current ? 'À poursuivre' : unlocked ? 'Pas commencé' : 'Verrouillé'}</span></span>
                            <span className={`lesson-kind kind-${slug(kind)}`}>{kind}</span>
                          </button>
                        );
                      })}
                    </div>}
                  </section>
                );
              })}
            </div>}
          </section>
        );
      })}
    </div>
  );
}
