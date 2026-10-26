/**
 * APPROVED COMPANY KNOWLEDGE
 *
 * The assistant may only state facts that appear here. This list is intentionally EMPTY:
 * the project owner must add real, approved information about USNAYA Techworks Solutions.
 * Do not add anything you have not verified. Entries marked approved: false are ignored.
 *
 * Example shape (do not copy the text, it is not a real fact):
 * {
 *   id: "services-overview",
 *   keywords: ["services", "offer", "products"],
 *   answer: "TODO: owner-approved description of services.",
 *   approved: false,
 * }
 */
export type KnowledgeEntry = {
  id: string;
  keywords: string[];
  answer: string;
  /** Only approved entries are ever used. */
  approved: boolean;
};

export const companyKnowledge: KnowledgeEntry[] = [
  {
    id: "office-overview",
    keywords: ["office", "company", "usnaya", "techworks", "workspace", "about"],
    answer: "USNAYA Techworks Solutions is a contemporary technology company office featuring IT, HR, Sales, a Conference Hall, Visitor Lounge, Break Area, and Executive Suite.",
    approved: true,
  },
  {
    id: "it-department",
    keywords: ["it", "technology", "software", "systems", "servers", "engineering", "abhishek"],
    answer: "The IT Department is led by Abhishek Sharma, Head of IT Department, supporting company systems, infrastructure, and developer workstations.",
    approved: true,
  },
  {
    id: "managing-director",
    keywords: ["manager", "director", "umesh", "executive", "cabin", "leader"],
    answer: "Umesh Sharma is the Managing Director, located in the Manager's Cabin in the executive wing.",
    approved: true,
  },
  {
    id: "break-area-coffee",
    keywords: ["coffee", "kitchen", "break", "lunch", "cafeteria", "drink", "pantry", "bhavishya"],
    answer: "The break area and cafeteria offer an espresso coffee station, microwave, refrigerator, water dispenser, and dining tables for meals and informal chats.",
    approved: true,
  },
  {
    id: "conference-hall",
    keywords: ["conference", "meeting", "presentation", "hall", "room", "book", "ankita"],
    answer: "The Conference Hall features a boardroom table and presentation display for team syncs, client meetings, and strategy discussions.",
    approved: true,
  },
  {
    id: "reception",
    keywords: ["reception", "receptionist", "priya", "front desk", "enter", "help"],
    answer: "Reception is the front desk where Priya Sharma welcomes visitors and guides guests to their destinations.",
    approved: true,
  },
  {
    id: "parking-facilities",
    keywords: ["parking", "car", "bike", "scooter", "vehicle", "gate"],
    answer: "Visitor and employee car parking is available on the left with accessible bays, and motorcycle/scooter parking is located near the pedestrian gate.",
    approved: true,
  },
];
