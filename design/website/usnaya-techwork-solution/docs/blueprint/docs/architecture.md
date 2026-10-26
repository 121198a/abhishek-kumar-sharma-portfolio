# Architecture Notes

Refer to `../03_ARCHITECTURE.md`. Experience Director owns legal
transitions; character runtime owns movement/animation; camera manager
owns camera modes; dialogue manager owns authored progression; backend
owns AI calls. Never block rendering on network calls. AI cannot execute
arbitrary actions.
