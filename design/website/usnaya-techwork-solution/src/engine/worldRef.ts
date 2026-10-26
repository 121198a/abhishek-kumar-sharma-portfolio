import { director, logEvent } from "../experience/ExperienceDirector";
import { audio } from "./AudioManager";
import { WorldSimulation } from "./WorldSimulation";

/** The one simulation instance. Components read it every frame; they never write to it. */
export const world = {
  sim: new WorldSimulation((e) => {
    logEvent(e);
    if (e.type === "navigation:arrived") audio.play("arrive");
    director.send(e);
  }),
  /** Camera forward direction on the ground plane, used for camera-relative movement. */
  camForward: { x: -0.6, z: -0.8 },
  /** Where the camera is currently looking. Orbit mode starts from here. */
  camTarget: { x: 0, y: 0.5, z: 20 },
};

world.sim.onStep = () => audio.play("step");
