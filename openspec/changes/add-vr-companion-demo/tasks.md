## 1. Demo Implementation
- [x] 1.1 Scaffold Vite project with `src/core`, `src/renderer`, `src/controls` modules and configure single-file HTML output (tree-shake three.js to required primitives only).
- [x] 1.2 Build panorama renderer using the trimmed three.js subset that loads an optimized equirectangular texture and exposes camera hooks.
- [x] 1.3 Implement input controller that combines touch drag + gyroscope orientation (with permission request + fallback messaging when unavailable).
- [x] 1.4 Wire core bootstrap to initialize renderer + controls, manage resize lifecycle, and embed sensor-permission prompts plus explicit touch-only fallback UI.
- [x] 1.5 Produce final bundled `dist/index.html`, confirm it runs standalone inside a blank HTML container simulating VAST `<HTMLResource>` and loads all assets inline/locally.
- [ ] 1.6 Iterate on the demo panorama asset so it contains clear markers/parallax cues while staying under payload limits.
- [ ] 1.7 Apply motion smoothing (e.g., exponential moving average) so gyroscope-driven rotation feels steady without noticeable lag.

## 2. Validation & Handoff
- [x] 2.1 Smoke-test on Android Chrome (and iOS Safari if available) verifying panorama loads, trimmed bundle stays lightweight, responds to motion/touch, and handles denied permissions with fallback.
- [x] 2.2 Document build + embedding instructions (including sourcing/compressing 360 assets and motion-permission caveats) in README or inline comments for ad ops teams.
- [ ] 2.3 Validate the refined asset + smoothing on device to ensure visual cues move smoothly with sensor input.
