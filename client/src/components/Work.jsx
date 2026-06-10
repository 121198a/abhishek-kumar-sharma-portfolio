import { useApi } from "../hooks/useApi";
import { useInView } from "../hooks/useAnimation";
import "./Work.css";

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.1);

  return (
    <article
      ref={ref}
      className={`project-card ${inView ? "project-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="project-card__header">
        <div className="project-card__meta">
          <span className="project-card__category">{project.category}</span>
          <span className="project-card__year">{project.year}</span>
        </div>
        <div className="project-card__accent" style={{ background: project.color }} />
      </div>

      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__description">{project.description}</p>

      <div className="project-card__footer">
        <div className="project-card__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-card__tag">{tag}</span>
          ))}
        </div>
        <button className="project-card__link" aria-label={`View ${project.title}`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function Work() {
  const { data: projects, loading } = useApi("/projects");
  const [titleRef, titleInView] = useInView();

  return (
    <section className=" work section" id="work">
      <div className="container">
        <div ref={titleRef} className={`section-header ${titleInView ? "section-header--visible" : ""}`}>
          <span className="section-eyebrow">Competence</span>
          <h2 className="section-title">
            Things I've
            <br />
            <span className="section-title--accent">built & shipped</span>
          </h2>
        </div>

        {loading ? (
          <div className="work__loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="project-skeleton" />
            ))}
          </div>
        ) : (
          <div className="work__grid">
            {projects?.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
