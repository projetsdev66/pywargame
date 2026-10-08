export interface LevelSession<T> {
  number: number;
  start: number;
  end: number;
  levels: T[];
}

/**
 * Répartit les niveaux déjà ordonnés en séances aussi équilibrées que possible.
 * Les données sources, identifiants et règles de progression ne sont pas modifiés.
 */
export function groupIntoSessions<T>(levels: readonly T[]): LevelSession<T>[] {
  if (levels.length === 0) return [];

  const sessionCount = Math.ceil(levels.length / 5);
  const baseSize = Math.floor(levels.length / sessionCount);
  const remainder = levels.length % sessionCount;
  let offset = 0;

  return Array.from({ length: sessionCount }, (_, index) => {
    const size = baseSize + (index < remainder ? 1 : 0);
    const start = offset + 1;
    const sessionLevels = levels.slice(offset, offset + size);
    offset += size;

    return {
      number: index + 1,
      start,
      end: offset,
      levels: sessionLevels,
    };
  });
}

export function findSessionForLevel<T extends { id: number }>(
  levels: readonly T[],
  levelId: number,
): LevelSession<T> | undefined {
  return groupIntoSessions(levels).find((session) =>
    session.levels.some((level) => level.id === levelId),
  );
}
