# Comparaison pédagogique pour PyWargame

## Ce qui a été observé

### France-IOI

France-IOI organise son parcours en niveaux et chapitres. Le parcours général va des bases jusqu’à l’algorithmique avancée. Le site associe des cours courts, des exercices progressifs, des fiches de synthèse, une validation automatique et un suivi de progression. [1] [2]

**Leçon retenue pour PyWargame :** chaque famille doit avoir une place claire dans le parcours, une notion introduite avant l’exercice, puis une synthèse après plusieurs exercices.

### Exercism

La piste Python d’Exercism regroupe les exercices par concepts. Elle combine pratique, analyse automatique du code et mentorat. Sa documentation explique aussi l’intérêt de tests lisibles et de messages d’échec montrant les valeurs attendues et obtenues. [3] [4]

**Leçon retenue pour PyWargame :** afficher le concept travaillé, conserver des tests visibles compréhensibles, puis distinguer le résultat fonctionnel des conseils de qualité de code.

### Codewars

Codewars propose de petits défis validés par des tests dans le navigateur. Les kata sont classés par difficulté et la plateforme donne un feedback immédiat. Les solutions d’autres utilisateurs sont consultables après résolution. [5] [6]

**Leçon retenue pour PyWargame :** conserver une difficulté progressive et des défis courts, mais ne pas transformer la formation CPGE en classement compétitif. La solution doit rester secondaire par rapport à la compréhension de l’algorithme.

### PyDéfis

PyDéfis propose des énoncés courts et des problèmes ouverts, parfois mathématiques, dont l’objectif est de construire un programme pour obtenir une réponse. Les défis peuvent être consultés avant la création d’un compte. [7]

**Leçon retenue pour PyWargame :** garder des défis de synthèse et de raisonnement, séparés des exercices guidés d’apprentissage.

### W3Schools

La page d’exercices Python met en avant des exercices courts, le suivi de progression et des activités organisées par thème. [8]

**Leçon retenue pour PyWargame :** permettre une séance courte et identifiable, avec un objectif visible et une progression qui ne dépend pas uniquement d’un compteur global.

## Décisions appliquées

1. L’ordre de la phase de base suit désormais une progression de cours : variables, opérateurs, conversions, affichage, listes, boucles, tests, dictionnaires, fonctions, chaînes et synthèse.
2. Les titres privilégient les notions Python et les exercices classiques plutôt que des contextes artificiels.
3. Chaque niveau reçoit une fiche de cours ciblée : repère de chapitre, syntaxe minimale, exemple, méthode et pièges.
4. Les sorties incorrectes indiquent la première différence entre le résultat obtenu et le résultat attendu.
5. La progression est synchronisée avec la signature du contenu du niveau. Une modification du cours, de l’énoncé ou des tests invalide uniquement la validation devenue obsolète.
6. Le contrôle de publication vérifie maintenant les identifiants contigus, la présence du cours enrichi, le nombre minimal d’indices et l’existence de tests.
7. Les conseils de code respectent correctement leurs modes : `avoid` signale un motif présent ; `prefer` signale un motif absent.

## Ce qui ne doit pas être copié

- Les classements et récompenses ne doivent pas remplacer la maîtrise des notions.
- Les titres humoristiques ou les contextes de jeu ne doivent pas masquer l’objectif algorithmique.
- Les solutions d’autres élèves ne doivent pas être révélées avant une tentative sérieuse.
- Les tests cachés doivent compléter les tests visibles, pas rendre l’exercice devinable ou arbitraire.

## Feuille de route recommandée

### Priorité 1 — stabilité

- conserver le contrôle automatique avant chaque publication ;
- tester les migrations de progression après toute modification de niveau ;
- garder les sorties et erreurs lisibles ;
- éviter les changements d’architecture React/Vite/Pyodide.

### Priorité 2 — parcours

- regrouper les niveaux en séances courtes de 5 à 10 défis ;
- ajouter une synthèse explicite à la fin des grandes familles ;
- distinguer clairement les bases, l’algorithmique, le calcul scientifique et les défis ouverts.

### Priorité 3 — feedback

- conserver les tests visibles et les diagnostics de différence ;
- proposer un indice progressif à la fois ;
- ajouter, après réussite, un retour sur la lisibilité, les invariants et les cas limites sans empêcher une solution correcte.

### Priorité 4 — contenu

- compléter les chapitres fichiers, modules et expressions régulières ;
- ajouter des exercices CPGE de parcours, recherche, tri, récursivité et preuves de terminaison ;
- réserver les défis mathématiques et ouverts à des séances de synthèse.

## Références

[1]: https://www.france-ioi.org/algo/chapters.php "France-IOI — Cours et problèmes"
[2]: https://www.france-ioi.org/lycee/progresser/index.html "France-IOI — Présentation du parcours"
[3]: https://exercism.org/tracks/python "Exercism — Python track"
[4]: https://exercism.org/docs/tracks/python/tests "Exercism — Testing on the Python track"
[5]: https://www.codewars.com/ "Codewars — Achieve mastery through challenge"
[6]: https://docs.codewars.com/gamification/ranks/ "Codewars — Ranks"
[7]: https://pydefis.callicode.fr/ "PyDéfis — Défis de programmation"
[8]: https://www.w3schools.com/python/python_exercises.asp "W3Schools — Python Exercises"
