# Testing Strategy

## Unit tests

State transition legality; dialogue graph validation;
department/destination references; AI schema and action allow-list;
route cancellation; asset manifest.

## Component tests

Destination menu; dialogue progression; AI
loading/success/timeout/retry; pause/reduced-motion; keyboard
focus/accessibility.

## Integration tests

Destination → route → arrival → interaction; guided dialogue → continue;
free explore → nearby character → resume; manager knock/entry; AI
unavailable → authored fallback.

## E2E smoke tests

Load experience, start tour, reach reception, select IT, complete
dialogue, change destination/resume exploration, confirm no uncaught
errors.

## Performance

Record FPS and memory on a named reference device/browser. Check initial
loading, progressive loading, texture/geometry sizes, quality mode and
scene re-entry/memory leaks.

Release gate: run actual checks and report actual results; document
blockers rather than claiming success.
