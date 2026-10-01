export type EducationEntry = {
  year: string;
  degree: string;
  institute: string;
  score: string;
};

// Sourced from the React portfolio's Education component — preserved as-is.
export const education: EducationEntry[] = [
  {
    year: "2022 – 2025",
    degree: "B.Tech in Computer Science & Information Technology (CSIT)",
    institute: "C.V. Raman Global University, Bhubaneswar, Odisha",
    score: "CGPA: 8.06 / 10",
  },
  {
    year: "2019 – 2022",
    degree: "Diploma in Computer Science & Engineering (CSE)",
    institute: "Arka Jain University, Jamshedpur, Jharkhand",
    score: "CGPA: 8.95 / 10",
  },
  {
    year: "2017 – 2018",
    degree: "Matriculation (10th)",
    institute: "Ramakrishna Mission English School, Jamshedpur, Jharkhand",
    score: "Percentage: 56%",
  },
];
