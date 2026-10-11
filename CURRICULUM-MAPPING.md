# Refonte du curriculum PyWargame

## Mapping des phases vers les modules

| Ancienne structure | Nouveau module | Sous-parties affichées | Type dominant |
| --- | --- | --- | --- |
| Phase 1 — Les bases de Python (270 niveaux) | **Bases de Python** | Une leçon par famille : variables, opérateurs, conversions, affichage, listes, boucles, conditions, chaînes, fonctions, dictionnaires/tuples et synthèse | Théorie / Atelier |
| Phase 2 — Algorithmique (120 niveaux) | **Algorithmique** | Accumulateurs, recherche, tri, dichotomie, récursivité, piles/files, compréhensions et boucles imbriquées | Atelier / Laboratoire |
| Phase 3 — Calcul scientifique (100 niveaux) | **Calcul scientifique** | Bases NumPy, masques, suites, intégration, recherche de zéros, Euler et courbes | Théorie / Laboratoire |
| Phase 4 — Synthèse type DS MPSI (40 niveaux) | **Problèmes de synthèse MPSI** | Familles de problèmes transversaux, organisées en séances de défis progressifs | Critique / Atelier |
| Phase 5 — Compléments Python pour la MPSI (20 niveaux) | **Compléments Python pour la MPSI** | Modules et expressions régulières, programmation objet, générateurs et outils complémentaires | Quiz / Théorie |

Les familles existantes restent la source de vérité pédagogique. Chaque niveau généré est conservé comme une **étape** et son identifiant reste inchangé : les liens directs, les codes sauvegardés et la progression locale ne sont donc pas cassés.

## Structure de données utilisée

```ts
Module = {
  phase: number,
  title: string,
  lessons: Lesson[]
}

Lesson = {
  key: string,
  title: string,       // topic existant
  kind: 'Théorie' | 'Atelier' | 'Laboratoire' | 'Critique' | 'Quiz',
  steps: Level[]       // niveaux existants, affichés sous forme de pastilles
}
```

Cette structure est dérivée de `LEVELS` et `PHASE_NAMES` au rendu : aucune duplication des 540 niveaux n’est introduite. Les compteurs sont recalculés à partir de `progress.done`, donc ils restent synchronisés en temps réel.

## Comportement

- Un clic sur un module ouvre ou ferme sa liste de leçons.
- Un clic sur une leçon ouvre ou ferme ses étapes.
- Une pastille correspond à un niveau existant et ouvre l’exercice dans la page actuelle.
- Le premier niveau non terminé de chaque leçon est marqué comme **À poursuivre** ; le prochain niveau global est automatiquement mis en évidence.
- Les niveaux verrouillés respectent la règle de progression existante (`id - 1` terminé).
- La progression, l’import/export JSON et la navigation par hash sont conservés.
- Aucun élément de certification, examen final ou parcours de certification n’est ajouté.

## Composants React

- `Home` : en-tête discret, message de synchronisation, résumé de progression et outils de sauvegarde.
- `LevelCatalog` : modules repliables, leçons typées, compteurs et étapes numérotées.
- `LevelPage` : inchangée fonctionnellement ; elle reste la destination des exercices.
- `progress.ts` : inchangé ; il continue de gérer la persistance et la resynchronisation par signature.
