import { MotionController } from './motionControls';
import { TouchController } from './touchControls';

export interface Orientation {
  yaw: number;
  pitch: number;
}

export type MotionResult = 'running' | 'denied' | 'unsupported';

interface ControlState {
  motionSupported: boolean;
  motionActive: boolean;
  motionDenied: boolean;
  motionRequiresPermission: boolean;
}

export interface ControlSystem {
  enableMotion: () => Promise<MotionResult>;
  getState: () => ControlState;
  dispose: () => void;
}

const MAX_PITCH = Math.PI * 0.45;

export function createControlSystem(target: HTMLElement, onChange: (orientation: Orientation) => void): ControlSystem {
  const motion = new MotionController((orientation) => {
    sensorOrientation = orientation;
    emit();
  });
  const touch = new TouchController(target, (deltaYaw, deltaPitch) => {
    inputOffset.yaw += deltaYaw;
    inputOffset.pitch = clamp(inputOffset.pitch + deltaPitch, -MAX_PITCH, MAX_PITCH);
    emit();
  });

  let sensorOrientation: Orientation | null = null;
  const inputOffset: Orientation = { yaw: 0, pitch: 0 };
  const aggregate: Orientation = { yaw: 0, pitch: 0 };

  function emit() {
    const baseYaw = sensorOrientation?.yaw ?? 0;
    const basePitch = sensorOrientation?.pitch ?? 0;
    aggregate.yaw = normalizeAngle(baseYaw + inputOffset.yaw);
    aggregate.pitch = clamp(basePitch + inputOffset.pitch, -MAX_PITCH, MAX_PITCH);
    onChange({ ...aggregate });
  }

  if (motion.isSupported() && !motion.requiresPermission()) {
    motion.start();
  }

  return {
    async enableMotion() {
      if (!motion.isSupported()) {
        return 'unsupported';
      }
      const granted = await motion.requestPermission();
      if (!granted) {
        return 'denied';
      }
      motion.start();
      emit();
      return 'running';
    },
    getState() {
      return {
        motionSupported: motion.isSupported(),
        motionActive: motion.isActive(),
        motionDenied: motion.isDenied(),
        motionRequiresPermission: motion.requiresPermission()
      };
    },
    dispose() {
      motion.dispose();
      touch.dispose();
    }
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(value: number) {
  const twoPi = Math.PI * 2;
  return ((value % twoPi) + twoPi) % twoPi - Math.PI;
}
