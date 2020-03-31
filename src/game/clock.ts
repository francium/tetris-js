export class Clock {
  private _lastTick: number = performance.now();

  /**
   * Returns the amount of time passed since last tick
   */
  public tick(): number {
    const dt = performance.now() - this._lastTick;
    this._lastTick += dt;
    return dt;
  }
}
