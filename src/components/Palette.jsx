import { useEffect, useMemo, useRef, useState } from 'react';
import { archive, links, projects, sections } from '../data.js';
import { openProject } from './Sections.jsx';

function items() {
  return [
    ...sections.map((s) => ({
      group: 'Go to', label: `${s.no} ${s.label}`, hint: `#${s.id}`,
      run: () => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }),
    })),
    ...projects.map((p) => ({
      group: 'Datasheet', label: p.name, hint: p.title, keys: p.stack.join(' ') + ' ' + p.domains.join(' '), run: () => openProject(p.id),
    })),
    ...archive.map((p) => ({
      group: 'Archive', label: p.name, hint: p.stack, run: () => window.open(p.href, '_blank', 'noopener'),
    })),
    { group: 'Links', label: 'Résumé (PDF)', hint: 'resume', run: () => window.open(links.resume, '_blank', 'noopener') },
    { group: 'Links', label: 'GitHub', hint: 'gauravrai1704', run: () => window.open(links.github, '_blank', 'noopener') },
    { group: 'Links', label: 'LinkedIn', hint: 'linkedin', run: () => window.open(links.linkedin, '_blank', 'noopener') },
    { group: 'Links', label: 'Copy email', hint: links.email, run: () => navigator.clipboard?.writeText(links.email).catch(() => {}) },
  ];
}

export default function Palette({ open, setOpen }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const all = useMemo(items, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((it) => `${it.group} ${it.label} ${it.hint} ${it.keys || ''}`.toLowerCase().includes(s));
  }, [q, all]);

  useEffect(() => {
    const on = (e) => {
      const typing = /input|textarea/i.test(document.activeElement?.tagName || '');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [setOpen]);

  useEffect(() => {
    if (open) { setQ(''); setSel(0); }
  }, [open]);

  useEffect(() => setSel(0), [q]);

  if (!open) return null;

  function choose(it) {
    setOpen(false);
    it?.run();
  }

  function key(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); choose(list[sel]); }
  }

  let lastGroup = null;
  return (
    <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette" onClick={() => setOpen(false)}>
      <div className="pal__box" onClick={(e) => e.stopPropagation()}>
        <div className="pal__in">
          <span className="mono">❯</span>
          <input
            ref={inputRef}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={key}
            placeholder="Jump to a section, project or link…"
            aria-label="Search"
          />
          <kbd>esc</kbd>
        </div>
        <ul className="pal__list" role="listbox">
          {list.length === 0 && <li className="pal__empty mono">no match. try “zk”, “cuda”, “resume”</li>}
          {list.map((it, i) => {
            const head = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            return (
              <li key={it.group + it.label}>
                {head && <p className="pal__group mono">{head}</p>}
                <button
                  role="option"
                  aria-selected={i === sel}
                  className={`pal__item ${i === sel ? 'is-sel' : ''}`}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => choose(it)}
                >
                  <span>{it.label}</span>
                  <span className="pal__hint mono">{it.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="pal__foot mono">
          <span>↑↓ navigate</span><span>↵ open</span><span>/ or ⌘K toggle</span>
        </div>
      </div>
    </div>
  );
}
