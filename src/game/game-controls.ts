export class GameControls {

  public readonly activeKeys: Set<string> = new Set();
  public readonly alt: boolean = false;
  public readonly ctrl: boolean = false;
  public readonly shift: boolean = false;

  private _handlerMap: Map<string, Function> = new Map();

  public init() {
    this._registerHandler('keydown', this._handleKeydown.bind(this));
    this._registerHandler('keyup', this._handleKeyup.bind(this));
  }

  public destory() {
    this._handlerMap.forEach((handler, eventType) => {
      document.body.removeEventListener(eventType as any, handler as any);
    })
  }

  private _registerHandler(eventType: string, handler: Function): void {
    this._handlerMap.set(eventType, handler);
    document.addEventListener(eventType, handler as any);
  }

  private _handleKeydown(ev: KeyboardEvent) {
    this.activeKeys.add(ev.key);
    this._updateModifiers(ev);
  }

  private _handleKeyup(ev: KeyboardEvent) {
    this.activeKeys.delete(ev.key);
    this._updateModifiers(ev);
  }

  private _updateModifiers(ev: KeyboardEvent) {
    (this.alt as any) = ev.altKey;
    (this.ctrl as any) = ev.ctrlKey;
    (this.shift as any) = ev.shiftKey;
  }

}
