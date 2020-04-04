import {Tetro} from "./tetro";
import {Vector2} from "./vec";

export class GameState {

  placedTetros = GameState.getEmptyField();

  activeTetro: Tetro = Tetro.random(new Vector2(3, 0));

  state: 'playing' | 'paused' | 'game over'  = 'playing';

  public newGame() {
    this.placedTetros = GameState.getEmptyField();
    this.activeTetro = Tetro.random(new Vector2(3, 0));
    this.state = 'playing';
  }

  public nextTetro() {
    this.activeTetro = Tetro.random(new Vector2(3, 0));
  }

  public togglePause() {
    if (this.state === 'game over') { return; }

    this.state = this.state === 'playing'
      ? 'paused'
      : 'playing';
  }

  private static getEmptyField(): number[][] {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0, 0, 0],
    ];
  }

}
