# VR Companion Demo

This project delivers a single-file HTML creative that renders an interactive panoramic scene for VAST `<HTMLResource>` companion placements. It uses a trimmed three.js workflow, gyroscope controls (with permission flow), and touch fallback so the demo works inside mobile ad iframes.

## Getting Started

```bash
npm install
npm run dev # local preview at http://localhost:5173
```

## Building a Single HTML Payload

```bash
npm run build
# Final artifact → dist/index.html
```

The build pipeline inlines JavaScript, CSS, and the placeholder panorama texture so `dist/index.html` can be dropped directly into the VAST `<HTMLResource>` tag without extra assets.

## Replacing the Panorama Asset

- The default gradient lives at `src/assets/panorama-gradient.png` (256×128, 2:1 ratio).
- Replace it with a compressed equirectangular JPG/PNG (≤4K recommended) and update `TEXTURE_URL` inside `src/core/bootstrap.ts` if you need to change the filename.
- Keep files under ~1.5 MB to ensure the creative loads fast enough for mobile ad slots.

## Motion vs Touch Controls

- Touch drag is always enabled via pointer events.
- Tapping “Enable motion controls” triggers `DeviceOrientationEvent.requestPermission()` on iOS; Android/Chrome works immediately.
- When permission is denied or absent, the UI surfaces a fallback message and keeps touch mode active.

## Embedding Guidance

1. Run `npm run build` to produce `dist/index.html`.
2. Paste the full HTML into the VAST `<Companion>`’s `<HTMLResource>` element.
3. Ensure the ad container allows device motion events (some SDKs expose an opt-in flag).
4. Because everything is self-contained, no additional hosting or CDN references are required.
