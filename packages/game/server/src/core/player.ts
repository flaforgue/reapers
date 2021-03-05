import Identifiable from './shared/identifiable';

export default class Player extends Identifiable {
  private readonly _socketId: string;

  public readonly name: string;

  public constructor(socketId: string, name: string) {
    super();
    this._socketId = socketId;
    this.name = name;
  }

  public update(): void {
    // console.info('Updating', this.id);
  }
}
