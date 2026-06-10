import { useApi } from "../hooks/useApi";
import { useInView } from "../hooks/useAnimation";
import "./Skills.css";

const categoryLabels = {
  frontend: "Frontend",
  backend: "Full-Stack",
  database: "Database & Infrastructure",
  tools: "Tools & Workflow",
};

const categoryColors = {
  frontend: "var(--blue)",
  backend: "var(--red)",
  database: "var(--green)",
  tools: "var(--orange)",
};

export default function Skills() {
  const { data: skills, loading } = useApi("/skills");
  const [ref, inView] = useInView();

  return (
    <section className="skills" id="skills">
      <div className="container">
        <div ref={ref} className={`section-header ${inView ? "section-header--visible" : ""}`}>
          <span className="section-eyebrow">Expertise</span>
          <h2 className="section-title">
            What I work
            <br />
            <span className="section-title--accent">and familiar with</span>
          </h2>
        </div>

        <div className="skills__grid">
          {loading
            ? [...Array(4)].map((_, i) => <div key={i} className="skills__skeleton" />)
            : skills &&
              Object.entries(skills).map(([key, items], i) => (
                <SkillCategory
                  key={key}
                  category={key}
                  label={categoryLabels[key]}
                  color={categoryColors[key]}
                  items={items}
                  index={i}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function SkillCategory({ category, label, color, items, index }) {
  const [ref, inView] = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`skills__category ${inView ? "skills__category--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="skills__cat-header">
        <span className="skills__cat-dot" style={{ background: color }} />
        <h3 className="skills__cat-title">{label}</h3>
      </div>
      <ul className="skills__list">
        {items.map((item, j) => (
          <li key={item} className="skills__item" style={{ animationDelay: `${j * 0.05 + index * 0.1}s` }}>
            <span className="skills__item-text">{item}</span>
            <div className="skills__item-bar">
              <div
                className={`skills__item-fill ${inView ? "skills__item-fill--active" : ""}`}
                style={{
                  background: color,
                  transitionDelay: `${j * 0.07 + index * 0.12 + 0.3}s`,
                  width: `${75 + Math.random() * 20}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
