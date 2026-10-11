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
    'synthese-bases': { prerequisites: 'Variables, listes, boucles, conditions, chaînes et fonctions.', keyIdea: 'Un problème de synthèse se découpe en opérations simples reliées par une spécification.', method: 'Identifier les données, écrire un invariant pour chaque parcours, puis tester un cas nominal et un cas limite.', pitfalls: 'Mélanger affichage et valeur renvoyée, oublier un cas vide ou coder sans vérifier le type du résultat.' },
  };
  return guides[key] ?? {
    prerequisites: `Les notions précédentes de la phase ${phase} et les opérations de base de Python.`,
    keyIdea: `Le thème « ${topic} » doit être transformé en une procédure précise et testable.`,
    method: 'Reformuler les entrées, la sortie et les cas limites avant d’écrire le code.',
    pitfalls: 'Confondre l’exemple de l’énoncé avec une règle générale ou oublier les cas limites.',
  };
}

function courseCardFor(key: string): { chapter: string; content: string } {
  const cards: Record<string, { chapter: string; content: string }> = {
    variables: { chapter: 'Chapitre 2 — Variables', content: '**Syntaxe minimale :** `nom = valeur`. Une affectation ne compare pas : elle donne un nouveau nom à une valeur.\n\n**Exemple :** `x = 3`, puis `y = x + 2` donne `y == 5`.' },
    operateurs: { chapter: 'Chapitre 2 — Opérations', content: '**À connaître :** `/` produit un flottant, `//` le quotient entier, `%` le reste et `**` une puissance.\n\n**Contrôle :** pour `a = b * (a // b) + a % b`, le quotient et le reste doivent vérifier la division euclidienne.' },
    conversions: { chapter: 'Chapitre 2 — Types et conversions', content: '**Conversions :** `int`, `float` et `str` construisent une valeur d’un autre type. `int(3.9)` tronque ; il n’arrondit pas.\n\n**Réflexe :** avant une opération, identifiez le type de chaque opérande.' },
    fstrings: { chapter: 'Chapitre 3 — Affichage', content: '**Affichage exact :** `print()` ajoute un espace entre ses arguments et un retour à la ligne. Une f-string s’écrit `f"x = {x}"`.\n\n**Pour valider :** comparez aussi la ponctuation, les espaces, les accents et l’ordre des lignes.' },
    'listes-index': { chapter: 'Chapitre 4 — Listes', content: '**Indices :** une liste de longueur `n` possède les indices `0` à `n - 1`. La tranche `L[a:b]` inclut `a` et exclut `b`.\n\n**Exemple :** `L[-1]` est le dernier élément et `L[1:]` enlève le premier.' },
    'listes-methodes': { chapter: 'Chapitre 4 — Opérations sur les listes', content: '**Mutation :** `append`, `extend`, `insert`, `remove` et `sort` modifient la liste. `sorted(L)` crée une nouvelle liste.\n\n**Piège :** la plupart des méthodes de modification renvoient `None`.' },
    'boucles-for': { chapter: 'Chapitre 5 — Boucle `for`', content: '**Parcours :** `for x in L` traite chaque élément ; `for i in range(n)` traite les indices ou les valeurs de `0` à `n - 1`.\n\n**Méthode :** dites ce que représente la variable de boucle avant d’écrire le corps.' },
    conditions: { chapter: 'Chapitre 5 — Comparaisons et tests', content: '**Branchement :** `if` teste le premier cas, `elif` les cas suivants et `else` le cas restant.\n\n**Attention :** `=` affecte, `==` compare ; les blocs sont délimités par l’indentation.' },
    'boucles-while': { chapter: 'Chapitre 5 — Boucle `while`', content: '**Structure :** initialisation, condition, corps, mise à jour.\n\n**Preuve de terminaison :** identifiez la quantité qui se rapproche de la condition d’arrêt. Sans mise à jour, le programme peut boucler indéfiniment.' },
    'dicts-tuples': { chapter: 'Chapitre 8 — Dictionnaires et tuples', content: '**Dictionnaire :** `d[cle]` lit une valeur si la clé existe ; `d.get(cle, defaut)` traite l’absence. Un tuple se construit avec `(...)` et ne se modifie pas.\n\n**Parcours :** `for cle, valeur in d.items()`.' },
    fonctions: { chapter: 'Chapitre 10 — Fonctions', content: '**Contrat :** une fonction reçoit des paramètres et renvoie un résultat avec `return`. `print` affiche mais ne remplace pas `return`.\n\n**Méthode :** spécifiez les entrées, la sortie, puis testez un cas normal et un cas limite.' },
    chaines: { chapter: 'Chapitre 11 — Chaînes de caractères', content: '**Séquence immuable :** une chaîne se parcourt comme une liste de caractères. Utilisez `split`, `join`, `strip`, `replace`, `count` et `in` selon le besoin.\n\n**Piège :** une méthode renvoie une nouvelle chaîne ; elle ne modifie pas la chaîne d’origine.' },
    accumulateurs: { chapter: 'Algorithmique — Accumulateurs', content: '**Invariant :** après `k` tours, l’accumulateur doit résumer exactement les `k` premiers éléments. Initialisez une somme à `0`, un produit à `1` et une construction à `[]`.\n\n**Test :** essayez aussi une liste à un élément et une liste vide si elle est autorisée.' },
    'max-position': { chapter: 'Algorithmique — Recherche', content: '**Recherche d’un extremum :** conservez simultanément la meilleure valeur et sa position. Initialisez avec le premier élément plutôt qu’avec `0`.\n\n**Égalités :** choisissez explicitement si vous gardez la première ou la dernière position.' },
    tris: { chapter: 'Algorithmique — Tris', content: '**Invariant de tri :** une partie du tableau est déjà ordonnée après chaque tour externe.\n\n**Analyse :** deux boucles imbriquées conduisent souvent à une complexité en `O(n²)`.' },
    dichotomie: { chapter: 'Algorithmique — Dichotomie', content: '**Condition préalable :** la liste doit être triée. On maintient un intervalle `[g, d]` contenant la cible et on le réduit à chaque étape.\n\n**Arrêt :** l’intervalle devient vide ou la valeur est trouvée.' },
    recursivite: { chapter: 'Algorithmique — Récursivité', content: '**Deux éléments obligatoires :** un cas de base et un appel sur une instance strictement plus petite.\n\n**Vérification :** la taille du problème doit décroître et le résultat du sous-problème doit être utilisé.' },
    comprehensions: { chapter: 'Listes en compréhension', content: '**Traduction :** commencez par écrire la boucle classique, puis utilisez `[expression for element in sequence if condition]`.\n\n**Lisibilité :** une compréhension trop longue doit rester une boucle explicite.' },
    'numpy-bases': { chapter: 'Calcul scientifique — NumPy', content: '**Array :** `np.array` porte une forme (`shape`) et permet les opérations élément par élément. Préférez la vectorisation aux boucles Python.\n\n**Sortie :** convertissez en liste avec `.tolist()` seulement si le test l’exige.' },
    'numpy-masques': { chapter: 'Calcul scientifique — Masques', content: '**Masque :** `(a > 0) & (a < 1)` construit un tableau booléen. Avec NumPy, utilisez `&` et `|`, jamais `and` et `or` pour comparer des arrays.\n\n**Parenthèses :** entourez chaque comparaison.' },
    suites: { chapter: 'Calcul scientifique — Suites', content: '**Récurrence :** stockez le terme courant `u`, puis appliquez la relation exactement `n` fois.\n\n**Contrôle :** distinguez le terme initial `u₀` du nombre de mises à jour.' },
    integration: { chapter: 'Calcul scientifique — Intégration numérique', content: '**Rectangle :** découpez `[a,b]` en `n` intervalles de largeur `h = (b-a)/n`, puis additionnez les valeurs pondérées par `h`.\n\n**Validation :** testez une fonction constante dont l’intégrale est connue.' },
    zeros: { chapter: 'Calcul scientifique — Recherche de zéro', content: '**Dichotomie :** elle nécessite un changement de signe aux bornes. À chaque étape, gardez le sous-intervalle où le signe change.\n\n**Tolérance :** arrêtez lorsque la largeur de l’intervalle est assez petite.' },
    euler: { chapter: 'Calcul scientifique — Méthode d’Euler', content: '**Schéma :** `y_suivant = y + h * f(t, y)`, puis `t = t + h`. L’ordre des mises à jour compte.\n\n**Convergence :** diminuer `h` permet de comparer la précision.' },
    'synthese-bases': { chapter: 'Méthode CPGE — Synthèse', content: '**Avant de coder :** reformulez les entrées, la sortie et les cas limites. Découpez ensuite en sous-problèmes : parcours, test, construction ou recherche.\n\n**Après le code :** vérifiez un cas simple à la main, puis un cas limite.' },
  };
  return cards[key] ?? { chapter: 'Méthode Python', content: '**Démarche :** identifier les données, la sortie attendue et les cas limites avant de choisir les instructions.' };
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
  const card = courseCardFor(key);
  const algorithmicExtension = phase === 2 || phase === 4 ? `

### Réflexe algorithmique
1. **Spécification :** notez les entrées, la sortie et les contraintes.
2. **Invariant :** formulez ce qui est vrai après chaque tour de boucle ou appel récursif.
3. **Terminaison :** identifiez la quantité entière qui diminue ou l’intervalle qui rétrécit.
4. **Complexité :** comptez les parcours ; une boucle imbriquée est souvent en \`O(n²)\`, un parcours simple en \`O(n)\`.
5. **Validation :** testez une taille minimale, un cas régulier et un cas limite.` : '';
  return `${theory}${algorithmicExtension}

### Cours essentiel
**Repère :** ${card.chapter}

${card.content}

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
    'synthese-bases': ['synthèse', 'cas limites'],
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
