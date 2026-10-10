// Phase 1 — Les bases de Python (260 niveaux, 12 familles progressives)
import type { FamSpec } from './util';
import { ri, pick, intArr, py, starterFn, starterPrint } from './util';

const THEORY_VAR = `## Variables, types et affectation

Une **variable** est un nom qui désigne une valeur. On crée une variable en lui affectant une valeur avec le signe \`=\` :

\`\`\`
x = 5
nom = "Alice"
\`\`\`

Python devine le type : \`int\` (entier), \`float\` (décimal), \`str\` (texte). On peut faire des calculs entre variables :

\`\`\`
a = 3
b = 4
c = a * b + 2   # c vaut 14
print(c)
\`\`\`

La fonction \`print()\` affiche une valeur à l'écran. Pour observer le type court d'une valeur, utilisez \`type(valeur).__name__\` : \`int\`, \`float\`, \`str\` ou \`bool\`. Le nom d'une variable doit décrire son contenu : préférez \`prix_unitaire\` à \`x\`.`;

const F1: FamSpec = {
  key: 'variables',
  topic: 'Variables, types et applications',
  count: 20,
  gen: (r, i) => {
    const mode = i % 6;
    if (mode === 0) {
      const prix = ri(r, 3, 18), quantite = ri(r, 2, 6), livraison = ri(r, 2, 9);
      const total = prix * quantite + livraison;
      return {
        topic: F1.topic, title: `Budget de commande ${i + 1}`, theory: THEORY_VAR,
        statement: `Une commande contient ${quantite} article(s) à ${prix} € et ${livraison} € de livraison. Créez les variables utiles puis affichez le **total**.`,
        starterCode: starterPrint(['Stockez le prix unitaire, la quantité et la livraison dans trois variables', 'Calculez le prix des articles puis ajoutez la livraison', 'Affichez le total']),
        hints: ['Commencez par donner un nom à chaque donnée.', 'Le prix des articles est prix_unitaire * quantite.', `total = ${prix} * ${quantite} + ${livraison}\nprint(total)`],
        visibleTests: [{ kind: 'stdout', expect: [String(total)] }], hiddenTests: [],
        solution: `prix_unitaire = ${prix}\nquantite = ${quantite}\nlivraison = ${livraison}\ntotal = prix_unitaire * quantite + livraison\nprint(total)`,
        tips: [{ pattern: 'print\\(', advice: 'Donner des noms aux données rend le calcul compréhensible, même lorsqu’il est court.', mode: 'prefer' }],
      };
    }
    if (mode === 1) {
      const longueur = ri(r, 3, 15), largeur = ri(r, 2, 10);
      const attendu = `Aire : ${longueur * largeur}\nPérimètre : ${2 * (longueur + largeur)}`;
      return {
        topic: F1.topic, title: `Plan d’une pièce ${i + 1}`, theory: THEORY_VAR,
        statement: `Une pièce mesure ${longueur} m sur ${largeur} m. Affichez exactement son aire puis son périmètre, sur deux lignes : \`Aire : ...\` et \`Périmètre : ...\`.`,
        starterCode: starterPrint(['Créez longueur et largeur', 'Calculez aire et perimetre dans deux variables', 'Affichez les deux résultats avec print()']),
        hints: ['L’aire est longueur * largeur ; le périmètre fait deux fois la somme.', 'Pour écrire du texte et une valeur, print("Aire :", aire) ajoute un espace.', `longueur = ${longueur}\nlargeur = ${largeur}\nprint("Aire :", longueur * largeur)\nprint("Périmètre :", 2 * (longueur + largeur))`],
        visibleTests: [{ kind: 'stdout', expect: [attendu] }], hiddenTests: [],
        solution: `longueur = ${longueur}\nlargeur = ${largeur}\naire = longueur * largeur\nperimetre = 2 * (longueur + largeur)\nprint("Aire :", aire)\nprint("Périmètre :", perimetre)`, tips: [],
      };
    }
    if (mode === 2) {
      const entier = ri(r, 2, 40), decimal = ri(r, 12, 98) / 10, texte = pick(r, ['Python', 'MPSI', 'algorithme']);
      return {
        topic: F1.topic, title: `Identifier les types ${i + 1}`, theory: THEORY_VAR,
        statement: `Créez quatre variables : un entier (${entier}), un nombre décimal (${decimal}), le texte \`${texte}\` et le booléen \`True\`. Affichez leur type, un par ligne, avec le nom court du type : \`int\`, \`float\`, \`str\`, \`bool\`.`,
        starterCode: starterPrint(['Créez les quatre variables demandées', 'Utilisez type(valeur).__name__ pour obtenir le nom court', 'Affichez les quatre noms de types dans l’ordre']),
        hints: ['Les types étudiés dans le cours sont int, float, str et bool.', 'type(x).__name__ renvoie par exemple "int", sans le texte <class ...>.', `entier = ${entier}\ndecimal = ${decimal}\ntexte = "${texte}"\nbooleen = True\nprint(type(entier).__name__)\nprint(type(decimal).__name__)\nprint(type(texte).__name__)\nprint(type(booleen).__name__)`],
        visibleTests: [{ kind: 'stdout', expect: ['int\nfloat\nstr\nbool'] }], hiddenTests: [],
        solution: `entier = ${entier}\ndecimal = ${decimal}\ntexte = "${texte}"\nbooleen = True\nprint(type(entier).__name__)\nprint(type(decimal).__name__)\nprint(type(texte).__name__)\nprint(type(booleen).__name__)`, tips: [],
      };
    }
    if (mode === 3) {
      const prenom = pick(r, ['Alice', 'Malik', 'Zoé', 'Hugo']), age = ri(r, 12, 25);
      return {
        topic: F1.topic, title: `Carte de présentation ${i + 1}`, theory: THEORY_VAR,
        statement: `Créez les variables \`prenom\` et \`age\`, puis affichez : \`Prénom : ${prenom} | Âge : ${age}\`.`,
        starterCode: starterPrint(['Créez une variable texte prenom', 'Créez une variable entière age', 'Assemblez le message avec print()']),
        hints: ['Une variable texte s’écrit entre guillemets.', 'print accepte plusieurs valeurs séparées par des virgules.', `prenom = "${prenom}"\nage = ${age}\nprint("Prénom :", prenom, "| Âge :", age)`],
        visibleTests: [{ kind: 'stdout', expect: [`Prénom : ${prenom} | Âge : ${age}`] }], hiddenTests: [],
        solution: `prenom = "${prenom}"\nage = ${age}\nprint("Prénom :", prenom, "| Âge :", age)`, tips: [],
      };
    }
    if (mode === 4) {
      const minutes = ri(r, 70, 320), heures = Math.floor(minutes / 60), reste = minutes % 60;
      return {
        topic: F1.topic, title: `Durée d’un trajet ${i + 1}`, theory: THEORY_VAR,
        statement: `Un trajet dure ${minutes} minutes. Affichez sa durée en minutes et secondes symboliques sous la forme : \`${heures} h ${reste} min\`.`,
        starterCode: starterPrint(['Stockez la durée totale', 'Calculez les heures entières et les minutes restantes', 'Affichez le résultat avec print()']),
        hints: ['Une heure contient 60 minutes.', 'Le quotient entier et le reste seront utiles : minutes // 60 et minutes % 60.', `duree = ${minutes}\nprint(duree // 60, "h", duree % 60, "min")`],
        visibleTests: [{ kind: 'stdout', expect: [`${heures} h ${reste} min`] }], hiddenTests: [],
        solution: `duree = ${minutes}\nheures = duree // 60\nminutes_restantes = duree % 60\nprint(heures, "h", minutes_restantes, "min")`, tips: [],
      };
    }
    const note1 = ri(r, 8, 18), note2 = ri(r, 8, 18), coefficient = ri(r, 2, 5);
    const moyenneArrondie = Math.round(((note1 + coefficient * note2) / (1 + coefficient)) * 100) / 100;
    return {
      topic: F1.topic, title: `Moyenne pondérée ${i + 1}`, theory: THEORY_VAR,
      statement: `Deux notes valent ${note1} et ${note2}, la seconde ayant un coefficient ${coefficient}. Affichez la moyenne pondérée arrondie à deux décimales.`,
      starterCode: starterPrint(['Créez les trois variables numériques', 'Calculez (note1 + coefficient * note2) / (1 + coefficient)', 'Utilisez round(resultat, 2) puis print()']),
      hints: ['Le coefficient augmente le poids de la seconde note.', 'Le dénominateur est la somme des coefficients.', `moyenne = (${note1} + ${coefficient} * ${note2}) / (1 + ${coefficient})\nprint(round(moyenne, 2))`],
      visibleTests: [{ kind: 'stdout', expect: [Number.isInteger(moyenneArrondie) ? `${moyenneArrondie}.0` : String(moyenneArrondie)] }], hiddenTests: [],
      solution: `note1 = ${note1}\nnote2 = ${note2}\ncoefficient = ${coefficient}\nmoyenne = (note1 + coefficient * note2) / (1 + coefficient)\nprint(round(moyenne, 2))`, tips: [],
    };
  },
};

const THEORY_OP = `## Opérateurs arithmétiques

En plus de \`+\`, \`-\`, \`*\`, \`/\`, Python propose :

- \`//\` : **division entière** (quotient) → \`17 // 5\` donne \`3\`
- \`%\` : **modulo** (reste de la division) → \`17 % 5\` donne \`2\`
- \`**\` : **puissance** → \`2 ** 10\` donne \`1024\`

Attention : \`/\` donne toujours un \`float\` (même \`6 / 3\` donne \`2.0\`).`;

const F2: FamSpec = {
  key: 'operateurs',
  topic: 'Opérateurs //, %, **',
  count: 20,
  gen: (r, i) => {
    const mode = i % 5;
    if (mode === 0) {
      const objets = ri(r, 23, 180), carton = ri(r, 4, 12), boites = Math.floor(objets / carton), reste = objets % carton;
      const attendu = `Boîtes pleines : ${boites}\nObjets restants : ${reste}`;
      return { topic: F2.topic, title: `Cartons à remplir ${i + 1}`, theory: THEORY_OP,
        statement: `Il faut ranger ${objets} objets dans des cartons de ${carton}. Affichez le nombre de cartons pleins puis le nombre d’objets restants.`,
        starterCode: starterPrint(['Stockez le nombre d’objets et la capacité d’un carton', 'Utilisez // pour les cartons pleins et % pour le reste', 'Affichez les deux résultats']),
        hints: ['La division entière donne le nombre de groupes complets.', 'Le reste donne les objets qui ne remplissent pas un carton.', `print("Boîtes pleines :", ${objets} // ${carton})\nprint("Objets restants :", ${objets} % ${carton})`],
        visibleTests: [{ kind: 'stdout', expect: [attendu] }], hiddenTests: [],
        solution: `objets = ${objets}\ncapacite = ${carton}\nprint("Boîtes pleines :", objets // capacite)\nprint("Objets restants :", objets % capacite)`, tips: [] };
    }
    if (mode === 1) {
      const participants = ri(r, 28, 160), groupe = ri(r, 4, 9), groupes = Math.floor(participants / groupe), reste = participants % groupe;
      const attendu = `${groupes} groupes complets, ${reste} personne(s) seule(s)`;
      return { topic: F2.topic, title: `Répartir un groupe ${i + 1}`, theory: THEORY_OP,
        statement: `Répartissez ${participants} participants par groupes de ${groupe}. Affichez : \`${attendu}\` (avec les nombres calculés).`,
        starterCode: starterPrint(['Calculez le nombre de groupes complets', 'Calculez le nombre de personnes restantes', 'Utilisez print() avec plusieurs valeurs']),
        hints: ['Le quotient entier correspond aux groupes complets.', 'Le reste correspond aux personnes non regroupées.', `print(${participants} // ${groupe}, "groupes complets,", ${participants} % ${groupe}, "personne(s) seule(s)")`],
        visibleTests: [{ kind: 'stdout', expect: [attendu] }], hiddenTests: [],
        solution: `participants = ${participants}\ntaille = ${groupe}\ngroupes = participants // taille\nseules = participants % taille\nprint(groupes, "groupes complets,", seules, "personne(s) seule(s)")`, tips: [] };
    }
    if (mode === 2) {
      const cote = ri(r, 3, 12), dalles = cote ** 2;
      return { topic: F2.topic, title: `Dallage carré ${i + 1}`, theory: THEORY_OP,
        statement: `Un sol carré possède ${cote} dalles sur chaque côté. Affichez le nombre total de dalles en utilisant une puissance.`,
        starterCode: starterPrint(['Stockez le nombre de dalles sur un côté', 'Un carré de côté c contient c ** 2 dalles', 'Affichez le résultat']),
        hints: ['Une puissance se note avec deux étoiles.', 'Le nombre total est côté multiplié par lui-même.', `cote = ${cote}\nprint(cote ** 2)`],
        visibleTests: [{ kind: 'stdout', expect: [String(dalles)] }], hiddenTests: [], solution: `cote = ${cote}\nprint(cote ** 2)`, tips: [] };
    }
    if (mode === 3) {
      const n = ri(r, 2, 6), cubes = n ** 3;
      return { topic: F2.topic, title: `Volume d’un cube ${i + 1}`, theory: THEORY_OP,
        statement: `Un cube mesure ${n} unités sur chaque arête. Affichez son volume avec l’opérateur de puissance.`,
        starterCode: starterPrint(['Créez la variable arete', 'Le volume d’un cube est arete ** 3', 'Affichez le volume']),
        hints: ['Le volume multiplie trois fois la longueur.', 'L’exposant 3 représente les trois dimensions.', `arete = ${n}\nprint(arete ** 3)`],
        visibleTests: [{ kind: 'stdout', expect: [String(cubes)] }], hiddenTests: [], solution: `arete = ${n}\nprint(arete ** 3)`, tips: [] };
    }
    const nombre = ri(r, 120, 999), dizaines = Math.floor(nombre / 10) % 10, unite = nombre % 10;
    const attendu = `Dizaines : ${dizaines}\nUnités : ${unite}`;
    return { topic: F2.topic, title: `Extraire les chiffres ${i + 1}`, theory: THEORY_OP,
      statement: `Pour le nombre ${nombre}, affichez le chiffre des dizaines puis celui des unités.`,
      starterCode: starterPrint(['Le chiffre des unités est le reste de la division par 10', 'Pour les dizaines, supprimez d’abord les unités avec // 10', 'Affichez les deux chiffres']),
      hints: ['Les unités sont nombre % 10.', 'Les dizaines sont (nombre // 10) % 10.', `print("Dizaines :", (${nombre} // 10) % 10)\nprint("Unités :", ${nombre} % 10)`],
      visibleTests: [{ kind: 'stdout', expect: [attendu] }], hiddenTests: [], solution: `nombre = ${nombre}\nprint("Dizaines :", (nombre // 10) % 10)\nprint("Unités :", nombre % 10)`, tips: [] };
  },
};

const THEORY_CONV = `## Types et conversions

Chaque valeur a un **type** : \`int\`, \`float\`, \`str\`, \`bool\`. La fonction \`type()\` l'affiche.

On convertit avec les fonctions portant le nom du type :

\`\`\`
int("42")     # 42 (entier)
float("3.14") # 3.14 (décimal)
str(7)        # "7" (texte)
int(3.99)     # 3 (troncature !)
\`\`\`

Piège classique : \`"3" + "4"\` donne \`"34"\` (concaténation), alors que \`int("3") + int("4")\` donne \`7\`.`;

const F3: FamSpec = {
  key: 'conversions',
  topic: 'Types et conversions',
  count: 20,
  gen: (r, i) => {
    const mode = i % 3;
    if (mode === 0) {
      const s = String(ri(r, 10, 999)), k = ri(r, 2, 9);
      return {
        topic: F3.topic,
        title: `Convertir un texte en nombre ${i + 1}`,
        theory: THEORY_CONV,
        statement: `Complétez la fonction \`convertis(texte)\` : elle reçoit une chaîne contenant un entier (par exemple \`"${s}"\`) et doit renvoyer cet entier multiplié par ${k}.`,
        starterCode: starterFn('def convertis(texte):', [
          'texte est une chaîne de caractères, pas un nombre !',
          'Convertissez-la en entier, multipliez par ' + k,
          'Renvoyez le résultat avec return',
        ]),
        hints: [
          'Une chaîne et un nombre ne se multiplient pas comme on voudrait : "5" * 2 donne "55".',
          'La fonction int() convertit une chaîne en entier.',
          `Écrivez : return int(texte) * ${k}`,
        ],
        visibleTests: [{ kind: 'call', fn: 'convertis', args: [s], expect: [parseInt(s) * k] }],
        hiddenTests: [
          { kind: 'call', fn: 'convertis', args: ['7'], expect: [7 * k] },
          { kind: 'call', fn: 'convertis', args: ['100'], expect: [100 * k] },
        ],
        solution: `def convertis(texte):\n    return int(texte) * ${k}`,
        tips: [
          { pattern: 'int\\(', advice: 'Bonne conversion. Pour un nombre à virgule, ce serait float().', mode: 'prefer' },
        ],
      };
    }
    if (mode === 1) {
      const n = ri(r, 5, 99);
      return {
        topic: F3.topic,
        title: `Nombre vers texte ${i + 1}`,
        theory: THEORY_CONV,
        statement: `Complétez \`double_texte(n)\` : elle reçoit un entier et doit renvoyer la **chaîne** formée du nombre écrit deux fois côte à côte. Exemple : avec ${n}, elle renvoie \`"${n}${n}"\`.`,
        starterCode: starterFn('def double_texte(n):', [
          'Convertissez n en chaîne avec str()',
          'Collez deux copies avec +',
          'Renvoyez le résultat',
        ]),
        hints: [
          'En Python, "coller" deux chaînes se fait avec +.',
          'str(n) transforme le nombre en texte.',
          'return str(n) + str(n)',
        ],
        visibleTests: [{ kind: 'call', fn: 'double_texte', args: [n], expect: [`${n}${n}`] }],
        hiddenTests: [{ kind: 'call', fn: 'double_texte', args: [3], expect: ['33'] }],
        solution: `def double_texte(n):\n    return str(n) + str(n)`,
        tips: [
          { pattern: 'str\\(n\\) \\* 2', advice: 'str(n) * 2 fonctionne aussi — c\'est même plus court.', mode: 'prefer' },
        ],
      };
    }
    const x = ri(r, 100, 999) / 10;
    return {
      topic: F3.topic,
      title: `Troncature ${i + 1}`,
      theory: THEORY_CONV,
      statement: `Complétez \`tronque(x)\` : elle reçoit un nombre décimal et doit renvoyer sa **partie entière** sous forme d'\`int\`. Exemple : tronque(${x}) → ${Math.trunc(x)}.`,
      starterCode: starterFn('def tronque(x):', [
        'La fonction int() tronque un float vers zéro',
        'Renvoyez int(x)',
      ]),
      hints: ['int(3.99) donne 3, pas 4.', 'La fonction int() suffit à elle seule.', 'return int(x)'],
      visibleTests: [{ kind: 'call', fn: 'tronque', args: [x], expect: [Math.trunc(x)] }],
      hiddenTests: [
        { kind: 'call', fn: 'tronque', args: [7.99], expect: [7] },
        { kind: 'call', fn: 'tronque', args: [-3.5], expect: [-3] },
      ],
      solution: 'def tronque(x):\n    return int(x)',
      tips: [
        { pattern: 'round', advice: 'round() arrondit (3.7 → 4) alors que int() tronque (3.7 → 3) : ce n\'est pas la même chose.', mode: 'avoid' },
      ],
    };
  },
};

const THEORY_FSTR = `## Écriture formatée et f-strings

Les **f-strings** permettent d'insérer des variables dans un texte. On préfixe la chaîne par \`f\` et on met les expressions entre accolades :

\`\`\`
nom = "Alice"
age = 20
print(f"{nom} a {age} ans.")        # Alice a 20 ans.
print(f"Dans 10 ans : {age + 10}")  # Dans 10 ans : 30
\`\`\`

On peut aussi formater les nombres : \`f"{3.14159:.2f}"\` donne \`"3.14"\`.`;

const PRENOMS = ['Alice', 'Bob', 'Chloé', 'David', 'Emma', 'Farid', 'Gina', 'Hugo'];
const VILLES = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Lille', 'Bordeaux'];

const F4: FamSpec = {
  key: 'fstrings',
  topic: 'Affichage et f-strings',
  count: 20,
  gen: (r, i) => {
    const mode = i % 2;
    if (mode === 0) {
      const nom = pick(r, PRENOMS), age = ri(r, 17, 45);
      const attendu = `Je m'appelle ${nom} et j'ai ${age} ans.`;
      return {
        topic: F4.topic,
        title: `Se présenter ${i + 1}`,
        theory: THEORY_FSTR,
        statement: `Complétez \`presentation(nom, age)\` qui doit renvoyer la chaîne exacte : \`"Je m'appelle {nom} et j'ai {age} ans."\` (avec les vraies valeurs). Exemple : presentation("${nom}", ${age}) → \`"${attendu}"\`.`,
        starterCode: starterFn('def presentation(nom, age):', [
          'Utilisez une f-string : f"...{nom}..."',
          'Respectez exactement la phrase demandée (espaces, apostrophe, point final)',
        ]),
        hints: [
          'Une f-string commence par f avant le guillemet : f"..."',
          'Les variables s\'insèrent entre accolades : {nom}.',
          `return f"Je m'appelle {nom} et j'ai {age} ans."`,
        ],
        visibleTests: [{ kind: 'call', fn: 'presentation', args: [nom, age], expect: [attendu] }],
        hiddenTests: [
          { kind: 'call', fn: 'presentation', args: ['Zoé', 19], expect: ["Je m'appelle Zoé et j'ai 19 ans."] },
          { kind: 'call', fn: 'presentation', args: ['Marc', 60], expect: ["Je m'appelle Marc et j'ai 60 ans."] },
        ],
        solution: `def presentation(nom, age):\n    return f"Je m'appelle {nom} et j'ai {age} ans."`,
        tips: [
          { pattern: '\\+', advice: 'La concaténation avec + fonctionne, mais la f-string est plus lisible et évite les str() partout.', mode: 'avoid' },
        ],
      };
    }
    const ville = pick(r, VILLES), temp = ri(r, 5, 35);
    const attendu = `À ${ville}, il fait ${temp} degrés.`;
    return {
      topic: F4.topic,
      title: `Bulletin météo ${i + 1}`,
      theory: THEORY_FSTR,
      statement: `Complétez \`meteo(ville, temperature)\` qui renvoie : \`"À {ville}, il fait {temperature} degrés."\` Exemple : meteo("${ville}", ${temp}) → \`"${attendu}"\`.`,
      starterCode: starterFn('def meteo(ville, temperature):', [
        'Une seule f-string suffit',
        'Attention à la virgule et au point final',
      ]),
      hints: [
        'f"À {ville}, il fait {temperature} degrés."',
        'N\'oubliez pas le f devant la chaîne, sinon les accolades restent du texte.',
        'return f"À {ville}, il fait {temperature} degrés."',
      ],
      visibleTests: [{ kind: 'call', fn: 'meteo', args: [ville, temp], expect: [attendu] }],
      hiddenTests: [{ kind: 'call', fn: 'meteo', args: ['Nice', 28], expect: ['À Nice, il fait 28 degrés.'] }],
      solution: `def meteo(ville, temperature):\n    return f"À {ville}, il fait {temperature} degrés."`,
      tips: [],
    };
  },
};

const THEORY_LISTES = `## Listes : indiçage et tranches

Une **liste** est une collection ordonnée : \`L = [10, 20, 30, 40]\`.

- **Indiçage** : \`L[0]\` est le premier élément (on compte à partir de 0 !), \`L[2]\` le troisième.
- **Indiçage négatif** : \`L[-1]\` est le dernier, \`L[-2]\` l'avant-dernier.
- **Tranches** : \`L[1:3]\` donne \`[20, 30]\` (de l'indice 1 inclus à 3 exclu). \`L[:2]\` = début jusqu'à 2 exclu, \`L[2:]\` = de 2 à la fin.
- \`len(L)\` donne la longueur.`;

const F5: FamSpec = {
  key: 'listes-index',
  topic: 'Listes : indiçage et tranches',
  count: 25,
  gen: (r, i) => {
    const L = intArr(r, 6, 1, 99);
    const mode = i % 5;
    const variants: {
      txt: string; code: string; calc: (L: number[]) => any; hint: string;
    }[] = [
      { txt: 'le premier élément', code: 'L[0]', calc: (l) => l[0], hint: 'Le premier élément est à l\'indice 0, pas 1.' },
      { txt: 'le dernier élément', code: 'L[-1]', calc: (l) => l[l.length - 1], hint: 'L\'indice -1 désigne le dernier élément.' },
      { txt: 'les trois premiers éléments (tranche)', code: 'L[:3]', calc: (l) => l.slice(0, 3), hint: 'L[:3] va du début jusqu\'à l\'indice 3 exclu.' },
      { txt: 'les éléments de l\'indice 2 à la fin', code: 'L[2:]', calc: (l) => l.slice(2), hint: 'L[2:] part de l\'indice 2 inclus jusqu\'à la fin.' },
      { txt: 'le nombre d\'éléments de la liste', code: 'len(L)', calc: (l) => l.length, hint: 'La fonction len() donne la longueur.' },
    ];
    const v = variants[mode];
    const L1 = intArr(r, 6, -50, 50), L2 = intArr(r, 7, 0, 100);
    return {
      topic: F5.topic,
      title: `Indiçage ${i + 1}`,
      theory: THEORY_LISTES,
      statement: `Complétez \`extrait(L)\` qui reçoit une liste et renvoie **${v.txt}**. Exemple : avec \`${py(L)}\`, elle renvoie \`${py(v.calc(L))}\`.`,
      starterCode: starterFn('def extrait(L):', [
        `Objectif : renvoyer ${v.txt}`,
        'Les indices commencent à 0',
        'Un seul return suffit',
      ]),
      hints: [v.hint, mode === 4 ? 'len(L)' : `La syntaxe est ${v.code}`, `return ${v.code}`],
      visibleTests: [{ kind: 'call', fn: 'extrait', args: [L], expect: [v.calc(L)] }],
      hiddenTests: [
        { kind: 'call', fn: 'extrait', args: [L1], expect: [v.calc(L1)] },
        { kind: 'call', fn: 'extrait', args: [L2], expect: [v.calc(L2)] },
      ],
      solution: `def extrait(L):\n    return ${v.code}`,
      tips: [
        { pattern: 'len\\(L\\) - 1\\]', advice: 'L[len(L) - 1] est correct, mais L[-1] est la façon pythonique : plus courte et plus claire.', mode: 'avoid' },
      ],
    };
  },
};

const THEORY_LISTMETH = `## Listes : méthodes et fonctions utiles

\`\`\`
L = [3, 1, 4, 1, 5]
len(L)      # 5 (longueur)
sum(L)      # 14 (somme)
min(L)      # 1
max(L)      # 5
sorted(L)   # [1, 1, 3, 4, 5] (nouvelle liste triée)
L.append(9) # ajoute 9 à la fin (modifie L)
\`\`\`

Attention : \`sorted(L)\` renvoie une **nouvelle** liste sans toucher à L, alors que \`L.sort()\` modifie L sur place.`;

const F6: FamSpec = {
  key: 'listes-methodes',
  topic: 'Listes : méthodes',
  count: 20,
  gen: (r, i) => {
    const L = intArr(r, 5, 1, 60);
    const x = ri(r, 50, 99);
    const mode = i % 5;
    const variants: {
      txt: string; code: string; calc: (l: number[]) => any; solExtra?: string;
    }[] = [
      { txt: 'la liste triée par ordre croissant (sans modifier L)', code: 'sorted(L)', calc: (l) => [...l].sort((p, q) => p - q) },
      { txt: `la somme des éléments`, code: 'sum(L)', calc: (l) => l.reduce((a, b) => a + b, 0) },
      { txt: `le plus grand élément`, code: 'max(L)', calc: (l) => Math.max(...l) },
      { txt: `le plus petit élément`, code: 'min(L)', calc: (l) => Math.min(...l) },
      { txt: `une nouvelle liste égale à L avec ${x} ajouté à la fin`, code: `L + [${x}]`, calc: (l) => [...l, x] },
    ];
    const v = variants[mode];
    const L1 = intArr(r, 6, -20, 40);
    return {
      topic: F6.topic,
      title: `Méthodes de listes ${i + 1}`,
      theory: THEORY_LISTMETH,
      statement: `Complétez \`transforme(L)\` qui renvoie **${v.txt}**. Exemple : avec \`${py(L)}\`, le résultat est \`${py(v.calc(L))}\`.`,
      starterCode: starterFn('def transforme(L):', [
        `Objectif : ${v.txt}`,
        'Il existe une fonction ou un opérateur tout fait : inutile de boucler',
      ]),
      hints: [
        'Python fournit déjà presque tout : pas besoin de boucle for ici.',
        mode === 4 ? 'Coller deux listes se fait avec +.' : `Essayez la fonction ${v.code.replace('(L)', '')}().`,
        `return ${v.code}`,
      ],
      visibleTests: [{ kind: 'call', fn: 'transforme', args: [L], expect: [v.calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'transforme', args: [L1], expect: [v.calc(L1)] }],
      solution: `def transforme(L):\n    return ${v.code}`,
      tips: mode === 0
        ? [{ pattern: 'for', advice: 'Une boucle de tri manuelle est un excellent exercice, mais sorted() est optimisé et bien plus rapide.', mode: 'avoid' }]
        : [{ pattern: 'for', advice: 'La fonction intégrée fait le travail en une ligne, en C optimisé : préférez-la à une boucle.', mode: 'avoid' }],
    };
  },
};

const THEORY_FOR = `## Boucles for et range()

La boucle \`for\` répète un bloc pour chaque élément :

\`\`\`
for i in range(5):      # i prend 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):   # i prend 1, 2, 3, 4, 5 (6 exclu !)
    print(i)

for i in range(0, 10, 2):  # 0, 2, 4, 6, 8 (pas de 2)
    print(i)
\`\`\`

**Accumulateur** : pour calculer une somme, on initialise une variable à 0 puis on ajoute à chaque tour :

\`\`\`
total = 0
for i in range(1, 11):
    total = total + i   # ou total += i
\`\`\`

L'**indentation** (4 espaces) définit le corps de la boucle : c'est crucial en Python.`;

const F7: FamSpec = {
  key: 'boucles-for',
  topic: 'Boucles for et range',
  count: 25,
  gen: (r, i) => {
    const mode = i % 4;
    if (mode === 0) {
      const n = ri(r, 3, 12), k = ri(r, 4, 10);
      const calc = (nn: number) => Array.from({ length: k }, (_, j) => nn * (j + 1));
      return {
        topic: F7.topic,
        title: `Table de multiplication ${i + 1}`,
        theory: THEORY_FOR,
        statement: `Complétez \`table(n)\` qui renvoie la liste des ${k} premiers multiples de n : [n×1, n×2, …, n×${k}]. Exemple : table(${n}) → \`${py(calc(n))}\`. Utilisez une boucle \`for\`.`,
        starterCode: starterFn('def table(n):', [
          'Créez une liste vide : resultat = []',
          `Bouclez avec for i in range(1, ${k + 1}):`,
          'Ajoutez n * i à la liste avec resultat.append(...)',
          'Renvoyez resultat',
        ]),
        hints: [
          `range(1, ${k + 1}) produit les entiers de 1 à ${k}.`,
          'On construit une liste en partant de [] et en ajoutant avec append().',
          `resultat = []\nfor i in range(1, ${k + 1}):\n    resultat.append(n * i)\nreturn resultat`,
        ],
        visibleTests: [{ kind: 'call', fn: 'table', args: [n], expect: [calc(n)] }],
        hiddenTests: [{ kind: 'call', fn: 'table', args: [7], expect: [calc(7)] }],
        solution: `def table(n):\n    resultat = []\n    for i in range(1, ${k + 1}):\n        resultat.append(n * i)\n    return resultat`,
        tips: [
          { pattern: 'append', advice: 'Correct ! Plus concis avec une liste en compréhension : return [n * i for i in range(1, ' + (k + 1) + ')]', mode: 'prefer' },
        ],
      };
    }
    if (mode === 1) {
      const n = ri(r, 10, 60);
      const calc = (x: number) => (x * (x + 1)) / 2;
      return {
        topic: F7.topic,
        title: `Somme des entiers ${i + 1}`,
        theory: THEORY_FOR,
        statement: `Complétez \`somme_entiers(n)\` qui calcule 1 + 2 + … + n avec une boucle \`for\` et un accumulateur. Exemple : somme_entiers(${n}) → ${calc(n)}.`,
        starterCode: starterFn('def somme_entiers(n):', [
          'Initialisez un accumulateur : total = 0',
          'Bouclez sur range(1, n + 1)',
          'Ajoutez chaque i à total',
          'Renvoyez total',
        ]),
        hints: [
          'Un accumulateur est une variable initialisée à 0 avant la boucle.',
          'total += i est un raccourci pour total = total + i.',
          'total = 0\nfor i in range(1, n + 1):\n    total += i\nreturn total',
        ],
        visibleTests: [{ kind: 'call', fn: 'somme_entiers', args: [n], expect: [calc(n)] }],
        hiddenTests: [
          { kind: 'call', fn: 'somme_entiers', args: [100], expect: [5050] },
          { kind: 'call', fn: 'somme_entiers', args: [1], expect: [1] },
        ],
        solution: `def somme_entiers(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total`,
        tips: [
          { pattern: 'for', advice: 'Bien ! Pour information : sum(range(1, n + 1)) fait la même chose, et la formule n*(n+1)//2 est en temps constant.', mode: 'prefer' },
        ],
      };
    }
    if (mode === 2) {
      const a = ri(r, 1, 5), b = ri(r, 10, 30), p = ri(r, 2, 5);
      const calc = (aa: number, bb: number, pp: number) => Array.from({ length: Math.floor((bb - aa) / pp) + 1 }, (_, j) => aa + j * pp);
      return {
        topic: F7.topic,
        title: `Range à pas ${i + 1}`,
        theory: THEORY_FOR,
        statement: `Complétez \`par_pas(debut, fin, pas)\` qui renvoie la liste des entiers de \`debut\` à \`fin\` (inclus) par sauts de \`pas\`. Exemple : par_pas(${a}, ${b}, ${p}) → \`${py(calc(a, b, p))}\`.`,
        starterCode: starterFn('def par_pas(debut, fin, pas):', [
          'range accepte 3 arguments : range(debut, fin_exclu, pas)',
          'fin doit être inclus : ajoutez 1',
          'list(range(...)) transforme en liste',
        ]),
        hints: [
          'range(0, 10, 2) donne 0, 2, 4, 6, 8.',
          'Pour inclure la borne de fin, écrivez range(debut, fin + 1, pas).',
          'return list(range(debut, fin + 1, pas))',
        ],
        visibleTests: [{ kind: 'call', fn: 'par_pas', args: [a, b, p], expect: [calc(a, b, p)] }],
        hiddenTests: [{ kind: 'call', fn: 'par_pas', args: [2, 20, 3], expect: [calc(2, 20, 3)] }],
        solution: `def par_pas(debut, fin, pas):\n    return list(range(debut, fin + 1, pas))`,
        tips: [
          { pattern: 'while', advice: 'Une boucle while fonctionne, mais range() exprime exactement cette idée : c\'est plus sûr (pas de risque de boucle infinie).', mode: 'avoid' },
        ],
      };
    }
    const L = intArr(r, 6, 1, 50);
    const calc = (l: number[]) => l.reduce((a, b) => a + b * b, 0);
    return {
      topic: F7.topic,
      title: `Somme de carrés ${i + 1}`,
      theory: THEORY_FOR,
      statement: `Complétez \`somme_carres(L)\` qui calcule la somme des **carrés** des éléments de L, avec une boucle \`for x in L\`. Exemple : somme_carres(${py(L)}) → ${calc(L)}.`,
      starterCode: starterFn('def somme_carres(L):', [
        'total = 0',
        'for x in L: itère directement sur les éléments',
        'Ajoutez x ** 2 à total',
        'Renvoyez total',
      ]),
      hints: [
        'for x in L: parcourt directement les valeurs (pas les indices).',
        'Le carré s\'écrit x ** 2 ou x * x.',
        'total = 0\nfor x in L:\n    total += x ** 2\nreturn total',
      ],
      visibleTests: [{ kind: 'call', fn: 'somme_carres', args: [L], expect: [calc(L)] }],
      hiddenTests: [{ kind: 'call', fn: 'somme_carres', args: [[3, 4]], expect: [25] }],
      solution: `def somme_carres(L):\n    total = 0\n    for x in L:\n        total += x ** 2\n    return total`,
      tips: [
        { pattern: 'range\\(len', advice: 'for i in range(len(L)) fonctionne, mais for x in L est plus direct et plus lisible quand l\'indice ne sert pas.', mode: 'avoid' },
      ],
    };
  },
};

const THEORY_WHILE = `## Boucles while

La boucle \`while\` répète un bloc **tant qu'une condition est vraie** :

\`\`\`
n = 100
compteur = 0
while n > 1:
    n = n // 2
    compteur += 1
# compteur vaut 6
\`\`\`

⚠️ Il faut que la condition devienne fausse à un moment, sinon la boucle est **infinie**. Ici, le site interrompt automatiquement au bout de quelques secondes.

On utilise \`while\` quand on ne sait pas à l'avance combien de tours il faudra ; \`for\` quand on connaît le nombre d'itérations ou la collection à parcourir.`;

const F8: FamSpec = {
  key: 'boucles-while',
  topic: 'Boucles while',
  count: 20,
  gen: (r, i) => {
    const mode = i % 3;
    if (mode === 0) {
      const n = ri(r, 100, 9999);
      const calc = (x: number) => {
        let c = 0;
        while (x > 1) { x = Math.floor(x / 2); c++; }
        return c;
      };
      return {
        topic: F8.topic,
        title: `Divisions par 2 ${i + 1}`,
        theory: THEORY_WHILE,
        statement: `Complétez \`nb_divisions(n)\` qui compte combien de fois on peut diviser n par 2 (division entière) avant d'atteindre 1 ou moins. Exemple : nb_divisions(${n}) → ${calc(n)}.`,
        starterCode: starterFn('def nb_divisions(n):', [
          'compteur = 0',
          'Tant que n > 1 : divisez n par 2 (//) et incrémentez le compteur',
          'Renvoyez le compteur',
        ]),
        hints: [
          'while n > 1: est la bonne condition.',
          'n = n // 2 divise en gardant un entier.',
          'compteur = 0\nwhile n > 1:\n    n = n // 2\n    compteur += 1\nreturn compteur',
        ],
        visibleTests: [{ kind: 'call', fn: 'nb_divisions', args: [n], expect: [calc(n)] }],
        hiddenTests: [
          { kind: 'call', fn: 'nb_divisions', args: [1024], expect: [10] },
          { kind: 'call', fn: 'nb_divisions', args: [1], expect: [0] },
        ],
        solution: `def nb_divisions(n):\n    compteur = 0\n    while n > 1:\n        n = n // 2\n        compteur += 1\n    return compteur`,
        tips: [
          { pattern: 'math\\.log|log2', advice: 'Astucieux : le résultat est proche de log2(n). Mais la boucle évite les problèmes d\'arrondi des flottants.', mode: 'avoid' },
        ],
      };
    }
    if (mode === 1) {
      const n = ri(r, 100, 99999);
      const calc = (x: number) => String(Math.abs(x)).split('').reduce((a, d) => a + Number(d), 0);
      return {
        topic: F8.topic,
        title: `Somme des chiffres ${i + 1}`,
        theory: THEORY_WHILE,
        statement: `Complétez \`somme_chiffres(n)\` qui calcule la somme des chiffres de n (entier positif) avec une boucle \`while\` : à chaque tour, récupérez le dernier chiffre avec \`n % 10\` puis supprimez-le avec \`n // 10\`. Exemple : somme_chiffres(${n}) → ${calc(n)}.`,
        starterCode: starterFn('def somme_chiffres(n):', [
          'total = 0',
          'Tant que n > 0 : ajoutez n % 10 à total, puis n = n // 10',
          'Renvoyez total',
        ]),
        hints: [
          'n % 10 donne le dernier chiffre, n // 10 l\'enlève.',
          'La boucle s\'arrête quand n vaut 0.',
          'total = 0\nwhile n > 0:\n    total += n % 10\n    n = n // 10\nreturn total',
        ],
        visibleTests: [{ kind: 'call', fn: 'somme_chiffres', args: [n], expect: [calc(n)] }],
        hiddenTests: [
          { kind: 'call', fn: 'somme_chiffres', args: [12345], expect: [15] },
          { kind: 'call', fn: 'somme_chiffres', args: [9], expect: [9] },
        ],
        solution: `def somme_chiffres(n):\n    total = 0\n    while n > 0:\n        total += n % 10\n        n = n // 10\n    return total`,
        tips: [
          { pattern: 'str\\(', advice: 'Convertir en str puis sommer fonctionne aussi, mais la version arithmétique (%//) est un classique à maîtriser.', mode: 'avoid' },
        ],
      };
    }
    const target = ri(r, 50, 200), step = ri(r, 3, 9);
    const calc = (t: number, s: number) => {
      let v = 0, c = 0;
      while (v < t) { v += s; c++; }
      return c;
    };
    return {
      topic: F8.topic,
      title: `Seuil à atteindre ${i + 1}`,
      theory: THEORY_WHILE,
      statement: `Complétez \`nb_etapes(cible, pas)\` : on part de 0 et on ajoute \`pas\` à chaque étape. Combien d'étapes faut-il pour atteindre ou dépasser \`cible\` ? Exemple : nb_etapes(${target}, ${step}) → ${calc(target, step)}.`,
      starterCode: starterFn('def nb_etapes(cible, pas):', [
        'valeur = 0 et compteur = 0',
        'Tant que valeur < cible : valeur += pas, compteur += 1',
        'Renvoyez compteur',
      ]),
      hints: [
        'La condition de continuation est valeur < cible.',
        'Incrémentez les deux variables dans la boucle.',
        'valeur = 0\ncompteur = 0\nwhile valeur < cible:\n    valeur += pas\n    compteur += 1\nreturn compteur',
      ],
      visibleTests: [{ kind: 'call', fn: 'nb_etapes', args: [target, step], expect: [calc(target, step)] }],
      hiddenTests: [{ kind: 'call', fn: 'nb_etapes', args: [10, 5], expect: [2] }],
      solution: `def nb_etapes(cible, pas):\n    valeur = 0\n    compteur = 0\n    while valeur < cible:\n        valeur += pas\n        compteur += 1\n    return compteur`,
      tips: [
        { pattern: 'import math|//', advice: 'On peut aussi calculer -(-cible // pas) ou math.ceil(cible/pas) sans boucle : temps constant !', mode: 'prefer' },
      ],
    };
  },
};

const THEORY_IF = `## Tests : if, elif, else

\`\`\`
if x < 0:
    print("négatif")
elif x == 0:
    print("nul")
else:
    print("positif")
\`\`\`

- Les conditions utilisent les opérateurs de comparaison : \`==\`, \`!=\`, \`<\`, \`<=>\`, \`>=\`.
- ⚠️ \`==\` teste l'égalité, \`=\` affecte une valeur. Ne pas les confondre !
- On combine avec \`and\`, \`or\`, \`not\`.
- \`elif\` = "sinon si" : Python teste les cas dans l'ordre et s'arrête au premier vrai.`;

const F9: FamSpec = {
  key: 'conditions',
  topic: 'Conditions if / elif / else',
  count: 25,
  gen: (r, i) => {
    const mode = i % 4;
    if (mode === 0) {
      const a = ri(r, 1, 100), b = -ri(r, 1, 100);
      return {
        topic: F9.topic,
        title: `Signe d'un nombre ${i + 1}`,
        theory: THEORY_IF,
        statement: `Complétez \`signe(x)\` qui renvoie la chaîne \`"positif"\`, \`"négatif"\` ou \`"nul"\` selon la valeur de x.`,
        starterCode: starterFn('def signe(x):', [
          'Testez d\'abord si x > 0',
          'Puis si x < 0 (sinon si : elif)',
          'Sinon (else), c\'est que x vaut 0',
        ]),
        hints: [
          'Trois cas → if, elif, else.',
          'Renvoyez des chaînes exactes : "positif", "négatif", "nul".',
          'if x > 0:\n    return "positif"\nelif x < 0:\n    return "négatif"\nelse:\n    return "nul"',
        ],
        visibleTests: [
          { kind: 'call', fn: 'signe', args: [a], expect: ['positif'] },
          { kind: 'call', fn: 'signe', args: [b], expect: ['négatif'] },
        ],
        hiddenTests: [{ kind: 'call', fn: 'signe', args: [0], expect: ['nul'] }],
        solution: `def signe(x):\n    if x > 0:\n        return "positif"\n    elif x < 0:\n        return "négatif"\n    else:\n        return "nul"`,
        tips: [],
      };
    }
    if (mode === 1) {
      const n = ri(r, 2, 500);
      const calc = (x: number) => (x % 2 === 0 ? 'pair' : 'impair');
      return {
        topic: F9.topic,
        title: `Pair ou impair ${i + 1}`,
        theory: THEORY_IF,
        statement: `Complétez \`parite(n)\` qui renvoie \`"pair"\` si n est divisible par 2, \`"impair"\` sinon. Pensez au modulo \`%\`.`,
        starterCode: starterFn('def parite(n):', [
          'n % 2 donne le reste de la division par 2',
          'Si ce reste vaut 0 : pair, sinon impair',
        ]),
        hints: [
          'Un nombre pair a un reste nul dans la division par 2.',
          'if n % 2 == 0: ...',
          'if n % 2 == 0:\n    return "pair"\nelse:\n    return "impair"',
        ],
        visibleTests: [{ kind: 'call', fn: 'parite', args: [n], expect: [calc(n)] }],
        hiddenTests: [
          { kind: 'call', fn: 'parite', args: [2], expect: ['pair'] },
          { kind: 'call', fn: 'parite', args: [7], expect: ['impair'] },
        ],
        solution: `def parite(n):\n    if n % 2 == 0:\n        return "pair"\n    else:\n        return "impair"`,
        tips: [
          { pattern: 'if.*else', advice: 'Variante concise : return "pair" if n % 2 == 0 else "impair" (expression conditionnelle).', mode: 'prefer' },
        ],
      };
    }
    if (mode === 2) {
      const note = ri(r, 0, 20);
      const calc = (x: number) => (x >= 16 ? 'excellent' : x >= 12 ? 'bien' : x >= 10 ? 'passable' : 'insuffisant');
      return {
        topic: F9.topic,
        title: `Mentions ${i + 1}`,
        theory: THEORY_IF,
        statement: `Complétez \`mention(note)\` (note sur 20) : ≥16 → \`"excellent"\`, ≥12 → \`"bien"\`, ≥10 → \`"passable"\`, sinon \`"insuffisant"\`. Exemple : mention(${note}) → \`"${calc(note)}"\`.`,
        starterCode: starterFn('def mention(note):', [
          'Testez les seuils du plus haut au plus bas',
          'if note >= 16: ... elif note >= 12: ... etc.',
        ]),
        hints: [
          'L\'ordre des tests compte : commencez par 16.',
          'elif évite de retester les cas déjà exclus.',
          'if note >= 16:\n    return "excellent"\nelif note >= 12:\n    return "bien"\nelif note >= 10:\n    return "passable"\nelse:\n    return "insuffisant"',
        ],
        visibleTests: [{ kind: 'call', fn: 'mention', args: [note], expect: [calc(note)] }],
        hiddenTests: [
          { kind: 'call', fn: 'mention', args: [16], expect: ['excellent'] },
          { kind: 'call', fn: 'mention', args: [10], expect: ['passable'] },
          { kind: 'call', fn: 'mention', args: [0], expect: ['insuffisant'] },
        ],
        solution: `def mention(note):\n    if note >= 16:\n        return "excellent"\n    elif note >= 12:\n        return "bien"\n    elif note >= 10:\n        return "passable"\n    else:\n        return "insuffisant"`,
        tips: [],
      };
    }
    const x = ri(r, -20, 20), y = ri(r, -20, 20), z = ri(r, -20, 20);
    return {
      topic: F9.topic,
      title: `Maximum de trois ${i + 1}`,
      theory: THEORY_IF,
      statement: `Complétez \`max3(a, b, c)\` qui renvoie le plus grand des trois nombres **sans utiliser max()**, avec des \`if\`. Exemple : max3(${x}, ${y}, ${z}) → ${Math.max(x, y, z)}.`,
      starterCode: starterFn('def max3(a, b, c):', [
        'Supposez que a est le maximum : m = a',
        'Si b > m, mettez m à jour ; pareil pour c',
        'Renvoyez m',
      ]),
      hints: [
        'Une variable m qui garde le meilleur candidat.',
        'if b > m: m = b — puis if c > m: m = c.',
        'm = a\nif b > m:\n    m = b\nif c > m:\n    m = c\nreturn m',
      ],
      visibleTests: [{ kind: 'call', fn: 'max3', args: [x, y, z], expect: [Math.max(x, y, z)] }],
      hiddenTests: [
        { kind: 'call', fn: 'max3', args: [1, 2, 3], expect: [3] },
        { kind: 'call', fn: 'max3', args: [-5, -2, -9], expect: [-2] },
      ],
      solution: `def max3(a, b, c):\n    m = a\n    if b > m:\n        m = b\n    if c > m:\n        m = c\n    return m`,
      tips: [
        { pattern: 'max\\(', advice: 'max(a, b, c) existe et est préférable en pratique — mais savoir le coder à la main est l\'objectif ici.', mode: 'prefer' },
      ],
    };
  },
};

const THEORY_STR = `## Chaînes de caractères

Une chaîne est une **séquence immuable** de caractères. Comme les listes : indiçage \`s[0]\`, tranches \`s[1:4]\`, \`len(s)\`.

Méthodes utiles (elles renvoient une **nouvelle** chaîne) :

\`\`\`
s = "Bonjour"
s.upper()      # "BONJOUR"
s.lower()      # "bonjour"
s.replace("o", "0")  # "B0nj0ur"
s[::-1]        # "ruojnoB" (renversée !)
"o" in s       # True (test d'appartenance)
\`\`\`

Parcours : \`for c in s:\` itère sur les caractères.`;

const MOTS = ['python', 'programme', 'variable', 'fonction', 'liste', 'boucle', 'algorithme', 'clavier'];

function countVowels(s: string) {
  return (s.match(/[aeiouy]/g) || []).length;
}

const F10: FamSpec = {
  key: 'chaines',
  topic: 'Chaînes de caractères',
  count: 20,
  gen: (r, i) => {
    const mode = i % 4;
    const mot = pick(r, MOTS);
    if (mode === 0) {
      const calc = (s: string) => s.split('').reverse().join('');
      return {
        topic: F10.topic,
        title: `Mot à l'envers ${i + 1}`,
        theory: THEORY_STR,
        statement: `Complétez \`renverse(s)\` qui renvoie la chaîne s à l'envers. Exemple : renverse("${mot}") → \`"${calc(mot)}"\`. Astuce : la tranche \`s[::-1]\` fait exactement cela.`,
        starterCode: starterFn('def renverse(s):', [
          'Les tranches acceptent un troisième argument : le pas',
          'Un pas de -1 parcourt à l\'envers',
        ]),
        hints: [
          's[a:b:pas] : le pas peut être négatif.',
          's[::-1] parcourt toute la chaîne à rebours.',
          'return s[::-1]',
        ],
        visibleTests: [{ kind: 'call', fn: 'renverse', args: [mot], expect: [calc(mot)] }],
        hiddenTests: [
          { kind: 'call', fn: 'renverse', args: ['abc'], expect: ['cba'] },
          { kind: 'call', fn: 'renverse', args: ['ressasser'], expect: ['ressasser'] },
        ],
        solution: 'def renverse(s):\n    return s[::-1]',
        tips: [
          { pattern: 'for', advice: 'Une boucle qui reconstruit caractère par caractère fonctionne, mais s[::-1] est la façon pythonique : une ligne, ultra rapide.', mode: 'avoid' },
        ],
      };
    }
    if (mode === 1) {
      const calc = countVowels;
      return {
        topic: F10.topic,
        title: `Compteur de voyelles ${i + 1}`,
        theory: THEORY_STR,
        statement: `Complétez \`compte_voyelles(s)\` qui compte les voyelles (a, e, i, o, u, y) dans s. Exemple : compte_voyelles("${mot}") → ${calc(mot)}. Parcourez la chaîne avec \`for c in s\` et testez \`c in "aeiouy"\`.`,
        starterCode: starterFn('def compte_voyelles(s):', [
          'compteur = 0',
          'for c in s: parcourt chaque caractère',
          'Si c est dans "aeiouy", incrémentez',
          'Renvoyez le compteur',
        ]),
        hints: [
          'Le test d\'appartenance c in "aeiouy" renvoie True ou False.',
          'if c in "aeiouy":\n    compteur += 1',
          'compteur = 0\nfor c in s:\n    if c in "aeiouy":\n        compteur += 1\nreturn compteur',
        ],
        visibleTests: [{ kind: 'call', fn: 'compte_voyelles', args: [mot], expect: [calc(mot)] }],
        hiddenTests: [
          { kind: 'call', fn: 'compte_voyelles', args: ['xyz'], expect: [1] },
          { kind: 'call', fn: 'compte_voyelles', args: ['aeiouy'], expect: [6] },
        ],
        solution: 'def compte_voyelles(s):\n    compteur = 0\n    for c in s:\n        if c in "aeiouy":\n            compteur += 1\n    return compteur',
        tips: [
          { pattern: 'for', advice: 'Bien ! Version une ligne possible : sum(1 for c in s if c in "aeiouy").', mode: 'prefer' },
        ],
      };
    }
    if (mode === 2) {
      const calc = (s: string) => s.toUpperCase();
      return {
        topic: F10.topic,
        title: `Cri ${i + 1}`,
        theory: THEORY_STR,
        statement: `Complétez \`crie(s)\` qui renvoie la chaîne en MAJUSCULES suivie d'un point d'exclamation. Exemple : crie("${mot}") → \`"${calc(mot)}!"\`.`,
        starterCode: starterFn('def crie(s):', [
          'La méthode .upper() met en majuscules',
          'Ajoutez "!" avec +',
        ]),
        hints: [
          'Les méthodes de chaîne s\'appellent avec un point : s.upper().',
          's.upper() renvoie une NOUVELLE chaîne (s ne change pas).',
          'return s.upper() + "!"',
        ],
        visibleTests: [{ kind: 'call', fn: 'crie', args: [mot], expect: [calc(mot) + '!'] }],
        hiddenTests: [{ kind: 'call', fn: 'crie', args: ['stop'], expect: ['STOP!'] }],
        solution: 'def crie(s):\n    return s.upper() + "!"',
        tips: [],
      };
    }
    const calc = (s: string) => s.length >= 3 ? s.slice(0, 3) : s;
    return {
      topic: F10.topic,
      title: `Abréviation ${i + 1}`,
      theory: THEORY_STR,
      statement: `Complétez \`abrege(s)\` qui renvoie les 3 premiers caractères de s (ou s entière si elle fait moins de 3 caractères). Exemple : abrege("${mot}") → \`"${calc(mot)}"\`.`,
      starterCode: starterFn('def abrege(s):', [
        'Une tranche s[:3] prend les 3 premiers caractères',
        'Bonne nouvelle : s[:3] ne plante pas si s est courte',
      ]),
      hints: [
        'Les tranches tolèrent les dépassements : "ab"[:3] donne "ab".',
        'Donc un seul return suffit, pas besoin de if.',
        'return s[:3]',
      ],
      visibleTests: [{ kind: 'call', fn: 'abrege', args: [mot], expect: [calc(mot)] }],
      hiddenTests: [
        { kind: 'call', fn: 'abrege', args: ['hi'], expect: ['hi'] },
        { kind: 'call', fn: 'abrege', args: ['abcd'], expect: ['abc'] },
      ],
      solution: 'def abrege(s):\n    return s[:3]',
      tips: [
        { pattern: 'if len', advice: 'Le if est inutile : les tranches Python gèrent seules les chaînes trop courtes. Plus simple = mieux.', mode: 'avoid' },
      ],
    };
  },
};

const THEORY_FONC = `## Fonctions

Une **fonction** regroupe des instructions réutilisables :

\`\`\`
def aire_carre(cote):
    """Renvoie l'aire d'un carré de côté donné."""
    return cote ** 2

print(aire_carre(5))   # 25
\`\`\`

- \`def\` définit la fonction, suivi du nom et des **paramètres** entre parenthèses.
- \`return\` **renvoie** le résultat et termine la fonction. Sans \`return\`, la fonction renvoie \`None\`.
- On appelle la fonction avec des **arguments** : \`aire_carre(5)\`.
- Principe **DRY** (Don't Repeat Yourself) : tout code dupliqué mérite une fonction.`;

const F11: FamSpec = {
  key: 'fonctions',
  topic: 'Définition de fonctions',
  count: 25,
  gen: (r, i) => {
    const mode = i % 5;
    if (mode === 0) {
      const l = ri(r, 3, 15), w = ri(r, 2, 12);
      return {
        topic: F11.topic,
        title: `Aire et périmètre ${i + 1}`,
        theory: THEORY_FONC,
        statement: `Complétez \`aire_rectangle(longueur, largeur)\` qui renvoie l'aire du rectangle. Exemple : aire_rectangle(${l}, ${w}) → ${l * w}.`,
        starterCode: starterFn('def aire_rectangle(longueur, largeur):', [
          'L\'aire d\'un rectangle = longueur × largeur',
          'Renvoyez le produit avec return',
        ]),
        hints: ['Un seul calcul.', 'return longueur * largeur', 'N\'oubliez pas le return (sinon la fonction renvoie None).'],
        visibleTests: [{ kind: 'call', fn: 'aire_rectangle', args: [l, w], expect: [l * w] }],
        hiddenTests: [{ kind: 'call', fn: 'aire_rectangle', args: [7, 3], expect: [21] }],
        solution: 'def aire_rectangle(longueur, largeur):\n    return longueur * largeur',
        tips: [],
      };
    }
    if (mode === 1) {
      const a = ri(r, 3, 12), b = ri(r, 3, 12);
      const calc = (x: number, y: number) => Math.hypot(x, y);
      return {
        topic: F11.topic,
        title: `Hypoténuse ${i + 1}`,
        theory: THEORY_FONC,
        statement: `Complétez \`hypotenuse(a, b)\` qui renvoie la longueur de l'hypoténuse d'un triangle rectangle : √(a² + b²). Indice : \`x ** 0.5\` calcule une racine carrée. Exemple : hypotenuse(3, 4) → 5.0.`,
        starterCode: starterFn('def hypotenuse(a, b):', [
          'Théorème de Pythagore : c² = a² + b²',
          'La racine carrée de x est x ** 0.5',
        ]),
        hints: [
          'Calculez a ** 2 + b ** 2.',
          'Élevez le tout à la puissance 0.5.',
          'return (a ** 2 + b ** 2) ** 0.5',
        ],
        visibleTests: [{ kind: 'call', fn: 'hypotenuse', args: [3, 4], expect: [5], tol: 1e-9 }],
        hiddenTests: [{ kind: 'call', fn: 'hypotenuse', args: [a, b], expect: [calc(a, b)], tol: 1e-9 }],
        solution: 'def hypotenuse(a, b):\n    return (a ** 2 + b ** 2) ** 0.5',
        tips: [
          { pattern: 'math\\.sqrt', advice: 'math.sqrt(a*a + b*b) est équivalent et très lisible ; math.hypot(a, b) existe aussi !', mode: 'prefer' },
        ],
      };
    }
    if (mode === 2) {
      const d = ri(r, 2, 9), n = ri(r, 10, 200);
      const calc = (x: number, dd: number) => x % dd === 0;
      return {
        topic: F11.topic,
        title: `Divisibilité ${i + 1}`,
        theory: THEORY_FONC,
        statement: `Complétez \`est_divisible(n, d)\` qui renvoie \`True\` si n est divisible par d, \`False\` sinon. Exemple : est_divisible(${n}, ${d}) → ${py(calc(n, d))}.`,
        starterCode: starterFn('def est_divisible(n, d):', [
          'Divisible = reste de la division nul',
          'n % d == 0 est déjà un booléen : renvoyez-le !',
        ]),
        hints: [
          'Le modulo % donne le reste.',
          'Une comparaison comme n % d == 0 vaut True ou False directement.',
          'return n % d == 0',
        ],
        visibleTests: [{ kind: 'call', fn: 'est_divisible', args: [n, d], expect: [calc(n, d)] }],
        hiddenTests: [
          { kind: 'call', fn: 'est_divisible', args: [10, 5], expect: [true] },
          { kind: 'call', fn: 'est_divisible', args: [10, 3], expect: [false] },
        ],
        solution: 'def est_divisible(n, d):\n    return n % d == 0',
        tips: [
          { pattern: 'if.*:\\s*\\n\\s*return True', advice: 'if cond: return True / else: return False se simplifie en : return cond. Le booléen est déjà là !', mode: 'avoid' },
        ],
      };
    }
    if (mode === 3) {
      const x = -ri(r, 1, 50);
      return {
        topic: F11.topic,
        title: `Valeur absolue ${i + 1}`,
        theory: THEORY_FONC,
        statement: `Complétez \`valeur_absolue(x)\` qui renvoie la valeur absolue de x **sans utiliser abs()**. Exemple : valeur_absolue(${x}) → ${-x}.`,
        starterCode: starterFn('def valeur_absolue(x):', [
          'Si x est négatif, renvoyez son opposé',
          'Sinon, renvoyez x tel quel',
        ]),
        hints: ['if x < 0: return -x', 'Sinon return x.', 'if x < 0:\n    return -x\nreturn x'],
        visibleTests: [{ kind: 'call', fn: 'valeur_absolue', args: [x], expect: [-x] }],
        hiddenTests: [
          { kind: 'call', fn: 'valeur_absolue', args: [42], expect: [42] },
          { kind: 'call', fn: 'valeur_absolue', args: [0], expect: [0] },
        ],
        solution: 'def valeur_absolue(x):\n    if x < 0:\n        return -x\n    return x',
        tips: [
          { pattern: 'abs\\(', advice: 'abs() est la fonction intégrée : en pratique utilisez-la. L\'exercice visait le raisonnement.', mode: 'prefer' },
        ],
      };
    }
    const c = ri(r, -10, 40);
    const calc = (x: number) => x * 9 / 5 + 32;
    return {
      topic: F11.topic,
      title: `Conversion Celsius ${i + 1}`,
      theory: THEORY_FONC,
      statement: `Complétez \`celsius_vers_fahrenheit(c)\` : la formule est F = C × 9/5 + 32. Exemple : celsius_vers_fahrenheit(${c}) → ${calc(c)}.`,
      starterCode: starterFn('def celsius_vers_fahrenheit(c):', [
        'Appliquez la formule : c * 9 / 5 + 32',
        'Un seul return',
      ]),
      hints: ['La multiplication et la division suffisent.', 'return c * 9 / 5 + 32', 'Attention à ne pas oublier le + 32.'],
      visibleTests: [{ kind: 'call', fn: 'celsius_vers_fahrenheit', args: [c], expect: [calc(c)], tol: 1e-9 }],
      hiddenTests: [
        { kind: 'call', fn: 'celsius_vers_fahrenheit', args: [100], expect: [212], tol: 1e-9 },
        { kind: 'call', fn: 'celsius_vers_fahrenheit', args: [0], expect: [32], tol: 1e-9 },
      ],
      solution: 'def celsius_vers_fahrenheit(c):\n    return c * 9 / 5 + 32',
      tips: [],
    };
  },
};

const THEORY_DICT = `## Dictionnaires et tuples

Un **dictionnaire** associe des **clés** à des **valeurs** :

\`\`\`
ages = {"Alice": 20, "Bob": 25}
ages["Alice"]        # 20 (accès par clé)
ages["Chloé"] = 22   # ajout / modification
"Bob" in ages        # True (test de clé)
ages.keys()          # les clés
ages.items()         # les paires (clé, valeur)
\`\`\`

Un **tuple** est une liste **immuable** : \`t = (3, 4)\`. On peut déballer : \`x, y = (3, 4)\`. Pratique pour renvoyer plusieurs valeurs : \`return quotient, reste\`.`;

const F12: FamSpec = {
  key: 'dicts-tuples',
  topic: 'Dictionnaires et tuples',
  count: 20,
  gen: (r, i) => {
    const mode = i % 4;
    if (mode === 0) {
      const mot = pick(r, ['ballon', 'lettre', 'programme', 'niveau', 'python']);
      const calc = (s: string) => {
        const d: Record<string, number> = {};
        for (const c of s) d[c] = (d[c] || 0) + 1;
        return d;
      };
      return {
        topic: F12.topic,
        title: `Compteur de lettres ${i + 1}`,
        theory: THEORY_DICT,
        statement: `Complétez \`compte_lettres(s)\` qui renvoie un dictionnaire associant chaque lettre à son nombre d'occurrences. Exemple : compte_lettres("${mot}") → \`${py(calc(mot))}\`.`,
        starterCode: starterFn('def compte_lettres(s):', [
          'Créez un dictionnaire vide : compte = {}',
          'Pour chaque caractère c de s :',
          '  si c est déjà une clé, incrémentez compte[c]',
          '  sinon initialisez compte[c] à 1',
          'Renvoyez compte',
        ]),
        hints: [
          'Le test c in compte dit si la clé existe.',
          'compte[c] = compte.get(c, 0) + 1 fait les deux cas en une ligne.',
          'compte = {}\nfor c in s:\n    compte[c] = compte.get(c, 0) + 1\nreturn compte',
        ],
        visibleTests: [{ kind: 'call', fn: 'compte_lettres', args: [mot], expect: [calc(mot)] }],
        hiddenTests: [{ kind: 'call', fn: 'compte_lettres', args: ['aba'], expect: [calc('aba')] }],
        solution: 'def compte_lettres(s):\n    compte = {}\n    for c in s:\n        compte[c] = compte.get(c, 0) + 1\n    return compte',
        tips: [
          { pattern: 'if c in compte', advice: 'Correct ! compte.get(c, 0) + 1 évite le if : la valeur par défaut 0 gère le premier passage.', mode: 'prefer' },
        ],
      };
    }
    if (mode === 1) {
      const d = { a: ri(r, 1, 9), b: ri(r, 10, 99), c: ri(r, 100, 999) };
      const inv = Object.fromEntries(Object.entries(d).map(([k, v]) => [String(v), k]));
      return {
        topic: F12.topic,
        title: `Dictionnaire inversé ${i + 1}`,
        theory: THEORY_DICT,
        statement: `Complétez \`inverse_dico(d)\` qui échange clés et valeurs. Exemple : inverse_dico(${py(d)}) → \`${py(inv)}\`. Parcourez avec \`for cle, valeur in d.items()\`.`,
        starterCode: starterFn('def inverse_dico(d):', [
          'resultat = {}',
          'for cle, valeur in d.items():',
          '  resultat[valeur] = cle',
          'Renvoyez resultat',
        ]),
        hints: [
          'd.items() donne les paires (clé, valeur).',
          'La valeur devient la clé : resultat[valeur] = cle.',
          'return {valeur: cle for cle, valeur in d.items()}',
        ],
        visibleTests: [{ kind: 'call', fn: 'inverse_dico', args: [d], expect: [inv] }],
        hiddenTests: [{ kind: 'call', fn: 'inverse_dico', args: [{ x: 1 }], expect: [{ 1: 'x' }] }],
        solution: 'def inverse_dico(d):\n    resultat = {}\n    for cle, valeur in d.items():\n        resultat[valeur] = cle\n    return resultat',
        tips: [
          { pattern: 'for', advice: 'Bien ! Version compréhension : {v: k for k, v in d.items()}.', mode: 'prefer' },
        ],
      };
    }
    if (mode === 2) {
      const a = ri(r, 50, 300), b = ri(r, 7, 19);
      const q = Math.floor(a / b), m = a % b;
      return {
        topic: F12.topic,
        title: `Quotient et reste ${i + 1}`,
        theory: THEORY_DICT,
        statement: `Complétez \`divise(a, b)\` qui renvoie un **tuple** (quotient, reste) de la division entière de a par b. Exemple : divise(${a}, ${b}) → (${q}, ${m}).`,
        starterCode: starterFn('def divise(a, b):', [
          'Un tuple s\'écrit avec des parenthèses et une virgule',
          'quotient = a // b, reste = a % b',
          'Renvoyez les deux valeurs séparées par une virgule (tuple)',
        ]),
        hints: [
          'Python permet return x, y (c\'est un tuple).',
          'La fonction intégrée divmod(a, b) fait exactement cela !',
          'return a // b, a % b',
        ],
        visibleTests: [{ kind: 'call', fn: 'divise', args: [a, b], expect: [[q, m]] }],
        hiddenTests: [{ kind: 'call', fn: 'divise', args: [100, 7], expect: [[14, 2]] }],
        solution: 'def divise(a, b):\n    return a // b, a % b',
        tips: [
          { pattern: 'divmod', advice: 'divmod(a, b) est la fonction intégrée prévue : renvoyez-la directement.', mode: 'prefer' },
        ],
      };
    }
    const nom = pick(r, PRENOMS), age = ri(r, 18, 40);
    return {
      topic: F12.topic,
      title: `Carnet d'adresses ${i + 1}`,
      theory: THEORY_DICT,
      statement: `Complétez \`cherche_age(annuaire, nom)\` : \`annuaire\` est un dictionnaire nom → âge. Renvoyez l'âge de \`nom\` s'il est présent, sinon la chaîne \`"inconnu"\`. Exemple : avec \`${py({ [nom]: age, 'Zoé': 21 })}\` et "${nom}", renvoyez ${age}.`,
      starterCode: starterFn('def cherche_age(annuaire, nom):', [
        'Testez si nom est une clé : if nom in annuaire',
        'Renvoyez annuaire[nom] ou "inconnu"',
      ]),
      hints: [
        'in teste l\'appartenance d\'une clé.',
        'annuaire.get(nom, "inconnu") fait tout en une ligne.',
        'return annuaire.get(nom, "inconnu")',
      ],
      visibleTests: [{ kind: 'call', fn: 'cherche_age', args: [{ [nom]: age, Zoé: 21 }, nom], expect: [age] }],
      hiddenTests: [
        { kind: 'call', fn: 'cherche_age', args: [{ [nom]: age }, 'Personne'], expect: ['inconnu'] },
        { kind: 'call', fn: 'cherche_age', args: [{}, 'X'], expect: ['inconnu'] },
      ],
      solution: 'def cherche_age(annuaire, nom):\n    if nom in annuaire:\n        return annuaire[nom]\n    return "inconnu"',
      tips: [
        { pattern: 'if nom in annuaire', advice: 'Correct ! annuaire.get(nom, "inconnu") est l\'idiome : une ligne, sans répéter le nom.', mode: 'prefer' },
      ],
    };
  },
};

export const PHASE1: FamSpec[] = [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12];
