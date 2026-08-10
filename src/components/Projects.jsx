import { projects } from '../data.js';

export default function Projects() {
  return (
    <section id="projects" className="section section--raised">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Projects</p>
          <h2 className="section-title">Built, shipped, measured.</h2>
          <p className="section-desc">
            Outside the research track — applied systems and ML work, each with a number
            attached rather than an adjective.
          </p>
        </div>

        <div className="project-list">
          {projects.map((p, i) => (
            <article className="project-row" key={p.title}>
              <span className="project-row__index mono">{String(i + 1).padStart(2, '0')}</span>

              <div className="project-row__body">
                <div className="project-row__head">
                  <h3 className="project-row__title">{p.title}</h3>
                  <span className="project-row__period mono">{p.period}</span>
                </div>

                <p className="project-row__desc">{p.description}</p>

                <div className="project-row__stats">
                  {p.stats.map((s) => <span className="tag project-row__stat" key={s}>{s}</span>)}
                </div>

                <div className="project-row__foot">
                  <div className="research-card__stack">
                    {p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}
                  </div>
                  <div className="project-row__links">
                    {p.live && (
                      <a className="btn btn--hot" href={p.live} target="_blank" rel="noreferrer">
                        Live ↗
                      </a>
                    )}
                    <a className="btn" href={p.repo} target="_blank" rel="noreferrer">
                      Code ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <a className="see-more" href="https://github.com/gauravrai1704?tab=repositories" target="_blank" rel="noreferrer">
          More on GitHub ↗
        </a>
      </div>
    </section>
  );
}
