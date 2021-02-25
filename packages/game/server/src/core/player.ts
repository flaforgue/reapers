import Game from './game';
import Identifiable from './shared/identifiable';

export default class Player extends Identifiable {
  private readonly _socketId: string;

  public readonly game: Game;
  public readonly name: string;

  public constructor(socketId: string, game: Game, name: string) {
    super();
    this._socketId = socketId;
    this.game = game;
    this.name = name;
  }

  public emitEvent(name: string, data?: unknown): void {
    this.game.emitEvent(this._socketId, name, data);
  }

  public update(): void {
    // console.info('Updating', this.id);
  }
}
