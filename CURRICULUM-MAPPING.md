# Curriculum Python v9 intégré à PyWargame

La page d’accueil suit désormais l’organisation du curriculum Python v9 de freeCodeCamp, sans certification :

```text
Python
├── Python Basics
│   ├── Introduction to Python — Théorie
│   ├── Understanding Variables and Data Types — Théorie
│   ├── Build a Report Card Printer — Atelier
│   ├── Introduction to Strings — Théorie
│   ├── Build an Employee Profile Generator — Atelier
│   ├── Build an Employee Profile Validator — Atelier
│   ├── Numbers and Mathematical Operations — Théorie
│   ├── Build a Bill Splitter — Atelier
│   ├── Booleans and Conditionals — Théorie
│   ├── Build a Movie Ticket Booking Calculator — Atelier
│   ├── Build a Travel Weather Planner — Laboratoire
│   ├── Understanding Functions and Scope — Théorie
│   ├── Build a Kitchen Inventory Tracker — Atelier
│   ├── Build an Apply Discount Function — Laboratoire
│   ├── Build a Caesar Cipher — Atelier
│   ├── Build an RPG Character — Laboratoire
│   ├── Python Basics Review — Révision
│   └── Python Basics Quiz — Quiz
├── Install Python
├── Loops and Sequences
├── Dictionaries and Sets
├── Error Handling
├── Classes and Objects
├── Object-Oriented Programming (OOP)
├── Linear Data Structures
├── Recursion
├── Algorithms
├── Graphs and Trees
├── Dynamic Programming
└── Python Review
```

Les autres cours contiennent leurs leçons et projets pédagogiques correspondants, avec les mêmes intitulés et les mêmes types de contenu que la page de référence : **Théorie**, **Atelier**, **Laboratoire**, **Révision** et **Quiz**.

Les éléments explicitement liés à la certification — projets de certification et examen final — ne sont pas affichés.

## Fonctionnement dans PyWargame

- `src/lib/curriculum.ts` contient le modèle de cours, modules, leçons, types et étapes.
- Les 550 exercices Python déjà présents servent de contenu exécutable local derrière les leçons du curriculum.
- Une leçon s’ouvre pour afficher ses étapes numérotées ; chaque étape ouvre l’exercice correspondant.
- Les états sont calculés avec la progression réelle : `Pas commencé`, `À poursuivre`, `Terminé` et `Verrouillé`.
- Les compteurs de modules et du cours racine se mettent à jour automatiquement.
- La recherche filtre les leçons comme dans le curriculum freeCodeCamp.
- Les données de progression et les liens `#/niveau/:id` restent compatibles avec l’application existante.
