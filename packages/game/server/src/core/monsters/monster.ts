import * as BABYLON from 'babylonjs';
import Character from '../character';
import ActionScheduler from '../shared/action-scheduler';
import { getRandomPosition } from '../../utils';
import { FrontMoveDirection } from '@reapers/game-shared';
import Attack from '../shared/attack';
import MonsterGenerator from '../monster-generator';
import World from '../world';

const walkingArea = 5;
const maxDistanceFromInitialPosition = 50;

export default class Monster extends Character {
  public readonly attackRange = 1;

  private readonly _initialPosition: BABYLON.Vector3;
  private readonly _randomMoveScheduler: ActionScheduler;
  private readonly _generator: MonsterGenerator;

  private _destination: BABYLON.Vector3;
  private _target: Character | null = null;
  private _isGoingBackToInitialPosition = false;

  public constructor(
    world: World,
    name: string,
    level: number,
    mesh: BABYLON.InstancedMesh,
    generator: MonsterGenerator,
    position?: BABYLON.Vector3,
    rotation?: BABYLON.Vector3,
    scaling?: BABYLON.Vector3,
  ) {
    super(world, name, level, mesh, position, rotation, scaling);

    this._generator = generator;
    this._initialPosition = this.position.clone();
    this._destination = this._initialPosition.clone();
    this._mesh.ellipsoidOffset = new BABYLON.Vector3(0, this._mesh.ellipsoid.y, 0);

    this._randomMoveScheduler = new ActionScheduler(() => {
      this._destination = this._world.createGroundVectorFrom(
        getRandomPosition(this._initialPosition, walkingArea),
      );
    }, 5);
  }

  public get destination(): BABYLON.Vector3 {
    return this._destination;
  }

  public update(): void {
    const distanceFromInitialPosition = this.getDistanceTo(this._initialPosition);

    if (distanceFromInitialPosition >= maxDistanceFromInitialPosition) {
      this._goBackToInitialPosition();
      return;
    }

    if (this._target) {
      if (this._target.isAlive) {
        if (this._isAtDestination() && this.canMove) {
          this._attack(this._target, this.attackRange);
        }
      } else {
        this._goBackToInitialPosition();
      }
    } else if (this._isAtDestination()) {
      if (this._isGoingBackToInitialPosition) {
        this._isGoingBackToInitialPosition = false;
        this.speedFactor.divide(2);
        this.life.setToMax();
      }

      this.frontMoveDirection = FrontMoveDirection.None;
      this._randomMoveScheduler.update();
    }

    if (!this._isAtDestination() && this.canMove) {
      this._lookAtY(this._destination);
      this.frontMoveDirection = FrontMoveDirection.Forward;
    }

    super.update();
  }

  private _isAtDestination(): boolean {
    return this.getDistanceTo(this._destination) <= this.attackRange;
  }

  public receiveAttack(attack: Attack): void {
    super.receiveAttack(attack);

    if (!this._isGoingBackToInitialPosition) {
      this._target = attack.parent;
      this._destination = attack.parent.position;
    }
  }

  protected _die(): void {
    this._generator.nbMonsters--;
    this.destroy();
  }

  private _goBackToInitialPosition(): void {
    if (!this._isGoingBackToInitialPosition) {
      this._target = null;
      this._destination = this._initialPosition.clone();
      this.speedFactor.multiply(2);
      this._isGoingBackToInitialPosition = true;
    }
  }
}
