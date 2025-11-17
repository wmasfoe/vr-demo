## ADDED Requirements
### Requirement: Interactive VR Companion Creative
The system MUST provide a single-file HTML creative that renders a panoramic scene with motion-enabled controls suitable for embedding inside a VAST `<HTMLResource>` companion slot.

#### Scenario: Motion-enabled panorama on supported device
- **GIVEN** a mobile browser that supports DeviceOrientation events and grants motion permissions
- **WHEN** the creative loads inside the companion placement
- **THEN** the panorama is displayed using three.js and responds to device motion and touch drag inputs
- **AND** all assets load from within the HTML payload without external network dependencies beyond the ad server

#### Scenario: Graceful fallback when sensors unavailable
- **GIVEN** motion sensors are unavailable or permission is denied
- **WHEN** the user loads the creative
- **THEN** touch drag controls remain available for panning the scene
- **AND** the user is shown messaging explaining how to enable motion controls or continue with touch-only interaction
