import config from '../../config';

export default class ActionScheduler {
  private readonly _secondsToComplete: number;
  private readonly _actionHandler: () => unknown;

  private _progress = 0;

  public constructor(actionHandler: () => void, secondsToComplete: number) {
    this._secondsToComplete = secondsToComplete;
    this._actionHandler = actionHandler;
  }

  public update() {
    this._progress += 1 / config.game.fps;

    if (this._progress >= this._secondsToComplete) {
      this._progress = 0;
      return this._actionHandler();
    }
  }
}
