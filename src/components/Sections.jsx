import { archive, depth, log, projects } from '../data.js';

const byId = Object.fromEntries([...projects, ...archive].map((p) => [p.id, p]));
export const openProject = (id) => window.dispatchEvent(new CustomEvent('open-project', { detail: id }));

const principles = [
  {
    k: 'measure',
    t: 'Find the real bottleneck.',
    d: 'PACT-KV started from a stall-cycle counter, not a guess. If I can’t measure it, I don’t optimize it.',
  },
  {
    k: 'verify',
    t: 'Make correctness checkable.',
    d: 'Rubik solutions are replayed by the engine, TrustTier proofs are checked on-chain, and Kanoon-Bridge checks each sentence against the statute it cites.',
  },
  {
    k: 'disclose',
    t: 'Write down what didn’t work.',
    d: 'Every project lists its limits: untested concurrency, synthetic training data, gains that shrink as N grows.',
  },
];

export function Thesis() {
  return (
    <section id="thesis" className="section thesis">
      <header className="section__head">
        <p className="mono section__no">00 / thesis</p>
        <h2 className="section__title">
          Anyone can demo a model. <em>Making it fast, small and trustworthy</em> is the real work.
        </h2>
      </header>
      <ol className="principles">
        {principles.map((p, i) => (
          <li key={p.k} className="principle">
            <span className="mono principle__k">0{i + 1} — {p.k}()</span>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Depth() {
  return (
    <section id="depth" className="section">
      <header className="section__head">
        <p className="mono section__no">02 / depth</p>
        <h2 className="section__title">How far down <em>the stack</em> it goes.</h2>
        <p className="section__lede">
          A cross-section of the work, from what people touch down to the hardware. Click a project
          to open its datasheet.
        </p>
      </header>
      <div className="depth">
        {depth.map((d, i) => (
          <div className="depth__row" key={d.layer} style={{ '--i': i }}>
            <span className="mono depth__lvl">L{depth.length - 1 - i}</span>
            <div className="depth__meta">
              <span className="depth__layer">{d.layer}</span>
              <span className="mono depth__note">{d.note}</span>
            </div>
            <div className="depth__items">
              {d.items.map((id) => {
                const p = byId[id];
                if (!p) return null;
                const inIndex = projects.some((x) => x.id === id);
                return inIndex ? (
                  <button key={id} className="node" onClick={() => openProject(id)}>{p.name}</button>
                ) : (
                  <a key={id} className="node node--dim" href={p.href} target="_blank" rel="noreferrer">{p.name}</a>
                );
              })}
            </div>
          </div>
        ))}
        <div className="depth__axis mono" aria-hidden>
          <span>↑ user</span><span>silicon ↓</span>
        </div>
      </div>
    </section>
  );
}

export function Log() {
  return (
    <section id="log" className="section">
      <header className="section__head">
        <p className="mono section__no">03 / log</p>
        <h2 className="section__title"><span className="mono title-mono">git log</span> <em>--me</em></h2>
      </header>
      <ol className="gitlog">
        {log.map((c) => (
          <li key={c.hash} className={`commit commit--${c.tag}`}>
            <span className="commit__dot" />
            <div className="commit__body">
              <p className="mono commit__meta">
                <span className="commit__hash">{c.hash}</span> <span className="commit__tag">({c.tag})</span> · {c.date}
              </p>
              <h3>{c.title}</h3>
              <p className="muted">{c.org}</p>
              <p>{c.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
