import { links } from '../data.js';

const items = [
  { label: 'Email', value: links.email, href: `mailto:${links.email}` },
  { label: 'GitHub', value: 'gauravrai1704', href: links.github },
  { label: 'LinkedIn', value: 'gaurav-rai', href: links.linkedin },
  { label: 'Kaggle', value: 'gauravrai1704', href: links.kaggle },
  { label: 'LeetCode', value: 'Gaurav_Rai_1704', href: links.leetcode },
];

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact__inner">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="section-title contact__title">
            Let's connect! Open to chatting about systems, research, or just life...
            </h2>
            <p className="contact__location mono">{links.location}</p>
          </div>

          <div className="contact__links">
            {items.map((it) => (
              <a key={it.label} className="contact__link" href={it.href} target="_blank" rel="noreferrer">
                <span className="contact__link-label mono">{it.label}</span>
                <span className="contact__link-value">{it.value}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
