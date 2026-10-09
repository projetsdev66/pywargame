// Utilitaires pour les générateurs de niveaux : hasard reproductible, formatage Python.
import type { Level } from '@/types/level';

export type RNG = () => number;

// Générateur pseudo-aléatoire déterministe (mulberry32) : les niveaux sont
// identiques à chaque chargement, sans stockage externe.
export function makeRng(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ri = (r: RNG, min: number, max: number) => min + Math.floor(r() * (max - min + 1));
export const pick = <T,>(r: RNG, arr: T[]): T => arr[Math.floor(r() * arr.length)];
export const intArr = (r: RNG, n: number, min: number, max: number) =>
  Array.from({ length: n }, () => ri(r, min, max));

// Représentation Python d'une valeur JS (pour les énoncés et les corrections)
export function py(v: any): string {
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(v)) return `[${v.map(py).join(', ')}]`;
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (v === null) return 'None';
  if (v && typeof v === 'object')
    return `{${Object.entries(v).map(([k, x]) => `${py(k)}: ${py(x)}`).join(', ')}}`;
  return String(v);
}

export interface FamSpec {
  key: string;
  topic: string;
  count: number;
  gen: (r: RNG, i: number) => Omit<Level, 'id' | 'phase' | 'phaseName'>;
}

// Complément commun injecté dans chaque fiche : il harmonise les 540 cours
// sans modifier les exercices générés ni révéler directement leur solution.
interface TheoryGuide {
  prerequisites: string;
  keyIdea: string;
  method: string;
  pitfalls: string;
}

function guideFor(key: string, phase: number, topic: string): TheoryGuide {
  const guides: Record<string, TheoryGuide> = {
    variables: { prerequisites: 'Aucune : on manipule des valeurs et des noms.', keyIdea: 'Une affectation lie un nom à une valeur ; elle ne compare pas deux valeurs.', method: 'Écrire les affectations dans l’ordre, puis calculer l’expression en respectant les priorités.', pitfalls: 'Réutiliser un ancien nom ou confondre `=` avec `==`.' },
    operateurs: { prerequisites: 'Variables et expressions arithmétiques.', keyIdea: '`//` donne le quotient entier, `%` le reste et `**` la puissance.', method: 'Identifier l’opération demandée et vérifier le résultat avec la division euclidienne.', pitfalls: 'Confondre `/` et `//`, surtout parce que `/` produit un flottant.' },
    conversions: { prerequisites: 'Types `int`, `float`, `str` et `bool`.', keyIdea: 'Le type détermine les opérations disponibles ; une conversion crée une nouvelle valeur.', method: 'Repérer le type reçu, choisir le constructeur adapté, puis vérifier le type renvoyé.', pitfalls: 'Additionner du texte comme des nombres ou croire que `int` arrondit un flottant.' },
    fstrings: { prerequisites: 'Chaînes, variables et fonctions.', keyIdea: 'Une f-string évalue les expressions entre accolades au moment de construire le texte.', method: 'Écrire d’abord le texte fixe, puis insérer chaque variable exactement à sa place.', pitfalls: 'Oublier le préfixe `f`, une accolade ou un espace demandé par l’énoncé.' },
    'listes-index': { prerequisites: 'Listes et entiers.', keyIdea: 'Le premier indice est 0 et une tranche exclut sa borne droite.', method: 'Écrire les indices valides avant de coder ; tester le premier et le dernier élément.', pitfalls: 'Utiliser `len(L)` comme indice ou oublier que `L[a:b]` s’arrête avant `b`.' },
    'listes-methodes': { prerequisites: 'Listes et boucles.', keyIdea: 'Certaines méthodes modifient la liste (`append`, `sort`) et renvoient `None`.', method: 'Décider si l’on veut modifier la liste ou construire une nouvelle liste.', pitfalls: 'Écrire `L = L.append(x)` ou utiliser `sort()` quand une copie est attendue.' },
    'boucles-for': { prerequisites: 'Listes, `range` et conditions.', keyIdea: '`for` parcourt une collection ou une suite de valeurs, une fois par élément.', method: 'Décrire ce que représente la variable de boucle à chaque tour et initialiser l’accumulateur.', pitfalls: 'Mauvaise borne de `range`, modification dangereuse de la liste parcourue.' },
    'boucles-while': { prerequisites: 'Conditions booléennes et affectations.', keyIdea: 'Une boucle `while` doit faire progresser une quantité vers une condition d’arrêt.', method: 'Écrire la condition, l’initialisation, puis la mise à jour qui garantit la terminaison.', pitfalls: 'Oublier la mise à jour et créer une boucle infinie.' },
    conditions: { prerequisites: 'Comparaisons et booléens.', keyIdea: '`if`, `elif`, `else` choisissent un seul chemin parmi plusieurs.', method: 'Ordonner les cas du plus spécifique au plus général et couvrir le cas restant.', pitfalls: 'Conditions qui se recouvrent, égalité oubliée ou indentation incorrecte.' },
    chaines: { prerequisites: 'Types, indices et boucles.', keyIdea: 'Une chaîne est une séquence immuable de caractères.', method: 'Utiliser les méthodes adaptées (`split`, `strip`, `count`, `replace`) avant une boucle manuelle.', pitfalls: 'Croire qu’une méthode modifie la chaîne ou confondre caractère et sous-chaîne.' },
    fonctions: { prerequisites: 'Variables, blocs indentés et `return`.', keyIdea: 'Une fonction reçoit des paramètres et renvoie une valeur indépendante de l’affichage.', method: 'Définir les entrées, le résultat attendu, puis un chemin de retour pour chaque cas.', pitfalls: 'Oublier `return`, modifier une variable extérieure ou mélanger affichage et résultat.' },
    'dicts-tuples': { prerequisites: 'Séquences, clés et valeurs.', keyIdea: 'Un dictionnaire associe des clés uniques à des valeurs ; un tuple est une séquence immuable.', method: 'Choisir une clé qui identifie naturellement l’information et traiter l’absence avec `get` si nécessaire.', pitfalls: 'Accéder à une clé absente ou utiliser une liste comme clé.' },
    accumulateurs: { prerequisites: 'Boucles `for`, conditions et valeurs initiales.', keyIdea: 'Un accumulateur résume les éléments déjà parcourus.', method: 'Formuler l’invariant : après k tours, que contient exactement l’accumulateur ?', pitfalls: 'Mauvaise valeur initiale : 0 pour une somme, 1 pour un produit, liste vide pour une construction.' },
    'max-position': { prerequisites: 'Indices, parcours et comparaisons.', keyIdea: 'On conserve le meilleur candidat et son indice, pas seulement la valeur.', method: 'Initialiser avec le premier élément puis comparer chaque élément restant.', pitfalls: 'Initialiser à 0, oublier les égalités ou supposer que la liste est non vide sans le préciser.' },
    tris: { prerequisites: 'Boucles imbriquées, indices et échanges.', keyIdea: 'Un tri maintient une partie déjà ordonnée et réduit la partie restante.', method: 'Définir l’invariant de la boucle externe et compter les comparaisons.', pitfalls: 'Mauvaise borne interne, échange incomplet ou oubli du retour de la liste.' },
    dichotomie: { prerequisites: 'Listes triées, indices et conditions.', keyIdea: 'La recherche dichotomique élimine la moitié des candidats à chaque étape.', method: 'Maintenir l’intervalle où la cible peut encore se trouver et prouver sa réduction.', pitfalls: 'Appliquer l’algorithme à une liste non triée ou boucler avec des bornes inchangées.' },
    recursivite: { prerequisites: 'Fonctions, conditions et raisonnement par taille.', keyIdea: 'Toute récursion doit avoir un cas de base et un appel sur un problème strictement plus petit.', method: 'Écrire d’abord le cas de base, puis vérifier la décroissance de la taille.', pitfalls: 'Absence de cas de base, progression insuffisante ou double comptage.' },
    'piles-files': { prerequisites: 'Listes et méthodes `append`/`pop`.', keyIdea: 'Une pile est LIFO ; une file est FIFO.', method: 'Choisir l’extrémité d’ajout et de retrait, puis simuler deux opérations à la main.', pitfalls: 'Inverser FIFO et LIFO ou retirer au mauvais indice.' },
    comprehensions: { prerequisites: 'Boucles, conditions et listes.', keyIdea: 'Une compréhension condense une construction régulière sans cacher sa logique.', method: 'Écrire d’abord la boucle classique, puis la traduire en compréhension.', pitfalls: 'Rendre l’expression illisible ou placer le filtre au mauvais endroit.' },
    'double-boucle': { prerequisites: 'Boucles simples et invariants.', keyIdea: 'Une boucle imbriquée traite souvent chaque paire ou chaque case d’une structure.', method: 'Compter séparément les tours externes et internes ; identifier les doublons éventuels.', pitfalls: 'Confondre indices de ligne et de colonne, ou compter deux fois une paire.' },
    'numpy-bases': { prerequisites: 'Listes, indices et opérations numériques.', keyIdea: 'Un array NumPy porte une forme et applique les opérations élément par élément.', method: 'Contrôler `shape`, choisir le type, vectoriser, puis convertir en liste seulement à la sortie.', pitfalls: 'Confondre liste et array, oublier `.tolist()` ou utiliser une mauvaise dimension.' },
    'numpy-masques': { prerequisites: 'Arrays, comparaisons et booléens.', keyIdea: 'Un masque booléen sélectionne les cases vraies sans boucle Python.', method: 'Construire le masque, l’appliquer, puis convertir le résultat ou agréger avec `sum`, `mean`.', pitfalls: 'Utiliser `and`/`or` au lieu de `&`/`|`, ou oublier les parenthèses autour des comparaisons.' },
    suites: { prerequisites: 'Boucles, récurrence et accumulateurs.', keyIdea: 'Une suite définie par récurrence se calcule en conservant son terme courant.', method: 'Initialiser `u` à u₀ et appliquer exactement n mises à jour.', pitfalls: 'Faire n+1 itérations ou utiliser la nouvelle valeur au mauvais moment.' },
    integration: { prerequisites: 'Fonctions, intervalles et sommes.', keyIdea: 'Une intégrale numérique approxime une aire par une somme pondérée.', method: 'Découper l’intervalle, calculer le pas h, puis contrôler l’erreur sur un cas connu.', pitfalls: 'Confondre nombre de points et nombre de rectangles, ou oublier le facteur h.' },
    zeros: { prerequisites: 'Fonctions, intervalles et dichotomie.', keyIdea: 'La dichotomie conserve un changement de signe et divise l’intervalle par deux.', method: 'Vérifier f(a)f(b) ≤ 0, choisir le sous-intervalle pertinent et fixer une tolérance.', pitfalls: 'Utiliser une fonction sans changement de signe ou arrêter sur une largeur mal mesurée.' },
    euler: { prerequisites: 'Suites, fonctions et dérivée.', keyIdea: 'Euler remplace localement la courbe par sa tangente : yₙ₊₁ = yₙ + h f(tₙ,yₙ).', method: 'Mettre à jour t et y dans le bon ordre et comparer avec un pas plus petit.', pitfalls: 'Confondre h et le nombre de pas, ou évaluer f au mauvais point.' },
    courbes: { prerequisites: 'NumPy et tableaux de valeurs.', keyIdea: 'Une courbe numérique est un couple de tableaux de même longueur.', method: 'Construire un axe régulier, appliquer la fonction vectorisée et vérifier les formes.', pitfalls: 'Axes de longueurs différentes ou fonction non vectorisable.' },
  };
  return guides[key] ?? {
    prerequisites: `Les notions précédentes de la phase ${phase} et les opérations de base de Python.`,
    keyIdea: `Le thème « ${topic} » doit être transformé en une procédure précise et testable.`,
    method: 'Reformuler les entrées, la sortie et les cas limites avant d’écrire le code.',
    pitfalls: 'Confondre l’exemple de l’énoncé avec une règle générale ou oublier les cas limites.',
  };
}

export function enrichTheory(theory: string, phase: number, topic: string, key = ''): string {
  const phaseAdvice: Record<number, string> = {
    1: 'Commencez par traduire chaque verbe de l’énoncé en une instruction Python, puis vérifiez les types des valeurs manipulées.',
    2: 'Écrivez l’invariant de la boucle en une phrase : que représente exactement l’accumulateur après chaque tour ?',
    3: 'Identifiez les dimensions, le type numérique et la tolérance attendue avant de calculer ; vérifiez ensuite un petit cas à la main.',
    4: 'Découpez le problème en sous-fonctions ou étapes simples, puis testez séparément un cas nominal et un cas limite.',
    5: 'Repérez l’outil Python demandé, construisez un exemple minimal, puis vérifiez le comportement lorsque l’entrée est vide, invalide ou à la borne.',
  };
  const advice = phaseAdvice[phase] ?? 'Décomposez le problème, testez un exemple simple et vérifiez les cas limites.';
  const guide = guideFor(key, phase, topic);
  const algorithmicExtension = phase === 2 || phase === 4 ? `

### Réflexe algorithmique
1. **Spécification :** notez les entrées, la sortie et les contraintes.
2. **Invariant :** formulez ce qui est vrai après chaque tour de boucle ou appel récursif.
3. **Terminaison :** identifiez la quantité entière qui diminue ou l’intervalle qui rétrécit.
4. **Complexité :** comptez les parcours ; une boucle imbriquée est souvent en \`O(n²)\`, un parcours simple en \`O(n)\`.
5. **Validation :** testez une taille minimale, un cas régulier et un cas limite.` : '';
  return `${theory}${algorithmicExtension}

### Fiche de notion
**Prérequis :** ${guide.prerequisites}

**Idée clé :** ${guide.keyIdea}

**Méthode :** ${guide.method}

**Piège classique :** ${guide.pitfalls}

### Méthode MPSI
**Notion travaillée :** ${topic}. ${advice}

### Points de vigilance
- Distinguez toujours la valeur renvoyée de la valeur affichée avec \`print()\`.
- Vérifiez les bornes : liste vide, premier ou dernier indice, valeur nulle et égalités.
- Préférez une solution lisible avant de chercher à la raccourcir ; le nom des variables doit rendre l’algorithme compréhensible.

### Auto-vérification
  Avant de valider, essayez mentalement un cas simple, un cas limite et un cas qui ne suit pas le chemin principal. Si le résultat est faux, lisez d’abord la première erreur signalée et localisez la ligne concernée.`;
}

export function learningMetadata(key: string, phase: number, index: number, count: number, topic: string) {
  const ranges: Record<number, [number, number]> = { 1: [1, 3], 2: [2, 4], 3: [2, 5], 4: [4, 5], 5: [3, 5] };
  const [minimum, maximum] = ranges[phase] ?? [1, 5];
  const ratio = count <= 1 ? 1 : index / (count - 1);
  const difficulty = Math.min(5, Math.max(1, Math.round(minimum + ratio * (maximum - minimum)))) as 1 | 2 | 3 | 4 | 5;
  const skillMap: Record<string, string[]> = {
    variables: ['affectation', 'expressions'], operateurs: ['arithmétique', 'division euclidienne'], conversions: ['types', 'conversion'],
    fstrings: ['chaînes', 'formatage'], 'listes-index': ['listes', 'indices'], 'listes-methodes': ['listes', 'méthodes'],
    'boucles-for': ['boucles', 'range'], 'boucles-while': ['boucles', 'terminaison'], conditions: ['booléens', 'branchements'],
    chaines: ['chaînes', 'parcours'], fonctions: ['fonctions', 'return'], 'dicts-tuples': ['dictionnaires', 'tuples'],
    accumulateurs: ['parcours', 'invariant'], 'max-position': ['recherche', 'indices'], tris: ['tri', 'complexité'],
    dichotomie: ['recherche', 'complexité logarithmique'], recursivite: ['récursivité', 'preuve'], 'piles-files': ['structures', 'LIFO/FIFO'],
    comprehensions: ['compréhensions', 'filtres'], 'double-boucle': ['boucles imbriquées', 'complexité'],
    'numpy-bases': ['NumPy', 'vectorisation'], 'numpy-masques': ['NumPy', 'masques'], suites: ['suites', 'récurrence'],
    integration: ['intégration', 'approximation'], zeros: ['zéros', 'dichotomie'], euler: ['Euler', 'équations différentielles'], courbes: ['NumPy', 'visualisation'],
  };
  const skills = skillMap[key] ?? [topic];
  const prerequisite = difficulty <= 1 ? 'Aucun prérequis' : difficulty === 2 ? 'Notions précédentes de la famille' : `Niveau ${difficulty - 1} de la famille`;
  return { difficulty, estimatedMinutes: 5 + difficulty * 3, skills, prerequisites: [prerequisite] };
}

// Gabarit de code de départ : uniquement des commentaires + un « pass ».
// L'élève écrit son code lui-même, guidé par les commentaires.
export function starterFn(signature: string, todo: string[]): string {
  const lines = todo.map((t) => `    # ${t}`).join('\n');
  return `${signature}\n    # À vous de jouer ! Complétez le corps de la fonction.\n${lines}\n    # Effacez la ligne « pass » et écrivez votre code.\n    pass\n`;
}

export function starterPrint(todo: string[]): string {
  const lines = todo.map((t) => `# ${t}`).join('\n');
  return `# À vous de jouer ! Écrivez votre programme ci-dessous.\n${lines}\n`;
}
