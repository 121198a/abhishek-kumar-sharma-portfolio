import type { CharacterDefinition, ConversationDefinition, Destination } from "../data/types";

/** Returns human-readable problems. An empty array means the graph is valid. */
export function validateConversation(
  c: ConversationDefinition,
  speakerIds: ReadonlySet<string>,
  destinationIds: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];
  const tag = `[${c.id}]`;
  if (!c.nodes[c.startNodeId]) errors.push(`${tag} start node "${c.startNodeId}" does not exist`);

  for (const [key, node] of Object.entries(c.nodes)) {
    if (key !== node.id) errors.push(`${tag} node key "${key}" differs from node id "${node.id}"`);
    if (!speakerIds.has(node.speakerId)) errors.push(`${tag} node "${node.id}" has unknown speaker "${node.speakerId}"`);
    if (node.nextNodeId && !c.nodes[node.nextNodeId]) errors.push(`${tag} node "${node.id}" points to missing node "${node.nextNodeId}"`);
    const hasExit = Boolean(node.end) || Boolean(node.nextNodeId) || (node.choices?.length ?? 0) > 0;
    if (!hasExit) errors.push(`${tag} node "${node.id}" is a dead end (add choices, nextNodeId or end: true)`);
    const ids = new Set<string>();
    for (const ch of node.choices ?? []) {
      if (ids.has(ch.id)) errors.push(`${tag} node "${node.id}" repeats choice id "${ch.id}"`);
      ids.add(ch.id);
      if (ch.nextNodeId && !c.nodes[ch.nextNodeId]) errors.push(`${tag} choice "${ch.id}" points to missing node "${ch.nextNodeId}"`);
      if (!ch.nextNodeId && !ch.action) errors.push(`${tag} choice "${ch.id}" has neither nextNodeId nor action`);
      if (ch.action?.type === "navigate" && !destinationIds.has(ch.action.targetId)) {
        errors.push(`${tag} choice "${ch.id}" navigates to unknown destination "${ch.action.targetId}"`);
      }
    }
  }

  // reachability
  const seen = new Set<string>();
  const stack = [c.startNodeId];
  while (stack.length) {
    const id = stack.pop() as string;
    if (seen.has(id)) continue;
    seen.add(id);
    const n = c.nodes[id];
    if (!n) continue;
    if (n.nextNodeId) stack.push(n.nextNodeId);
    n.choices?.forEach((ch) => ch.nextNodeId && stack.push(ch.nextNodeId));
  }
  for (const id of Object.keys(c.nodes)) if (!seen.has(id)) errors.push(`${tag} node "${id}" is unreachable`);
  return errors;
}

export function validateAllConversations(
  conversations: ConversationDefinition[],
  characters: CharacterDefinition[],
  destinations: Destination[],
): string[] {
  const speakers = new Set(characters.map((c) => c.id));
  const dests = new Set(destinations.map((d) => d.id));
  const ids = new Set<string>();
  const errors: string[] = [];
  for (const c of conversations) {
    if (ids.has(c.id)) errors.push(`duplicate conversation id "${c.id}"`);
    ids.add(c.id);
    errors.push(...validateConversation(c, speakers, dests));
  }
  for (const ch of characters) {
    if (ch.conversationId && !ids.has(ch.conversationId)) errors.push(`character "${ch.id}" uses missing conversation "${ch.conversationId}"`);
  }
  for (const d of destinations) {
    if (d.introConversationId && !ids.has(d.introConversationId)) errors.push(`destination "${d.id}" uses missing conversation "${d.introConversationId}"`);
    if (d.speakerId && !speakers.has(d.speakerId)) errors.push(`destination "${d.id}" has unknown speaker "${d.speakerId}"`);
  }
  return errors;
}
