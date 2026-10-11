import { useState } from 'react';
import { Check, ChevronDown, Circle, Lock } from 'lucide-react';
import { LEVELS, PHASE_NAMES } from '@/levels';
import { isUnlocked, type Progress } from '@/lib/progress';
import type { Level } from '@/types/level';

const PHASES = Object.keys(PHASE_NAMES).map(Number);
type LessonKind = 'Théorie' | 'Atelier' | 'Laboratoire' | 'Critique' | 'Quiz';

function kindFor(level: Level, phase: number, index: number): LessonKind {
  if (phase === 4) return index % 3 === 0 ? 'Critique' : 'Atelier';
  if (phase === 5) return index % 3 === 0 ? 'Quiz' : 'Théorie';
  if (phase === 3) return index % 2 === 0 ? 'Théorie' : 'Laboratoire';
  if (phase === 2) return index % 3 === 0 ? 'Théorie' : 'Laboratoire';
  return level.title.toLowerCase().includes('synthèse') ? 'Critique' : index % 3 === 0 ? 'Théorie' : 'Atelier';
}

function slug(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
}

function lessonGroups(phase: number) {
  const levels = LEVELS.filter((level) => level.phase === phase);
  const topics = [...new Set(levels.map((level) => level.topic))];
  return topics.map((topic, index) => ({
    key: `${phase}:${topic}`,
    title: topic,
    kind: kindFor(levels.find((level) => level.topic === topic)!, phase, index),
    steps: levels.filter((level) => level.topic === topic),
  }));
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
  const [openLessons, setOpenLessons] = useState<string[]>(() => activeLevel ? [`${activeLevel.phase}:${activeLevel.topic}`] : []);
  const normalizedQuery = query.trim().toLowerCase();
  const toggle = <T,>(items: T[], item: T) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item];

  return (
    <div className="curriculum-list">
      {PHASES.map((phase) => {
        const phaseLevels = LEVELS.filter((level) => level.phase === phase);
        const done = phaseLevels.filter((level) => progress.done.includes(level.id)).length;
        const open = openModules.includes(phase);
        const moduleId = `module-${phase}`;
        const lessons = lessonGroups(phase).filter((lesson) => !normalizedQuery || `${lesson.title} ${lesson.steps.map((step) => step.title).join(' ')}`.toLowerCase().includes(normalizedQuery));
        return (
          <section className="curriculum-module" key={phase}>
            <button className="module-row" type="button" aria-expanded={open} aria-controls={moduleId} onClick={() => setOpenModules((items) => toggle(items, phase))}>
              <ChevronDown className={`module-chevron ${open ? 'is-open' : ''}`} size={18} aria-hidden="true" />
              <Circle className="module-radio" size={17} aria-hidden="true" />
              <span className="module-title">{PHASE_NAMES[phase]}</span>
              <span className="module-count">{done} sur {phaseLevels.length} étapes achevées</span>
            </button>
            {open && <div className="module-lessons" id={moduleId}>
              {lessons.map((lesson) => {
                const lessonDone = lesson.steps.filter((level) => progress.done.includes(level.id)).length;
                const lessonOpen = openLessons.includes(lesson.key);
                const lessonId = `lesson-${slug(lesson.key)}`;
                const next = lesson.steps.find((level) => !progress.done.includes(level.id));
                return (
                  <div className="curriculum-lesson" key={lesson.key}>
                    <button className="lesson-row" type="button" aria-expanded={lessonOpen} aria-controls={lessonId} onClick={() => setOpenLessons((items) => toggle(items, lesson.key))}>
                      <ChevronDown className={`lesson-chevron ${lessonOpen ? 'is-open' : ''}`} size={15} aria-hidden="true" />
                      <span className={`lesson-radio ${next?.id === activeLevelId ? 'is-current' : ''}`} aria-hidden="true" />
                      <span className="lesson-title">{lesson.title}</span>
                      <span className={`lesson-kind kind-${slug(lesson.kind)}`}>{lesson.kind}</span>
                      <span className="lesson-count">{lessonDone}/{lesson.steps.length}</span>
                    </button>
                    {lessonOpen && <div className="step-strip" id={lessonId} aria-label={`Étapes de ${lesson.title}`}>
                      {lesson.steps.map((level, stepIndex) => {
                        const completed = progress.done.includes(level.id);
                        const unlocked = isUnlocked(progress.done, level.id);
                        const current = level.id === activeLevelId && !completed;
                        return (
                          <button
                            key={level.id}
                            className="step-pill"
                            data-state={completed ? 'done' : current ? 'current' : unlocked ? 'open' : 'locked'}
                            type="button"
                            disabled={!unlocked}
                            aria-current={current ? 'step' : undefined}
                            aria-label={`Étape ${stepIndex + 1} : ${level.title}`}
                            title={level.title}
                            onClick={() => onOpen(level.id)}
                          >
                            {completed ? <Check size={12} aria-hidden="true" /> : !unlocked ? <Lock size={11} aria-hidden="true" /> : stepIndex + 1}
                          </button>
                        );
                      })}
                    </div>}
                  </div>
                );
              })}
            </div>}
          </section>
        );
      })}
    </div>
  );
}
