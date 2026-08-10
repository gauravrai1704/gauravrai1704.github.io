import { academics } from '../data.js';

export default function Academics() {
  return (
    <section id="academics" className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Academics</p>
          <h2 className="section-title">{academics.degree}</h2>
          <p className="section-desc">
            {academics.school} · {academics.period}
          </p>
        </div>

        <div className="academics-grid">
          {academics.stats.map((s) => (
            <div className="research-stat academics-stat" key={s.label}>
              <span className="research-stat__value mono">{s.value}</span>
              <span className="research-stat__label">{s.label}</span>
            </div>
          ))}
        </div>

        <ul className="academics-extras">
          {academics.extras.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
