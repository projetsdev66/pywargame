// Phase 2 — Algorithmique (120 niveaux)
import type { FamSpec } from './util';
import { ri, intArr, py, starterFn } from './util';

const THEORY_ACC = `## Parcours et accumulateurs

Le schéma **accumulateur** est partout en algorithmique :

\`\`\`
def somme(L):
    total = 0            # accumulateur
    for x in L:          # parcours
        total += x       # mise à jour
    return total
\`\`\`

Variantes : compter les éléments vérifiant une condition (compteur + \`if\` dans la boucle), concaténer des chaînes, chercher un élément (avec \`break\` ou \`return\` anticipé).`;

const G1: FamSpec = {
  key: 'accumulateurs',
  topic: 'Parcours et accumulateurs',
  count: 20,
  gen: (r, i) => {
    const mode = i % 4;
    const L = intArr(r, 8, -30, 50);
    if (mode === 0) {
      const seuil = ri(r, 5, 30);
      const calc = (l: number[]) => l.filter((x) => x > seuil).length;
      return {
        topic: G1.topic,
        title: `Comptage filtré ${i + 1}`,
        theory: THEORY_ACC,
        statement: `Complétez \`compte_grands(L, seuil)\` qui compte les éléments **strictement supérieurs** au seuil. Exemple : compte_grands(${py(L)}, ${seuil}) → ${calc(L)}.`,
        starterCode: starterFn('def compte_grands(L, seuil):', [
          'compteur = 0', 'Parcourez L avec for x in L', 'Si x > seuil : compteur += 1', 'Renvoyez compteur',
        ]),
        hints: ['Un if à l\'intérieur du for.', 'Attention : strictement supérieur, donc >.', 'compteur = 0\nfor x in L:\n    if x > seuil:\n        compteur += 1\nreturn compteur'],
        visibleTests: [{ kind: 'call', fn: 'compte_grands', args: [L, seuil], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'compte_grands', args: [[1, 2, 3], 2], expect: [1] }],
        solution: 'def compte_grands(L, seuil):\n    compteur = 0\n    for x in L:\n        if x > seuil:\n            compteur += 1\n    return compteur',
        tips: [{ pattern: 'for', advice: 'Bien ! Une ligne possible : sum(1 for x in L if x > seuil).', mode: 'prefer' }],
      };
    }
    if (mode === 1) {
      const calc = (l: number[]) => l.reduce((a, x) => (x % 2 === 0 ? a + x : a), 0);
      return {
        topic: G1.topic,
        title: `Somme des pairs ${i + 1}`,
        theory: THEORY_ACC,
        statement: `Complétez \`somme_pairs(L)\` qui additionne uniquement les nombres pairs de L. Exemple : somme_pairs(${py(L)}) → ${calc(L)}.`,
        starterCode: starterFn('def somme_pairs(L):', [
          'total = 0', 'Pour chaque x de L, testez si x est pair (x % 2 == 0)', 'Ajoutez seulement les pairs',
        ]),
        hints: ['x % 2 == 0 teste la parité.', 'Mettez le if dans le for.', 'total = 0\nfor x in L:\n    if x % 2 == 0:\n        total += x\nreturn total'],
        visibleTests: [{ kind: 'call', fn: 'somme_pairs', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'somme_pairs', args: [[1, 3, 5]], expect: [0] }],
        solution: 'def somme_pairs(L):\n    total = 0\n    for x in L:\n        if x % 2 == 0:\n            total += x\n    return total',
        tips: [{ pattern: 'for', advice: 'Correct ! Alternative : sum(x for x in L if x % 2 == 0).', mode: 'prefer' }],
      };
    }
    if (mode === 2) {
      const calc = (l: number[]) => (l.length ? l.reduce((a, b) => a * b, 1) : 1);
      return {
        topic: G1.topic,
        title: `Produit ${i + 1}`,
        theory: THEORY_ACC,
        statement: `Complétez \`produit(L)\` qui multiplie tous les éléments de L (1 pour une liste vide). Exemple : produit(${py(L)}) → ${calc(L)}.`,
        starterCode: starterFn('def produit(L):', [
          'Attention : l\'accumulateur d\'un produit part de 1, pas 0 !', 'Multipliez à chaque tour : total *= x',
        ]),
        hints: ['0 × quoi que ce soit = 0 : initialisez à 1.', 'total = 1 puis total *= x.', 'total = 1\nfor x in L:\n    total *= x\nreturn total'],
        visibleTests: [{ kind: 'call', fn: 'produit', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'produit', args: [[]], expect: [1] }],
        solution: 'def produit(L):\n    total = 1\n    for x in L:\n        total *= x\n    return total',
        tips: [{ pattern: 'for', advice: 'Avec le module math : math.prod(L) fait exactement cela.', mode: 'prefer' }],
      };
    }
    const calc = (l: number[]) => l.map(Math.abs).reduce((a, b) => a + b, 0);
    return {
      topic: G1.topic,
      title: `Somme des valeurs absolues ${i + 1}`,
      theory: THEORY_ACC,
      statement: `Complétez \`somme_abs(L)\` : somme des valeurs absolues des éléments. Exemple : somme_abs(${py(L)}) → ${calc(L)}.`,
      starterCode: starterFn('def somme_abs(L):', [
        'total = 0', 'Ajoutez abs(x) à chaque tour',
      ]),
      hints: ['abs(x) donne la valeur absolue.', 'total += abs(x).', 'total = 0\nfor x in L:\n    total += abs(x)\nreturn total'],
      visibleTests: [{ kind: 'call', fn: 'somme_abs', args: [L], expect: [calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'somme_abs', args: [[-5, -5]], expect: [10] }],
      solution: 'def somme_abs(L):\n    total = 0\n    for x in L:\n        total += abs(x)\n    return total',
      tips: [{ pattern: 'for', advice: 'Compact : return sum(abs(x) for x in L).', mode: 'prefer' }],
    };
  },
};

const THEORY_MAX = `## Recherche de maximum et de position

Trouver le maximum à la main : on garde le **meilleur candidat** et sa position :

\`\`\`
def indice_max(L):
    imax = 0
    for i in range(len(L)):
        if L[i] > L[imax]:
            imax = i
    return imax
\`\`\`

Pièges : liste vide (que renvoyer ?), égalités (le premier ou le dernier ?). En pratique, \`max(L)\` et \`L.index(max(L))\` font le travail.`;

const G2: FamSpec = {
  key: 'max-position',
  topic: 'Maximum et position',
  count: 15,
  gen: (r, i) => {
    const L = Array.from(new Set(intArr(r, 8, 1, 99)));
    const mode = i % 3;
    if (mode === 0) {
      const calc = (l: number[]) => l.indexOf(Math.max(...l));
      return {
        topic: G2.topic,
        title: `Indice du maximum ${i + 1}`,
        theory: THEORY_MAX,
        statement: `Complétez \`indice_max(L)\` qui renvoie l'**indice** du plus grand élément (sans utiliser max()). Exemple : indice_max(${py(L)}) → ${calc(L)}.`,
        starterCode: starterFn('def indice_max(L):', [
          'imax = 0 : indice du meilleur candidat', 'for i in range(len(L)):', 'Si L[i] > L[imax] : imax = i', 'Renvoyez imax',
        ]),
        hints: ['On compare L[i] au candidat L[imax].', 'Strictement supérieur garde le premier en cas d\'égalité.', 'imax = 0\nfor i in range(len(L)):\n    if L[i] > L[imax]:\n        imax = i\nreturn imax'],
        visibleTests: [{ kind: 'call', fn: 'indice_max', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'indice_max', args: [[5, 2, 9, 9, 1]], expect: [2] }],
        solution: 'def indice_max(L):\n    imax = 0\n    for i in range(len(L)):\n        if L[i] > L[imax]:\n            imax = i\n    return imax',
        tips: [{ pattern: 'for', advice: 'Bien ! En pratique : L.index(max(L)).', mode: 'prefer' }],
      };
    }
    if (mode === 1) {
      const calc = (l: number[]) => {
        const s = [...l].sort((a, b) => b - a);
        return s[1];
      };
      return {
        topic: G2.topic,
        title: `Second maximum ${i + 1}`,
        theory: THEORY_MAX,
        statement: `Complétez \`second_max(L)\` qui renvoie le **deuxième** plus grand élément (liste sans doublons, longueur ≥ 2). Exemple : second_max(${py(L)}) → ${calc(L)}. Essayez en un seul parcours, sans tri.`,
        starterCode: starterFn('def second_max(L):', [
          'Gardez deux variables : m1 (max) et m2 (second)',
          'Pour chaque x : si x > m1, alors m2 = m1 et m1 = x',
          'sinon si x > m2 : m2 = x',
        ]),
        hints: [
          'Quand un nouveau max apparaît, l\'ancien devient le second.',
          'Initialisez m1 et m2 avec les deux premiers éléments.',
          'm1, m2 = max(L[0], L[1]), min(L[0], L[1])\nfor x in L[2:]:\n    if x > m1:\n        m2 = m1\n        m1 = x\n    elif x > m2:\n        m2 = x\nreturn m2',
        ],
        visibleTests: [{ kind: 'call', fn: 'second_max', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'second_max', args: [[10, 4]], expect: [4] }],
        solution: 'def second_max(L):\n    m1, m2 = max(L[0], L[1]), min(L[0], L[1])\n    for x in L[2:]:\n        if x > m1:\n            m2 = m1\n            m1 = x\n        elif x > m2:\n            m2 = x\n    return m2',
        tips: [{ pattern: 'sorted|sort', advice: 'Trier puis prendre l\'avant-dernier coûte O(n log n) ; un seul parcours est O(n) : plus rapide.', mode: 'avoid' }],
      };
    }
    const calc = (l: number[]) => Math.min(...l);
    return {
      topic: G2.topic,
      title: `Minimum à la main ${i + 1}`,
      theory: THEORY_MAX,
      statement: `Complétez \`minimum(L)\` qui renvoie le plus petit élément sans min(). Exemple : minimum(${py(L)}) → ${calc(L)}.`,
      starterCode: starterFn('def minimum(L):', [
        'm = L[0] : premier candidat', 'Parcourez le reste et mettez à jour si plus petit',
      ]),
      hints: ['Partez de L[0], pas de 0 !', 'if x < m: m = x', 'm = L[0]\nfor x in L[1:]:\n    if x < m:\n        m = x\nreturn m'],
      visibleTests: [{ kind: 'call', fn: 'minimum', args: [L], expect: [calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'minimum', args: [[3, 1, 2]], expect: [1] }],
      solution: 'def minimum(L):\n    m = L[0]\n    for x in L[1:]:\n        if x < m:\n            m = x\n    return m',
      tips: [{ pattern: 'm = 0', advice: 'Initialiser à 0 est un piège : si tous les éléments sont positifs, vous renvoyez 0 à tort. Partez de L[0].', mode: 'avoid' }],
    };
  },
};

const THEORY_TRI = `## Tris simples

**Tri sélection** : à chaque tour, on trouve le minimum de la partie non triée et on l'échange en tête :

\`\`\`
def tri_selection(L):
    for i in range(len(L)):
        imin = i
        for j in range(i + 1, len(L)):
            if L[j] < L[imin]:
                imin = j
        L[i], L[imin] = L[imin], L[i]  # échange
    return L
\`\`\`

Deux boucles imbriquées → environ n²/2 comparaisons : **complexité quadratique**. L'échange simultané \`a, b = b, a\` évite la variable temporaire.`;

const G3: FamSpec = {
  key: 'tris',
  topic: 'Tris à la main',
  count: 15,
  gen: (r, i) => {
    const L = intArr(r, 7, 1, 60);
    const s = [...L].sort((a, b) => a - b);
    const mode = i % 3;
    const names = ['tri_selection', 'tri_bulles', 'tri_decroissant'];
    const titles = ['Tri sélection', 'Tri bulles', 'Tri décroissant'];
    const descs = [
      'Implémentez le **tri sélection** : pour chaque position i, trouvez l\'indice du minimum dans L[i:] et échangez.',
      'Implémentez le **tri à bulles** : parcourez la liste en échangeant les voisins mal ordonnés ; répétez jusqu\'à ce que ce soit trié.',
      'Triez la liste par ordre **décroissant** avec l\'algorithme de votre choix (écrit à la main, sans sort ni sorted).',
    ];
    const sols = [
      'def tri_selection(L):\n    for i in range(len(L)):\n        imin = i\n        for j in range(i + 1, len(L)):\n            if L[j] < L[imin]:\n                imin = j\n        L[i], L[imin] = L[imin], L[i]\n    return L',
      'def tri_bulles(L):\n    n = len(L)\n    for i in range(n):\n        for j in range(n - 1 - i):\n            if L[j] > L[j + 1]:\n                L[j], L[j + 1] = L[j + 1], L[j]\n    return L',
      'def tri_decroissant(L):\n    for i in range(len(L)):\n        imax = i\n        for j in range(i + 1, len(L)):\n            if L[j] > L[imax]:\n                imax = j\n        L[i], L[imax] = L[imax], L[i]\n    return L',
    ];
    const expected = mode === 2 ? [...s].reverse() : s;
    return {
      topic: G3.topic,
      title: `${titles[mode]} ${i + 1}`,
      theory: THEORY_TRI,
      statement: `Complétez \`${names[mode]}(L)\` qui trie la liste et la renvoie. ${descs[mode]} Exemple : ${names[mode]}(${py(L)}) → \`${py(expected)}\`.`,
      starterCode: starterFn(`def ${names[mode]}(L):`, [
        'Deux boucles imbriquées : la externe fixe une position, la interne cherche quoi y mettre',
        'Échangez avec L[a], L[b] = L[b], L[a]',
        'Renvoyez L',
      ]),
      hints: [
        'range(i + 1, len(L)) parcourt la partie non triée.',
        'L\'échange a, b = b, a est simultané : pas besoin de variable temporaire.',
        sols[mode],
      ],
      visibleTests: [{ kind: 'call', fn: names[mode], args: [L], expect: [expected] }],
      hiddenTests: [
        { kind: 'call', fn: names[mode], args: [[3, 1, 2]], expect: [mode === 2 ? [3, 2, 1] : [1, 2, 3]] },
        { kind: 'call', fn: names[mode], args: [[]], expect: [[]] },
      ],
      solution: sols[mode],
      tips: [
        { pattern: 'sorted|\\.sort', advice: 'L\'exercice demande un tri manuel. En pratique, sorted(L) (timsort, O(n log n)) est bien plus rapide pour les grandes listes.', mode: 'avoid' },
        { pattern: 'temp', advice: 'Python permet L[i], L[j] = L[j], L[i] : plus de variable temporaire nécessaire.', mode: 'avoid' },
      ],
    };
  },
};

const THEORY_DICHO = `## Recherche dichotomique

Dans une liste **triée**, on peut chercher en divisant l'intervalle par 2 à chaque étape :

\`\`\`
def dichotomie(L, x):
    gauche, droite = 0, len(L) - 1
    while gauche <= droite:
        milieu = (gauche + droite) // 2
        if L[milieu] == x:
            return milieu
        elif L[milieu] < x:
            gauche = milieu + 1
        else:
            droite = milieu - 1
    return -1
\`\`\`

Complexité **O(log n)** : pour 1 000 000 d'éléments, ~20 comparaisons suffisent (contre 1 000 000 en parcours simple).`;

const G4: FamSpec = {
  key: 'dichotomie',
  topic: 'Recherche dichotomique',
  count: 10,
  gen: (r, i) => {
    const L = [...new Set(intArr(r, 10, 1, 100))].sort((a, b) => a - b);
    const present = L[Math.floor(r() * L.length)];
    const absent = (() => { let v = ri(r, 1, 100); while (L.includes(v)) v = ri(r, 1, 100); return v; })();
    return {
      topic: G4.topic,
      title: `Dichotomie ${i + 1}`,
      theory: THEORY_DICHO,
      statement: `Complétez \`dichotomie(L, x)\` qui renvoie l'indice de x dans la liste **triée** L, ou -1 s'il est absent. Interdiction d'utiliser \`in\` ou \`.index()\` : divisez l'intervalle de recherche par deux à chaque tour.`,
      starterCode: starterFn('def dichotomie(L, x):', [
        'gauche, droite = 0, len(L) - 1',
        'Tant que gauche <= droite :',
        '  milieu = (gauche + droite) // 2',
        '  comparez L[milieu] à x et réduisez l\'intervalle',
        'Renvoyez -1 si la boucle se termine',
      ]),
      hints: [
        'Trois cas : égalité (renvoyer milieu), L[milieu] < x (chercher à droite), sinon à gauche.',
        'Chercher à droite : gauche = milieu + 1. À gauche : droite = milieu - 1.',
        'gauche, droite = 0, len(L) - 1\nwhile gauche <= droite:\n    milieu = (gauche + droite) // 2\n    if L[milieu] == x:\n        return milieu\n    elif L[milieu] < x:\n        gauche = milieu + 1\n    else:\n        droite = milieu - 1\nreturn -1',
      ],
      visibleTests: [
        { kind: 'call', fn: 'dichotomie', args: [L, present], expect: [L.indexOf(present)] },
        { kind: 'call', fn: 'dichotomie', args: [L, absent], expect: [-1] },
      ],
      hiddenTests: [
        { kind: 'call', fn: 'dichotomie', args: [[1, 2, 3], 3], expect: [2] },
        { kind: 'call', fn: 'dichotomie', args: [[], 5], expect: [-1] },
      ],
      solution: 'def dichotomie(L, x):\n    gauche, droite = 0, len(L) - 1\n    while gauche <= droite:\n        milieu = (gauche + droite) // 2\n        if L[milieu] == x:\n            return milieu\n        elif L[milieu] < x:\n            gauche = milieu + 1\n        else:\n            droite = milieu - 1\n    return -1',
      tips: [
        { pattern: '\\bin\\b|\\.index', advice: 'L\'exercice impose la dichotomie (O(log n)). in et .index() parcourent toute la liste : O(n).', mode: 'avoid' },
      ],
    };
  },
};

const THEORY_REC = `## Récursivité

Une fonction **récursive** s'appelle elle-même sur un problème plus petit, avec un **cas de base** qui arrête la récursion :

\`\`\`
def factorielle(n):
    if n <= 1:          # cas de base
        return 1
    return n * factorielle(n - 1)   # appel récursif
\`\`\`

Sans cas de base : récursion infinie (RecursionError). Chaque appel doit **se rapprocher** du cas de base.`;

const G5: FamSpec = {
  key: 'recursivite',
  topic: 'Récursivité',
  count: 20,
  gen: (r, i) => {
    const mode = i % 4;
    if (mode === 0) {
      const n = ri(r, 4, 12);
      const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
      return {
        topic: G5.topic,
        title: `Factorielle ${i + 1}`,
        theory: THEORY_REC,
        statement: `Complétez \`fact(n)\` récursive : n! = n × (n-1)!, avec 0! = 1. Exemple : fact(${n}) → ${fact(n)}.`,
        starterCode: starterFn('def fact(n):', [
          'Cas de base : si n <= 1, renvoyez 1', 'Sinon : n * fact(n - 1)',
        ]),
        hints: ['Quel est le plus petit cas ? n <= 1.', 'Le cas général ramène à n-1.', 'if n <= 1:\n    return 1\nreturn n * fact(n - 1)'],
        visibleTests: [{ kind: 'call', fn: 'fact', args: [n], expect: [fact(n)] }],
        hiddenTests: [{ kind: 'call', fn: 'fact', args: [0], expect: [1] }],
        solution: 'def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)',
        tips: [{ pattern: 'while|for', advice: 'La version itérative évite la limite de profondeur de récursion (~1000 appels) : souvent préférable en Python.', mode: 'avoid' }],
      };
    }
    if (mode === 1) {
      const n = ri(r, 6, 15);
      const fib = (x: number): number => (x <= 1 ? x : fib(x - 1) + fib(x - 2));
      return {
        topic: G5.topic,
        title: `Fibonacci ${i + 1}`,
        theory: THEORY_REC,
        statement: `Complétez \`fibo(n)\` : fibo(0)=0, fibo(1)=1, fibo(n)=fibo(n-1)+fibo(n-2). Exemple : fibo(${n}) → ${fib(n)}. (Version récursive simple, n ≤ 20.)`,
        starterCode: starterFn('def fibo(n):', [
          'Deux cas de base : n == 0 → 0, n == 1 → 1', 'Cas général : somme des deux appels récursifs',
        ]),
        hints: ['if n <= 1: return n gère les deux cas de base.', 'return fibo(n - 1) + fibo(n - 2).', 'if n <= 1:\n    return n\nreturn fibo(n - 1) + fibo(n - 2)'],
        visibleTests: [{ kind: 'call', fn: 'fibo', args: [n], expect: [fib(n)] }],
        hiddenTests: [
          { kind: 'call', fn: 'fibo', args: [0], expect: [0] },
          { kind: 'call', fn: 'fibo', args: [10], expect: [55] },
        ],
        solution: 'def fibo(n):\n    if n <= 1:\n        return n\n    return fibo(n - 1) + fibo(n - 2)',
        tips: [{ pattern: 'return fibo\\(n - 1\\) \\+ fibo\\(n - 2\\)', advice: 'Cette version double-récursive est exponentielle (2^n appels) ! Une boucle ou la mémoïsation (functools.lru_cache) la rend linéaire.', mode: 'avoid' }],
      };
    }
    if (mode === 2) {
      const a = ri(r, 2, 5), n = ri(r, 4, 10);
      return {
        topic: G5.topic,
        title: `Puissance récursive ${i + 1}`,
        theory: THEORY_REC,
        statement: `Complétez \`puissance(a, n)\` récursive (sans **) : aⁿ = a × aⁿ⁻¹, et a⁰ = 1. Exemple : puissance(${a}, ${n}) → ${a ** n}.`,
        starterCode: starterFn('def puissance(a, n):', [
          'Cas de base : n == 0', 'Sinon : a * puissance(a, n - 1)',
        ]),
        hints: ['Tout nombre à la puissance 0 vaut 1.', 'Réduisez n de 1 à chaque appel.', 'if n == 0:\n    return 1\nreturn a * puissance(a, n - 1)'],
        visibleTests: [{ kind: 'call', fn: 'puissance', args: [a, n], expect: [a ** n] }],
        hiddenTests: [{ kind: 'call', fn: 'puissance', args: [5, 0], expect: [1] }],
        solution: 'def puissance(a, n):\n    if n == 0:\n        return 1\n    return a * puissance(a, n - 1)',
        tips: [{ pattern: 'for|while', advice: 'Bonus : l\'exponentiation rapide (aⁿ = (a²)^(n/2) si n pair) est en O(log n) — classique de concours.', mode: 'avoid' }],
      };
    }
    const L = intArr(r, 6, 1, 40);
    const calc = (l: number[]) => l.reduce((a, b) => a + b, 0);
    return {
      topic: G5.topic,
      title: `Somme récursive ${i + 1}`,
      theory: THEORY_REC,
      statement: `Complétez \`somme_rec(L)\` récursive : la somme d'une liste est son premier élément + la somme du reste ; la liste vide donne 0. Exemple : somme_rec(${py(L)}) → ${calc(L)}.`,
      starterCode: starterFn('def somme_rec(L):', [
        'Cas de base : liste vide → 0 (testez len(L) == 0)', 'Sinon : L[0] + somme_rec(L[1:])',
      ]),
      hints: ['if len(L) == 0: return 0.', 'L[1:] est la liste privée du premier élément.', 'if len(L) == 0:\n    return 0\nreturn L[0] + somme_rec(L[1:])'],
      visibleTests: [{ kind: 'call', fn: 'somme_rec', args: [L], expect: [calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'somme_rec', args: [[]], expect: [0] }],
      solution: 'def somme_rec(L):\n    if len(L) == 0:\n        return 0\n    return L[0] + somme_rec(L[1:])',
      tips: [{ pattern: 'L\\[1:\\]', advice: 'Le slicing L[1:] recopie la liste à chaque appel (O(n²) au total). Passer un indice en paramètre évite ces copies.', mode: 'avoid' }],
    };
  },
};

const THEORY_PILE = `## Piles et files

Une **pile** (stack, LIFO : dernier entré, premier sorti) s'implémente avec une liste :

\`\`\`
pile = []
pile.append(x)   # empiler
x = pile.pop()   # dépiler (retire le dernier)
\`\`\`

Une **file** (queue, FIFO : premier entré, premier sorti) : on retire au début (\`pop(0)\`, ou mieux \`collections.deque\` avec \`popleft()\`).

Application classique : vérifier le parenthésage — on empile chaque "(" et on dépile à chaque ")".`;

const G6: FamSpec = {
  key: 'piles-files',
  topic: 'Piles et files',
  count: 15,
  gen: (r, i) => {
    const mode = i % 3;
    if (mode === 0) {
      const exprs: [string, boolean][] = [
        ['(a+b)*(c-d)', true], ['((x)', false], ['(a)(b)(c)', true],
        ['())(', false], ['((a+b))', true], [')x(', false], ['((a)(b))', true],
      ];
      const [ex, ok] = exprs[i % exprs.length];
      return {
        topic: G6.topic,
        title: `Parenthésage ${i + 1}`,
        theory: THEORY_PILE,
        statement: `Complétez \`bien_parenthesee(s)\` qui vérifie que les parenthèses de s sont équilibrées et correctement ordonnées. Exemples : bien_parenthesee("${ex}") → ${py(ok)}. Utilisez une pile (ou un compteur).`,
        starterCode: starterFn('def bien_parenthesee(s):', [
          'Parcourez les caractères : "(" empile, ")" dépile',
          'Si la pile est vide au moment d\'un ")" → False',
          'À la fin, la pile doit être vide',
        ]),
        hints: [
          'Un simple compteur suffit : +1 pour "(", -1 pour ")".',
          'Le compteur ne doit jamais passer sous 0, et finir à 0.',
          'n = 0\nfor c in s:\n    if c == "(":\n        n += 1\n    elif c == ")":\n        n -= 1\n    if n < 0:\n        return False\nreturn n == 0',
        ],
        visibleTests: [{ kind: 'call', fn: 'bien_parenthesee', args: [ex], expect: [ok] }],
        hiddenTests: [
          { kind: 'call', fn: 'bien_parenthesee', args: ['(()'], expect: [false] },
          { kind: 'call', fn: 'bien_parenthesee', args: [''], expect: [true] },
        ],
        solution: 'def bien_parenthesee(s):\n    n = 0\n    for c in s:\n        if c == "(":\n            n += 1\n        elif c == ")":\n            n -= 1\n        if n < 0:\n            return False\n    return n == 0',
        tips: [{ pattern: 'append.*pop|pop.*append', advice: 'Une vraie pile (append/pop) est nécessaire dès qu\'il y a plusieurs types de crochets ; ici le compteur suffit et c\'est optimal.', mode: 'prefer' }],
      };
    }
    if (mode === 1) {
      const L = intArr(r, 5, 1, 50);
      const calc = (l: number[]) => [...l].reverse();
      return {
        topic: G6.topic,
        title: `Renverser avec une pile ${i + 1}`,
        theory: THEORY_PILE,
        statement: `Complétez \`renverse_pile(L)\` qui renvoie la liste inversée en utilisant une **pile** : empilez tous les éléments, puis dépilez-les (sans utiliser [::-1] ni reversed()). Exemple : renverse_pile(${py(L)}) → \`${py(calc(L))}\`.`,
        starterCode: starterFn('def renverse_pile(L):', [
          'Empilez chaque élément : pile.append(x)',
          'Dépilez dans une nouvelle liste : pile.pop()',
          'Renvoyez le résultat',
        ]),
        hints: [
          'Le dernier empilé est le premier dépilé : c\'est ce qui inverse.',
          'while pile: resultat.append(pile.pop())',
          'pile = []\nfor x in L:\n    pile.append(x)\nresultat = []\nwhile pile:\n    resultat.append(pile.pop())\nreturn resultat',
        ],
        visibleTests: [{ kind: 'call', fn: 'renverse_pile', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'renverse_pile', args: [[1]], expect: [[1]] }],
        solution: 'def renverse_pile(L):\n    pile = []\n    for x in L:\n        pile.append(x)\n    resultat = []\n    while pile:\n        resultat.append(pile.pop())\n    return resultat',
        tips: [{ pattern: 'while pile', advice: 'Pédagogiquement parfait. En pratique, L[::-1] ou reversed(L) font cela en une ligne.', mode: 'prefer' }],
      };
    }
    const L = intArr(r, 6, 1, 30);
    const calc = (l: number[]) => l.map((x) => x * 2);
    return {
      topic: G6.topic,
      title: `File de traitement ${i + 1}`,
      theory: THEORY_PILE,
      statement: `Complétez \`traite_file(L)\` qui simule une file : retirez les éléments **par le début** (\`pop(0)\`), doublez-les, et empilez les résultats dans une liste de sortie. Exemple : traite_file(${py(L)}) → \`${py(calc(L))}\`.`,
      starterCode: starterFn('def traite_file(L):', [
        'Travaillez sur une copie : file = list(L)',
        'Tant que la file n\'est pas vide : x = file.pop(0)',
        'Ajoutez 2 * x à la liste de sortie',
      ]),
      hints: [
        'pop(0) retire le premier élément (FIFO).',
        'Ne modifiez pas la liste reçue : copiez-la d\'abord.',
        'file = list(L)\nsortie = []\nwhile file:\n    x = file.pop(0)\n    sortie.append(2 * x)\nreturn sortie',
      ],
      visibleTests: [{ kind: 'call', fn: 'traite_file', args: [L], expect: [calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'traite_file', args: [[]], expect: [[]] }],
      solution: 'def traite_file(L):\n    file = list(L)\n    sortie = []\n    while file:\n        x = file.pop(0)\n        sortie.append(2 * x)\n    return sortie',
      tips: [{ pattern: 'pop\\(0\\)', advice: 'pop(0) décale toute la liste : O(n) par appel, donc O(n²) au total. collections.deque avec popleft() est en O(1).', mode: 'avoid' }],
    };
  },
};

const THEORY_COMP = `## Listes en compréhension

Une **liste en compréhension** construit une liste en une ligne :

\`\`\`
carres = [x ** 2 for x in range(10)]
pairs = [x for x in range(20) if x % 2 == 0]
\`\`\`

Forme générale : \`[expression for x in iterable if condition]\`. C'est plus court et souvent plus rapide qu'une boucle avec append.`;

const G7: FamSpec = {
  key: 'comprehensions',
  topic: 'Listes en compréhension',
  count: 15,
  gen: (r, i) => {
    const mode = i % 3;
    if (mode === 0) {
      const n = ri(r, 5, 15);
      const calc = (x: number) => Array.from({ length: x }, (_, j) => j * j);
      return {
        topic: G7.topic,
        title: `Carrés en compréhension ${i + 1}`,
        theory: THEORY_COMP,
        statement: `Complétez \`carres(n)\` qui renvoie [0², 1², …, (n-1)²] avec une **liste en compréhension** (une seule ligne). Exemple : carres(${n}) → \`${py(calc(n))}\`.`,
        starterCode: starterFn('def carres(n):', [
          'Forme : [expression for i in range(n)]', 'L\'expression est i ** 2',
        ]),
        hints: ['Une ligne après le return.', '[i ** 2 for i in range(n)]', 'return [i ** 2 for i in range(n)]'],
        visibleTests: [{ kind: 'call', fn: 'carres', args: [n], expect: [calc(n)] }],
        hiddenTests: [{ kind: 'call', fn: 'carres', args: [1], expect: [[0]] }],
        solution: 'def carres(n):\n    return [i ** 2 for i in range(n)]',
        tips: [{ pattern: 'append', advice: 'La boucle+append marche, mais la compréhension est l\'idiome Python : plus courte et plus rapide.', mode: 'avoid' }],
      };
    }
    if (mode === 1) {
      const L = intArr(r, 8, -20, 40);
      const calc = (l: number[]) => l.filter((x) => x >= 0);
      return {
        topic: G7.topic,
        title: `Filtrer les positifs ${i + 1}`,
        theory: THEORY_COMP,
        statement: `Complétez \`positifs(L)\` qui garde uniquement les éléments ≥ 0, avec une compréhension. Exemple : positifs(${py(L)}) → \`${py(calc(L))}\`.`,
        starterCode: starterFn('def positifs(L):', [
          'Forme : [x for x in L if condition]', 'La condition est x >= 0',
        ]),
        hints: ['Le if va à la fin de la compréhension.', '[x for x in L if x >= 0]', 'return [x for x in L if x >= 0]'],
        visibleTests: [{ kind: 'call', fn: 'positifs', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'positifs', args: [[-1, -2]], expect: [[]] }],
        solution: 'def positifs(L):\n    return [x for x in L if x >= 0]',
        tips: [{ pattern: 'for.*append', advice: 'La compréhension remplace avantageusement le couple for+append ici.', mode: 'avoid' }],
      };
    }
    const L = intArr(r, 6, 1, 30);
    const calc = (l: number[]) => l.map((x) => (x % 2 === 0 ? x / 2 : x * 3 + 1));
    return {
      topic: G7.topic,
      title: `Transformation de Syracuse ${i + 1}`,
      theory: THEORY_COMP,
      statement: `Complétez \`syracuse_etape(L)\` qui transforme chaque x : x/2 si pair, 3x+1 si impair — avec une compréhension et une **expression conditionnelle** \`a if cond else b\`. Exemple : syracuse_etape(${py(L)}) → \`${py(calc(L))}\`.`,
      starterCode: starterFn('def syracuse_etape(L):', [
        'Expression conditionnelle : (x // 2) if x % 2 == 0 else (3 * x + 1)', 'Placez-la dans une compréhension',
      ]),
      hints: ['La syntaxe est [valeur_si_vrai if cond else valeur_si_faux for x in L].', 'x // 2 garde un entier.', 'return [x // 2 if x % 2 == 0 else 3 * x + 1 for x in L]'],
      visibleTests: [{ kind: 'call', fn: 'syracuse_etape', args: [L], expect: [calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'syracuse_etape', args: [[6]], expect: [[3]] }],
      solution: 'def syracuse_etape(L):\n    return [x // 2 if x % 2 == 0 else 3 * x + 1 for x in L]',
      tips: [],
    };
  },
};

const THEORY_DOUBLE = `## Boucles imbriquées et complexité

Deux boucles imbriquées parcourant n éléments → **O(n²)** opérations :

\`\`\`
for i in range(n):
    for j in range(i + 1, n):   # paires (i, j) sans répétition
        ...
\`\`\`

Réflexe : se demander si on peut faire mieux (tri + recherche, dictionnaire pour des lookups en O(1)). La **complexité** mesure comment le temps croît avec la taille des données.`;

const G8: FamSpec = {
  key: 'double-boucle',
  topic: 'Boucles imbriquées',
  count: 10,
  gen: (r, i) => {
    const mode = i % 2;
    if (mode === 0) {
      const L = intArr(r, 6, 1, 20);
      const calc = (l: number[]) => {
        let c = 0;
        for (let a = 0; a < l.length; a++) for (let b = a + 1; b < l.length; b++) if (l[a] + l[b] === 20) c++;
        return c;
      };
      return {
        topic: G8.topic,
        title: `Paires de somme 20 ${i + 1}`,
        theory: THEORY_DOUBLE,
        statement: `Complétez \`compte_paires(L)\` qui compte les paires (i < j) telles que L[i] + L[j] == 20. Exemple : compte_paires(${py(L)}) → ${calc(L)}.`,
        starterCode: starterFn('def compte_paires(L):', [
          'Boucle externe : i dans range(len(L))',
          'Boucle interne : j dans range(i + 1, len(L)) pour éviter les doublons',
          'Si L[i] + L[j] == 20 : comptez',
        ]),
        hints: ['j part de i+1 : pas de paire comptée deux fois.', 'if L[i] + L[j] == 20: compteur += 1.', 'compteur = 0\nfor i in range(len(L)):\n    for j in range(i + 1, len(L)):\n        if L[i] + L[j] == 20:\n            compteur += 1\nreturn compteur'],
        visibleTests: [{ kind: 'call', fn: 'compte_paires', args: [L], expect: [calc(L)] }],
        hiddenTests: [{ kind: 'call', fn: 'compte_paires', args: [[10, 10, 10]], expect: [3] }],
        solution: 'def compte_paires(L):\n    compteur = 0\n    for i in range(len(L)):\n        for j in range(i + 1, len(L)):\n            if L[i] + L[j] == 20:\n                compteur += 1\n    return compteur',
        tips: [{ pattern: 'for', advice: 'O(n²) ici. Avec un set des valeurs vues, on peut faire O(n) : pour chaque x, tester si 20-x a déjà été vu.', mode: 'avoid' }],
      };
    }
    const n = ri(r, 3, 5);
    const calc = (k: number) => Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => a * b));
    return {
      topic: G8.topic,
      title: `Table de multiplication matricielle ${i + 1}`,
      theory: THEORY_DOUBLE,
      statement: `Complétez \`table_multiplication(n)\` qui renvoie une **liste de listes** : la ligne i contient [i×0, i×1, …, i×(n-1)]. Exemple : table_multiplication(${n}) → \`${py(calc(n))}\`.`,
      starterCode: starterFn('def table_multiplication(n):', [
        'resultat = []',
        'Pour i dans range(n) : construisez la ligne [i * j pour j dans range(n)]',
        'Ajoutez chaque ligne au résultat',
      ]),
      hints: ['Une liste de listes = une liste par ligne.', 'ligne = [i * j for j in range(n)] puis resultat.append(ligne).', 'resultat = []\nfor i in range(n):\n    ligne = [i * j for j in range(n)]\n    resultat.append(ligne)\nreturn resultat'],
      visibleTests: [{ kind: 'call', fn: 'table_multiplication', args: [n], expect: [calc(n)] }],
      hiddenTests: [{ kind: 'call', fn: 'table_multiplication', args: [2], expect: [calc(2)] }],
      solution: 'def table_multiplication(n):\n    resultat = []\n    for i in range(n):\n        ligne = [i * j for j in range(n)]\n        resultat.append(ligne)\n    return resultat',
      tips: [{ pattern: 'for i in range\\(n\\):\\s*\\n\\s*ligne', advice: 'Une compréhension double fait tout en une ligne : [[i * j for j in range(n)] for i in range(n)].', mode: 'prefer' }],
    };
  },
};

export const PHASE2: FamSpec[] = [G1, G2, G3, G4, G5, G6, G7, G8];
