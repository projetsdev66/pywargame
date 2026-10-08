import type React from 'react';

export function Markdown({ text }: { text: string }) {
  const blocks: { type: 'code' | 'text'; content: string }[] = [];
  const parts = text.split('```');
  parts.forEach((part, index) => {
    if (index % 2 === 1) blocks.push({ type: 'code', content: part.replace(/^\n/, '') });
    else if (part.trim()) blocks.push({ type: 'text', content: part });
  });

  const inline = (value: string, keyBase: string) => {
    const output: (string | React.ReactNode)[] = [];
    value.split(/(`[^`]+`)/g).forEach((segment, index) => {
      if (segment.startsWith('`') && segment.endsWith('`')) {
        output.push(
          <code className="inline-code" key={`${keyBase}-${index}`}>
            {segment.slice(1, -1)}
          </code>,
        );
      } else {
        segment.split(/(\*\*[^*]+\*\*)/g).forEach((subsegment, subIndex) => {
          if (subsegment.startsWith('**') && subsegment.endsWith('**')) {
            output.push(<strong key={`${keyBase}-${index}-${subIndex}`}>{subsegment.slice(2, -2)}</strong>);
          } else if (subsegment) {
            output.push(subsegment);
          }
        });
      }
    });
    return output;
  };

  return (
    <div className="markdown-content">
      {blocks.map((block, blockIndex) => (
        block.type === 'code' ? (
          <pre className="markdown-code" key={blockIndex}>
            {block.content.replace(/\n$/, '')}
          </pre>
        ) : (
          <div className="markdown-text-block" key={blockIndex}>
            {block.content.split('\n').map((line, lineIndex) => {
              const key = `${blockIndex}-${lineIndex}`;
              if (line.startsWith('## ')) {
                return <h3 className="markdown-heading" key={key}>{line.slice(3)}</h3>;
              }
              if (line.startsWith('- ')) {
                return (
                  <div className="markdown-list-item" key={key}>
                    <span className="markdown-list-marker" aria-hidden="true" />
                    <span>{inline(line.slice(2), key)}</span>
                  </div>
                );
              }
              if (!line.trim()) return null;
              return <p key={key}>{inline(line, key)}</p>;
            })}
          </div>
        )
      ))}
    </div>
  );
}
