## Why
Mobile advertisers need a demo-quality companion placement to prove VAST `<HTMLResource>` creatives can host immersive VR experiences. Right now the project is empty, so there is no reference implementation for gyroscope-driven panoramic rendering within the constrained ad iframe.

## What Changes
- Deliver a minimal yet functional VR companion ad demo that renders a panoramic scene with a trimmed three.js subset inside a single HTML payload.
- Implement motion + touch controls so Android browsers can explore the panorama, with graceful fallback when sensors are unavailable.
- Source/optimize lightweight equirectangular assets suited for ad payload limits, add visual markers for easier UX validation, and document how they’re bundled.
- Smooth device-orientation input to avoid abrupt jumps while still keeping touch adjustments responsive.
- Document build outputs so ad ops teams understand how to embed the generated HTML within VAST.

## Impact
- Provides a tangible artifact for validating feasibility with advertisers and SSPs.
- Establishes initial code structure (`src`, `dist`, core/renderer/controls modules) for future enhancements.
- De-risks motion permissions/compatibility issues early in the project lifecycle.
