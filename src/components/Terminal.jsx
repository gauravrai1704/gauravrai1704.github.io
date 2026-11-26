import { useEffect, useRef, useState } from 'react';
import { archive, links, projects } from '../data.js';
import { openProject } from './Sections.jsx';

const external = {
  github: links.github,
  linkedin: links.linkedin,
  leetcode: links.leetcode,
  kaggle: links.kaggle,
  resume: links.resume,
};

function run(raw) {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = (args[0] || '').toLowerCase();
  switch ((cmd || '').toLowerCase()) {
    case '':
      return [];
    case 'help':
      return [
        'whoami            who is this',
        'ls                list projects',
        'cat <id>          one-line summary of a project',
        'open <id|link>    open a datasheet or: github linkedin leetcode kaggle resume',
        'email             copy my email',
        'clear             clear the screen',
      ];
    case 'whoami':
      return [
        'Gaurav Rai — CSE @ Shiv Nadar University (2024–28), CGPA 9.52',
        'AI systems · LLM inference · trustworthy ML · ' + links.location,
      ];
    case 'ls':
      return [
        ...projects.map((p) => `${p.id.padEnd(12)} ${p.year.padEnd(8)} ${p.name}`),
        ...archive.map((p) => `${p.id.padEnd(12)} ${p.year.padEnd(8)} ${p.name}  (archive)`),
      ];
    case 'cat': {
      const p = [...projects, ...archive].find((x) => x.id === arg);
      if (!p) return [`cat: ${arg || '<id>'}: no such project — try ls`];
      return [p.oneliner || p.note];
    }
    case 'open': {
      if (projects.some((p) => p.id === arg)) {
        openProject(arg);
        return [`opening datasheet ${arg}…`];
      }
      const a = archive.find((p) => p.id === arg);
      const href = external[arg] || a?.href;
      if (href) {
        window.open(href, '_blank', 'noopener');
        return [`→ ${href}`];
      }
      return [`open: ${arg || '<target>'}: not found`];
    }
    case 'email':
    case 'mail':
    case 'contact':
      navigator.clipboard?.writeText(links.email).catch(() => {});
      return [`${links.email}  (copied to clipboard)`];
    case 'sudo':
      return ['permission denied. nice try, though.'];
    case 'rm':
      return ['rm: refusing to remove anything. everything here has a receipt.'];
    case 'exit':
      return ['there is no exit. only the email: ' + links.email];
    default:
      return [`${cmd}: command not found — type help`];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState([
    { k: 'out', t: 'gr-shell 1.0 — type `help`, or just email me.' },
  ]);
  const [value, setValue] = useState('');
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit(e) {
    e.preventDefault();
    const v = value;
    if (v.trim().toLowerCase() === 'clear') {
      setLines([]);
    } else {
      const out = run(v).map((t) => ({ k: 'out', t }));
      setLines((l) => [...l, { k: 'in', t: v }, ...out]);
    }
    if (v.trim()) setHist((h) => [v, ...h]);
    setHi(-1);
    setValue('');
  }

  function key(e) {
    if (e.key === 'ArrowUp' && hist.length) {
      e.preventDefault();
      const n = Math.min(hi + 1, hist.length - 1);
      setHi(n); setValue(hist[n]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = hi - 1;
      setHi(n); setValue(n >= 0 ? hist[n] : '');
    }
  }

  const quick = ['whoami', 'ls', 'open github', 'email'];

  return (
    <div className="term mono" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="term__bar">
        <span className="term__lights"><i /><i /><i /></span>
        <span>gaurav-rai — zsh — 80×24</span>
      </div>
      <div className="term__body" ref={bodyRef} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={`term__line term__line--${l.k}`}>
            {l.k === 'in' && <span className="term__ps">❯ </span>}
            {l.t}
          </div>
        ))}
        <form onSubmit={submit} className="term__form">
          <label htmlFor="term-in" className="term__ps">❯</label>
          <input
            id="term-in"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={key}
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal command"
          />
        </form>
      </div>
      <div className="term__quick">
        {quick.map((q) => (
          <button
            key={q}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const out = run(q).map((t) => ({ k: 'out', t }));
              setLines((l) => [...l, { k: 'in', t: q }, ...out]);
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
