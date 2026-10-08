// Phase 3 — Calcul scientifique (100 niveaux)
import type { FamSpec } from './util';
import { ri, intArr, py, starterFn } from './util';

const THEORY_NUMPY = `## NumPy : tableaux

NumPy manipule des **tableaux** (arrays) bien plus rapides que les listes :

\`\`\`
import numpy as np
A = np.array([1, 2, 3])
A * 2          # array([2, 4, 6]) : opération sur TOUT le tableau
A + A          # array([2, 4, 6])
np.arange(5)   # array([0, 1, 2, 3, 4])
np.zeros((2, 3))   # matrice 2×3 de zéros
np.linspace(0, 1, 5)  # 5 points réguliers entre 0 et 1
\`\`\`

Les opérations sont **vectorisées** : pas de boucle, c'est NumPy qui itère en C optimisé.`;

const H1: FamSpec = {
  key: 'numpy-bases',
  topic: 'NumPy : création et opérations',
  count: 20,
  gen: (r, i) => {
    const mode = i % 4;
    if (mode === 0) {
      const k = ri(r, 2, 9);
      const L = intArr(r, 5, 1, 20);
      return {
        topic: H1.topic,
        title: `Vectorisation ${i + 1}`,
        theory: THEORY_NUMPY,
        statement: `Complétez \`multiplie(L, k)\` qui multiplie **tous** les éléments par k avec NumPy (sans boucle), et renvoie une **liste** Python (\`.tolist()\`). Exemple : multiplie(${py(L)}, ${k}) → \`${py(L.map((x) => x * k))}\`.`,
        starterCode: starterFn('def multiplie(L, k):', [
          'import numpy as np est déjà permis : utilisez-le',
          'np.array(L) crée le tableau',
          'Multipliez par k, puis .tolist() pour renvoyer une liste',
        ]),
        hints: ['import numpy as np\nA = np.array(L) * k', 'Renvoyez A.tolist().', 'import numpy as np\ndef multiplie(L, k):\n    return (np.array(L) * k).tolist()'],
        visibleTests: [{ kind: 'call', fn: 'multiplie', args: [L, k], expect: [L.map((x) => x * k)] }],
        hiddenTests: [{ kind: 'call', fn: 'multiplie', args: [[1, 2], 3], expect: [[3, 6]] }],
        solution: `import numpy as np\n\ndef multiplie(L, k):\n    return (np.array(L) * k).tolist()`,
        tips: [{ pattern: 'for', advice: 'La boucle fonctionne, mais la vectorisation NumPy est des ordres de grandeur plus rapide sur les grands tableaux.', mode: 'avoid' }],
      };
    }
    if (mode === 1) {
      const a = ri(r, 1, 5), b = ri(r, 8, 20);
      const calc = Array.from({ length: b - a }, (_, j) => a + j);
      return {
        topic: H1.topic,
        title: `np.arange ${i + 1}`,
        theory: THEORY_NUMPY,
        statement: `Complétez \`suite()\` qui renvoie la **liste** des entiers de ${a} à ${b - 1} créée avec \`np.arange\`. Résultat attendu : \`${py(calc)}\`.`,
        starterCode: starterFn('def suite():', [
          'np.arange(debut, fin) exclut la borne de fin', 'Convertissez avec .tolist()',
        ]),
        hints: [`np.arange(${a}, ${b})`, '.tolist() transforme en liste Python.', `import numpy as np\ndef suite():\n    return np.arange(${a}, ${b}).tolist()`],
        visibleTests: [{ kind: 'call', fn: 'suite', args: [], expect: [calc] }],
        hiddenTests: [],
        solution: `import numpy as np\n\ndef suite():\n    return np.arange(${a}, ${b}).tolist()`,
        tips: [],
      };
    }
    if (mode === 2) {
      const n = ri(r, 2, 4), m = ri(r, 2, 4);
      const calc = Array.from({ length: n }, (_, a) => Array.from({ length: m }, (_, b) => a + b));
      return {
        topic: H1.topic,
        title: `Matrice i+j ${i + 1}`,
        theory: THEORY_NUMPY,
        statement: `Complétez \`matrice_somme()\` qui construit avec NumPy la matrice ${n}×${m} dont l'élément (i, j) vaut i + j, et la renvoie sous forme de liste de listes. Attendu : \`${py(calc)}\`. Astuce : \`np.fromfunction\` ou un tableau de zéros + boucles.`,
        starterCode: starterFn('def matrice_somme():', [
          `np.zeros((${n}, ${m}), dtype=int) crée la matrice`,
          'Deux boucles i, j : A[i, j] = i + j',
          'Renvoyez A.tolist()',
        ]),
        hints: ['L\'indiçage d\'un array 2D : A[i, j].', 'for i in range(' + n + '):\n    for j in range(' + m + '):\n        A[i, j] = i + j', `import numpy as np\ndef matrice_somme():\n    A = np.zeros((${n}, ${m}), dtype=int)\n    for i in range(${n}):\n        for j in range(${m}):\n            A[i, j] = i + j\n    return A.tolist()`],
        visibleTests: [{ kind: 'call', fn: 'matrice_somme', args: [], expect: [calc] }],
        hiddenTests: [],
        solution: `import numpy as np\n\ndef matrice_somme():\n    A = np.zeros((${n}, ${m}), dtype=int)\n    for i in range(${n}):\n        for j in range(${m}):\n            A[i, j] = i + j\n    return A.tolist()`,
        tips: [{ pattern: 'for', advice: 'La version vectorisée np.fromfunction(lambda i, j: i + j, (' + n + ', ' + m + ')) évite les boucles.', mode: 'avoid' }],
      };
    }
    const n = ri(r, 4, 8);
    const calc = Array.from({ length: n }, (_, j) => j / (n - 1));
    return {
      topic: H1.topic,
      title: `np.linspace ${i + 1}`,
      theory: THEORY_NUMPY,
      statement: `Complétez \`points()\` qui renvoie la liste de ${n} points régulièrement espacés entre 0 et 1 **inclus**, créée avec \`np.linspace\`. Attendu : \`${py(calc.map((x) => Math.round(x * 1e9) / 1e9))}\` (à l'arrondi près).`,
      starterCode: starterFn('def points():', [
        `np.linspace(0, 1, ${n}) inclut les deux bornes`, '.tolist() pour la liste',
      ]),
      hints: [`np.linspace(0, 1, ${n})`, 'Puis .tolist().', `import numpy as np\ndef points():\n    return np.linspace(0, 1, ${n}).tolist()`],
      visibleTests: [{ kind: 'call', fn: 'points', args: [], expect: [calc], tol: 1e-9 }],
      hiddenTests: [],
      solution: `import numpy as np\n\ndef points():\n    return np.linspace(0, 1, ${n}).tolist()`,
      tips: [],
    };
  },
};

const THEORY_MASK = `## NumPy : masques booléens et statistiques

Un **masque booléen** sélectionne des éléments sans boucle :

\`\`\`
A = np.array([3, -1, 4, -2])
A[A > 0]       # array([3, 4]) : seulement les positifs
A > 0          # array([True, False, True, False])
(A > 0).sum()  # 2 : compte les True
A.mean(), A.max(), A.std()   # statistiques
\`\`\``;

const H2: FamSpec = {
  key: 'numpy-masques',
  topic: 'NumPy : masques et statistiques',
  count: 20,
  gen: (r, i) => {
    const L = intArr(r, 8, -20, 40);
    const mode = i % 3;
    if (mode === 0) {
      const calc = L.filter((x) => x >= 0);
      return {
        topic: H2.topic,
        title: `Masque positif ${i + 1}`,
        theory: THEORY_MASK,
        statement: `Complétez \`garde_positifs(L)\` qui renvoie la liste des éléments ≥ 0 **avec un masque NumPy** (pas de boucle for). Exemple : garde_positifs(${py(L)}) → \`${py(calc)}\`.`,
        starterCode: starterFn('def garde_positifs(L):', [
          'A = np.array(L)', 'A[A >= 0] sélectionne via un masque booléen', '.tolist() pour renvoyer une liste',
        ]),
        hints: ['A >= 0 crée un tableau de booléens.', 'A[A >= 0] ne garde que les True.', 'import numpy as np\ndef garde_positifs(L):\n    A = np.array(L)\n    return A[A >= 0].tolist()'],
        visibleTests: [{ kind: 'call', fn: 'garde_positifs', args: [L], expect: [calc] }],
        hiddenTests: [{ kind: 'call', fn: 'garde_positifs', args: [[-5, -1]], expect: [[]] }],
        solution: 'import numpy as np\n\ndef garde_positifs(L):\n    A = np.array(L)\n    return A[A >= 0].tolist()',
        tips: [{ pattern: 'for', advice: 'Le masque booléen est l\'outil NumPy prévu : vectorisé, lisible, rapide.', mode: 'avoid' }],
      };
    }
    if (mode === 1) {
      const seuil = ri(r, 0, 20);
      const calc = L.filter((x) => x > seuil).length;
      return {
        topic: H2.topic,
        title: `Compter avec un masque ${i + 1}`,
        theory: THEORY_MASK,
        statement: `Complétez \`compte_au_dessus(L, seuil)\` qui compte les éléments > seuil avec NumPy (indice : \`(A > seuil).sum()\`). Exemple : compte_au_dessus(${py(L)}, ${seuil}) → ${calc}.`,
        starterCode: starterFn('def compte_au_dessus(L, seuil):', [
          '(A > seuil) est un tableau de booléens', '.sum() compte les True', 'Renvoyez un int : int(...)',
        ]),
        hints: ['True vaut 1 pour la somme.', 'int((np.array(L) > seuil).sum())', 'import numpy as np\ndef compte_au_dessus(L, seuil):\n    A = np.array(L)\n    return int((A > seuil).sum())'],
        visibleTests: [{ kind: 'call', fn: 'compte_au_dessus', args: [L, seuil], expect: [calc] }],
        hiddenTests: [{ kind: 'call', fn: 'compte_au_dessus', args: [[1, 2, 3], 5], expect: [0] }],
        solution: 'import numpy as np\n\ndef compte_au_dessus(L, seuil):\n    A = np.array(L)\n    return int((A > seuil).sum())',
        tips: [],
      };
    }
    const mean = L.reduce((a, b) => a + b, 0) / L.length;
    return {
      topic: H2.topic,
      title: `Moyenne NumPy ${i + 1}`,
      theory: THEORY_MASK,
      statement: `Complétez \`moyenne(L)\` qui renvoie la moyenne des éléments avec NumPy. Exemple : moyenne(${py(L)}) ≈ ${Math.round(mean * 1000) / 1000} (tolérance acceptée).`,
      starterCode: starterFn('def moyenne(L):', [
        'np.array(L) puis la méthode .mean()', 'Renvoyez un float : float(...)',
      ]),
      hints: ['A.mean() calcule la moyenne.', 'float(np.array(L).mean())', 'import numpy as np\ndef moyenne(L):\n    return float(np.array(L).mean())'],
      visibleTests: [{ kind: 'call', fn: 'moyenne', args: [L], expect: [mean], tol: 1e-9 }],
      hiddenTests: [{ kind: 'call', fn: 'moyenne', args: [[2, 4]], expect: [3], tol: 1e-9 }],
      solution: 'import numpy as np\n\ndef moyenne(L):\n    return float(np.array(L).mean())',
      tips: [{ pattern: 'sum\\(.*\\)\\s*/\\s*len', advice: 'sum(L)/len(L) est exact, mais np.mean est optimisé et gère les grands tableaux plus sûrement.', mode: 'avoid' }],
    };
  },
};

const THEORY_SUITES = `## Suites et sommes numériques

Une **suite récurrente** se calcule par accumulation :

\`\`\`
u = 1
for n in range(1, 11):
    u = u / 2 + 1   # u_{n} en fonction de u_{n-1}
\`\`\`

Une **somme de série** Σ f(k) s'écrit avec un accumulateur dans une boucle. C'est la base de tout le calcul numérique en MPSI (intégrales, séries, schémas).`;

const H3: FamSpec = {
  key: 'suites',
  topic: 'Suites et séries',
  count: 15,
  gen: (r, i) => {
    const mode = i % 3;
    if (mode === 0) {
      const a = ri(r, 2, 4), b = ri(r, 1, 5), u0 = ri(r, 0, 5), n = ri(r, 5, 12);
      const calc = (uu: number, nn: number) => {
        for (let k = 0; k < nn; k++) uu = a * uu + b;
        return uu;
      };
      return {
        topic: H3.topic,
        title: `Suite arithmético-géométrique ${i + 1}`,
        theory: THEORY_SUITES,
        statement: `Suite définie par u₀ = ${u0} et u(n+1) = ${a}·u(n) + ${b}. Complétez \`terme(n)\` qui calcule u(n) par boucle. Exemple : terme(${n}) → ${calc(u0, n)}.`,
        starterCode: starterFn('def terme(n):', [
          `u = ${u0}  # terme initial`,
          `Répétez n fois : u = ${a} * u + ${b}`,
          'Renvoyez u',
        ]),
        hints: [`for k in range(n): u = ${a} * u + ${b}`, 'L\'ordre compte : on réutilise u à chaque tour.', `u = ${u0}\nfor k in range(n):\n    u = ${a} * u + ${b}\nreturn u`],
        visibleTests: [{ kind: 'call', fn: 'terme', args: [n], expect: [calc(u0, n)] }],
        hiddenTests: [{ kind: 'call', fn: 'terme', args: [0], expect: [u0] }],
        solution: `def terme(n):\n    u = ${u0}\n    for k in range(n):\n        u = ${a} * u + ${b}\n    return u`,
        tips: [{ pattern: 'for', advice: 'Pour les grandes valeurs de n, il existe une formule explicite (point fixe) : u_n = l + a^n (u_0 - l) avec l = b/(1-a).', mode: 'prefer' }],
      };
    }
    if (mode === 1) {
      const n = ri(r, 5, 15);
      const calc = (x: number) => Array.from({ length: x }, (_, k) => 1 / (k + 1) ** 2).reduce((a, b) => a + b, 0);
      return {
        topic: H3.topic,
        title: `Série harmonique² ${i + 1}`,
        theory: THEORY_SUITES,
        statement: `Complétez \`somme_serie(n)\` qui calcule Σₖ₌₁ⁿ 1/k² (approximation de π²/6). Exemple : somme_serie(${n}) ≈ ${Math.round(calc(n) * 1e6) / 1e6}.`,
        starterCode: starterFn('def somme_serie(n):', [
          'total = 0.0', 'for k in range(1, n + 1): ajoutez 1 / k ** 2', 'Renvoyez total',
        ]),
        hints: ['k part de 1 (sinon division par zéro).', 'total += 1 / k ** 2.', 'total = 0.0\nfor k in range(1, n + 1):\n    total += 1 / k ** 2\nreturn total'],
        visibleTests: [{ kind: 'call', fn: 'somme_serie', args: [n], expect: [calc(n)], tol: 1e-9 }],
        hiddenTests: [{ kind: 'call', fn: 'somme_serie', args: [1], expect: [1], tol: 1e-9 }],
        solution: 'def somme_serie(n):\n    total = 0.0\n    for k in range(1, n + 1):\n        total += 1 / k ** 2\n    return total',
        tips: [],
      };
    }
    const n = ri(r, 5, 12);
    const calc = (x: number) => {
      let h = 0;
      for (let k = 1; k <= x; k++) h += 1 / k;
      return h;
    };
    return {
      topic: H3.topic,
      title: `Série harmonique ${i + 1}`,
      theory: THEORY_SUITES,
      statement: `Complétez \`harmonique(n)\` = 1 + 1/2 + 1/3 + … + 1/n. Exemple : harmonique(${n}) ≈ ${Math.round(calc(n) * 1e6) / 1e6}.`,
      starterCode: starterFn('def harmonique(n):', [
        'total = 0.0', 'Ajoutez 1 / k pour k de 1 à n',
      ]),
      hints: ['range(1, n + 1).', 'total += 1 / k.', 'total = 0.0\nfor k in range(1, n + 1):\n    total += 1 / k\nreturn total'],
      visibleTests: [{ kind: 'call', fn: 'harmonique', args: [n], expect: [calc(n)], tol: 1e-9 }],
      hiddenTests: [{ kind: 'call', fn: 'harmonique', args: [2], expect: [1.5], tol: 1e-9 }],
      solution: 'def harmonique(n):\n    total = 0.0\n    for k in range(1, n + 1):\n        total += 1 / k\n    return total',
      tips: [{ pattern: 'for', advice: 'Une ligne possible : sum(1 / k for k in range(1, n + 1)).', mode: 'prefer' }],
    };
  },
};

const THEORY_INTEG = `## Intégration numérique

Pour approcher ∫ₐᵇ f(x) dx, on découpe [a, b] en n intervalles de largeur h = (b-a)/n.

**Méthode des rectangles** (point gauche) :

\`\`\`
h = (b - a) / n
total = 0
for k in range(n):
    total += f(a + k * h)
return total * h
\`\`\`

**Méthode des trapèzes** : h × (f(a)/2 + f(a+h) + … + f(b-h) + f(b)/2) — plus précise.`;

const H4: FamSpec = {
  key: 'integration',
  topic: 'Intégration numérique',
  count: 12,
  gen: (r, i) => {
    void r;
    const mode = i % 2;
    const n = ri(r, 100, 400);
    if (mode === 0) {
      // ∫₀¹ x^p dx = 1/(p+1)
      const p = ri(r, 2, 4);
      const exact = 1 / (p + 1);
      return {
        topic: H4.topic,
        title: `Rectangles ${i + 1}`,
        theory: THEORY_INTEG,
        statement: `Complétez \`integrale_rectangles(f, a, b, n)\` qui approche ∫ₐᵇ f par la méthode des **rectangles à gauche** (h = (b-a)/n, somme des f(a + k·h) pour k de 0 à n-1, le tout × h). Vérifiez : pour f(x) = x**${p} sur [0, 1] avec n = ${n}, vous devez approcher ${Math.round(exact * 10000) / 10000}.`,
        starterCode: starterFn('def integrale_rectangles(f, a, b, n):', [
          'h = (b - a) / n', 'total = 0', 'for k in range(n): total += f(a + k * h)', 'Renvoyez total * h',
        ]),
        hints: ['f est une fonction passée en paramètre : appelez-la f(x).', 'k va de 0 à n-1 : points GAUCHES.', 'h = (b - a) / n\ntotal = 0\nfor k in range(n):\n    total += f(a + k * h)\nreturn total * h'],
        visibleTests: [{ kind: 'call', fn: 'integrale_rectangles', args: ['__LAMBDA__x**2', 0, 1, 1000], expect: [1 / 3], tol: 1e-3 }],
        hiddenTests: [{ kind: 'call', fn: 'integrale_rectangles', args: ['__LAMBDA__x', 0, 2, 1000], expect: [2], tol: 5e-3 }],
        solution: 'def integrale_rectangles(f, a, b, n):\n    h = (b - a) / n\n    total = 0\n    for k in range(n):\n        total += f(a + k * h)\n    return total * h',
        tips: [{ pattern: 'sum\\(', advice: 'sum(f(a + k * h) for k in range(n)) * h est plus concis et tout aussi clair.', mode: 'prefer' }],
      };
    }
    return {
      topic: H4.topic,
      title: `Trapèzes ${i + 1}`,
      theory: THEORY_INTEG,
      statement: `Complétez \`integrale_trapezes(f, a, b, n)\` par la méthode des **trapèzes** : h × [f(a)/2 + f(b)/2 + Σ f(a + k·h) pour k de 1 à n-1]. Testez avec f(x) = x**2 sur [0, 1], n = ${n} : attendu ≈ 0.3333.`,
      starterCode: starterFn('def integrale_trapezes(f, a, b, n):', [
        'h = (b - a) / n', 'total = (f(a) + f(b)) / 2', 'Ajoutez f(a + k * h) pour k de 1 à n-1', 'Renvoyez total * h',
      ]),
      hints: ['Les extrémités comptent pour moitié.', 'k va de 1 à n-1 (points intérieurs).', 'h = (b - a) / n\ntotal = (f(a) + f(b)) / 2\nfor k in range(1, n):\n    total += f(a + k * h)\nreturn total * h'],
      visibleTests: [{ kind: 'call', fn: 'integrale_trapezes', args: ['__LAMBDA__x**2', 0, 1, 100], expect: [1 / 3], tol: 1e-4 }],
      hiddenTests: [{ kind: 'call', fn: 'integrale_trapezes', args: ['__LAMBDA__x', 0, 2, 10], expect: [2], tol: 1e-9 }],
      solution: 'def integrale_trapezes(f, a, b, n):\n    h = (b - a) / n\n    total = (f(a) + f(b)) / 2\n    for k in range(1, n):\n        total += f(a + k * h)\n    return total * h',
      tips: [{ pattern: 'for', advice: 'Les trapèzes convergent en O(1/n²), contre O(1/n) pour les rectangles : à n égal, bien plus précis.', mode: 'prefer' }],
    };
  },
};

const THEORY_ZERO = `## Zéros de fonctions : dichotomie et Newton

**Dichotomie** : si f est continue et change de signe sur [a, b] (f(a)·f(b) < 0), on coupe l'intervalle en deux et on garde la moitié où le signe change :

\`\`\`
while b - a > eps:
    m = (a + b) / 2
    if f(a) * f(m) <= 0:
        b = m
    else:
        a = m
return (a + b) / 2
\`\`\`

**Newton** : x(n+1) = x(n) − f(x(n))/f′(x(n)) — converge très vite près de la racine.`;

const H5: FamSpec = {
  key: 'zeros',
  topic: 'Zéros de fonctions',
  count: 12,
  gen: (_r, i) => {
    const mode = i % 2;
    if (mode === 0) {
      return {
        topic: H5.topic,
        title: `Dichotomie fonctionnelle ${i + 1}`,
        theory: THEORY_ZERO,
        statement: `Complétez \`zero_dichotomie(f, a, b, eps)\` qui renvoie une valeur approchée d'un zéro de f sur [a, b] (f(a) et f(b) de signes opposés) à eps près, par dichotomie. Test : zero_dichotomie(lambda x: x**2 - 2, 1, 2, 1e-6) ≈ √2 ≈ 1.4142136.`,
        starterCode: starterFn('def zero_dichotomie(f, a, b, eps):', [
          'Tant que b - a > eps :', 'm = (a + b) / 2', 'Si f(a) * f(m) <= 0 : b = m, sinon a = m', 'Renvoyez (a + b) / 2',
        ]),
        hints: ['Le signe de f(a) * f(m) dit de quel côté est la racine.', 'On réduit l\'intervalle de moitié à chaque tour.', 'while b - a > eps:\n    m = (a + b) / 2\n    if f(a) * f(m) <= 0:\n        b = m\n    else:\n        a = m\nreturn (a + b) / 2'],
        visibleTests: [{ kind: 'call', fn: 'zero_dichotomie', args: ['__LAMBDA__x**2 - 2', 1, 2, 1e-6], expect: [Math.SQRT2], tol: 1e-5 }],
        hiddenTests: [{ kind: 'call', fn: 'zero_dichotomie', args: ['__LAMBDA__x**3 - 8', 1, 3, 1e-6], expect: [2], tol: 1e-5 }],
        solution: 'def zero_dichotomie(f, a, b, eps):\n    while b - a > eps:\n        m = (a + b) / 2\n        if f(a) * f(m) <= 0:\n            b = m\n        else:\n            a = m\n    return (a + b) / 2',
        tips: [],
      };
    }
    return {
      topic: H5.topic,
      title: `Méthode de Newton ${i + 1}`,
      theory: THEORY_ZERO,
      statement: `Complétez \`newton(f, fp, x0, n)\` qui effectue n itérations de Newton : x ← x − f(x)/f′(x). Test : newton(lambda x: x**2 - 2, lambda x: 2*x, 1.0, 8) ≈ 1.4142136.`,
      starterCode: starterFn('def newton(f, fp, x0, n):', [
        'x = x0', 'Répétez n fois : x = x - f(x) / fp(x)', 'Renvoyez x',
      ]),
      hints: ['fp est la dérivée de f, passée en paramètre.', 'Chaque itération affine l\'estimation.', 'x = x0\nfor k in range(n):\n    x = x - f(x) / fp(x)\nreturn x'],
      visibleTests: [{ kind: 'call', fn: 'newton', args: ['__LAMBDA__x**2 - 2', '__LAMBDA__2*x', 1.0, 8], expect: [Math.SQRT2], tol: 1e-9 }],
      hiddenTests: [{ kind: 'call', fn: 'newton', args: ['__LAMBDA__x**3 - 27', '__LAMBDA__3*x**2', 2.0, 10], expect: [3], tol: 1e-6 }],
      solution: 'def newton(f, fp, x0, n):\n    x = x0\n    for k in range(n):\n        x = x - f(x) / fp(x)\n    return x',
      tips: [{ pattern: 'while', advice: 'Une boucle while avec test |f(x)| > eps s\'arrête dès que la précision est atteinte : souvent moins d\'itérations que n fixé.', mode: 'prefer' }],
    };
  },
};

const THEORY_EULER = `## Schéma d'Euler

Pour résoudre y′ = f(t, y) avec y(t₀) = y₀, on avance par petits pas h :

\`\`\`
t, y = t0, y0
for k in range(n):
    y = y + h * f(t, y)
    t = t + h
\`\`\`

C'est la discrétisation de la définition de la dérivée : y(t+h) ≈ y(t) + h·y′(t). Plus h est petit, plus c'est précis (mais plus on itère).`;

const H6: FamSpec = {
  key: 'euler',
  topic: "Équations différentielles : Euler",
  count: 12,
  gen: (r, i) => {
    const mode = i % 2;
    if (mode === 0) {
      // y' = a*y, y(0)=1, t en [0,1] : exp(a)
      const a = ri(r, 1, 3) * 0.5;
      const n = 1000;
      const h = 1 / n;
      let y = 1;
      for (let k = 0; k < n; k++) y = y + h * a * y;
      return {
        topic: H6.topic,
        title: `Exponentielle par Euler ${i + 1}`,
        theory: THEORY_EULER,
        statement: `Complétez \`euler_exp(a, n)\` qui résout y′ = a·y avec y(0) = 1 sur [0, 1] par le schéma d'Euler (pas h = 1/n), et renvoie y(1) approché. Avec a = ${a} et n = ${n}, attendu ≈ ${Math.round(y * 1e4) / 1e4} (la valeur exacte est e^${a} ≈ ${Math.round(Math.exp(a) * 1e4) / 1e4}).`,
        starterCode: starterFn('def euler_exp(a, n):', [
          'h = 1 / n ; y = 1', 'Répétez n fois : y = y + h * a * y', 'Renvoyez y',
        ]),
        hints: ['f(t, y) = a * y ici.', 'n itérations pour aller de 0 à 1.', 'h = 1 / n\ny = 1\nfor k in range(n):\n    y = y + h * a * y\nreturn y'],
        visibleTests: [{ kind: 'call', fn: 'euler_exp', args: [a, n], expect: [y, Math.exp(a)], tol: 2e-2 }],
        hiddenTests: [{ kind: 'call', fn: 'euler_exp', args: [1.0, 1000], expect: [Math.E], tol: 2e-2 }],
        solution: 'def euler_exp(a, n):\n    h = 1 / n\n    y = 1\n    for k in range(n):\n        y = y + h * a * y\n    return y',
        tips: [{ pattern: 'for', advice: 'Notez que y = (1 + h*a) ** n est la forme fermée du schéma ici — mais Euler marche pour TOUTE équation, pas seulement celle-ci.', mode: 'prefer' }],
      };
    }
    // y' = -y + cos? keep simple: y' = t (y = t²/2)
    const n = 500;
    const h = 1 / n;
    let y = 0, t = 0;
    for (let k = 0; k < n; k++) { y = y + h * t; t = t + h; }
    return {
      topic: H6.topic,
      title: `Euler général ${i + 1}`,
      theory: THEORY_EULER,
      statement: `Complétez \`euler(f, t0, y0, h, n)\` qui applique n pas du schéma d'Euler pour y′ = f(t, y) et renvoie la valeur finale de y. Test : euler(lambda t, y: t, 0, 0, 1/500, 500) approche y(1) = 0.5 (solution de y′ = t).`,
      starterCode: starterFn('def euler(f, t0, y0, h, n):', [
        't, y = t0, y0', 'Répétez n fois : y = y + h * f(t, y) puis t = t + h', 'Renvoyez y',
      ]),
      hints: ['Mettez à jour y AVANT t (f utilise l\'ancien t).', 'f(t, y) est passé en paramètre.', 't, y = t0, y0\nfor k in range(n):\n    y = y + h * f(t, y)\n    t = t + h\nreturn y'],
      visibleTests: [{ kind: 'call', fn: 'euler', args: ['__LAMBDA__t', 0, 0, 1 / 500, 500], expect: [0.5], tol: 1e-3 }],
      hiddenTests: [{ kind: 'call', fn: 'euler', args: ['__LAMBDA__y', 0, 1, 1 / 1000, 1000], expect: [Math.E], tol: 2e-2 }],
      solution: 'def euler(f, t0, y0, h, n):\n    t, y = t0, y0\n    for k in range(n):\n        y = y + h * f(t, y)\n        t = t + h\n    return y',
      tips: [],
    };
  },
};

const THEORY_PLOT = `## Préparer des données pour une courbe

Avec matplotlib on trace \`plt.plot(x, y)\` où x et y sont des listes de même longueur. L'étape clé (celle qu'on teste ici) est de **construire correctement les tableaux de données** :

\`\`\`
import numpy as np
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)
\`\`\`

Sur le site, on vérifie les données ; l'affichage graphique se fera dans votre IDE ou notebook Jupyter.`;

const H7: FamSpec = {
  key: 'courbes',
  topic: 'Données pour matplotlib',
  count: 9,
  gen: (r, i) => {
    const n = 50;
    const mode = i % 3;
    if (mode === 0) {
      const a = ri(r, 2, 5);
      const calc = Array.from({ length: n }, (_, k) => (k / (n - 1)) ** a);
      return {
        topic: H7.topic,
        title: `Points de y = x^${a} ${i + 1}`,
        theory: THEORY_PLOT,
        statement: `Complétez \`points_puissance()\` qui renvoie un **tuple (x, y)** de listes : x = ${n} points de 0 à 1 (np.linspace), y = x^${a}. Renvoyez des listes Python (tolist()).`,
        starterCode: starterFn('def points_puissance():', [
          `x = np.linspace(0, 1, ${n})`,
          `y = x ** ${a} (vectorisé !)`,
          'Convertissez les deux arrays en listes et renvoyez-les ensemble (tuple)',
        ]),
        hints: ['Les opérations sur les arrays sont élément par élément.', 'Un return x, y renvoie un tuple.', `import numpy as np\ndef points_puissance():\n    x = np.linspace(0, 1, ${n})\n    y = x ** ${a}\n    return x.tolist(), y.tolist()`],
        visibleTests: [{ kind: 'call', fn: 'points_puissance', args: [], expect: [[Array.from({ length: n }, (_, k) => k / (n - 1)), calc]], tol: 1e-9 }],
        hiddenTests: [],
        solution: `import numpy as np\n\ndef points_puissance():\n    x = np.linspace(0, 1, ${n})\n    y = x ** ${a}\n    return x.tolist(), y.tolist()`,
        tips: [{ pattern: 'for', advice: 'Inutile de boucler : x ** ' + a + ' sur l\'array calcule tout d\'un coup.', mode: 'avoid' }],
      };
    }
    if (mode === 1) {
      const calc = Array.from({ length: n }, (_, k) => Math.sin((2 * Math.PI * k) / (n - 1)));
      return {
        topic: H7.topic,
        title: `Un tour de sinus ${i + 1}`,
        theory: THEORY_PLOT,
        statement: `Complétez \`points_sinus()\` qui renvoie (x, y) : x = ${n} points de 0 à 2π, y = sin(x) (avec np.sin sur l'array).`,
        starterCode: starterFn('def points_sinus():', [
          `x = np.linspace(0, 2 * np.pi, ${n})`, 'y = np.sin(x)', 'Renvoyez en listes',
        ]),
        hints: ['np.pi donne π.', 'np.sin appliqué à un array calcule tous les sinus.', `import numpy as np\ndef points_sinus():\n    x = np.linspace(0, 2 * np.pi, ${n})\n    y = np.sin(x)\n    return x.tolist(), y.tolist()`],
        visibleTests: [{ kind: 'call', fn: 'points_sinus', args: [], expect: [[Array.from({ length: n }, (_, k) => (2 * Math.PI * k) / (n - 1)), calc]], tol: 1e-9 }],
        hiddenTests: [],
        solution: `import numpy as np\n\ndef points_sinus():\n    x = np.linspace(0, 2 * np.pi, ${n})\n    y = np.sin(x)\n    return x.tolist(), y.tolist()`,
        tips: [{ pattern: 'math\\.sin', advice: 'math.sin ne marche que sur un scalaire ; np.sin vectorise sur tout le tableau.', mode: 'avoid' }],
      };
    }
    const calc = Array.from({ length: n }, (_, k) => Math.exp(-(k / (n - 1)) * 3));
    return {
      topic: H7.topic,
      title: `Décroissance exponentielle ${i + 1}`,
      theory: THEORY_PLOT,
      statement: `Complétez \`points_exp()\` qui renvoie (x, y) : x = ${n} points de 0 à 3, y = e^(−x) (np.exp(-x)).`,
      starterCode: starterFn('def points_exp():', [
        `x = np.linspace(0, 3, ${n})`, 'y = np.exp(-x) — le moins s\'applique à tout l\'array', 'Renvoyez en listes',
      ]),
      hints: ['np.exp(-x) calcule e^(−x) pour tout le tableau.', '.tolist() des deux côtés.', `import numpy as np\ndef points_exp():\n    x = np.linspace(0, 3, ${n})\n    y = np.exp(-x)\n    return x.tolist(), y.tolist()`],
      visibleTests: [{ kind: 'call', fn: 'points_exp', args: [], expect: [[Array.from({ length: n }, (_, k) => (3 * k) / (n - 1)), calc]], tol: 1e-9 }],
      hiddenTests: [],
      solution: `import numpy as np\n\ndef points_exp():\n    x = np.linspace(0, 3, ${n})\n    y = np.exp(-x)\n    return x.tolist(), y.tolist()`,
      tips: [],
    };
  },
};

export const PHASE3: FamSpec[] = [H1, H2, H3, H4, H5, H6, H7];
export const NUMPY_KEYS = new Set(['numpy-bases', 'numpy-masques', 'courbes']);
