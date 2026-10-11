import { LEVELS } from '@/levels';
import type { Level } from '@/types/level';

export type LessonKind = 'Théorie' | 'Atelier' | 'Laboratoire' | 'Révision' | 'Quiz';
export interface CurriculumLesson { title: string; kind: LessonKind; steps: Level[]; }
export interface CurriculumModule { title: string; lessons: CurriculumLesson[]; totalSteps: number; }
export interface CurriculumCourse { title: string; modules: CurriculumModule[]; totalSteps: number; }

type LessonDef = [string, LessonKind];
const moduleDefs: Array<[string, LessonDef[]]> = [
  ['Python Basics', [
    ['Introduction to Python', 'Théorie'], ['Understanding Variables and Data Types', 'Théorie'], ['Build a Report Card Printer', 'Atelier'], ['Introduction to Strings', 'Théorie'], ['Build an Employee Profile Generator', 'Atelier'], ['Build an Employee Profile Validator', 'Atelier'], ['Numbers and Mathematical Operations', 'Théorie'], ['Build a Bill Splitter', 'Atelier'], ['Booleans and Conditionals', 'Théorie'], ['Build a Movie Ticket Booking Calculator', 'Atelier'], ['Build a Travel Weather Planner', 'Laboratoire'], ['Understanding Functions and Scope', 'Théorie'], ['Build a Kitchen Inventory Tracker', 'Atelier'], ['Build an Apply Discount Function', 'Laboratoire'], ['Build a Caesar Cipher', 'Atelier'], ['Build an RPG Character', 'Laboratoire'], ['Python Basics Review', 'Révision'], ['Python Basics Quiz', 'Quiz'],
  ]],
  ['Install Python', [['Installing Python and Running Code Locally', 'Théorie'], ['Python Installation Review', 'Révision'], ['Python Installation Quiz', 'Quiz']]],
  ['Loops and Sequences', [['Working with Loops and Sequences', 'Théorie'], ['Build a Pin Extractor', 'Atelier'], ['Build a Number Pattern Generator', 'Laboratoire'], ['Loops and Sequences Review', 'Révision'], ['Loops and Sequences Quiz', 'Quiz']]],
  ['Dictionaries and Sets', [['Working with Dictionaries and Sets', 'Théorie'], ['Working with Modules', 'Théorie'], ['Build a Medical Data Validator', 'Atelier'], ['Dictionaries and Sets Review', 'Révision'], ['Dictionaries and Sets Quiz', 'Quiz']]],
  ['Error Handling', [['Understanding Error Handling', 'Théorie'], ['Debug an ISBN Validator', 'Laboratoire'], ['Error Handling Review', 'Révision'], ['Error Handling Quiz', 'Quiz']]],
  ['Classes and Objects', [['Classes and Objects', 'Théorie'], ['Build a Musical Instrument Inventory', 'Atelier'], ['Build a Planet Class', 'Laboratoire'], ['Build an Email Simulator', 'Atelier'], ['Classes and Objects Review', 'Révision'], ['Classes and Objects Quiz', 'Quiz']]],
  ['Object-Oriented Programming (OOP)', [['Understanding Object Oriented Programming and Encapsulation', 'Théorie'], ['Build a Salary Tracker', 'Atelier'], ['Build a Game Character Stats Tracker', 'Laboratoire'], ['Understanding Inheritance and Polymorphism', 'Théorie'], ['Build a Media Catalogue', 'Atelier'], ['Understanding Abstraction', 'Théorie'], ['Build a Discount Calculator', 'Atelier'], ['Build a Player Interface', 'Laboratoire'], ['Object Oriented Programming Review', 'Révision'], ['Object Oriented Programming Quiz', 'Quiz']]],
  ['Linear Data Structures', [['Working with Common Data Structures', 'Théorie'], ['Build a Linked List', 'Atelier'], ['Data Structures Review', 'Révision'], ['Data Structures Quiz', 'Quiz']]],
  ['Recursion', [['Understanding Recursion and the Call Stack', 'Théorie'], ['Build a Countup Function', 'Atelier'], ['Build a Range of Numbers Generator', 'Laboratoire'], ['Review Recursion', 'Révision'], ['Recursion Quiz', 'Quiz']]],
  ['Algorithms', [['Searching and Sorting Algorithms', 'Théorie'], ['Implement the Binary Search Algorithm', 'Atelier'], ['Implement the Bisection Method', 'Laboratoire'], ['Implement the Merge Sort Algorithm', 'Atelier'], ['Implement the Quicksort Algorithm', 'Laboratoire'], ['Implement the Selection Sort Algorithm', 'Laboratoire'], ['Implement the Luhn Algorithm', 'Laboratoire'], ['Searching and Sorting Algorithms Review', 'Révision'], ['Searching and Sorting Algorithms Quiz', 'Quiz']]],
  ['Graphs and Trees', [['Understanding Graphs and Trees', 'Théorie'], ['Implement the Shortest Path Algorithm', 'Atelier'], ['Build an Adjacency List to Matrix Converter', 'Laboratoire'], ['Implement the Breadth-First Search Algorithm', 'Atelier'], ['Implement the Depth-First Search Algorithm', 'Laboratoire'], ['Implement the Depth-First Search Algorithm', 'Laboratoire'], ['Implement the N-Queens Algorithm', 'Laboratoire'], ['Graphs and Trees Review', 'Révision'], ['Graphs and Trees Quiz', 'Quiz']]],
  ['Dynamic Programming', [['Understanding Dynamic Programming', 'Théorie'], ['Build an Nth Fibonacci Number Calculator', 'Laboratoire'], ['Dynamic Programming Review', 'Révision'], ['Dynamic Programming Quiz', 'Quiz']]],
  ['Python Review', [['Python Review', 'Révision']]],
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
