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
  // Garder seulement les lignes utiles du traceback
  const lines = msg.split('\n').filter((l) => !l.includes('pyodide') && !l.includes('at '));
  const idx = lines.findIndex((l) => /Error|Exception/.test(l));
  return idx >= 0 ? lines.slice(Math.max(0, idx - 3)).join('\n').trim() : lines.slice(-6).join('\n').trim();
}
