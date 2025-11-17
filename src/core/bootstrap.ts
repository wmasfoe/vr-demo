import { PanoramaRenderer } from '../renderer/panoramaRenderer';
import { createControlSystem } from '../controls/controller';

const TEXTURE_URL = new URL('../assets/panorama-gradient.png', import.meta.url).href;

export async function bootstrap() {
  const root = document.querySelector<HTMLDivElement>('#app');
  if (!root) {
    throw new Error('Missing #app container');
  }

  root.innerHTML = '';

  const stage = document.createElement('div');
  stage.className = 'stage';
  root.appendChild(stage);

  const touchHint = document.createElement('div');
  touchHint.className = 'touch-hint';
  touchHint.textContent = 'Touch & drag to adjust';
  root.appendChild(touchHint);

  const controlPanel = buildControlPanel();
  root.appendChild(controlPanel.panel);

  const renderer = new PanoramaRenderer(stage);
  await renderer.init(TEXTURE_URL);

  const controlSystem = createControlSystem(stage, (orientation) => {
    renderer.updateOrientation(orientation);
  });

  const updateMessage = () => {
    const state = controlSystem.getState();
    controlPanel.badge.textContent = state.motionActive ? 'Motion enabled' : 'Touch mode';
    controlPanel.badge.classList.toggle('error', state.motionDenied);

    if (!state.motionSupported) {
      controlPanel.statusText.textContent =
        'This device does not expose motion sensors. Panorama remains fully interactive via touch drag controls.';
      controlPanel.button.hidden = true;
      return;
    }

    if (!state.motionRequiresPermission) {
      controlPanel.button.hidden = true;
      controlPanel.statusText.textContent =
        'Move your phone to explore the scene. Touch drag still works for fine adjustments.';
      return;
    }

    controlPanel.button.hidden = state.motionActive;
    controlPanel.button.disabled = state.motionActive;

    if (state.motionDenied) {
      controlPanel.statusText.textContent =
        'Motion permission was denied. Use touch controls or enable sensors from system settings to retry.';
      controlPanel.badge.textContent = 'Touch only';
      return;
    }

    if (state.motionActive) {
      controlPanel.statusText.textContent =
        'Move your phone to explore the scene. Touch drag still works for fine adjustments.';
    } else {
      controlPanel.statusText.textContent =
        'Tap below to enable motion controls. We only request permission once there is explicit user intent.';
    }
  };

  updateMessage();

  controlPanel.button.addEventListener('click', async () => {
    const result = await controlSystem.enableMotion();
    if (result === 'denied') {
      alert('Motion access was denied by the browser. You can continue in touch-only mode.');
    }
    updateMessage();
  });

  const resize = () => renderer.resize();
  window.addEventListener('resize', resize);

  const cleanup = () => {
    window.removeEventListener('resize', resize);
    controlSystem.dispose();
    renderer.dispose();
  };

  window.addEventListener('beforeunload', cleanup, { once: true });
  window.addEventListener('pagehide', cleanup, { once: true });
}

function buildControlPanel() {
  const panel = document.createElement('div');
  panel.className = 'control-panel';

  const badge = document.createElement('div');
  badge.className = 'badge';
  panel.appendChild(badge);

  const statusText = document.createElement('div');
  statusText.className = 'status-text';
  panel.appendChild(statusText);

  const button = document.createElement('button');
  button.className = 'motion-button';
  button.type = 'button';
  button.textContent = 'Enable motion controls';
  panel.appendChild(button);

  return { panel, badge, statusText, button };
}
