import {TetroShape} from './tetro-shape';
import {Vector2} from './vec';

export class Tetro {

  public constructor(
    public readonly shape: TetroShape,
    public readonly position: Vector2
  ) {}

  public moveDown() {
    (this.position as any) = this.position.add(new Vector2(0, 1));
  }

  public moveLeft() {
    (this.position as any) = this.position.add(new Vector2(-1, 0));
  }

  public moveRight() {
    (this.position as any) = this.position.add(new Vector2(1, 0));
  }

  public rotate(direction: 1 | -1 = 1) {
    this.shape.rotate(direction);
  }

  public static random(position: Vector2) {
    const shape = TetroShape.random();
    return new Tetro(shape, position);
  }

}
