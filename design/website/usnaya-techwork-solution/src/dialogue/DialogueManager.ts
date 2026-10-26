import { characterById } from "../data/characters";
import type { ConversationDefinition, DialogueChoice, DialogueNode } from "../data/types";
import { conversationById } from "./conversations";

/** Pure helpers around a conversation graph. UI state lives in the store. */
export function startNode(c: ConversationDefinition): DialogueNode {
  const n = c.nodes[c.startNodeId];
  if (!n) throw new Error(`Conversation ${c.id} has no start node`);
  return n;
}

export function getConversation(id: string | null | undefined): ConversationDefinition | null {
  return id ? (conversationById(id) ?? null) : null;
}

export type StepResult =
  | { kind: "node"; node: DialogueNode }
  | { kind: "end" }
  | { kind: "action"; choice: DialogueChoice };

/** Apply a choice: either move to another node, or surface an action for the Director to validate. */
export function applyChoice(c: ConversationDefinition, choice: DialogueChoice): StepResult {
  if (choice.action) return { kind: "action", choice };
  const next = choice.nextNodeId ? c.nodes[choice.nextNodeId] : undefined;
  return next ? { kind: "node", node: next } : { kind: "end" };
}

export function advance(c: ConversationDefinition, node: DialogueNode): StepResult {
  if (node.nextNodeId) {
    const n = c.nodes[node.nextNodeId];
    if (n) return { kind: "node", node: n };
  }
  return { kind: "end" };
}

export function speakerLabel(speakerId: string): { name: string; role: string } {
  const ch = characterById(speakerId);
  return ch ? { name: ch.displayName, role: ch.role } : { name: speakerId, role: "" };
}
