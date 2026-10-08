import json, io, sys, math, re, contextlib, signal, traceback
L = json.load(open(sys.argv[1]))

def to_json(v):
    try:
        import numpy as np
        if isinstance(v, np.ndarray): v = v.tolist()
        elif isinstance(v, (np.integer,)): v = int(v)
        elif isinstance(v, (np.floating,)): v = float(v)
        elif isinstance(v, np.bool_): v = bool(v)
    except ImportError: pass
    if isinstance(v, (list, tuple)): return [to_json(x) for x in v]
    if isinstance(v, dict): return {str(k): to_json(x) for k, x in v.items()}
    if isinstance(v, float) and not math.isfinite(v): return str(v)
    if v is None: return None
    if isinstance(v, (set, frozenset)): return None
    return v

def deq(a, b, tol=0):
    if isinstance(a, bool) or isinstance(b, bool): return a is b or (isinstance(a,bool) and isinstance(b,bool) and a==b)
    if isinstance(a,(int,float)) and isinstance(b,(int,float)):
        if tol>0: return abs(a-b) <= tol*max(1,abs(b))
        return a==b or abs(a-b)<1e-12
    if isinstance(a,list) and isinstance(b,list): return len(a)==len(b) and all(deq(x,y,tol) for x,y in zip(a,b))
    if isinstance(a,dict) and isinstance(b,dict): return a.keys()==b.keys() and all(deq(a[k],b[k],tol) for k in a)
    return a==b

def norm(s): return re.sub(r'\n+$','',re.sub(r'[ \t]+\n','\n',s.replace('\r',''))).strip()

class TO(Exception): pass
def handler(*a): raise TO()
signal.signal(signal.SIGALRM, handler)

def run(code, tests):
    """returns list of (passed, detail) per test, or ('ERR', msg)"""
    g = {'__name__':'__main__'}
    buf = io.StringIO()
    signal.alarm(10)
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code,'<eleve>','exec'), g)
        res=[]
        for tt in tests:
            t=tt['t']
            if t['kind']=='stdout':
                got=norm(buf.getvalue()); res.append((any(norm(e)==got for e in t['expect']), f"stdout={got!r} exp={t['expect'][:1]}"))
            else:
                fn=g.get(t['fn'])
                if fn is None: res.append((False,'fn undefined')); continue
                args=[]
                for a in t['args']:
                    if isinstance(a,str) and a.startswith('__LAMBDA__'):
                        e=a[10:]
                        usesY=re.search(r'(^|[^a-zA-Z_])y([^a-zA-Z_]|$)',e); usesT=re.search(r'(^|[^a-zA-Z_])t([^a-zA-Z_]|$)',e)
                        sig='t, y' if (usesY or usesT) else 'x'
                        args.append(eval(f'lambda {sig}: {e}', g))
                    else: args.append(json.loads(json.dumps(a)))
                try:
                    with contextlib.redirect_stdout(io.StringIO()):
                        got=to_json(fn(*args))
                except Exception as ex:
                    res.append((False,f'call error {ex!r}')); continue
                res.append((any(deq(got,e,t.get('tol',0) or 0) for e in t['expect']), f"{t['fn']}{tuple(t['args'])!r} -> {got!r} exp={t['expect'][:1]}"))
        return res
    except TO: return 'TIMEOUT'
    except BaseException as ex: return 'ERR '+repr(ex)
    finally: signal.alarm(0)

bad_sol=[]; starter_pass=[]; no_tests=[]
for l in L:
    if not l['tests']: no_tests.append(l['id'])
    r = run(l['solution'], l['tests'])
    if isinstance(r,str) or not all(p for p,_ in r):
        bad_sol.append((l['id'], l['title'], r if isinstance(r,str) else [d for p,d in r if not p][:2]))
    rs = run(l['starter'], l['tests'])
    if not isinstance(rs,str) and l['tests'] and all(p for p,_ in rs):
        starter_pass.append((l['id'], l['title']))
print('niveaux:',len(L))
print('solutions KO:',len(bad_sol))
for b in bad_sol[:40]: print('  ',b)
print('starter qui passe déjà:',len(starter_pass), starter_pass[:10])
print('sans tests:',no_tests[:10])
sys.exit(1 if (bad_sol or starter_pass or no_tests) else 0)
