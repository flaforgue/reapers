import config from '../../config';

export default class ActionScheduler {
  public readonly interval: number; // in seconds

  private _progress = 0;
  private _actionHandler: () => void;

  public constructor(actionHandler: () => void, interval: number) {
    this.interval = interval;
    this._actionHandler = actionHandler;
  }

  public update() {
    this._progress += 1 / config.fps;

    if (this._progress >= this.interval) {
      this._actionHandler();
      this._progress = 0;
    }
  }
}
