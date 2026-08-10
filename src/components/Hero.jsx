import { links } from '../data.js';

const stats = [
  { value: '2.7×', label: 'context extension, PACT-KV' },
  { value: '9.61M', label: 'params, full SR model' },
  { value: '9.52', label: 'CGPA' },
];

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <p className="eyebrow">Gaurav Rai </p>

        <h1 className="hero__title">
          Making <span className="hero__hot">deep learning</span> run where
          the hardware says it can&rsquo;t —<br className="hero__br" />
          <span className="hero__cold">tiered memory</span> for LLM inference,
          quantized vision on the edge.
        </h1>

        <p className="hero__sub">
          I am a Computer Science and Engineering student at Shiv Nadar University passionate 
          about how things work under the hood. I enjoy breaking down complex systems, 
          identifying bottlenecks, and iterating until I can measure tangible improvements. 
          Whether I am exploring low-level hardware interactions, building machine learning 
          infrastructure, or simply learning a new paradigm, I am driven by curiosity and the 
          desire to build performant, reliable software. Outside of coding, I value continuous 
          growth, meaningful collaborations, and drawing inspiration from the people around me.
        </p>

        <div className="hero__cta">
          <a className="btn btn--solid" href="#research">See the research</a>
          <a className="btn" href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>

        <div className="hero__stats">
          {stats.map((s) => (
            <div className="hero__stat" key={s.label}>
              <span className="hero__stat-value mono">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="tier-divider">
          <div className="tier-divider__hot" style={{ width: '62%' }} />
          <div className="tier-divider__cold" style={{ width: '38%' }} />
        </div>
        <div className="tier-caption">
          <span>T1 — systems &amp; inference</span>
          <span>T2 — vision &amp; restoration</span>
        </div>
      </div>
    </section>
  );
}
