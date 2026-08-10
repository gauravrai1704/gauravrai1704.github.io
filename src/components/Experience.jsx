import { experience } from '../data.js';

export default function Experience() {
  return (
    <section id="experience" className="section section--raised">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Currently.</h2>
        </div>

        <div className="exp-list">
          {experience.map((e) => (
            <div className="exp-row" key={e.role}>
              <span className="exp-row__period mono">{e.period}</span>
              <div className="exp-row__body">
                <h3 className="exp-row__role">{e.role}</h3>
                <p className="exp-row__org">{e.org}</p>
                <p className="exp-row__desc">{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
