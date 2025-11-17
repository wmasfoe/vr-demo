import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TextureLoader,
  CanvasTexture,
  Texture,
  SRGBColorSpace
} from 'three';
import type { Orientation } from '../controls/controller';

export class PanoramaRenderer {
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private sphere: Mesh<SphereGeometry, MeshBasicMaterial>;
  private raf?: number;

  constructor(private readonly container: HTMLElement) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(75, this.aspectRatio, 1, 2000);
    this.camera.rotation.reorder('YXZ');

    const geometry = new SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    this.sphere = new Mesh(geometry, material);
    this.scene.add(this.sphere);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight, false);
    this.container.appendChild(this.renderer.domElement);
  }

  async init(textureUrl: string) {
    await this.loadTexture(textureUrl);
    this.start();
  }

  updateOrientation(orientation: Orientation) {
    this.camera.rotation.y = orientation.yaw;
    this.camera.rotation.x = orientation.pitch;
  }

  resize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  dispose() {
    cancelAnimationFrame(this.raf ?? 0);
    this.renderer.dispose();
    this.sphere.geometry.dispose();
    if (this.sphere.material.map) {
      this.sphere.material.map.dispose();
    }
    this.sphere.material.dispose();
  }

  private start() {
    const renderLoop = () => {
      this.raf = requestAnimationFrame(renderLoop);
      this.renderer.render(this.scene, this.camera);
    };
    renderLoop();
  }

  private loadTexture(textureUrl: string) {
    const loader = new TextureLoader();
    return new Promise<void>((resolve) => {
      loader.load(
        textureUrl,
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          this.applyTexture(texture);
          resolve();
        },
        undefined,
        () => {
          console.warn('Falling back to generated canvas texture.');
          this.applyTexture(this.generateFallbackTexture());
          resolve();
        }
      );
    });
  }

  private applyTexture(texture: CanvasTexture | Texture) {
    this.sphere.material.map = texture;
    this.sphere.material.needsUpdate = true;
  }

  private generateFallbackTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to acquire canvas context');
    }
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#19324f');
    gradient.addColorStop(0.5, '#366d9b');
    gradient.addColorStop(1, '#e7cfa2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new CanvasTexture(canvas);
  }

  private get aspectRatio() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    return width / Math.max(height, 1);
  }
}
