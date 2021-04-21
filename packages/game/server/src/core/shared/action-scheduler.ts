import config from '../../config';

export default class ActionScheduler<T = void> {
  private readonly _secondsToComplete: number;
  private readonly _actionHandler: () => T;

  private _progress = 0;

  public constructor(actionHandler: () => T, secondsToComplete: number) {
    this._secondsToComplete = secondsToComplete;
    this._actionHandler = actionHandler;
  }

  public update(): T | void {
    this._progress += 1 / config.game.fps;

    if (this._progress >= this._secondsToComplete) {
      this._progress = 0;
      return this._actionHandler();
    }
  }

  public forceAction(): void {
    this._progress = this._secondsToComplete;
  }
}
