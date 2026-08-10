import { useState } from 'react';
import { research } from '../data.js';

function ResearchCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('quant');
  const isHot = index % 2 === 0;

  return (
    <article className={`research-card ${isHot ? 'research-card--hot' : 'research-card--cold'}`}>
      <div className="research-card__head">
        <p className="eyebrow">{item.tier}</p>
        <h3 className="research-card__title">{item.title}</h3>
        <p className="research-card__subtitle">{item.subtitle}</p>
        <p className="research-card__venue mono">{item.venue}</p>
      </div>

      <p className="research-card__blurb">{item.blurb}</p>

      <div className="research-card__stats">
        {item.stats.map((s) => (
          <div key={s.label} className="research-stat">
            <span className="research-stat__value mono">{s.value}</span>
            <span className="research-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="research-card__foot">
        <div className="research-card__stack">
          {item.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
        </div>
        <div className="research-card__actions">
          {item.links.map((l) => (
            <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
          <button
            className="btn btn--solid"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? 'Close studies' : 'Learn more'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="research-card__panel">
          <div className="research-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === 'quant'}
              className={`research-tab ${tab === 'quant' ? 'is-active' : ''}`}
              onClick={() => setTab('quant')}
            >
              Quantitative
            </button>
            <button
              role="tab"
              aria-selected={tab === 'qual'}
              className={`research-tab ${tab === 'qual' ? 'is-active' : ''}`}
              onClick={() => setTab('qual')}
            >
              Qualitative
            </button>
          </div>

          <ul className="research-list">
            {(tab === 'quant' ? item.quant : item.qual).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function Research() {
  return (
    <section id="research" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Research</p>
          <h2 className="section-title">Two problems, one constraint: make it work under a hard budget.</h2>
          <p className="section-desc">
            One project fights the memory wall in LLM inference; the other fights the parameter
            count in image restoration. Both start from the same question — what&rsquo;s the
            cheapest system that still holds up under measurement.
          </p>
        </div>

        <div className="research-grid">
          {research.map((item, i) => (
            <ResearchCard item={item} index={i} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
