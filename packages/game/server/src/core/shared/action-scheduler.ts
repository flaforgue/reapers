import config from '../../config';

export default class ActionScheduler {
  private readonly _secondsToComplete: number;
  private readonly _actionHandler: () => void;

  private _progress = 0;

  public constructor(actionHandler: () => void, secondsToComplete: number) {
    this._secondsToComplete = secondsToComplete;
    this._actionHandler = actionHandler;
  }

  public update() {
    this._progress += 1 / config.game.fps;

    if (this._progress >= this._secondsToComplete) {
      this._actionHandler();
      this._progress = 0;
    }
  }
}
