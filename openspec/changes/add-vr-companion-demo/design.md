# Design: VR Companion Demo

## Goals
- Deliver a lightweight panoramic viewer packaged as single HTML suitable for VAST `<HTMLResource>`.
- Use a trimmed three.js subset for WebGL rendering, minimizing bundle size while keeping GPU acceleration.
- Provide sensor-driven controls with touch fallback to guarantee interaction on devices without motion APIs.

## Architecture
```
src/
  core/
    bootstrap.ts        # entry initializes renderer + controls, handles resize, DOM prompts
  renderer/
    panoramaRenderer.ts # wraps three.js subset for sphere + texture + camera
  controls/
    motionControls.ts   # gyroscope permission + orientation
    touchControls.ts    # drag-to-pan
    controller.ts       # combines inputs, exposes unified API
  assets/
    pano.jpg            # demo equirectangular texture (local, compressed)
```
- `core/bootstrap` mounts canvas, requests sensor permission on first tap, and swaps UI states (`motion-enabled`, `touch-only`).
- Renderer loads local equirectangular texture into an inverted sphere mesh; no external network fetches.
- Controls module translates DeviceOrientation angles to camera rotation; when unsupported, touch controls remain active.
- A lightweight orientation filter (exponential moving average) smooths rapid device sensor jitter without affecting intentional touch drags.
- Build pipeline (Vite) uses rollup options to inline JS/CSS into `index.html`, with manual chunk pruning to avoid unused three.js modules.

## Key Decisions
1. **Trimmed three.js subset** – Instead of pure CSS3D or Canvas, we rely on GPU-accelerated WebGL but tree-shake to essentials (`Scene`, `PerspectiveCamera`, `SphereGeometry`, `MeshBasicMaterial`, `TextureLoader`, `Vector3`). This balances performance vs. bundle size.
2. **Sensor fallback UX** – Provide a permission overlay with clear call-to-action; if denied, auto-switch to prominent touch instructions. Prevents blank experiences in locked-down environments.
3. **Asset strategy** – Include a single compressed 360 JPG (≤4K) with visual landmarks and band markers to make motion obvious while keeping HTML < ad platform limits. Future assets can replace the file without code changes.
4. **Motion smoothing** – Apply easing/EMA on gyroscope readings to minimize jitter from hardware noise but still allow quick turns; touch deltas bypass smoothing for responsiveness.
5. **Testing approach** – Manual smoke tests on Android Chrome (primary) and iOS Safari (secondary). Logging hooks in controls help diagnose sensor availability quickly.

## Open Questions / Future Work
- Whether we need analytics pings or interaction tracking for ad metrics.
- How to dynamically swap textures or load them from ad server query params.
- Potential addition of lightweight UI (call-to-action, hotspot markers) once core panorama is approved.
