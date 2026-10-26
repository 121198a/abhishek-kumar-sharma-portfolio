import { characters } from "../data/characters";
import { world } from "../engine/worldRef";
import { useExperience } from "../store/experienceStore";
import { Person } from "./Person";
import { currentLine } from "../store/dialogueStore";
import { send } from "../experience/ExperienceDirector";
import { dist } from "../navigation/graph";
import { useUi } from "../store/uiStore";

function handleNpcSelect(id: string) {
  const c = world.sim.chars.get(id);
  if (!c || !c.def.conversationId) return;
  const d = dist(world.sim.visitor.pos, c.nav.pos);
  const state = useExperience.getState().name;
  if (state !== "freeExplore" && state !== "destinationChoice" && state !== "reception") return;
  if (d <= 6.0) {
    send({ type: "interaction:started", targetId: id });
  } else {
    useUi.getState().setToast(`Selected ${c.def.displayName}. Moving closer to speak.`);
    send({ type: "destination:selected", destinationId: c.def.departmentId });
  }
}

function Npc({ id }: { id: string }) {
  const c = world.sim.chars.get(id);
  if (!c) return null;
  const d = c.def;
  return (
    <Person
      outfit={d.outfit}
      skin={d.skin}
      hair={d.hair}
      look={d.look}
      label={d.displayName}
      onSelect={() => handleNpcSelect(id)}
      read={() => ({ x: c.nav.pos.x, z: c.nav.pos.z, yaw: c.yaw, anim: c.anim, moving: c.nav.moving })}
      bubble={() => {
        const speaker = useExperience.getState().context.speakerId;
        return speaker === id ? currentLine() : null;
      }}
    />
  );
}

export function Characters() {
  return (
    <>
      {characters.map((c) => (
        <Npc key={c.id} id={c.id} />
      ))}
    </>
  );
}

export function Visitor() {
  const v = world.sim.visitor;
  return (
    <Person
      outfit="#3d6fa6"
      skin="#d4a37b"
      hair="#2a1d17"
      label="You"
      labelClass="person-label person-label--you"
      read={() => ({ x: world.sim.visitor.pos.x, z: world.sim.visitor.pos.z, yaw: world.sim.visitor.yaw, anim: v.moving || world.sim.visitor.moving ? "walk" : "idle", moving: world.sim.visitor.moving })}
    />
  );
}
