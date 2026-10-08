// Rendu minimaliste du markdown des fiches de cours : ## titres, ``` blocs de code,
// `code inline`, **gras**, listes à puces.
import type React from 'react';

export function Markdown({ text }: { text: string }) {
  const blocks: { type: 'code' | 'text'; content: string }[] = [];
  const parts = text.split('```');
  parts.forEach((p, i) => {
    if (i % 2 === 1) blocks.push({ type: 'code', content: p.replace(/^\n/, '') });
    else if (p.trim()) blocks.push({ type: 'text', content: p });
  });

  const inline = (s: string, keyBase: string) => {
    // découpe sur `code` puis **gras**
    const out: (string | React.ReactNode)[] = [];
    s.split(/(`[^`]+`)/g).forEach((seg, i) => {
      if (seg.startsWith('`') && seg.endsWith('`')) {
        out.push(
          <code key={keyBase + i} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-pink-700">
            {seg.slice(1, -1)}
          </code>
        );
      } else {
        seg.split(/(\*\*[^*]+\*\*)/g).forEach((sub, j) => {
          if (sub.startsWith('**') && sub.endsWith('**'))
            out.push(<strong key={keyBase + i + '-' + j} className="font-semibold text-slate-900">{sub.slice(2, -2)}</strong>);
          else if (sub) out.push(sub);
        });
      }
    });
    return out;
  };

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-700">
      {blocks.map((b, i) =>
        b.type === 'code' ? (
          <pre key={i} className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-[13px] leading-relaxed text-emerald-200">
            {b.content.replace(/\n$/, '')}
          </pre>
        ) : (
          <div key={i} className="space-y-2">
            {b.content.split('\n').map((line, j) => {
              const k = `${i}-${j}`;
              if (line.startsWith('## '))
                return <h3 key={k} className="pt-1 text-lg font-bold text-slate-900">{line.slice(3)}</h3>;
              if (line.startsWith('- '))
                return (
                  <div key={k} className="flex gap-2 pl-1">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    <span>{inline(line.slice(2), k)}</span>
                  </div>
                );
              if (!line.trim()) return null;
              return <p key={k}>{inline(line, k)}</p>;
            })}
          </div>
        )
      )}
    </div>
  );
}
