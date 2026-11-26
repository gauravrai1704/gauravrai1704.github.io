import { useEffect, useState } from 'react';
import { archive, domains, projects } from '../data.js';

const domainLabel = Object.fromEntries(domains.map((d) => [d.id, d.label]));

function Datasheet({ p }) {
  return (
    <div className="sheet">
      <div className="sheet__head">
        <div>
          <p className="mono sheet__code">{p.code} · {p.status}</p>
          <h3 className="sheet__title">{p.title}</h3>
        </div>
        <div className="sheet__links">
          {p.links.map((l) => (
            <a key={l.href} className="btn btn--sm" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="sheet__metrics">
        {p.metrics.map((m) => (
          <div className="metric" key={m.l}>
            <span className="metric__v">{m.v}</span>
            <span className="metric__l">{m.l}</span>
          </div>
        ))}
      </div>

      <div className="sheet__body">
        <div className="sheet__col">
          <h4 className="mono label">§1 problem</h4>
          <p>{p.problem}</p>
          <h4 className="mono label">§2 role</h4>
          <p>{p.role} <span className="muted">({p.team})</span></p>
        </div>
        <div className="sheet__col">
          <h4 className="mono label">§3 mechanism</h4>
          <ol className="mech">
            {p.mechanism.map((m) => <li key={m}>{m}</li>)}
          </ol>
        </div>
      </div>

      <div className="sheet__foot">
        <div className="receipts">
          <h4 className="mono label">§4 receipts</h4>
          <ul>
            {p.receipts.map((r) => <li key={r} className="mono">{r}</li>)}
          </ul>
        </div>
        <div className="stack">
          <h4 className="mono label">§5 stack</h4>
          <div className="chips">
            {p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(projects[0].id);

  // Opening a project from the palette / terminal / depth chart.
  useEffect(() => {
    const on = (e) => {
      const id = e.detail;
      if (projects.some((p) => p.id === id)) {
        setFilter('all');
        setOpen(id);
        requestAnimationFrame(() =>
          document.getElementById(`p-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
      }
    };
    window.addEventListener('open-project', on);
    return () => window.removeEventListener('open-project', on);
  }, []);

  const shown = projects.filter((p) => filter === 'all' || p.domains.includes(filter));
  const shownArchive = archive.filter((p) => filter === 'all' || p.domains.includes(filter));

  return (
    <section id="index" className="section">
      <header className="section__head">
        <p className="mono section__no">01 / index</p>
        <h2 className="section__title">Selected work, <em>with receipts.</em></h2>
        <p className="section__lede">
          Each entry is a datasheet: the problem, how it works, the numbers, and where the numbers
          come from, including the parts that didn&rsquo;t work.
        </p>
      </header>

      <div className="filters mono" role="tablist" aria-label="Filter by domain">
        {domains.map((d) => {
          const n = d.id === 'all' ? projects.length : projects.filter((p) => p.domains.includes(d.id)).length;
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={filter === d.id}
              className={`filter ${filter === d.id ? 'is-on' : ''}`}
              onClick={() => setFilter(d.id)}
            >
              {d.label}<sup>{n}</sup>
            </button>
          );
        })}
      </div>

      <div className="table" role="list">
        <div className="row row--head mono" aria-hidden>
          <span>id</span><span>name</span><span className="hide-md">domain</span><span className="hide-sm">headline</span><span>yr</span><span />
        </div>
        {shown.map((p) => {
          const isOpen = open === p.id;
          return (
            <article key={p.id} id={`p-${p.id}`} className={`entry ${isOpen ? 'is-open' : ''}`} role="listitem">
              <button
                className="row"
                aria-expanded={isOpen}
                aria-controls={`sheet-${p.id}`}
                onClick={() => setOpen(isOpen ? null : p.id)}
              >
                <span className="mono row__code">{p.code}</span>
                <span className="row__name">{p.name}</span>
                <span className="mono row__dom hide-md">{p.domains.map((d) => domainLabel[d]).join(' · ')}</span>
                <span className="row__line hide-sm">{p.oneliner}</span>
                <span className="mono row__yr">{p.year}</span>
                <span className="row__toggle mono" aria-hidden>{isOpen ? '−' : '+'}</span>
              </button>
              <div id={`sheet-${p.id}`} className="entry__panel" hidden={!isOpen}>
                {isOpen && <Datasheet p={p} />}
              </div>
            </article>
          );
        })}
      </div>

      {shownArchive.length > 0 && (
        <div className="archive">
          <p className="mono label">/archive — earlier builds</p>
          <div className="archive__grid">
            {shownArchive.map((a) => (
              <a key={a.id} id={`p-${a.id}`} className="card" href={a.href} target="_blank" rel="noreferrer">
                <span className="mono card__yr">{a.year}</span>
                <span className="card__name">{a.name} <span aria-hidden>↗</span></span>
                <span className="card__note">{a.note}</span>
                <span className="mono card__metric">{a.metric}</span>
                <span className="mono card__stack">{a.stack}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
