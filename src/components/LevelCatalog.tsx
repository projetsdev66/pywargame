import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Circle, Lock, Terminal } from 'lucide-react';
import { CURRICULUM, type CurriculumLesson, type CurriculumModule } from '@/lib/curriculum';
import { isUnlocked, type Progress } from '@/lib/progress';

function slug(value: string) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'); }
function matches(lesson: CurriculumLesson, query: string) { const q = query.trim().toLowerCase(); return !q || lesson.title.toLowerCase().includes(q); }

function CourseModule({ module, progress, activeLevelId, onOpen, query }: { module: CurriculumModule; progress: Progress; activeLevelId?: number; onOpen: (id: number) => void; query: string }) {
  const [open, setOpen] = useState(() => module.title === 'Python Basics');
  const [openLessons, setOpenLessons] = useState<string[]>([]);
  const lessons = module.lessons.filter((lesson) => matches(lesson, query));
  const done = module.lessons.flatMap((lesson) => lesson.steps).filter((level) => progress.done.includes(level.id)).length;
  const toggleLesson = (title: string) => setOpenLessons((items) => items.includes(title) ? items.filter((item) => item !== title) : [...items, title]);

  return <section className="curriculum-module fcc-course-module">
    <button className="module-row" type="button" aria-expanded={open} aria-controls={`course-${slug(module.title)}`} onClick={() => setOpen((value) => !value)}>
      <ChevronDown className={`module-chevron ${open ? 'is-open' : ''}`} size={18} aria-hidden="true" />
      <Circle className="module-radio" size={17} aria-hidden="true" />
      <span className="module-title">{module.title}</span>
      <span className="module-count">{done} sur {module.totalSteps} étapes achevées</span>
    </button>
    {open && <div className="module-lessons fcc-lesson-list" id={`course-${slug(module.title)}`}>
      {lessons.map((lesson) => {
        const lessonOpen = openLessons.includes(lesson.title);
        const lessonDone = lesson.steps.filter((level) => progress.done.includes(level.id)).length;
        const currentStep = lesson.steps.find((level) => !progress.done.includes(level.id));
        return <div className="fcc-lesson" key={`${module.title}-${lesson.title}`}>
          <button className="fcc-lesson-row" type="button" aria-expanded={lessonOpen} onClick={() => toggleLesson(lesson.title)}>
            <ChevronRight className={`fcc-lesson-chevron ${lessonOpen ? 'is-open' : ''}`} size={15} aria-hidden="true" />
            <span className={`lesson-radio ${currentStep?.id === activeLevelId ? 'is-current' : ''}`} aria-hidden="true" />
            <span className="fcc-lesson-title">{lesson.title}</span>
            <span className="fcc-lesson-status">{lessonDone === lesson.steps.length ? 'Terminé' : currentStep?.id === activeLevelId ? 'À poursuivre' : 'Pas commencé'}</span>
            <span className={`lesson-kind kind-${slug(lesson.kind)}`}>{lesson.kind}</span>
          </button>
          {lessonOpen && <div className="fcc-step-list" aria-label={`Étapes de ${lesson.title}`}>
            {lesson.steps.map((level, index) => {
              const completed = progress.done.includes(level.id);
              const unlocked = isUnlocked(progress.done, level.id);
              const current = level.id === activeLevelId && !completed;
              return <button className="fcc-step" data-state={completed ? 'done' : current ? 'current' : unlocked ? 'open' : 'locked'} key={level.id} type="button" disabled={!unlocked} aria-current={current ? 'step' : undefined} onClick={() => onOpen(level.id)} title={level.title}>
                {completed ? <Check size={12} aria-hidden="true" /> : !unlocked ? <Lock size={11} aria-hidden="true" /> : index + 1}
              </button>;
            })}
          </div>}
        </div>;
      })}
    </div>}
  </section>;
}

export function LevelCatalog({ progress, activeLevelId, onOpen, query = '' }: { progress: Progress; activeLevelId?: number; onOpen: (id: number) => void; query?: string }) {
  const [courseOpen, setCourseOpen] = useState(true);
  return <div className="curriculum-list">
    <button className="course-row" type="button" aria-expanded={courseOpen} aria-controls="python-course" onClick={() => setCourseOpen((value) => !value)}>
      <ChevronDown className={`module-chevron ${courseOpen ? 'is-open' : ''}`} size={18} aria-hidden="true" />
      <span className="course-icon" aria-hidden="true"><Terminal size={17} /></span>
      <span className="module-title">{CURRICULUM.title}</span>
      <span className="module-count">{progress.done.length} sur {CURRICULUM.totalSteps} étapes achevées</span>
    </button>
    {courseOpen && <div id="python-course" className="course-modules">{CURRICULUM.modules.map((module) => <CourseModule key={module.title} module={module} progress={progress} activeLevelId={activeLevelId} onOpen={onOpen} query={query} />)}</div>}
  </div>;
}
