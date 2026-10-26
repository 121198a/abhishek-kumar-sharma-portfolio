# Bug fix: instant destination switching and synchronised guided tour

## Root causes (found in `src/engine/WorldSimulation.ts`)
1. **Stale guide route.** A new task replaced Priya's path only when the visitor was within 7 m of her. Otherwise she was "not leading", her old path was left in place, and the "not leading" branch kept stepping her along it (to IT) before sending her home.
2. **Two controllers, two routes.** The visitor was given its own route to the destination while Priya got a separate one. The two only matched where the paths merged, so the sync rule compared distances on unrelated routes.
3. **Stall repair issued a destination.** The stuck-recovery code re-planned the visitor's own route straight to the destination.
4. Destination "Reception" was never led by Priya.
5. The unreachable branch cancelled the visitor but not the guide.

The Director already protected itself with a route id (`routeId`) and ignored arrival events from old ids; the leak was in the simulation.

## Fix
- One task at a time: `startRoute` first calls `cancelTask` (both characters' paths, follow state, stall timer), then installs the new task. `finishTask` reports arrival only for the active id and logs ignored obsolete ones. Leaving guided travel cancels the task, including Priya's path.
- Priya alone owns the destination route (`routeFrom(guide, destination)`), for every guided destination including Reception.
- The visitor gets no destination. `src/navigation/follow.ts` builds a follow path: the guide's route plus a short connector (or a join point if the visitor already stands on her route), trimmed 1.6 m short of the end. Both characters then share one tail, so "distance left to walk" compares directly: the visitor moves only when Priya is more than 1.8 m ahead, Priya waits when she is more than 4.5 m ahead. No time delays are used. If the visitor stands ahead of her after a turn-around, she walks past first.
- Stall recovery rebuilds the guide route and the follow path; it never gives the visitor a destination. The last-resort give-up cancels both and still reports a single arrival.
- Only fallback with an independent visitor route: non-guided walks (arrival from the street) and the rare case where the guide has no route.

## Debug trace
`sim.trace` always records task events (started, cancelled with reason, arrived, ignored obsolete arrival, stall reroute, abandoned). Mirror to the console with `window.__NAV_DEBUG = true`, or read `world.sim.trace`. Silent by default.

## Tests
- `src/tests/taskSwitching.test.ts` (6 tests, real Director and simulation): IT then Parking then Cabin; the full Reception > IT > Parking > Cabin > Lounge > Reception sequence with switches on the next frame, mid-walk, while following and just before arrival; 12 seeded random switches (some on the same frame) checking every frame that Priya's route ends at the latest destination; the visitor never advances while ahead of her; stale arrival events ignored; leaving guided travel leaves no old route. Against the previous `WorldSimulation.ts` three of these fail; against the fix all pass.
- Browser (`scripts/e2e.mjs`, step "rapid destination changes"): IT, Parking, Manager's Cabin selected 1.5 s apart in real Chromium; the debug trace showed three starts, the earlier two cancelled, one arrival, for the cabin.
- Full suite: 101 tests pass; tsc, eslint, build clean.

## Limits
- Software rendering runs the simulation slowly, so the browser check finishes the final walk with Skip. Smoothness of the turn-around (Priya turning and walking past the visitor in a narrow corridor) was not judged visually; they can briefly overlap.
