// Contrôle des niveaux : chaque correction doit passer tous ses tests, et le code
// de départ ne doit jamais les passer. Nécessite node, tsc (devDependency) et python3
// (avec numpy pour la phase 3).  Usage : npm run check:levels
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pywargame-'));
fs.mkdirSync(path.join(tmp, 'levels')); fs.mkdirSync(path.join(tmp, 'types'));
for (const f of fs.readdirSync(path.join(root, 'src/levels'))) {
  const s = fs.readFileSync(path.join(root, 'src/levels', f), 'utf8')
    .replace(/from '\.\/(util|phase\d|index)'/g, "from './$1.js'")
    .replace(/from '@\/types\/level'/g, "from '../types/level.js'");
  fs.writeFileSync(path.join(tmp, 'levels', f), s);
}
fs.copyFileSync(path.join(root, 'src/types/level.ts'), path.join(tmp, 'types/level.ts'));
fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}');
fs.writeFileSync(path.join(tmp, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { target: 'es2022', module: 'nodenext', moduleResolution: 'nodenext', outDir: 'out', strict: false, skipLibCheck: true, types: [] },
  include: ['levels/*.ts', 'types/*.ts'],
}));
spawnSync('npx', ['tsc', '-p', tmp], { stdio: 'inherit' });
const { LEVELS, NUMPY_LEVELS } = await import(pathToFileURL(path.join(tmp, 'out/levels/index.js')).href);
const data = LEVELS.map((l) => ({
  id: l.id, phase: l.phase, title: l.title, numpy: NUMPY_LEVELS.has(l.id),
  starter: l.starterCode, solution: l.solution, tips: l.tips,
  tests: [...l.visibleTests.map((t) => ({ t, v: true })), ...l.hiddenTests.map((t) => ({ t, v: false }))],
}));
const json = path.join(tmp, 'levels.json');
fs.writeFileSync(json, JSON.stringify(data));
const r = spawnSync('python3', [path.join(root, 'scripts/check_levels.py'), json], { stdio: 'inherit' });
process.exit(r.status ?? 1);
