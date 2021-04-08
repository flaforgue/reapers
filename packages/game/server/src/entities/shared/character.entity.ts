import * as BABYLON from 'babylonjs';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  CharacterKind,
} from '@reapers/game-shared';
import config from '../../config';
import PositionableEntity from './positionable.entity';
import BoundedValue from './bounded-value';

const SPEED = new BABYLON.Vector3(config.moveStep, config.moveStep, config.moveStep);
const LOW_SPEED = SPEED.multiply(
  new BABYLON.Vector3(Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2),
);
export default class CharacterEntity extends PositionableEntity {
  public readonly name: string;
  public readonly level: number;
  public readonly life: BoundedValue;
  public readonly attackRange: number = 0;

  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  protected readonly _shouldMoveWithCollisions: boolean = true;
  protected _kind: CharacterKind = CharacterKind.Player;

  public constructor(
    name: string,
    level: number,
    mesh: BABYLON.Mesh,
    position?: number[],
    rotation?: number[],
  ) {
    super(mesh, position, rotation);
    this.name = name;
    this.level = level;
    this.life = this._createLifeBoudedValue();
  }

  public get kind(): CharacterKind {
    return this._kind;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue();
  }

  public update() {
    if (this._shouldMoveWithCollisions) {
      this._moveWithCollisions();
    } else {
      this._moveWithoutCollisions();
    }

    this._updateRotation();
  }

  private _moveWithCollisions() {
    const move = new BABYLON.Vector3(0, config.gravity, 0);
    let isMovingFront = true;

    if (this.frontMoveDirection === FrontMoveDirection.Forward) {
      move.x -= Math.sin(this._mesh.rotation.y);
      move.z -= Math.cos(this._mesh.rotation.y);
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      move.x += Math.sin(this._mesh.rotation.y);
      move.z += Math.cos(this._mesh.rotation.y);
    } else {
      isMovingFront = false;
    }

    let isMovingSide = true;
    if (this.sideMoveDirection === SideMoveDirection.Right) {
      move.x -= Math.sin(this._mesh.rotation.y + Math.PI / 2);
      move.z -= Math.cos(this._mesh.rotation.y + Math.PI / 2);
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      move.x += Math.sin(this._mesh.rotation.y + Math.PI / 2);
      move.z += Math.cos(this._mesh.rotation.y + Math.PI / 2);
    } else {
      isMovingSide = false;
    }

    this._mesh.moveWithCollisions(
      move.multiply(isMovingFront && isMovingSide ? LOW_SPEED : SPEED),
    );
  }

  private _moveWithoutCollisions() {
    let isMovingFront = true;
    let isMovingSide = true;
    let amountRight = 0;
    let amountUp = 0;
    let amountForward = 0;

    if (this.frontMoveDirection === FrontMoveDirection.Forward) {
      amountForward = config.moveStep;
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      amountForward = config.moveStep * -1;
    } else {
      isMovingFront = false;
    }

    if (this.sideMoveDirection === SideMoveDirection.Right) {
      amountRight = config.moveStep;
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      amountRight = config.moveStep * -1;
    } else {
      isMovingSide = false;
    }

    if (isMovingFront && isMovingSide) {
      amountRight *= Math.SQRT1_2;
      amountForward *= Math.SQRT1_2;
    }

    this._mesh.movePOV(amountRight, amountUp, amountForward);
  }

  private _updateRotation() {
    let rotationAmount = 0;

    if (this.rotationDirection === RotationDirection.Left) {
      rotationAmount = config.rotationStep * -1;
    } else if (this.rotationDirection === RotationDirection.Right) {
      rotationAmount = config.rotationStep;
    }

    this._mesh.rotatePOV(0, rotationAmount, 0);
  }

  public setRotation(rotationY: number) {
    this._mesh.rotation.y = rotationY;
  }

  public attack(target: CharacterEntity) {}
}
