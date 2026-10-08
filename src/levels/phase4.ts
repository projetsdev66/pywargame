// Phase 4 — Problèmes de synthèse type DS/TP MPSI (40 niveaux)
import type { FamSpec } from './util';
import { ri, pick, intArr, py, starterFn } from './util';

const THEORY_DS = `## Problèmes de synthèse

Ces niveaux mélangent plusieurs notions, comme les questions de DS ou de TP de MPSI : chaînes, dictionnaires, boucles, listes, algorithmique. Lisez bien l'énoncé, décomposez le problème en étapes, et testez sur les exemples avant de valider.

Conseil de méthode : écrivez d'abord un algorithme en français dans les commentaires, puis traduisez en Python.`;

// --- 8 sous-types × 5 variantes = 40 niveaux ---

const K1: FamSpec = {
  key: 'ds-anagrammes',
  topic: 'Synthèse : anagrammes',
  count: 5,
  gen: (_r, i) => {
    const pairs: [string, string, boolean][] = [
      ['chien', 'niche', true], ['marion', 'manoir', true], ['python', 'typhon', true],
      ['liste', 'table', false], ['parisien', 'aspirine', true], ['bonjour', 'jourbon', false],
    ];
    const [a, b, ok] = pairs[i % pairs.length];
    return {
      topic: K1.topic,
      title: `Anagrammes ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`sont_anagrammes(mot1, mot2)\` qui renvoie True si les deux mots sont des anagrammes (mêmes lettres, même multiplicité). Exemple : sont_anagrammes("${a}", "${b}") → ${py(ok)}. Approche conseillée : dictionnaire de comptage, ou trier les lettres.`,
      starterCode: starterFn('def sont_anagrammes(mot1, mot2):', [
        'Deux approches possibles :',
        '  1) comparer sorted(mot1) et sorted(mot2)',
        '  2) comparer deux dictionnaires de comptage',
        'Choisissez-en une et codez-la',
      ]),
      hints: [
        'sorted("cba") donne [\'a\', \'b\', \'c\'] — comparer les versions triées suffit.',
        'Sinon : comptez chaque lettre avec un dictionnaire (compte.get(c, 0) + 1).',
        'return sorted(mot1) == sorted(mot2)',
      ],
      visibleTests: [{ kind: 'call', fn: 'sont_anagrammes', args: [a, b], expect: [ok] }],
      hiddenTests: [
        { kind: 'call', fn: 'sont_anagrammes', args: ['rail', 'liar'], expect: [true] },
        { kind: 'call', fn: 'sont_anagrammes', args: ['aab', 'abb'], expect: [false] },
      ],
      solution: 'def sont_anagrammes(mot1, mot2):\n    return sorted(mot1) == sorted(mot2)',
      tips: [
        { pattern: 'sorted', advice: 'Tri : O(n log n), simple. Le comptage par dictionnaire est O(n) : optimal pour de très longues chaînes.', mode: 'prefer' },
        { pattern: '\\.sort\\(', advice: 'str n\'a pas de .sort() ; utilisez sorted() qui renvoie une liste triée.', mode: 'avoid' },
      ],
    };
  },
};

const K2: FamSpec = {
  key: 'ds-rle',
  topic: 'Synthèse : compression RLE',
  count: 5,
  gen: (r) => {
    const s = pick(r, ['aaabbbbc', 'xxxxxyyyyyz', 'abbbccccdd', 'wwwwwwwaa', 'mnoppppp']);
    const calc = (x: string) => {
      if (!x) return '';
      let out = '', prev = x[0], n = 1;
      for (let k = 1; k < x.length; k++) {
        if (x[k] === prev) n++;
        else { out += prev + n; prev = x[k]; n = 1; }
      }
      return out + prev + n;
    };
    return {
      topic: K2.topic,
      title: 'Compression RLE',
      theory: THEORY_DS,
      statement: `Complétez \`compresse(s)\` qui code une chaîne en « run-length » : chaque série de caractères identiques devient caractère + nombre. Exemple : compresse("${s}") → \`"${calc(s)}"\`.`,
      starterCode: starterFn('def compresse(s):', [
        'Gardez : caractère courant (courant) et sa longueur de série (n)',
        'Quand le caractère change : ajoutez courant + str(n) au résultat',
        'N\'oubliez pas la dernière série après la boucle !',
      ]),
      hints: [
        'Initialisez avec le premier caractère : courant = s[0], n = 1.',
        'Le piège classique : oublier d\'ajouter la dernière série.',
        'resultat = ""\ncourant = s[0]\nn = 1\nfor c in s[1:]:\n    if c == courant:\n        n += 1\n    else:\n        resultat += courant + str(n)\n        courant = c\n        n = 1\nresultat += courant + str(n)\nreturn resultat',
      ],
      visibleTests: [{ kind: 'call', fn: 'compresse', args: [s], expect: [calc(s)] }],
      hiddenTests: [
        { kind: 'call', fn: 'compresse', args: ['a'], expect: ['a1'] },
        { kind: 'call', fn: 'compresse', args: ['abc'], expect: ['a1b1c1'] },
      ],
      solution: 'def compresse(s):\n    if s == "":\n        return ""\n    resultat = ""\n    courant = s[0]\n    n = 1\n    for c in s[1:]:\n        if c == courant:\n            n += 1\n        else:\n            resultat += courant + str(n)\n            courant = c\n            n = 1\n    resultat += courant + str(n)\n    return resultat',
      tips: [],
    };
  },
};

const K3: FamSpec = {
  key: 'ds-stats',
  topic: 'Synthèse : statistiques',
  count: 5,
  gen: (r, i) => {
    const L = intArr(r, 8, 1, 30);
    const calc = (l: number[]) => {
      const cnt: Record<number, number> = {};
      for (const x of l) cnt[x] = (cnt[x] || 0) + 1;
      const m = Math.max(...Object.values(cnt));
      return Math.min(...Object.keys(cnt).map(Number).filter((k) => cnt[k] === m));
    };
    return {
      topic: K3.topic,
      title: `Mode statistique ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`mode(L)\` qui renvoie la valeur la plus fréquente de L (en cas d'égalité, la plus petite). Exemple : mode(${py(L)}) → ${calc(L)}.`,
      starterCode: starterFn('def mode(L):', [
        'Étape 1 : dictionnaire de comptage valeur → occurrences',
        'Étape 2 : trouvez la fréquence maximale',
        'Étape 3 : parmi les valeurs à cette fréquence, prenez la plus petite',
      ]),
      hints: [
        'compte[x] = compte.get(x, 0) + 1.',
        'max(compte.values()) donne la fréquence max.',
        'compte = {}\nfor x in L:\n    compte[x] = compte.get(x, 0) + 1\nfmax = max(compte.values())\ncandidats = [x for x, f in compte.items() if f == fmax]\nreturn min(candidats)',
      ],
      visibleTests: [{ kind: 'call', fn: 'mode', args: [L], expect: [calc(L)] }],
      hiddenTests: [
        { kind: 'call', fn: 'mode', args: [[1, 1, 2, 2, 3]], expect: [1] },
        { kind: 'call', fn: 'mode', args: [[7]], expect: [7] },
      ],
      solution: 'def mode(L):\n    compte = {}\n    for x in L:\n        compte[x] = compte.get(x, 0) + 1\n    fmax = max(compte.values())\n    candidats = [x for x, f in compte.items() if f == fmax]\n    return min(candidats)',
      tips: [{ pattern: 'Counter', advice: 'collections.Counter(L).most_common(1) fait le comptage pour vous — mais attention à la règle d\'égalité.', mode: 'prefer' }],
    };
  },
};

const K4: FamSpec = {
  key: 'ds-premiers',
  topic: 'Synthèse : nombres premiers',
  count: 5,
  gen: (r, i) => {
    const n = ri(r, 20, 60);
    const sieve = (lim: number) => {
      const res: number[] = [];
      for (let x = 2; x <= lim; x++) {
        let pr = true;
        for (let d = 2; d * d <= x; d++) if (x % d === 0) { pr = false; break; }
        if (pr) res.push(x);
      }
      return res;
    };
    return {
      topic: K4.topic,
      title: `Premiers jusqu'à n ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`premiers(n)\` qui renvoie la liste des nombres premiers ≤ n. Exemple : premiers(${n}) → \`${py(sieve(n))}\`. Un nombre x est premier s'il n'a aucun diviseur entre 2 et √x.`,
      starterCode: starterFn('def premiers(n):', [
        'Pour chaque x de 2 à n :',
        '  testez les diviseurs d de 2 à √x (d * d <= x)',
        '  si aucun ne divise x, ajoutez x au résultat',
      ]),
      hints: [
        'Il suffit de tester jusqu\'à √x : au-delà, les diviseurs viennent par paires.',
        'Utilisez un drapeau ou break.',
        'resultat = []\nfor x in range(2, n + 1):\n    est_premier = True\n    d = 2\n    while d * d <= x:\n        if x % d == 0:\n            est_premier = False\n            break\n        d += 1\n    if est_premier:\n        resultat.append(x)\nreturn resultat',
      ],
      visibleTests: [{ kind: 'call', fn: 'premiers', args: [n], expect: [sieve(n)] }],
      hiddenTests: [
        { kind: 'call', fn: 'premiers', args: [10], expect: [[2, 3, 5, 7]] },
        { kind: 'call', fn: 'premiers', args: [1], expect: [[]] },
      ],
      solution: 'def premiers(n):\n    resultat = []\n    for x in range(2, n + 1):\n        est_premier = True\n        d = 2\n        while d * d <= x:\n            if x % d == 0:\n                est_premier = False\n                break\n            d += 1\n        if est_premier:\n            resultat.append(x)\n    return resultat',
      tips: [{ pattern: 'range\\(2, x\\)', advice: 'Tester jusqu\'à x au lieu de √x multiplie le travail : la borne √x est bien meilleure.', mode: 'avoid' }],
    };
  },
};

const K5: FamSpec = {
  key: 'ds-palindromes',
  topic: 'Synthèse : palindromes',
  count: 5,
  gen: (_r, i) => {
    const phrases: [string, boolean][] = [
      ['kayak', true], ['ressasser', true], ['python', false],
      ['radar', true], ['niveau', false], ['elle', true],
    ];
    const [s, ok] = phrases[i % phrases.length];
    return {
      topic: K5.topic,
      title: `Palindrome à la main ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`est_palindrome(s)\` **sans utiliser [::-1]** : comparez les caractères par les deux bouts (deux indices qui se rapprochent). Exemple : est_palindrome("${s}") → ${py(ok)}.`,
      starterCode: starterFn('def est_palindrome(s):', [
        'i = 0, j = len(s) - 1',
        'Tant que i < j : si s[i] != s[j], renvoyez False',
        'Sinon rapprochez : i += 1, j -= 1',
        'Renvoyez True',
      ]),
      hints: [
        'Deux pointeurs qui avancent l\'un vers l\'autre.',
        'while i < j: ...',
        'i = 0\nj = len(s) - 1\nwhile i < j:\n    if s[i] != s[j]:\n        return False\n    i += 1\n    j -= 1\nreturn True',
      ],
      visibleTests: [{ kind: 'call', fn: 'est_palindrome', args: [s], expect: [ok] }],
      hiddenTests: [
        { kind: 'call', fn: 'est_palindrome', args: ['a'], expect: [true] },
        { kind: 'call', fn: 'est_palindrome', args: ['ab'], expect: [false] },
      ],
      solution: 'def est_palindrome(s):\n    i = 0\n    j = len(s) - 1\n    while i < j:\n        if s[i] != s[j]:\n            return False\n        i += 1\n        j -= 1\n    return True',
      tips: [{ pattern: '\\[::-1\\]', advice: 's == s[::-1] est l\'idiome Python (accepté en pratique) ; la version deux pointeurs montre la technique demandée en DS.', mode: 'prefer' }],
    };
  },
};

const K6: FamSpec = {
  key: 'ds-matrice',
  topic: 'Synthèse : matrices',
  count: 5,
  gen: (r, i) => {
    const n = ri(r, 3, 4);
    const M = Array.from({ length: n }, () => intArr(r, n, 1, 30));
    const trace = (m: number[][]) => m.reduce((acc, row, k) => acc + row[k], 0);
    const tr = M[0].map((_, j) => M.map((row) => row[j]));
    return {
      topic: K6.topic,
      title: `Transposée ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`transpose(M)\` qui renvoie la transposée de la matrice carrée M (lignes ↔ colonnes) : B[j][i] = A[i][j]. Exemple : transpose(${py(M)}) → \`${py(tr)}\`. La trace (somme diagonale, ici ${trace(M)}) est invariante par transposition — bon moyen de se tester.`,
      starterCode: starterFn('def transpose(M):', [
        'n = len(M)',
        'B[j][i] = A[i][j] : construisez ligne par ligne',
        'Compréhension double possible : [[M[i][j] for i in range(n)] for j in range(n)]',
      ]),
      hints: [
        'La ligne j de la transposée = la colonne j de M.',
        'for j in range(n): ligne = [M[i][j] for i in range(n)].',
        'return [[M[i][j] for i in range(len(M))] for j in range(len(M))]',
      ],
      visibleTests: [{ kind: 'call', fn: 'transpose', args: [M], expect: [tr] }],
      hiddenTests: [{ kind: 'call', fn: 'transpose', args: [[[1, 2], [3, 4]]], expect: [[[1, 3], [2, 4]]] }],
      solution: 'def transpose(M):\n    n = len(M)\n    return [[M[i][j] for i in range(n)] for j in range(n)]',
      tips: [{ pattern: 'zip', advice: 'list(map(list, zip(*M))) transpose en une ligne grâce au déballage.', mode: 'prefer' }],
    };
  },
};

const K7: FamSpec = {
  key: 'ds-pgcd',
  topic: 'Synthèse : arithmétique',
  count: 5,
  gen: (r, i) => {
    const g = ri(r, 3, 12), a = g * ri(r, 2, 8), b = g * ri(r, 2, 8);
    const pgcd = (x: number, y: number): number => (y === 0 ? x : pgcd(y, x % y));
    return {
      topic: K7.topic,
      title: `PGCD d'Euclide ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`pgcd(a, b)\` par l'**algorithme d'Euclide** : tant que b ≠ 0, remplacez (a, b) par (b, a mod b). Exemple : pgcd(${a}, ${b}) → ${pgcd(a, b)}.`,
      starterCode: starterFn('def pgcd(a, b):', [
        'Tant que b != 0 :', '  a, b = b, a % b  (échange simultané)', 'Renvoyez a',
      ]),
      hints: [
        'Le reste a % b est la clé de l\'algorithme.',
        'a, b = b, a % b fait les deux affectations d\'un coup.',
        'while b != 0:\n    a, b = b, a % b\nreturn a',
      ],
      visibleTests: [{ kind: 'call', fn: 'pgcd', args: [a, b], expect: [pgcd(a, b)] }],
      hiddenTests: [
        { kind: 'call', fn: 'pgcd', args: [17, 5], expect: [1] },
        { kind: 'call', fn: 'pgcd', args: [12, 12], expect: [12] },
      ],
      solution: 'def pgcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a',
      tips: [{ pattern: 'while', advice: 'Version récursive en une ligne : return a if b == 0 else pgcd(b, a % b). math.gcd existe aussi.', mode: 'prefer' }],
    };
  },
};

const K8: FamSpec = {
  key: 'ds-texte',
  topic: 'Synthèse : analyse de texte',
  count: 5,
  gen: (_r, i) => {
    const phrases = [
      'le python est un langage le python est clair',
      'un deux deux trois trois trois',
      'algorithme programme algorithme',
      'for while for if for while',
      'liste tuple liste set liste tuple',
    ];
    const s = phrases[i % phrases.length];
    const calc = (x: string) => {
      const mots = x.split(' ');
      const cnt: Record<string, number> = {};
      for (const m of mots) cnt[m] = (cnt[m] || 0) + 1;
      const mx = Math.max(...Object.values(cnt));
      return Object.keys(cnt).filter((k) => cnt[k] === mx).sort();
    };
    return {
      topic: K8.topic,
      title: `Mots les plus fréquents ${i + 1}`,
      theory: THEORY_DS,
      statement: `Complétez \`mots_frequents(texte)\` qui renvoie la **liste triée** des mots les plus fréquents du texte (mots séparés par des espaces, split()). Exemple : mots_frequents("${s}") → \`${py(calc(s))}\`.`,
      starterCode: starterFn('def mots_frequents(texte):', [
        'texte.split() découpe en mots',
        'Comptez avec un dictionnaire',
        'Trouvez la fréquence max, puis gardez les mots qui l\'atteignent',
        'Renvoyez la liste triée : sorted(...)',
      ]),
      hints: [
        'compte[m] = compte.get(m, 0) + 1.',
        'fmax = max(compte.values()).',
        'mots = texte.split()\ncompte = {}\nfor m in mots:\n    compte[m] = compte.get(m, 0) + 1\nfmax = max(compte.values())\nreturn sorted([m for m, f in compte.items() if f == fmax])',
      ],
      visibleTests: [{ kind: 'call', fn: 'mots_frequents', args: [s], expect: [calc(s)] }],
      hiddenTests: [{ kind: 'call', fn: 'mots_frequents', args: ['b a b a'], expect: [['a', 'b']] }],
      solution: 'def mots_frequents(texte):\n    mots = texte.split()\n    compte = {}\n    for m in mots:\n        compte[m] = compte.get(m, 0) + 1\n    fmax = max(compte.values())\n    return sorted([m for m, f in compte.items() if f == fmax])',
      tips: [],
    };
  },
};

export const PHASE4: FamSpec[] = [K1, K2, K3, K4, K5, K6, K7, K8];
