import { useEffect, useRef, useState } from 'react';
import { Home } from '@/pages/Home';
import { LevelPage } from '@/pages/Level';
import { getLevel } from '@/levels';
import { isUnlocked, loadProgressReport, markLevelSolved, saveProgress, type Progress } from '@/lib/progress';
import { warmup } from '@/lib/pyodide';

// Navigation par l'ancre de l'URL (#/niveau/12) : le bouton « retour » du
// navigateur ou du téléphone fonctionne, et un niveau peut être rouvert par
// son lien. Un niveau verrouillé ou inexistant renvoie à l'accueil.
function levelFromHash(done: number[]): number | null {
  const m = window.location.hash.match(/^#\/niveau\/(\d+)$/);
  if (!m) return null;
  const id = Number(m[1]);
  return getLevel(id) && isUnlocked(done, id) ? id : null;
}

export default function App() {
  const [initialReport] = useState(() => loadProgressReport());
  const [progress, setProgress] = useState<Progress>(initialReport.progress);
  const [syncMessage, setSyncMessage] = useState<string | null>(() => {
    if (initialReport.migratedLegacy) return 'Votre ancienne progression a été resynchronisée : les niveaux modifiés doivent être validés à nouveau. Vos codes et indices sont conservés.';
    if (initialReport.invalidatedIds.length > 0) return `${initialReport.invalidatedIds.length} niveau${initialReport.invalidatedIds.length > 1 ? 'x' : ''} modifié${initialReport.invalidatedIds.length > 1 ? 's' : ''} doit${initialReport.invalidatedIds.length > 1 ? 'vent' : ''} être validé${initialReport.invalidatedIds.length > 1 ? 's' : ''} à nouveau. Vos codes sont conservés.`;
    return null;
  });
  const [currentId, setCurrentId] = useState<number | null>(() => levelFromHash(initialReport.progress.done));
  const doneRef = useRef<number[]>(progress.done);

  // Sauvegarde à chaque changement
  useEffect(() => {
    doneRef.current = progress.done;
    saveProgress(progress);
  }, [progress]);
  // Précharge Python en arrière-plan
  useEffect(() => { const t = setTimeout(warmup, 1500); return () => clearTimeout(t); }, []);
  // Suit les changements d'URL (retour arrière, lien direct)
  useEffect(() => {
    const onHash = () => setCurrentId(levelFromHash(doneRef.current));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  // Remonte en haut de page à chaque changement de niveau
  useEffect(() => { window.scrollTo(0, 0); }, [currentId]);

  const openLevel = (id: number) => { window.location.hash = `/niveau/${id}`; };
  const goHome = () => { window.location.hash = '/'; };

  const level = currentId !== null ? getLevel(currentId) : undefined;

  return (
    <div>
      {level ? (
        <LevelPage
          key={level.id}
          level={level}
          progress={progress}
          onBack={goHome}
          onOpen={openLevel}
          onSolved={(id) => setProgress((p) => markLevelSolved(p, id))}
          onSaveCode={(id, code) => setProgress((p) => ({ ...p, codes: { ...p.codes, [id]: code } }))}
          onUseHint={(id, n) => setProgress((p) => ({ ...p, hintsUsed: { ...p.hintsUsed, [id]: n } }))}
        />
      ) : (
        <Home
          progress={progress}
          onOpen={openLevel}
          onReset={() => { setProgress({ done: [], codes: {}, hintsUsed: {}, signatures: {} }); setSyncMessage(null); }}
          onImport={(p) => setProgress(p)}
          syncMessage={syncMessage}
        />
      )}
    </div>
  );
}
