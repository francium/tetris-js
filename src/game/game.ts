import {Clock} from "./clock";
import {GameControls} from "./game-controls";
import {GameState} from "./game-state";
import {Vector2} from "./vec";

const ROWS = 20;
const COLS = 9;

const GRID_W = 300 / COLS;
const GRID_H = 500 / ROWS;

export class Game {

  private static _CONTROL_SKIP_MS = 250;
  private static _DROP_SKIP_MS = 500;

  private _controlSkip = 0;
  private _dropSkip = 0;
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
    const dt = this._clock.tick()
    this._update(dt);
    this._render();

    if (!this._running) {
      this._stop();
      return;
    }

    requestAnimationFrame(() => this._run());
  }

  private _dt: number = 0;
  private _update(dt: number): void {
    this._dt = dt;

    let skipDrop = false;

    this._controlSkip += dt;
    if (this._controlSkip >= Game._CONTROL_SKIP_MS) {
      this._controlSkip = 0;

      if (this._controls.activeKeys.has('w')) {
        this._state.activeTetro.rotate();
      }
      if (this._controls.activeKeys.has('s')) {
        this._dropSkip = Game._DROP_SKIP_MS;
      }
      if (this._controls.activeKeys.has('a')) {
        const pos = this._state.activeTetro.position.add(new Vector2(-1, 0));
        if (this._isPlaceableAt(pos)) {
          this._state.activeTetro.moveLeft();
        }
      }
      if (this._controls.activeKeys.has('d')) {
        const pos = this._state.activeTetro.position.add(new Vector2(1, 0));
        if (this._isPlaceableAt(pos)) {
          this._state.activeTetro.moveRight();
        }
      }
      if (this._controls.activeKeys.has(' ')) {
        while (this._canMoveDown()) {
          this._state.activeTetro.moveDown();
        }

        this._placeTetro();
        this._state.nextTetro();
        this._clearLines();
      }
    }

    // Automatic drop
    if (!skipDrop) {
      this._dropSkip += dt;
      if (this._dropSkip >= Game._DROP_SKIP_MS) {
        this._dropSkip = 0;

        if (this._canMoveDown()) {
          this._state.activeTetro.moveDown();
        } else {
          this._placeTetro();
          this._state.nextTetro();
          this._clearLines();
        }
      }
    }
  }

  private _canMoveDown() {
    return (
      !this._isLanded()
      && this._isPlaceableAt(this._state.activeTetro.position)
    );
  }

  private _placeTetro() {
    const pos = this._state.activeTetro.position;
    const bitmap = this._state.activeTetro.shape.bitmap();

    for (let r = 0; r < bitmap.length; r++) {
      for (let c = 0; c < bitmap[0].length; c++) {
        const ro = r + pos.y;
        const co = c + pos.x;

        if (bitmap[r][c] === 1) {
          this._state.placedTetros[ro][co] = 1;
        }
      }
    }
  }

  private _isLanded(): boolean {
    const pos = this._state.activeTetro.position.add(new Vector2(0, 1));
    return !this._isPlaceableAt(pos);
  }

  private _isPlaceableAt(pos: Vector2): boolean {
    const bitmap = this._state.activeTetro.shape.bitmap();

    for (let r = 0; r < bitmap.length; r++) {
      for (let c = 0; c < bitmap[0].length; c++) {
        if (bitmap[r][c] == 0) { continue; }

        const ro = r + pos.y;
        const co = c + pos.x;

        if (ro < 0 || ro >= ROWS || co < 0 || co >= COLS) {
          return false;
        }

        if (this._state.placedTetros[ro][co] === 1) {
          return false;
        }
      }
    }

    return true;
  }

  private _clearLines(): void {
    let dropAmount = 0;

    for (let r = ROWS - 1; r >= 0; r--) {
      const row = this._state.placedTetros[r];

      if (dropAmount > 0) {
        this._state.placedTetros[r + dropAmount] = row;
      }

      if (row.every(i => i === 1)) {
        row.fill(0);
        dropAmount++;
      }
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

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
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

    for (let row = 1; row < ROWS; row++) {
      this._context.beginPath();
      this._context.moveTo(100, 0 + row * GRID_H);
      this._context.lineTo(400, 0 + row * GRID_H);
      this._context.stroke();
    }
    for (let col = 1; col < COLS; col++) {
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

    this._context.fillText(`control skip: ${this._controlSkip}, drop skip: ${this._dropSkip}`, 5, 55);
  }

}

class FPS {
  public static calculate(dt: number) {
    return Math.round(1000 / dt);
  }
}
