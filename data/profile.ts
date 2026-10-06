// Single source of truth for personal/profile information.
// Every field here is drawn from the two source portfolios — nothing is
// invented. If a fact wasn't present in either source project, it isn't here.

export const profile = {
  name: "Abhishek Kumar Sharma",
  title: "Full-Stack AI Developer",
  shortTitle: "Full-Stack AI Developer",
  currentLocation: "Ahmedabad, Gujarat, India",
  permanentLocation: "Jamshedpur, Jharkhand, India",
  email: "sharmaabhishek121198@gmail.com",
  phone: "Available upon inquiry",
  phoneHref: "mailto:sharmaabhishek121198@gmail.com?subject=Phone%20Contact%20Request",
  github: "https://github.com/121198a",
  linkedin: "https://www.linkedin.com/in/abhishek-kumar-sharma-75306b1ba/",
  x: "https://x.com/12_sharma_ji",
  instagram: "https://www.instagram.com/_.itsyourabhishek._/",
  facebook: "https://www.facebook.com/profile.php?id=100016034742635",
  resumeHref: "/resume.pdf",

  // Current role, drawn directly from the most recent internship entry —
  // never presented as a permanent/full-time claim that isn't verified.
  currentRole: {
    title: "Frontend Developer Intern",
    org: "Infopulse Technology",
  },

  tagline: "Building real products, not just demos.",

  intro: [
    "I'm Abhishek Kumar Sharma, a full-stack developer currently based in Ahmedabad, Gujarat, India, with a permanent location in Jamshedpur, Jharkhand, India. I build production-ready web applications using React.js, JavaScript, Node.js, Spring Boot, MySQL, MongoDB, and AWS.",
    "I enjoy building scalable web apps, clean REST APIs, and responsive interfaces. I focus on writing clear, maintainable code that solves real problems and stays easy to understand months later.",
    "Outside of work, I experiment with new developer tools, build personal projects, and study cloud and system fundamentals.",
  ],

  // Derived counts (computed from data arrays at render time, not hardcoded)
  // so nothing here can silently drift out of sync with the real data.
};

export type Profile = typeof profile;
