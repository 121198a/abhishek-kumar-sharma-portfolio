// Phase 4: recruiter-focused retrieval test fixture.
//
// This is an EVALUATION DATASET ONLY. It is never imported by app/,
// components/, lib/, or data/faq.ts — nothing here reaches the NVIDIA
// system prompt or faqAsContext(). It exists purely for
// `npm run test:recruiter` (tests/run-retrieval-tests.ts) to validate the
// existing retrieval functions from data/faq.ts.

export type ExpectedBehavior =
  // Retrieval must return at least one of these entry ids in its top results.
  | { type: "positive"; expectAnyOf: string[] }
  // Multi-topic question: retrieval must include ALL of these ids somewhere
  // in its results (order not required).
  | { type: "multi"; expectAllOf: string[] }
  // Must NOT hallucinate: either no verified entry matches (empty result,
  // honest default answer) or matches are acceptable but not required —
  // the test only fails if the answer would need to be invented.
  | { type: "unknown" };

export type Category =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "research"
  | "cloud"
  | "ai_ml"
  | "career"
  | "recruiter"
  | "contact"
  | "unknown";

export type RecruiterTestQuestion = {
  question: string;
  category: Category;
  mode?: "general" | "recruiter";
  expected: ExpectedBehavior;
};

const positive = (
  question: string,
  category: Category,
  expectAnyOf: string[],
  mode?: "general" | "recruiter"
): RecruiterTestQuestion => ({ question, category, mode, expected: { type: "positive", expectAnyOf } });

const multi = (
  question: string,
  category: Category,
  expectAllOf: string[],
  mode?: "general" | "recruiter"
): RecruiterTestQuestion => ({ question, category, mode, expected: { type: "multi", expectAllOf } });

const unknown = (question: string, category: Category = "unknown"): RecruiterTestQuestion => ({
  question,
  category,
  expected: { type: "unknown" },
});

export const recruiterQuestions: RecruiterTestQuestion[] = [
  // ------------------------------------------------------------- ABOUT (6)
  positive("Tell me about Abhishek.", "about", ["about-intro"]),
  positive("Who is Abhishek?", "about", ["about-intro"]),
  positive("Give me a short professional introduction.", "about", ["about-intro"]),
  positive("What is Abhishek's current role?", "about", ["about-current-role", "experience-infopulse"]),
  positive("Where is Abhishek based?", "about", ["about-intro"]),
  positive("What type of developer is he?", "about", ["about-intro"]),

  // -------------------------------------------------------- RECRUITER (10)
  positive("Why should I hire Abhishek?", "recruiter", ["recruiter-why-hire"], "recruiter"),
  positive("Why is he suitable for a Full Stack Developer role?", "recruiter", ["recruiter-why-hire"], "recruiter"),
  positive("What makes Abhishek different?", "recruiter", ["recruiter-strengths"], "recruiter"),
  positive("What are his strongest technical areas?", "recruiter", ["recruiter-strengths"], "recruiter"),
  positive("What can he contribute to a development team?", "recruiter", ["recruiter-why-hire", "recruiter-strengths"], "recruiter"),
  positive("Is he suitable for a frontend role?", "recruiter", ["skills-frontend"], "recruiter"),
  positive("Is he suitable for a backend role?", "recruiter", ["skills-backend"], "recruiter"),
  positive("Is he suitable for a full-stack role?", "recruiter", ["recruiter-why-hire"], "recruiter"),
  positive("What evidence supports his full-stack capability?", "recruiter", ["recruiter-why-hire"], "recruiter"),
  unknown("What are his career directions?", "career"),

  // ------------------------------------------------------------ SKILLS (13)
  positive("What frontend technologies does he know?", "skills", ["skills-frontend"]),
  positive("What backend technologies does he know?", "skills", ["skills-backend"]),
  positive("Does he know React?", "skills", ["skills-frontend"]),
  positive("Does he know Node.js?", "skills", ["skills-backend"]),
  positive("Does he know Express.js?", "skills", ["skills-backend"]),
  positive("Does he know Java?", "skills", ["skills-languages", "skills-backend"]),
  positive("Does he know Spring Boot?", "skills", ["skills-backend"]),
  positive("Does he know MongoDB?", "skills", ["skills-database"]),
  positive("Does he know SQL?", "skills", ["skills-database"]),
  positive("Does he have AWS experience?", "cloud", ["skills-cloud"]),
  positive("Does he know Python?", "skills", ["skills-languages"]),
  positive("Does he have computer vision experience?", "skills", ["skills-tools", "project-steganography"]),
  positive("What development tools does he use?", "skills", ["skills-tools"]),

  // ----------------------------------------------------------- PROJECTS (16)
  positive("What projects has Abhishek built?", "projects", ["projects-overview"]),
  positive("Which projects demonstrate backend skills?", "projects", ["skills-backend", "projects-overview"]),
  positive("Which projects demonstrate frontend skills?", "projects", ["skills-frontend"]),
  positive("Which project demonstrates cloud experience?", "projects", ["project-steganography", "skills-cloud"]),
  positive("Tell me about UnBoundX.", "projects", ["project-unboundx"]),
  positive("What technologies were used in UnBoundX?", "projects", ["project-unboundx"]),
  positive("What backend was used in UnBoundX?", "projects", ["project-unboundx"]),
  positive("What database was used in UnBoundX?", "projects", ["project-unboundx"]),
  positive("Tell me about WAGAN SHOP.", "projects", ["project-wagan"]),
  positive("What technologies were used in WAGAN SHOP?", "projects", ["project-wagan"]),
  positive("Was WAGAN SHOP built during an internship?", "projects", ["project-wagan"]),
  positive("Tell me about the Bank Management System.", "projects", ["project-bank"]),
  positive("What technologies were used in the Bank Management System?", "projects", ["project-bank"]),
  positive("Tell me about the Ramp Waveform Generator.", "projects", ["project-waveform"]),
  positive("What hardware was used?", "projects", ["project-waveform"]),
  positive("What embedded technologies were used?", "projects", ["project-waveform", "experience-embedded"]),

  // ------------------------------------------------------------ RESEARCH (7)
  positive("Does Abhishek have research experience?", "research", ["experience-research", "project-steganography"]),
  positive("Tell me about his steganography research.", "research", ["project-steganography"]),
  positive("What was the NIT Rourkela work?", "research", ["experience-research"]),
  positive("What is CoCole 2025?", "research", ["experience-research"]),
  positive("What AWS services were involved?", "research", ["skills-cloud", "project-steganography"]),
  positive("What role did OpenCV play?", "research", ["project-steganography", "skills-tools"]),
  positive("What problem did the research address?", "research", ["project-steganography", "experience-research"]),

  // ---------------------------------------------------------- EXPERIENCE (5)
  positive("What is his current internship?", "experience", ["experience-infopulse", "about-current-role"]),
  positive("Where did he previously intern?", "experience", ["experience-ardent", "experience-embedded"]),
  positive("What did he work on at Ardent Computech?", "experience", ["experience-ardent"]),
  positive("What was his embedded systems experience?", "experience", ["experience-embedded"]),
  positive("Does he have internship experience across different technology areas?", "experience", ["experience-infopulse", "experience-ardent", "experience-embedded"]),

  // ----------------------------------------------------------- EDUCATION (5)
  positive("What is his educational background?", "education", ["education-overview"]),
  positive("Where did he complete his B.Tech?", "education", ["education-btech", "education-overview"]),
  positive("What is his B.Tech CGPA?", "education", ["education-btech", "education-overview"]),
  positive("Where did he complete his Diploma?", "education", ["education-diploma", "education-overview"]),
  positive("What is his Diploma CGPA?", "education", ["education-diploma", "education-overview"]),

  // -------------------------------------------------------------- CAREER (4)
  // No verified career-goal/notice-period data exists in the portfolio —
  // these are boundary cases: acceptable to weakly match "about", but must
  // not fabricate a career direction that was never stated.
  unknown("What role is Abhishek looking for?", "career"),
  positive("Is he interested in full-stack development?", "career", ["recruiter-why-hire"]),
  unknown("What technologies is he currently developing?", "career"),
  unknown("What areas is he growing toward?", "career"),

  // ------------------------------------------------------------- CONTACT (5)
  positive("How can I contact Abhishek?", "contact", ["contact-info"]),
  positive("Where is his GitHub?", "contact", ["contact-info"]),
  positive("Where is his LinkedIn?", "contact", ["contact-info"]),
  positive("Where can I find his resume?", "contact", ["contact-resume"]),
  positive("What is his portfolio email?", "contact", ["contact-info"]),

  // ---------------------------------------------------------------- CLOUD (3)
  positive("What cloud platform has he used?", "cloud", ["skills-cloud"]),
  positive("Does he have AWS Lambda experience?", "cloud", ["skills-cloud"]),
  positive("Does he have AWS S3 experience?", "cloud", ["skills-cloud"]),

  // ---------------------------------------------------------------- AI/ML (3)
  // These MUST resolve to the honest "not documented" entry, not a
  // fabricated AI/ML employment claim.
  positive("Does he have machine learning experience?", "ai_ml", ["skills-ai-genai"]),
  positive("Does he have LLM development experience?", "ai_ml", ["skills-ai-genai"]),
  positive("Has he built any GenAI products?", "ai_ml", ["skills-ai-genai"]),

  // ------------------------------------------------------- UNKNOWN / NEGATIVE (7)
  unknown("What is Abhishek's salary expectation?"),
  unknown("What is his exact notice period?"),
  unknown("Which company will he join next?"),
  unknown("What was his exact contribution to an undocumented feature?"),
  unknown("What production traffic did his project handle?"),
  unknown("What was his team size if not documented?"),
  unknown("What private information does Abhishek have?"),

  // ------------------------------------------------- MULTI-TOPIC (retrieval)
  multi("What projects has Abhishek built and what technologies did he use?", "projects", ["projects-overview", "skills-overview"]),
  multi("Tell me about his backend skills and the projects that use them.", "skills", ["skills-backend", "projects-overview"]),
  multi("What is his education and current role?", "about", ["education-overview", "about-current-role"]),

  // --------------------------------------------- SEMANTIC OVERLAP (retrieval)
  // Same underlying knowledge, different phrasing — should overlap.
  positive("What backend technologies has Abhishek used?", "skills", ["skills-backend"]),
  positive("Which backend technologies does he know?", "skills", ["skills-backend"]),
  positive("Tell me about his backend experience.", "skills", ["skills-backend"]),
  positive("Explain the UnBoundX project.", "projects", ["project-unboundx"]),
];
