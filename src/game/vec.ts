export class Vector2 {

  public constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  public add(value: Vector2) {
    return new Vector2(
      this.x + value.x,
      this.y + value.y
    );
  }

}
