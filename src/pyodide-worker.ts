// Worker Pyodide : exécute le code de l'élève en isolation, avec capture de stdout
// et appels de fonctions de test. Le thread principal impose un timeout (terminate).

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

let pyodide: any = null;
let numpyReady = false;

async function init(needNumpy: boolean) {
  if (!pyodide) {
    (self as any).importScripts(PYODIDE_CDN + 'pyodide.js');
    pyodide = await (self as any).loadPyodide({ indexURL: PYODIDE_CDN });
  }
  if (needNumpy && !numpyReady) {
    await pyodide.loadPackage('numpy');
    numpyReady = true;
  }
}

self.onmessage = async (e: MessageEvent) => {
  const { id, code, calls, needNumpy } = e.data;
  try {
    await init(!!needNumpy);
    // Capture stdout
    pyodide.setStdout({ batched: (s: string) => { stdoutBuf.push(s); } });
    pyodide.setStderr({ batched: (s: string) => { stdoutBuf.push(s); } });
  } catch (err: any) {
    (self as any).postMessage({ id, error: 'INIT: ' + String(err) });
    return;
  }
  stdoutBuf = [];
  try {
    // Namespace frais à chaque exécution
    const globals = pyodide.globals.get('dict')();
    await pyodide.runPythonAsync(code, { globals });
    const results: any[] = [];
    for (const c of calls || []) {
      try {
        const fn = globals.get(c.fn);
        if (!fn) {
          results.push({ ok: false, error: `La fonction « ${c.fn} » n'est pas définie.` });
          continue;
        }
        // Conversion des arguments : les chaînes « __LAMBDA__expr » deviennent
        // de vraies fonctions Python (lambda x: expr, lambda t, y: expr selon les virgules au 1er niveau).
        const argsJs = c.args.map((a: any) => {
          if (typeof a === 'string' && a.startsWith('__LAMBDA__')) {
            const expr = a.slice('__LAMBDA__'.length);
            const depth = (s: string) => {
              let d = 0, found = false;
              for (const ch of s) {
                if (ch === '(' || ch === '[') d++;
                if (ch === ')' || ch === ']') d--;
                if (ch === ',' && d === 0) found = true;
              }
              return found;
            };
            // Nom du paramètre adapté aux variables utilisées dans l'expression
            const usesY = /(^|[^a-zA-Z_])y([^a-zA-Z_]|$)/.test(expr);
            const usesT = /(^|[^a-zA-Z_])t([^a-zA-Z_]|$)/.test(expr);
            const sig = usesY || usesT ? 't, y' : 'x';
            const lam = pyodide.runPython(`lambda ${sig}: ${expr}`, { globals });
            void depth;
            return lam;
          }
          return JSON.parse(JSON.stringify(a));
        });
        let res = fn(...argsJs);
        if (res && typeof res.tolist === 'function') res = res.tolist(); // numpy → liste
        if (res && typeof res.toJs === 'function') {
          res = res.toJs({ dict_converter: Object.fromEntries });
        }
        if (res instanceof Map) res = Object.fromEntries(res);
        if (res && res.constructor && res.constructor.name === 'PyProxy') res = undefined;
        results.push({ ok: true, got: sanitize(res) });
      } catch (callErr: any) {
        results.push({ ok: false, error: cleanError(String(callErr)) });
      }
    }
    globals.destroy && globals.destroy();
    (self as any).postMessage({ id, stdout: stdoutBuf.join('\n'), results });
  } catch (err: any) {
    (self as any).postMessage({ id, stdout: stdoutBuf.join('\n'), error: cleanError(String(err)) });
  }
};

let stdoutBuf: string[] = [];

function sanitize(v: any): any {
  if (v === undefined) return null;
  if (ArrayBuffer.isView(v)) return Array.from(v as any).map(sanitize);
  if (Array.isArray(v)) return v.map(sanitize);
  if (v && typeof v === 'object') {
    const o: any = {};
    for (const k of Object.keys(v)) o[k] = sanitize(v[k]);
    return o;
  }
  if (typeof v === 'number' && !Number.isFinite(v)) return String(v);
  return v;
}

function cleanError(msg: string): string {
  const lines = msg.split('\n').map((line) => line.trimEnd()).filter((line) => !line.includes('pyodide') && !line.includes('at '));
  const location = lines.find((line) => /File .*line \d+/.test(line));
  const codeLine = lines.find((line, index) => index > 0 && /^\s*\^?$/.test(line) === false && !/Traceback|File /.test(line) && !/Error|Exception/.test(line));
  const errorLine = [...lines].reverse().find((line) => /(?:Error|Exception|Warning):/.test(line)) ?? lines[lines.length - 1] ?? 'Erreur inconnue.';
  const match = errorLine.match(/^([A-Za-z]+(?:Error|Exception|Warning)):\s*(.*)$/);
  const type = match?.[1] ?? 'Erreur Python';
  const message = match?.[2] ?? errorLine;
  const profile = errorProfile(type, message);
  const output = [`${profile.title} (${type})`, `Message : ${message}`];
  if (location) output.push(`Emplacement : ${location.replace(/^.*File /, 'fichier ')}`);
  if (codeLine && codeLine.length < 160) output.push(`Ligne repérée : ${codeLine.trim()}`);
  output.push(`\nExplication : ${profile.explanation}`, `Question à se poser : ${profile.question}`);
  return output.join('\n');
}

function errorProfile(type: string, message: string): { title: string; explanation: string; question: string } {
  if (/SyntaxError|IndentationError/.test(type)) return { title: 'La structure du code est invalide', explanation: 'Python ne peut pas lire la structure : vérifiez les deux-points, les parenthèses et l’indentation du bloc indiqué.', question: 'Chaque if, for, while et def possède-t-il un bloc indenté après ses deux-points ?' };
  if (/NameError/.test(type)) return { title: 'Un nom est inconnu', explanation: 'Une variable ou une fonction est utilisée avant d’avoir été définie, ou son orthographe ne correspond pas.', question: 'Où ce nom est-il créé, et est-il écrit exactement de la même façon ?' };
  if (/TypeError/.test(type)) return { title: 'Des types incompatibles sont utilisés', explanation: 'L’opération ou l’appel ne convient pas au type de valeur reçu. Utilisez par exemple int(), float() ou str() si la conversion est justifiée.', question: 'Quel est le type de chacune des valeurs de cette expression ?' };
  if (/ZeroDivisionError/.test(type)) return { title: 'Division par zéro', explanation: 'Le dénominateur vaut zéro dans ce cas. Il faut traiter ce cas avant d’effectuer la division.', question: 'Que doit renvoyer votre fonction lorsque le diviseur vaut zéro ?' };
  if (/IndexError/.test(type)) return { title: 'Indice hors limites', explanation: 'L’indice demandé n’existe pas dans la séquence. Une liste de longueur n possède les indices de 0 à n-1.', question: 'Quelle est la longueur de la liste et quelles sont ses bornes valides ?' };
  if (/KeyError/.test(type)) return { title: 'Clé absente du dictionnaire', explanation: 'La clé demandée n’est pas présente. Utilisez get() ou testez son appartenance si l’absence est possible.', question: 'Que doit-il se passer lorsque cette clé n’existe pas ?' };
  if (/AttributeError/.test(type)) return { title: 'Attribut ou méthode indisponible', explanation: 'La valeur n’a pas cet attribut ou cette méthode. Vérifiez son type et le nom exact de l’opération.', question: 'La méthode appelée appartient-elle réellement à ce type de valeur ?' };
  if (/ValueError/.test(type)) return { title: 'Valeur impossible pour cette opération', explanation: 'Le type est accepté, mais la valeur ne respecte pas le format ou le domaine attendu.', question: 'Quelle condition sur l’entrée faut-il vérifier avant cette conversion ou ce calcul ?' };
  if (/RecursionError/.test(type)) return { title: 'Récursion trop profonde', explanation: 'Les appels récursifs ne rejoignent pas assez vite le cas de base, ou la taille du problème ne diminue pas.', question: 'Quelle quantité diminue strictement à chaque appel ?' };
  return { title: 'Le programme a rencontré une erreur', explanation: message || 'Le message Python doit être lu avec la ligne indiquée pour localiser la cause.', question: 'Quelle est la première ligne de votre code qui reçoit une valeur inattendue ?' };
}
