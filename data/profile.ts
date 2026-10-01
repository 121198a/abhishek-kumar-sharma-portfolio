// Single source of truth for personal/profile information.
// Every field here is drawn from the two source portfolios — nothing is
// invented. If a fact wasn't present in either source project, it isn't here.

export const profile = {
  name: "Abhishek Kumar Sharma",
  title: "Frontend & Full-Stack Developer",
  shortTitle: "Full-Stack Developer",
  location: "Jharkhand, India",
  email: "sharmaabhishek121198@gmail.com",
  github: "https://github.com/121198a",
  linkedin: "https://www.linkedin.com/in/abhishek-kumar-sharma-75306b1ba/",
  resumeHref: "/resume.pdf",

  // Current role, drawn directly from the most recent internship entry —
  // never presented as a permanent/full-time claim that isn't verified.
  currentRole: {
    title: "Frontend Developer Intern",
    org: "Infopulse Technology",
  },

  tagline: "Building real products, not just demos.",

  intro: [
    "I'm Abhishek Kumar Sharma, a frontend and full-stack developer from Jharkhand, India, with hands-on experience across React.js, JavaScript, Node.js, Spring Boot, MySQL, MongoDB and AWS.",
    "I like building scalable web applications, designing REST APIs, shaping responsive interfaces and solving real problems with code that stays readable months later — not just code that works once.",
    "Outside of feature work, I spend time exploring new tools, building personal projects, and going deeper on cloud and systems fundamentals.",
  ],

  // Derived counts (computed from data arrays at render time, not hardcoded)
  // so nothing here can silently drift out of sync with the real data.
};

export type Profile = typeof profile;
