/** Destinations the AI is allowed to suggest. Must match src/data/destinations.ts (a test enforces this). */
export const DESTINATION_IDS = [
  "main-gate",
  "car-parking",
  "bike-parking",
  "reception",
  "it-department",
  "hr-department",
  "sales-department",
  "conference-hall",
  "waiting-lounge",
  "office-kitchen",
  "manager-cabin",
] as const;

export type DestinationId = (typeof DESTINATION_IDS)[number];
export const isAllowedDestination = (id: unknown): id is DestinationId => typeof id === "string" && (DESTINATION_IDS as readonly string[]).includes(id);
