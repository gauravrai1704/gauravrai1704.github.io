import { useEffect, useState } from 'react';
import { sections } from '../data.js';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false });
}

function useActiveSection() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const ids = ['top', ...sections.map((s) => s.id)];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return p;
}

export default function StatusBar({ onPalette }) {
  const time = useClock();
  const active = useActiveSection();
  const progress = useScrollProgress();

  return (
    <header className="bar mono">
      <a href="#top" className="bar__id" aria-label="Back to top">
        <span className="bar__mark">GR</span>
        <span className="bar__name">Gaurav Rai</span>
      </a>
      <nav className="bar__nav" aria-label="Sections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''}>
            <span className="bar__no">{s.no}</span>
            {s.label}
          </a>
        ))}
      </nav>
      <div className="bar__right">
        <span className="hide-sm bar__time">IST {time}</span>
        <button className="bar__k" onClick={onPalette} aria-label="Open command palette">
          <kbd>⌘</kbd><kbd>K</kbd>
        </button>
      </div>
      <span className="bar__progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
