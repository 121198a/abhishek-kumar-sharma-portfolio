export type Vec2 = { x: number; z: number };
export type Rect = { x0: number; x1: number; z0: number; z1: number };

export type PropKind =
  // seating and tables
  | "desk"
  | "chair"
  | "sofa"
  | "armchair"
  | "bench"
  | "confTable"
  | "diningTable"
  | "coffeeTable"
  | "sideTable"
  | "managerDesk"
  | "receptionDesk"
  | "securityDesk"
  // storage
  | "shelf"
  | "cabinet"
  | "filing"
  | "credenza"
  // kitchen and appliances
  | "counter"
  | "coffee"
  | "fridge"
  | "microwave"
  | "sink"
  | "dispenser"
  | "binSet"
  | "printerStation"
  // technical
  | "rack"
  | "cableTray"
  // soft furnishing and light
  | "rug"
  | "plant"
  | "lamp"
  | "tableLamp"
  | "pendant"
  | "brandWall"
  // wall-mounted: origin on the wall surface, facing +z (rotate to face the room)
  | "wallDisplay"
  | "whiteboard"
  | "noticeBoard"
  | "directoryBoard"
  | "artFrame"
  | "wallClock"
  | "acousticPanel"
  | "firstAid"
  | "extinguisher"
  | "exitSign";

/** Finish variants. Which variants a kind understands is decided in src/world/props. */
export type PropVariant =
  // desks
  | "workstation"
  | "engineering"
  | "hr"
  | "sales"
  | "bench"
  // chairs
  | "task"
  | "meeting"
  | "cafe"
  | "guest"
  // upholstery
  | "taupe"
  | "charcoal"
  | "leather"
  | "sand"
  // plants
  | "tall"
  | "small"
  | "blades"
  // other
  | "conference"
  | "executive"
  | "mobile"
  | "round"
  | "art1"
  | "art2"
  | "art3"
  | "code"
  | "dashboard"
  | "document"
  | "welcome";

export type Prop = {
  kind: PropKind;
  x: number;
  z: number;
  rot?: number;
  w?: number;
  d?: number;
  variant?: PropVariant;
  /** Height override in metres for wall-mounted or hanging items. */
  y?: number;
};

export type FloorFinish = "carpet" | "stone" | "tile" | "wood";

export type Zone = {
  id: string;
  name: string;
  rect: Rect;
  floor: string;
  /** Surface texture used by the interior renderer. Exterior zones leave it out. */
  finish?: FloorFinish;
  props: Prop[];
};

export type NavNode = { id: string; x: number; z: number };

export type Destination = {
  id: string;
  label: string;
  zoneId: string;
  nodeId: string;
  /** Conversation opened automatically on arrival (not used for the manager's cabin). */
  introConversationId?: string;
  /** Character shown speaking in that intro. */
  speakerId?: string;
  objective: string;
};

export type Pose = "stand" | "sit" | "sit-type";

export type Look = {
  hair: "short" | "long" | "bun" | "cap" | "bald";
  /** Blazer or jacket colour worn over the outfit. */
  jacket?: string;
  /** Tie colour (formal wear). */
  tie?: string;
  /** Height multiplier, around 0.92 to 1.08. */
  scale?: number;
  /** Skirt or long-top silhouette instead of trousers. */
  longTop?: boolean;
  /** Designer spectacles for professional presentation. */
  glasses?: boolean;
  /** Role-based accessory (coffee mug for break area, tablet for lounge/meeting). */
  accessory?: "mug" | "tablet" | "none";
};

export type CharacterDefinition = {
  id: string;
  displayName: string;
  role: string;
  departmentId: string;
  position: Vec2;
  /** Yaw in radians. 0 faces +z (towards the entrance). */
  facing: number;
  conversationId?: string;
  movementProfile: "stationary" | "patrol" | "guided";
  patrol?: Vec2[];
  pose: Pose;
  /** Clothing colour (hex). */
  outfit: string;
  skin: string;
  hair: string;
  look?: Look;
  /** True when the role/placement is a stand-in the owner has not confirmed. */
  roleUnconfirmed?: boolean;
  aiEnabled: boolean;
};

export type DialogueAction =
  | { type: "navigate"; targetId: string }
  | { type: "startTour" }
  | { type: "freeExplore" }
  | { type: "endConversation" }
  | { type: "toggleGate" };

export type DialogueChoice = {
  id: string;
  label: string;
  nextNodeId?: string;
  action?: DialogueAction;
};

export type DialogueNode = {
  id: string;
  speakerId: string;
  text: string;
  choices?: DialogueChoice[];
  nextNodeId?: string;
  /** Explicit terminal node. Without it a node must have choices or nextNodeId. */
  end?: boolean;
};

export type ConversationDefinition = {
  id: string;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
  /** "placeholder" = neutral demo wording that the owner must replace with approved copy. */
  status: "placeholder" | "approved";
};
