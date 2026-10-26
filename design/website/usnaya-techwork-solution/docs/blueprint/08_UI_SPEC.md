# UI Specification

## Art direction

Premium, calm, architectural, readable. Interface complements the world.
Reuse an existing website design system if integrating into one.

## Components

Loading/progress, welcome/start, guided/explore choice, destination
directory, current objective, optional character speech bubble,
persistent dialogue panel, AI input, nearby interaction prompt,
pause/settings, audio toggle, reduced-motion option, controls hint,
optional minimap later.

## Dialogue

HTML/CSS, high contrast, speaker name/role, readable text,
keyboard-accessible choices, AI loading/typing state, retry/fallback, no
raw HTML from AI. Clearly distinguish a suggested reply from an action.

## States

Default, hover/focus, selected, disabled, loading, error,
success/completed.

## Accessibility

Keyboard access, visible focus, reduced motion, captions/transcripts if
voice is added, no colour-only meaning, no-WebGL fallback.

## Desktop controls

WASD/arrows move; mouse camera/look; E/click interact; Esc close/pause.
Final mapping must be shown in a help panel.

## Responsive

Desktop/laptop first. Keep UI from overflowing; later add touch
joystick/tap-to-move, larger targets and a mobile quality profile.
