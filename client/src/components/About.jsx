import { useInView } from "../hooks/useAnimation";
import "./About.css";

const timeline = [
  { year: "2026", role: "Frontend Developer Intern", company: "Infopulse Technology", desc: "Developed responsive and interactive web applications using React.js, JavaScript, HTML5, and CSS3. Built reusable UI components, integrated REST APIs, optimized application performance, and collaborated with cross-functional teams to deliver scalable user-focused solutions." },
  { year: "2025", role: "Research Student", company: "CoCole 2025 NIT Rourkela", desc: "Published research on Coverless Image Steganography using Python, OpenCV, AWS S3, and AWS Lambda." },
  { year: "2024", role: "Embedded Systems Intern", company: "C.V.Raman Global University", desc: "Developed STM32 applications using Embedded C, HAL libraries, and oscilloscope testing." },
  { year: "2021", role: "Full Stack Mern Developer Intern", company: "Ardent Computech Pvt.Ltd.", desc: "Built responsive web applications using React.js, Node.js, MySQL, REST APIs, JWT authentication, and Git workflows." },
];

export default function About() {
  const [ref, inView] = useInView();
  const [tlRef, tlInView] = useInView();

  return (
    <section className="about" id="about">
      <div className="container about__inner">
        {/* Left: bio */}
        <div ref={ref} className={`about__bio ${inView ? "about__bio--visible" : ""}`}>
          <span className="section-eyebrow">About</span>
          <h2 className="about__title">
            I build with
            <br />
            clarity & craft.
          </h2>
          <div className="about__text">
            <p>
              I'm Abhishek Kumar Sharma — a  Frontend and Full-Stack Developer
              from Jharkhand, India with practical experience in React.js,
              JavaScript, Node.js, Spring Boot, MySQL, MongoDB, and AWS. <em></em>
            </p>
            <p>
              I enjoy building scalable web applications, designing REST APIs,
              creating responsive user interfaces, and solving real-world
              problems through clean and maintainable code.
            </p>
            <p>
              When I'm not writing code, I'm exploring new technologies, working on
              personal projects, researching cloud solutions, and continuously 
              improving my software engineering skills.
            </p>
          </div>
          <div className="about__links">
            <a href="https://github.com/121198a" target="_blank" rel="noopener noreferrer" className="about__link">
              GitHub
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="about__link">
              LinkedIn
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="/Fresher_Abhishek_Kumar_Sharma_Resume_2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="about__link"
            >
            Resume ↓
            </a>
          </div>
        </div>

        {/* Right: timeline */}
        <div ref={tlRef} className={`about__timeline ${tlInView ? "about__timeline--visible" : ""}`}>
          <span className="about__timeline-label">Internship Experience</span>
          {timeline.map((item, i) => (
            <div
              key={i}
              className="timeline-item"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="timeline-item__year">{item.year}</div>
              <div className="timeline-item__content">
                <div className="timeline-item__role">{item.role}</div>
                <div className="timeline-item__company">{item.company}</div>
                <div className="timeline-item__desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
