import { useEffect, useState } from 'react';
import { nav, links } from '../data.js';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__mark" onClick={() => setOpen(false)}>
          GR<span className="nav__dot">·</span>
        </a>

        <nav className="nav__links">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>

        <a className="btn btn--solid nav__cta" href={links.resume} target="_blank" rel="noreferrer">
          Résumé
        </a>

        <button
          className={`nav__burger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
          ))}
          <a href={links.resume} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Résumé ↗
          </a>
        </div>
      )}
    </header>
  );
}
