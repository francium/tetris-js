import { fromEvent, interval, Subscription } from 'rxjs';
import { buffer, map } from 'rxjs/operators';

const mapToKey = map((evs: KeyboardEvent[]) => evs.map(ev => ev.key));

export class GameControls {

  private static readonly POLL_RATE = 75;

  private _activeKeys: Set<string> = new Set();

  private _subs: Subscription[] = [];

  public init() {
    const poll$ = interval(GameControls.POLL_RATE);

    const keydown$ = fromEvent<KeyboardEvent>(document.body, 'keydown').pipe(
      buffer(poll$),
      mapToKey,
    );
    const keyup$ = fromEvent<KeyboardEvent>(document.body, 'keyup').pipe(
      buffer(poll$),
      mapToKey,
    );

    this._subs = [
      keydown$.subscribe(keys => {
        keys.forEach(k => this._activeKeys.add(k));
      }),
      keyup$.subscribe(keys => {
        keys.forEach(k => this._activeKeys.delete(k));
      }),
    ]
  }

  public destory() {
    this._subs.forEach(s => s.unsubscribe());
  }

  public peekPressedKeys() {
    return this._activeKeys;
  }

  public getPressedKeys() {
    const s = this._activeKeys;
    this._activeKeys = new Set();
    return s;
  }

}
