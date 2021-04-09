import config from '../../config';

export default class ActionScheduler {
  public readonly secondsToComplete: number;

  private _progress = 0;
  private _actionHandler: () => void;

  public constructor(actionHandler: () => void, secondsToComplete: number) {
    this.secondsToComplete = secondsToComplete;
    this._actionHandler = actionHandler;
  }

  public update() {
    this._progress += 1 / config.fps;

    if (this._progress >= this.secondsToComplete) {
      this._actionHandler();
      this._progress = 0;
    }
  }
}
