import {Clock} from "./clock";
import {GameControls} from "./game-controls";
import {GameState} from "./game-state";

const GRID_W = 300 / 9;
const GRID_H = 500 / 20;

export class Game {

  private static _FRAME_SKIP_TARGET = 20;

  private _frameSkip = 0;
  private _clock: Clock = new Clock();
  private _controls = new GameControls();
  private _state = new GameState();
  private _running = false;
  private _context!: CanvasRenderingContext2D;

  public constructor(private readonly _canvas: HTMLCanvasElement) {
    this._context = this._canvas.getContext('2d')!;
    if (!this._context) { throw new Error('Unable to get canvas context'); }
  }

  public start() {
    this._running = true;
    this._init();
    this._run();
  }

  private _stop() {
    this._destory();
  }

  private _init() {
    this._controls.init();
  }

  private _destory() {
    this._controls.destory();
  }

  private _run(): void {
    this._frameSkip++;
    if (this._frameSkip === Game._FRAME_SKIP_TARGET) {
      this._frameSkip = 0;

      const dt = this._clock.tick()
      this._update(dt);
      this._render();

      if (!this._running) {
        this._stop();
        return;
      }
    }

    requestAnimationFrame(() => this._run());
  }

  private _dt: number = 0;
  private _update(dt: number): void {
    this._dt = dt;

    if (this._controls.activeKeys.has('w')) {
      this._state.activeTetro.rotate();
    }
    if (this._controls.activeKeys.has('s')) {
      this._state.activeTetro.moveDown();
    }
    if (this._controls.activeKeys.has('a')) {
      this._state.activeTetro.moveLeft();
    }
    if (this._controls.activeKeys.has('d')) {
      this._state.activeTetro.moveRight();
    }
  }

  private _render(): void {
    this._renderClearScreen();
    this._renderBackground();
    this._renderPlacedTetros();
    this._renderActiveTetro();
    this._renderGrid();
    this._renderDebugInfo();
  }

  private _renderClearScreen(): void {
    this._context.fillStyle = 'black';
    this._context.fillRect(0, 0, 500, 500);
  }

  private _renderBackground(): void {
    this._context.fillStyle = '#800';
    this._context.fillRect(0, 0, 100, 500);
    this._context.fillRect(400, 0, 100, 500);
  }

  private _renderPlacedTetros(): void {
    this._context.fillStyle = 'white';

    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 9; col++) {
        if (this._state.placedTetros[row][col] === 0) { continue; }

        this._context.fillRect(100 + col * GRID_W, 0 + row * GRID_H, GRID_W, GRID_H);
      }
    }
  }

  private _renderActiveTetro(): void {
    const tetro = this._state.activeTetro;
    const tetroBitmap = tetro.shape.bitmap();

    const rows = tetroBitmap.length;
    const cols = tetroBitmap[0].length;

    const offsetX = tetro.position.x;
    const offsetY = tetro.position.y;

    for (let row = offsetY; row < (rows + offsetY); row++) {
      for (let col = offsetX; col < (cols + offsetX); col++) {
        if (tetroBitmap[row - offsetY][col - offsetX] === 0) { continue; }

        this._context.fillRect(100 + col * GRID_W, 0 + row * GRID_H, GRID_W, GRID_H);
      }
    }
  }

  private _renderGrid(): void {
    this._context.strokeStyle = '#800';
    this._context.lineWidth = 2;

    for (let row = 1; row < 20; row++) {
      this._context.beginPath();
      this._context.moveTo(100, 0 + row * GRID_H);
      this._context.lineTo(400, 0 + row * GRID_H);
      this._context.stroke();
    }
    for (let col = 1; col < 9; col++) {
      this._context.beginPath();
      this._context.moveTo(100 + col * GRID_W, 0);
      this._context.lineTo(100 + col * GRID_W, 500);
      this._context.stroke();
    }
  }

  private _renderDebugInfo(): void {
    this._context.fillStyle = 'white';
    this._context.fillText(`${+new Date()}`, 5, 25);
    this._context.fillText(`FPS: ${FPS.calculate(this._dt)}`, 5, 15);

    const activeModifiers = `Modifiers: A: ${this._controls.alt}, C: ${this._controls.ctrl}, S: ${this._controls.shift}`;
    const activeKeys = `Keys: ${Array.from(this._controls.activeKeys).join(' ')}`;
    this._context.fillText(activeModifiers, 5, 35);
    this._context.fillText(activeKeys, 5, 45);
  }

}

class FPS {
  public static calculate(dt: number) {
    return Math.round(1000 / dt);
  }
}
