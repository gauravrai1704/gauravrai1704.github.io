import { useCallback, useRef } from 'react';
import SignalField from './SignalField.jsx';
import { bootLines, links } from '../data.js';

export default function Hero() {
  const snrRef = useRef(null);
  const posRef = useRef(null);
  const modeRef = useRef(null);

  // Writes straight to the DOM: the canvas reports every frame and React
  // doesn't need to hear about it.
  const onStats = useCallback(({ snr, x, y, idle }) => {
    if (snrRef.current) snrRef.current.textContent = (snr * 100).toFixed(1).padStart(5, '0') + '%';
    if (posRef.current) posRef.current.textContent = `${String(x).padStart(4, '0')},${String(y).padStart(4, '0')}`;
    if (modeRef.current) modeRef.current.textContent = idle ? 'auto-scan' : 'cursor';
  }, []);

  return (
    <section id="top" className="hero">
      <h1 className="sr-only">Gaurav Rai, AI systems engineer</h1>

      <div className="hero__field frame">
        <span className="frame__corner frame__corner--tl" />
        <span className="frame__corner frame__corner--tr" />
        <span className="frame__corner frame__corner--bl" />
        <span className="frame__corner frame__corner--br" />
        <SignalField onStats={onStats} />
        <div className="hero__hud hero__hud--top mono">
          <span>fig.0 · name, observed through noise</span>
          <span className="hide-sm">move the cursor to restore the signal</span>
        </div>
        <div className="hero__hud hero__hud--bottom mono">
          <span>signal <b ref={snrRef}>000.0%</b></span>
          <span className="hide-sm">lens <b ref={posRef}>0000,0000</b></span>
          <span>mode <b ref={modeRef}>auto-scan</b></span>
        </div>
      </div>

      <div className="hero__grid">
        <div className="hero__copy">
          <p className="kicker mono">Gaurav Rai — AI systems · LLM inference · trustworthy ML</p>
          <p className="hero__claim">
            I build AI that runs on <em>less</em>,
            and <span className="hl">shows its work.</span>
          </p>
          <p className="hero__sub">
            I study Computer Science and Engineering at Shiv Nadar University and work on the
            engineering that makes AI practical: serving LLMs past the GPU memory wall, shrinking
            vision models to INT8 for edge cameras, grounding LLM answers in the sources they cite,
            and proving a model&rsquo;s verdict on-chain. Every number in my repositories comes from
            a script, every claim says what produced it, and every limitation is written down.
          </p>
          <div className="hero__cta">
            <a className="btn btn--acid" href="#index">Open the index <span aria-hidden>↓</span></a>
            <a className="btn" href={links.resume} target="_blank" rel="noreferrer">Résumé <span aria-hidden>↗</span></a>
            <a className="btn btn--ghost" href={links.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden>↗</span></a>
          </div>
        </div>

        <div className="boot mono" aria-label="Recent work summary">
          <div className="boot__head">
            <span>~/gr — dmesg</span>
            <span className="boot__dot" />
          </div>
          <ol>
            {bootLines.map(([st, cmd, res], i) => (
              <li key={cmd} style={{ animationDelay: `${0.5 + i * 0.18}s` }}>
                <span className={`boot__st boot__st--${st === 'ok' ? 'ok' : 'wip'}`}>[{st === 'ok' ? ' ok ' : ' .. '}]</span>
                <span className="boot__cmd">{cmd}</span>
                <span className="boot__res">{res}</span>
              </li>
            ))}
          </ol>
          <div className="boot__foot">
            <span>uptime: B.Tech &rsquo;28 · CGPA 9.52</span>
            <span className="cursor-blink">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
