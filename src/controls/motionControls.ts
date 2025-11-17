import type { Orientation } from './controller';

const DEG2RAD = Math.PI / 180;

type PermissionStateResult = 'unknown' | 'granted' | 'denied';
type DeviceOrientationConstructor = typeof window.DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

export class MotionController {
  private handler = (event: DeviceOrientationEvent) => this.onDeviceOrientation(event);
  private active = false;
  private denied = false;
  private baseline: Orientation | null = null;
  private permission: PermissionStateResult = 'unknown';
  private requiresPrompt: boolean;

  constructor(private readonly onChange: (orientation: Orientation) => void) {
    const deviceOrientation =
      typeof window !== 'undefined'
        ? ((window.DeviceOrientationEvent as DeviceOrientationConstructor | undefined) ?? undefined)
        : undefined;
    this.requiresPrompt = typeof deviceOrientation?.requestPermission === 'function';
  }

  isSupported() {
    return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
  }

  isActive() {
    return this.active;
  }

  isDenied() {
    return this.denied;
  }

  requiresPermission() {
    return this.requiresPrompt;
  }

  async requestPermission() {
    if (!this.isSupported()) {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const deviceOrientation = window.DeviceOrientationEvent as DeviceOrientationConstructor;

    if (this.requiresPrompt && typeof deviceOrientation?.requestPermission === 'function') {
      try {
        const state = await deviceOrientation.requestPermission();
        this.permission = state === 'granted' ? 'granted' : 'denied';
        this.denied = this.permission === 'denied';
        return state === 'granted';
      } catch (error) {
        console.warn('Device orientation permission error', error);
        this.permission = 'denied';
        this.denied = true;
        return false;
      }
    }

    this.permission = 'granted';
    this.denied = false;
    return true;
  }

  start() {
    if (!this.isSupported() || this.active) {
      return;
    }
    this.baseline = null;
    window.addEventListener('deviceorientation', this.handler, false);
    this.active = true;
  }

  stop() {
    if (!this.active) {
      return;
    }
    window.removeEventListener('deviceorientation', this.handler);
    this.active = false;
    this.baseline = null;
  }

  dispose() {
    this.stop();
  }

  private onDeviceOrientation(event: DeviceOrientationEvent) {
    if (event.alpha == null || event.beta == null) {
      return;
    }

    if (!this.baseline) {
      this.baseline = {
        yaw: event.alpha,
        pitch: event.beta
      };
    }

    const yaw = normalizeDegrees(event.alpha - this.baseline.yaw) * DEG2RAD;
    const pitch = normalizeDegrees((event.beta ?? 0) - this.baseline.pitch) * DEG2RAD;
    const clampedPitch = clamp(pitch, -Math.PI / 2, Math.PI / 2);

    this.onChange({ yaw, pitch: clampedPitch });
  }
}

function normalizeDegrees(value: number) {
  const range = 360;
  return ((value % range) + range) % range - range / 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
