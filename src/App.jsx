import { useState } from 'react';
import StatusBar from './components/StatusBar.jsx';
import Hero from './components/Hero.jsx';
import Index from './components/Index.jsx';
import Terminal from './components/Terminal.jsx';
import Palette from './components/Palette.jsx';
import { Depth, Log, Papers, Thesis } from './components/Sections.jsx';
import { links } from './data.js';

export default function App() {
  const [palette, setPalette] = useState(false);

  return (
    <>
      <a className="skip" href="#index">Skip to work</a>
      <StatusBar onPalette={() => setPalette(true)} />
      <main className="wrap">
        <Hero />
        <Thesis />
        <Index />
        <Depth />
        <Papers />
        <Log />

        <section id="contact" className="section contact">
          <header className="section__head">
            <p className="mono section__no">05 / contact</p>
            <h2 className="section__title">Hard problems welcome. <em>Ideally the ones nobody has measured yet.</em></h2>
          </header>
          <div className="contact__grid">
            <div className="contact__links">
              <a className="contact__mail" href={`mailto:${links.email}`}>{links.email}</a>
              <ul className="mono">
                <li><a href={links.github} target="_blank" rel="noreferrer">github <span>/gauravrai1704 ↗</span></a></li>
                <li><a href={links.linkedin} target="_blank" rel="noreferrer">linkedin <span>/gaurav-rai ↗</span></a></li>
                <li><a href={links.leetcode} target="_blank" rel="noreferrer">leetcode <span>/Gaurav_Rai_1704 ↗</span></a></li>
                <li><a href={links.kaggle} target="_blank" rel="noreferrer">kaggle <span>/gauravrai1704 ↗</span></a></li>
                <li><a href={links.resume} target="_blank" rel="noreferrer">résumé <span>.pdf ↗</span></a></li>
              </ul>
              <p className="muted mono">{links.location} · IST (UTC+5:30)</p>
            </div>
            <Terminal />
          </div>
        </section>
      </main>

      <footer className="foot mono wrap">
        <span>© {new Date().getFullYear()} Gaurav Rai</span>
        <span className="hide-sm">React + one canvas. No UI kit, no template.</span>
        <a href={links.source} target="_blank" rel="noreferrer">view source ↗</a>
      </footer>

      <Palette open={palette} setOpen={setPalette} />
    </>
  );
}
