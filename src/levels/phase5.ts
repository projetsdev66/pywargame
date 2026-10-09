// Phase 5 — Compléments Python pour la MPSI (20 niveaux)
import type { FamSpec } from './util';
import { ri, py, starterFn } from './util';

const THEORY_EXCEPTIONS = `## Gérer les erreurs avec les exceptions
Une erreur d’exécution peut être traitée avec \`try/except\` :
\`\`\`
try:
    valeur = int(texte)
except ValueError:
    valeur = 0
\`\`\`
Le bloc \`try\` contient l’opération risquée ; \`except\` indique le comportement de secours. On attrape de préférence une exception précise, comme \`ValueError\`, plutôt que \`Exception\` sans distinction.`;

const M1: FamSpec = {
  key: 'exceptions',
  topic: 'Exceptions et validation',
  count: 5,
  gen: (r, i) => {
    const divisor = ri(r, 2, 9);
    const fallback = ri(r, -9, 9);
    const values = [`${ri(r, 10, 80)}`, 'abc', `${ri(r, 10, 80)}`];
    if (i % 2 === 0) return {
      topic: M1.topic, title: `Division sûre ${i + 1}`, theory: THEORY_EXCEPTIONS,
      statement: `Complétez \`division_sure(a, b)\` : renvoyez \`a / b\`, mais renvoyez \`None\` si \`b\` vaut zéro. Exemple : division_sure(12, ${divisor}) ≈ ${12 / divisor}.`,
      starterCode: starterFn('def division_sure(a, b):', ['Placez la division dans un bloc try', 'Interceptez ZeroDivisionError', 'Renvoyez None en cas de division impossible']),
      hints: ['Le cas à intercepter est ZeroDivisionError.', 'Le return du cas normal se place dans try.', 'try:\n    return a / b\nexcept ZeroDivisionError:\n    return None'],
      visibleTests: [{ kind: 'call', fn: 'division_sure', args: [12, divisor], expect: [12 / divisor], tol: 1e-12 }],
      hiddenTests: [{ kind: 'call', fn: 'division_sure', args: [5, 0], expect: [null] }],
      solution: 'def division_sure(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None', tips: [],
    };
    return {
      topic: M1.topic, title: `Conversion tolérante ${i + 1}`, theory: THEORY_EXCEPTIONS,
      statement: `Complétez \`entier_ou(texte, secours)\` : convertissez \`texte\` en entier, ou renvoyez \`secours\` si la conversion échoue. Exemple : entier_ou("${values[0]}", ${fallback}) → ${Number(values[0])}.`,
      starterCode: starterFn('def entier_ou(texte, secours):', ['Essayez int(texte) dans try', 'Interceptez ValueError', 'Renvoyez secours si texte ne représente pas un entier']),
      hints: ['int() lève ValueError pour un texte invalide.', 'Ne confondez pas la valeur secours et le texte.', 'try:\n    return int(texte)\nexcept ValueError:\n    return secours'],
      visibleTests: [{ kind: 'call', fn: 'entier_ou', args: [values[0], fallback], expect: [Number(values[0])] }],
      hiddenTests: [{ kind: 'call', fn: 'entier_ou', args: ['abc', fallback], expect: [fallback] }],
      solution: 'def entier_ou(texte, secours):\n    try:\n        return int(texte)\n    except ValueError:\n        return secours', tips: [],
    };
  },
};

const THEORY_MODULES = `## Modules et expressions régulières
Un module regroupe des outils importables. Le module \`re\` décrit des motifs textuels :
\`\`\`
import re
nombres = re.findall(r"-?\\\\d+", texte)
\`\`\`
\`findall\` renvoie toutes les sous-chaînes qui correspondent au motif. Le préfixe \`r\` rend les antislashs plus lisibles.`;
const M2: FamSpec = {
  key: 'modules-regex', topic: 'Modules et expressions régulières', count: 5,
  gen: (_r, i) => {
    if (i % 2 === 0) return {
      topic: M2.topic, title: `Extraire des entiers ${i + 1}`, theory: THEORY_MODULES,
      statement: `Complétez \`extraire_entiers(texte)\` : renvoyez la liste des entiers signés trouvés dans le texte. Exemple : extraire_entiers("temp=-3 puis 42") → [-3, 42].`,
      starterCode: starterFn('def extraire_entiers(texte):', ['Importez re', 'Trouvez les motifs -?\\\\d+', 'Convertissez chaque résultat en int']),
      hints: ['re.findall renvoie des chaînes.', 'Utilisez une compréhension de liste.', 'import re\nreturn [int(x) for x in re.findall(r"-?\\d+", texte)]'],
      visibleTests: [{ kind: 'call', fn: 'extraire_entiers', args: ['temp=-3 puis 42'], expect: [[-3, 42]] }],
      hiddenTests: [{ kind: 'call', fn: 'extraire_entiers', args: ['aucun nombre'], expect: [[]] }],
      solution: 'import re\n\ndef extraire_entiers(texte):\n    return [int(x) for x in re.findall(r"-?\\d+", texte)]', tips: [],
    };
    const prefix = i % 3 === 1 ? 'Py' : 'py';
    return {
      topic: M2.topic, title: `Motif dans une chaîne ${i + 1}`, theory: THEORY_MODULES,
      statement: `Complétez \`contient_prefixe(texte)\` : renvoyez True si le texte contient un mot qui commence par « ${prefix} », sans tenir compte de la casse.`,
      starterCode: starterFn('def contient_prefixe(texte):', ['Importez re', 'Utilisez re.search avec re.IGNORECASE', 'Renvoyez un booléen']),
      hints: [`Le motif peut être r"\\b${prefix.toLowerCase()}\\w*".`, 're.search renvoie un objet ou None.', `return re.search(r"\\b${prefix.toLowerCase()}\\w*", texte, re.IGNORECASE) is not None`],
      visibleTests: [{ kind: 'call', fn: 'contient_prefixe', args: ['Un langage Python'], expect: [true] }],
      hiddenTests: [{ kind: 'call', fn: 'contient_prefixe', args: ['un langage ruby'], expect: [false] }],
      solution: `import re\n\ndef contient_prefixe(texte):\n    return re.search(r"\\b${prefix.toLowerCase()}\\w*", texte, re.IGNORECASE) is not None`, tips: [],
    };
  },
};

const THEORY_CLASSES = `## Classes et objets
Une classe décrit des objets qui partagent des attributs et des méthodes. \`__init__\` initialise l’instance et \`self\` désigne l’objet courant :
\`\`\`
class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur
    def aire(self):
        return self.largeur * self.hauteur
\`\`\`
Une méthode se définit comme une fonction dont le premier paramètre est \`self\`.`;
const M3: FamSpec = {
  key: 'classes', topic: 'Classes et objets', count: 5,
  gen: (r, i) => {
    const a = ri(r, 2, 12), b = ri(r, 2, 12);
    if (i % 2 === 0) return {
      topic: M3.topic, title: `Objet rectangle ${i + 1}`, theory: THEORY_CLASSES,
      statement: `Définissez une classe \`Rectangle\` puis complétez \`aire_rectangle(largeur, hauteur)\` qui instancie la classe et renvoie son aire. Exemple : aire_rectangle(${a}, ${b}) → ${a * b}.`,
      starterCode: starterFn('def aire_rectangle(largeur, hauteur):', ['Définissez la classe Rectangle avant la fonction', 'Ajoutez __init__ et stockez largeur et hauteur', 'Ajoutez une méthode aire puis utilisez-la']),
      hints: ['Une classe se définit avec class Rectangle:.', 'La méthode reçoit self.', 'class Rectangle:\n    def __init__(self, largeur, hauteur):\n        self.largeur = largeur\n        self.hauteur = hauteur\n    def aire(self):\n        return self.largeur * self.hauteur\nreturn Rectangle(largeur, hauteur).aire()'],
      visibleTests: [{ kind: 'call', fn: 'aire_rectangle', args: [a, b], expect: [a * b] }],
      hiddenTests: [{ kind: 'call', fn: 'aire_rectangle', args: [3, 7], expect: [21] }],
      solution: 'class Rectangle:\n    def __init__(self, largeur, hauteur):\n        self.largeur = largeur\n        self.hauteur = hauteur\n    def aire(self):\n        return self.largeur * self.hauteur\n\ndef aire_rectangle(largeur, hauteur):\n    return Rectangle(largeur, hauteur).aire()', tips: [],
    };
    return {
      topic: M3.topic, title: `Objet compteur ${i + 1}`, theory: THEORY_CLASSES,
      statement: `Créez une classe \`Compteur\` avec un attribut \`valeur\`, une méthode \`avance\` qui ajoute 1, puis complétez \`compter(n)\` pour renvoyer la valeur après n avances.`,
      starterCode: starterFn('def compter(n):', ['Définissez Compteur avec valeur initialisée à 0', 'La méthode avance modifie self.valeur', 'Créez un compteur, faites n avances, puis renvoyez sa valeur']),
      hints: ['Une méthode qui modifie l’objet utilise self.valeur += 1.', 'Répétez l’appel avec une boucle for.', 'class Compteur:\n    def __init__(self): self.valeur = 0\n    def avance(self): self.valeur += 1\nc = Compteur()\nfor _ in range(n): c.avance()\nreturn c.valeur'],
      visibleTests: [{ kind: 'call', fn: 'compter', args: [a], expect: [a] }],
      hiddenTests: [{ kind: 'call', fn: 'compter', args: [0], expect: [0] }],
      solution: 'class Compteur:\n    def __init__(self):\n        self.valeur = 0\n    def avance(self):\n        self.valeur += 1\n\ndef compter(n):\n    c = Compteur()\n    for _ in range(n):\n        c.avance()\n    return c.valeur', tips: [],
    };
  },
};

const THEORY_GENERATORS = `## Générateurs et itérables
Une fonction contenant \`yield\` produit ses valeurs une par une. Elle renvoie un générateur, utile pour éviter de construire une grande liste en mémoire :
\`\`\`
def carres(n):
    for k in range(n):
        yield k * k
\`\`\`
On peut ensuite le parcourir avec \`for\` ou le convertir avec \`list(carres(n))\`.`;
const M4: FamSpec = {
  key: 'generateurs', topic: 'Générateurs et itérables', count: 5,
  gen: (_r, i) => {
    const n = 4 + i;
    if (i % 2 === 0) return {
      topic: M4.topic, title: `Générateur de carrés ${i + 1}`, theory: THEORY_GENERATORS,
      statement: `Complétez \`liste_carres(n)\` en utilisant un générateur avec \`yield\` pour renvoyer les carrés de 0 à n-1 sous forme de liste. Attendu pour n=${n} : ${py(Array.from({ length: n }, (_, k) => k * k))}.`,
      starterCode: starterFn('def liste_carres(n):', ['Écrivez un générateur carres avec yield', 'Parcourez range(n)', 'Convertissez le générateur en liste']),
      hints: ['yield suspend une fonction et produit une valeur.', 'Le générateur peut être une fonction locale.', 'def carres(n):\n    for k in range(n):\n        yield k * k\nreturn list(carres(n))'],
      visibleTests: [{ kind: 'call', fn: 'liste_carres', args: [n], expect: [Array.from({ length: n }, (_, k) => k * k)] }],
      hiddenTests: [{ kind: 'call', fn: 'liste_carres', args: [0], expect: [[]] }],
      solution: 'def liste_carres(n):\n    def carres():\n        for k in range(n):\n            yield k * k\n    return list(carres())', tips: [],
    };
    return {
      topic: M4.topic, title: `Sommes progressives ${i + 1}`, theory: THEORY_GENERATORS,
      statement: `Complétez \`sommes_progressives(L)\` avec un générateur : renvoyez les sommes cumulées des éléments de L. Exemple : [2, 5, 1] → [2, 7, 8].`,
      starterCode: starterFn('def sommes_progressives(L):', ['Accumulez une somme total', 'Produisez chaque total avec yield', 'Renvoyez une liste construite à partir du générateur']),
      hints: ['La somme cumulée est conservée entre deux yield.', 'Ajoutez x à total avant de produire total.', 'def cumul(L):\n    total = 0\n    for x in L:\n        total += x\n        yield total\nreturn list(cumul(L))'],
      visibleTests: [{ kind: 'call', fn: 'sommes_progressives', args: [[2, 5, 1]], expect: [[2, 7, 8]] }],
      hiddenTests: [{ kind: 'call', fn: 'sommes_progressives', args: [[],], expect: [[]] }],
      solution: 'def sommes_progressives(L):\n    def cumul():\n        total = 0\n        for x in L:\n            total += x\n            yield total\n    return list(cumul())', tips: [],
    };
  },
};

export const PHASE5: FamSpec[] = [M1, M2, M3, M4];
