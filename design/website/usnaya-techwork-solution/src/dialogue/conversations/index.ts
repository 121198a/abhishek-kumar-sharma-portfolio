import type { ConversationDefinition, DialogueNode } from "../../data/types";

/**
 * All wording here is NEUTRAL PLACEHOLDER copy. It makes no claims about USNAYA's services,
 * clients or policies. Replace it with owner-approved text and set status to "approved".
 */

const DEMO_NOTE =
  "This demo does not include detailed company information yet. You can type a question below or contact the team directly.";

type Topic = { label: string; answer: string };

/** Builds: greeting -> topics -> answer -> back to topics / goodbye. */
function simpleConversation(id: string, speakerId: string, greeting: string, topics: Topic[]): ConversationDefinition {
  const nodes: Record<string, DialogueNode> = {
    greet: {
      id: "greet",
      speakerId,
      text: greeting,
      choices: [
        ...topics.map((t, i) => ({ id: `t${i}`, label: t.label, nextNodeId: `a${i}` })),
        { id: "bye", label: "Thank you, that's all.", nextNodeId: "bye" },
      ],
    },
    bye: {
      id: "bye",
      speakerId,
      text: "Of course. Enjoy the rest of your visit.",
      end: true,
    },
  };
  topics.forEach((t, i) => {
    nodes[`a${i}`] = {
      id: `a${i}`,
      speakerId,
      text: t.answer,
      choices: [
        { id: "back", label: "Ask something else", nextNodeId: "greet" },
        { id: "done", label: "That's all for now", nextNodeId: "bye" },
      ],
    };
  });
  return { id, startNodeId: "greet", nodes, status: "placeholder" };
}

const receptionIntro: ConversationDefinition = {
  id: "reception-intro",
  startNodeId: "welcome",
  status: "placeholder",
  nodes: {
    welcome: {
      id: "welcome",
      speakerId: "receptionist",
      text: "Welcome to USNAYA Techworks Solutions. How may I help you today?",
      choices: [
        { id: "mgr", label: "I'd like to meet the manager.", action: { type: "navigate", targetId: "manager-cabin" } },
        { id: "it", label: "Take me to the IT department.", action: { type: "navigate", targetId: "it-department" } },
        { id: "hr", label: "I have a question for HR.", action: { type: "navigate", targetId: "hr-department" } },
        { id: "sales", label: "I'd like to speak with Sales.", action: { type: "navigate", targetId: "sales-department" } },
        { id: "conf", label: "Show me the conference hall.", action: { type: "navigate", targetId: "conference-hall" } },
        { id: "wait", label: "I'll wait in the lounge.", action: { type: "navigate", targetId: "waiting-lounge" } },
        { id: "kit", label: "Where is the break area?", action: { type: "navigate", targetId: "office-kitchen" } },
        { id: "park", label: "Where is the parking?", action: { type: "navigate", targetId: "car-parking" } },
        { id: "explore", label: "I'll look around on my own.", action: { type: "freeExplore" } },
        { id: "later", label: "Not right now.", action: { type: "endConversation" } },
      ],
    },
  },
};

const managerIntro: ConversationDefinition = {
  id: "manager-intro",
  startNodeId: "hello",
  status: "placeholder",
  nodes: {
    hello: {
      id: "hello",
      speakerId: "umesh",
      text: "Please, come in and have a seat. It's good to meet you. What brings you to USNAYA Techworks Solutions?",
      choices: [
        { id: "intro", label: "I'd like to know about the company.", nextNodeId: "company" },
        { id: "meet", label: "I'd like to arrange a meeting.", nextNodeId: "meeting" },
        { id: "bye", label: "I only wanted to say hello.", nextNodeId: "bye" },
      ],
    },
    company: {
      id: "company",
      speakerId: "umesh",
      text: `I'd be glad to talk about that. ${DEMO_NOTE}`,
      choices: [
        { id: "back", label: "Ask something else", nextNodeId: "hello" },
        { id: "done", label: "That's all for now", nextNodeId: "bye" },
      ],
    },
    meeting: {
      id: "meeting",
      speakerId: "umesh",
      text: "Certainly. Please speak with reception to book a time, or use the contact details shown on the company website.",
      choices: [
        { id: "back", label: "Ask something else", nextNodeId: "hello" },
        { id: "done", label: "That's all for now", nextNodeId: "bye" },
      ],
    },
    bye: {
      id: "bye",
      speakerId: "umesh",
      text: "A pleasure. Please visit again.",
      end: true,
    },
  },
};

const assistantIntro: ConversationDefinition = {
  id: "assistant-intro",
  startNodeId: "hello",
  status: "placeholder",
  nodes: {
    hello: {
      id: "hello",
      speakerId: "assistant",
      text: "Good day. The manager's cabin is just ahead. Knock on the door and wait for permission to enter.",
      choices: [
        { id: "go", label: "Take me to the cabin.", action: { type: "navigate", targetId: "manager-cabin" } },
        { id: "bye", label: "Thank you.", nextNodeId: "bye" },
      ],
    },
    bye: { id: "bye", speakerId: "assistant", text: "You're welcome.", end: true },
  },
};

const itHead: ConversationDefinition = simpleConversation(
    "it-head-intro",
    "abhishek",
    "Hello, I'm Abhishek Sharma, Head of the IT Department. Welcome. How can I help?",
    [
      { label: "What does the IT department do?", answer: `We look after the technology side of the company. ${DEMO_NOTE}` },
      { label: "Can I see the equipment?", answer: "Feel free to look around. The server racks are along the left wall." },
    ],
);

const gateIntro: ConversationDefinition = {
  id: "gate-intro",
  startNodeId: "hello",
  status: "placeholder",
  nodes: {
    hello: {
      id: "hello",
      speakerId: "guard",
      text: "Good day, and welcome to USNAYA Techworks Solutions. Vehicles use the left gate. Visitors on foot come through the pedestrian entry on the right. How can I help?",
      choices: [
        { id: "gate", label: "Open or close the vehicle gate.", action: { type: "toggleGate" } },
        { id: "car", label: "Where can I park a car?", action: { type: "navigate", targetId: "car-parking" } },
        { id: "bike", label: "Where can I park a motorcycle or scooter?", action: { type: "navigate", targetId: "bike-parking" } },
        { id: "rec", label: "Take me to reception.", action: { type: "navigate", targetId: "reception" } },
        { id: "bye", label: "Thank you.", nextNodeId: "bye" },
      ],
    },
    bye: { id: "bye", speakerId: "guard", text: "Please sign in at reception. Have a good visit.", end: true },
  },
};

function parkingInfo(id: string, text: string, other: { label: string; target: string }): ConversationDefinition {
  return {
    id,
    startNodeId: "info",
    status: "placeholder",
    nodes: {
      info: {
        id: "info",
        speakerId: "guard",
        text,
        choices: [
          { id: "other", label: other.label, action: { type: "navigate", targetId: other.target } },
          { id: "rec", label: "Take me to reception.", action: { type: "navigate", targetId: "reception" } },
          { id: "done", label: "Thanks, that's all.", nextNodeId: "bye" },
        ],
      },
      bye: { id: "bye", speakerId: "guard", text: "You're welcome.", end: true },
    },
  };
}

const carParkingInfo = parkingInfo(
  "car-parking-info",
  "Employees park on the left, visitors on the right. The first two visitor bays are accessible bays, closest to the pedestrian path.",
  { label: "Show me the two-wheeler parking.", target: "bike-parking" },
);
const bikeParkingInfo = parkingInfo(
  "bike-parking-info",
  "Motorcycles and scooters have their own marked area near the pedestrian entry, separate from the car bays.",
  { label: "Show me the car parking.", target: "car-parking" },
);

export const conversations: ConversationDefinition[] = [
  itHead,
  gateIntro,
  carParkingInfo,
  bikeParkingInfo,
  receptionIntro,
  managerIntro,
  assistantIntro,
  simpleConversation(
    "it-engineer-intro",
    "it-engineer",
    "Hello, and welcome to the IT department. How can I help?",
    [
      { label: "What does the IT team do?", answer: `We support the technology side of the company. ${DEMO_NOTE}` },
      { label: "Who is the head of IT?", answer: "Abhishek Sharma is the Head of the IT Department. He is at the desk across the room." },
    ],
  ),
  simpleConversation(
    "hr-exec-intro",
    "hr-exec",
    "Welcome to the HR department. What can I help you with?",
    [{ label: "I'm interested in working here.", answer: `Thank you for your interest. ${DEMO_NOTE}` }],
  ),
  simpleConversation(
    "sales-exec-intro",
    "sales-exec",
    "Welcome to Sales. How can we help your business?",
    [
      { label: "What do you offer?", answer: `Thanks for asking. ${DEMO_NOTE}` },
      { label: "I'd like a proposal.", answer: "Please share your requirements with the team. Reception can arrange a meeting." },
    ],
  ),
  simpleConversation(
    "ankita-intro",
    "ankita",
    "Hello, I'm Ankita. Welcome to the conference hall. How can I help?",
    [
      { label: "What happens in this room?", answer: "Team meetings, presentations and client discussions take place here." },
      { label: "Can I book it?", answer: "Please ask at reception and they will arrange it." },
    ],
  ),
  simpleConversation(
    "bhavishya-intro",
    "bhavishya",
    "Hello, I'm Bhavishya. Welcome to the break area. Can I get you a coffee?",
    [
      { label: "Do people eat lunch here?", answer: "Yes, team members gather here for lunch, informal catch-ups, and daily breaks." },
      { label: "What can I find in the break area?", answer: "We have an espresso coffee station, microwave, refrigerator, water dispenser, and comfortable dining tables." },
      { label: "Can you tell me about this office?", answer: "USNAYA Techworks Solutions features dedicated IT, HR, and Sales departments, a Conference Hall, Executive Suite, and this break area." },
    ],
  ),
  simpleConversation(
    "dravya-intro",
    "dravya",
    "Hi, I'm Dravya. This is the lounge. Please take a seat.",
    [{ label: "What is this area for?", answer: "It is a comfortable place for visitors to wait and for informal chats." }],
  ),
];

export const conversationById = (id: string) => conversations.find((c) => c.id === id);
