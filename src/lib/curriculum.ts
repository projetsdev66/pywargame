import { LEVELS } from '@/levels';
import type { Level } from '@/types/level';

export type LessonKind = 'Théorie' | 'Atelier' | 'Laboratoire' | 'Révision' | 'Quiz';
export interface CurriculumLesson { title: string; kind: LessonKind; steps: Level[]; }
export interface CurriculumModule { title: string; lessons: CurriculumLesson[]; totalSteps: number; }
export interface CurriculumCourse { title: string; modules: CurriculumModule[]; totalSteps: number; }

type LessonDef = [string, LessonKind];
const moduleDefs: Array<[string, LessonDef[]]> = [
  ['Bases de Python', [
    ['Introduction à Python', 'Théorie'], ['Comprendre les variables et les types de données', 'Théorie'], ['Créer un générateur de bulletin scolaire', 'Atelier'], ['Introduction aux chaînes de caractères', 'Théorie'], ['Créer un générateur de profil employé', 'Atelier'], ['Créer un validateur de profil employé', 'Atelier'], ['Nombres et opérations mathématiques', 'Théorie'], ['Créer un calculateur de partage d’addition', 'Atelier'], ['Booléens et conditions', 'Théorie'], ['Créer un calculateur de réservation de cinéma', 'Atelier'], ['Créer un planificateur météo de voyage', 'Laboratoire'], ['Comprendre les fonctions et la portée', 'Théorie'], ['Créer un inventaire de cuisine', 'Atelier'], ['Créer une fonction d’application de remise', 'Laboratoire'], ['Créer un chiffrement de César', 'Atelier'], ['Créer un personnage de RPG', 'Laboratoire'], ['Révision des bases de Python', 'Révision'], ['Quiz sur les bases de Python', 'Quiz'],
  ]],
  ['Installer Python', [['Installer Python et exécuter du code localement', 'Théorie'], ['Révision de l’installation de Python', 'Révision'], ['Quiz sur l’installation de Python', 'Quiz']]],
  ['Boucles et séquences', [['Travailler avec les boucles et les séquences', 'Théorie'], ['Créer un extracteur de code PIN', 'Atelier'], ['Créer un générateur de motifs numériques', 'Laboratoire'], ['Révision des boucles et des séquences', 'Révision'], ['Quiz sur les boucles et les séquences', 'Quiz']]],
  ['Dictionnaires et ensembles', [['Travailler avec les dictionnaires et les ensembles', 'Théorie'], ['Travailler avec les modules', 'Théorie'], ['Créer un validateur de données médicales', 'Atelier'], ['Révision des dictionnaires et des ensembles', 'Révision'], ['Quiz sur les dictionnaires et les ensembles', 'Quiz']]],
  ['Gestion des erreurs', [['Comprendre la gestion des erreurs', 'Théorie'], ['Déboguer un validateur ISBN', 'Laboratoire'], ['Révision de la gestion des erreurs', 'Révision'], ['Quiz sur la gestion des erreurs', 'Quiz']]],
  ['Classes et objets', [['Classes et objets', 'Théorie'], ['Créer un inventaire d’instruments de musique', 'Atelier'], ['Créer une classe Planète', 'Laboratoire'], ['Créer un simulateur d’e-mails', 'Atelier'], ['Révision des classes et des objets', 'Révision'], ['Quiz sur les classes et les objets', 'Quiz']]],
  ['Programmation orientée objet (POO)', [['Comprendre la programmation orientée objet et l’encapsulation', 'Théorie'], ['Créer un suivi des salaires', 'Atelier'], ['Créer un suivi des statistiques de personnage', 'Laboratoire'], ['Comprendre l’héritage et le polymorphisme', 'Théorie'], ['Créer un catalogue multimédia', 'Atelier'], ['Comprendre l’abstraction', 'Théorie'], ['Créer un calculateur de remise', 'Atelier'], ['Créer une interface de joueur', 'Laboratoire'], ['Révision de la programmation orientée objet', 'Révision'], ['Quiz sur la programmation orientée objet', 'Quiz']]],
  ['Structures de données linéaires', [['Travailler avec les structures de données courantes', 'Théorie'], ['Créer une liste chaînée', 'Atelier'], ['Révision des structures de données', 'Révision'], ['Quiz sur les structures de données', 'Quiz']]],
  ['Récursivité', [['Comprendre la récursivité et la pile d’appels', 'Théorie'], ['Créer une fonction de comptage croissant', 'Atelier'], ['Créer un générateur d’intervalles de nombres', 'Laboratoire'], ['Révision de la récursivité', 'Révision'], ['Quiz sur la récursivité', 'Quiz']]],
  ['Algorithmes', [['Algorithmes de recherche et de tri', 'Théorie'], ['Implémenter l’algorithme de recherche binaire', 'Atelier'], ['Implémenter la méthode de dichotomie', 'Laboratoire'], ['Implémenter l’algorithme de tri fusion', 'Atelier'], ['Implémenter l’algorithme de tri rapide', 'Laboratoire'], ['Implémenter l’algorithme de tri par sélection', 'Laboratoire'], ['Implémenter l’algorithme de Luhn', 'Laboratoire'], ['Révision des algorithmes de recherche et de tri', 'Révision'], ['Quiz sur les algorithmes de recherche et de tri', 'Quiz']]],
  ['Graphes et arbres', [['Comprendre les graphes et les arbres', 'Théorie'], ['Implémenter l’algorithme du plus court chemin', 'Atelier'], ['Créer un convertisseur de liste d’adjacence en matrice', 'Laboratoire'], ['Implémenter l’algorithme de parcours en largeur', 'Atelier'], ['Implémenter l’algorithme de parcours en profondeur', 'Laboratoire'], ['Implémenter l’algorithme de parcours en profondeur', 'Laboratoire'], ['Implémenter l’algorithme des huit reines', 'Laboratoire'], ['Révision des graphes et des arbres', 'Révision'], ['Quiz sur les graphes et les arbres', 'Quiz']]],
  ['Programmation dynamique', [['Comprendre la programmation dynamique', 'Théorie'], ['Créer un calculateur du nombre de Fibonacci', 'Laboratoire'], ['Révision de la programmation dynamique', 'Révision'], ['Quiz sur la programmation dynamique', 'Quiz']]],
  ['Révision de Python', [['Révision de Python', 'Révision']]],
];

const lessonCount = moduleDefs.reduce((sum, [, defs]) => sum + defs.length, 0);
const baseStepCount = Math.floor(LEVELS.length / lessonCount);
let remainingSteps = LEVELS.length % lessonCount;
let levelOffset = 0;

export const CURRICULUM: CurriculumCourse = (() => {
  const modules = moduleDefs.map(([title, defs]) => {
    const lessons = defs.map(([lessonTitle, kind]) => {
      const size = baseStepCount + (remainingSteps-- > 0 ? 1 : 0);
      const steps = LEVELS.slice(levelOffset, levelOffset + size);
      levelOffset += size;
      return { title: lessonTitle, kind, steps };
    });
    return { title, lessons, totalSteps: lessons.reduce((sum, lesson) => sum + lesson.steps.length, 0) };
  });
  return { title: 'Python', modules, totalSteps: modules.reduce((sum, module) => sum + module.totalSteps, 0) };
})();
