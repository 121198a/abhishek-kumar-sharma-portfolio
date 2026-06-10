import { useInView } from "../hooks/useAnimation";
import "./Education.css";

const education = [
  {
    year: "2022 - 2025",
    degree: "B.Tech in Computer Science & Information Technology (CSIT)",
    institute: "C.V. Raman Global University Bhubaneswar, Odisha",
    score: "CGPA: 8.06 / 10",
  },
  {
    year: "2019 - 2022",
    degree: "Diploma in Computer Science & Engineering (CSE)",
    institute: "Arka Jain University Jamshedpur, Jharkhand",
    score: "CGPA: 8.95 / 10",
  },
  {
    year: "2017 - 2018",
    degree: "Matriculation (10th)",
    institute: "Ramakrishna Mission English School Jamshedpur, Jharkhand",
    score: "Percentage: 56%",
  },
];

export default function Education() {
  const [ref, inView] = useInView();

  return (
    <section id="education" className="education">
      <div className="container">
        <div
          ref={ref}
          className={`section-header ${
            inView ? "section-header--visible" : ""
          }`}
        >
          <span className="section-eyebrow">Education</span>

          <h2 className="section-title">
            Academic
            <br />
            Journey
          </h2>
        </div>

        <div className="education__timeline">
          {education.map((item, index) => (
            <div key={index} className="education__card">
              <div className="education__year">
                {item.year}
              </div>

              <div className="education__content">
                <div className="education__degree">
                  {item.degree}
                </div>

                <div className="education__institute">
                  {item.institute}
                </div>

                <div className="education__score">
                  {item.score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}