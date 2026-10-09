# 🐍 PyWargame

Apprendre Python **niveau par niveau** (style wargame Bandit), orienté **MPSI**.
540 niveaux, 5 phases : bases (260), algorithmique (120), calcul scientifique (100), synthèse type DS (40), compléments Python MPSI (20).

Chaque niveau : théorie → énoncé → éditeur de code → tests (visibles + cachés) → correction commentée.
Le Python s'exécute **dans le navigateur** (Pyodide), site 100 % statique, sans compte : la progression est stockée dans le navigateur (export/import JSON).

## Lancer en local

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production -> dist/
```

## Vérifier les niveaux

```bash
npm run check:levels   # nécessite python3 + numpy
```

Contrôle les 540 niveaux : chaque correction passe tous ses tests, aucun code de départ ne les passe. À lancer avant toute mise en ligne.

## Ajouter des niveaux

Les niveaux sont des *familles génératrices* dans `src/levels/phase1.ts` … `phase5.ts` (`FamSpec`).
Créer `{ key, topic, count, gen }` où `gen(rng, i)` renvoie `{ topic, title, theory, statement, starterCode, hints, visibleTests, hiddenTests, solution, tips }`, puis l'ajouter au tableau `PHASEx`.

Tests :

```ts
{ kind: 'call', fn: 'ma_fonction', args: [1, 2], expect: [3], tol: 1e-9 }  // plusieurs résultats acceptés
{ kind: 'stdout', expect: ['42'] }                                         // sortie affichée
```

Fonction passée en argument : `'__LAMBDA__x**2'` (devient `lambda x: x**2` ; `t, y` si l'expression les utilise).

## Déployer

Site statique : `npm run build` produit `dist/`.
- **Vercel** : importer le dépôt GitHub (framework Vite détecté, commande `npm run build`, dossier `dist`). Chaque push redéploie.
- Tout autre hébergement statique convient (`npx serve dist`).

## Limites connues

- Premier chargement de Python : quelques secondes (~10 Mo), idem numpy.
- Les niveaux « matplotlib » vérifient les données, pas l'image.
- Architecture prête pour comptes, classement, espace enseignant (non implémentés volontairement).
