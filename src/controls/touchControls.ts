const TOUCH_SENSITIVITY_YAW = 0.005;
const TOUCH_SENSITIVITY_PITCH = 0.0035;

type Listener = (deltaYaw: number, deltaPitch: number) => void;

export class TouchController {
  private pointerActive = false;
  private lastX = 0;
  private lastY = 0;
  private boundMove = (event: PointerEvent) => this.onMove(event);
  private boundEnd = (event: PointerEvent) => this.onEnd(event);

  constructor(private readonly target: HTMLElement, private readonly listener: Listener) {
    target.addEventListener('pointerdown', (event) => this.onDown(event));
  }

  dispose() {
    window.removeEventListener('pointermove', this.boundMove);
    window.removeEventListener('pointerup', this.boundEnd);
    window.removeEventListener('pointercancel', this.boundEnd);
  }

  private onDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.buttons !== 1) {
      return;
    }
    this.pointerActive = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.target.setPointerCapture(event.pointerId);
    window.addEventListener('pointermove', this.boundMove, { passive: false });
    window.addEventListener('pointerup', this.boundEnd);
    window.addEventListener('pointercancel', this.boundEnd);
  }

  private onMove(event: PointerEvent) {
    if (!this.pointerActive) {
      return;
    }
    event.preventDefault();
    const deltaX = event.clientX - this.lastX;
    const deltaY = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    this.listener(-deltaX * TOUCH_SENSITIVITY_YAW, -deltaY * TOUCH_SENSITIVITY_PITCH);
  }

  private onEnd(event: PointerEvent) {
    this.pointerActive = false;
    window.removeEventListener('pointermove', this.boundMove);
    window.removeEventListener('pointerup', this.boundEnd);
    window.removeEventListener('pointercancel', this.boundEnd);
    if (event.pointerId && this.target.hasPointerCapture(event.pointerId)) {
      this.target.releasePointerCapture(event.pointerId);
    }
  }
}
