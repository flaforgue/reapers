import * as BABYLON from 'babylonjs';
import { Key } from '../configs/keycodes';
import { MoveDirection, RotationDirection } from '../types';
import { isMoveDirection, isRotationDirection } from '../utils';

enum Animation {
  Defeat = 0,
  Idle = 1,
  Pickup = 2,
  Punch = 3,
  ReceiveHit = 4,
  Shoot = 5,
  SitDown = 6,
  StandUp = 7,
  Victory = 8,
  Walk = 9,
  WalkCarry = 10,
}

const moveStep = 0.05;
const rotationStep = 2;

export default class Player {
  public readonly scene: BABYLON.Scene;
  private _moveDirection: MoveDirection = MoveDirection.None;
  private _rotationDirection: RotationDirection = RotationDirection.None;
  private _meshes: BABYLON.AbstractMesh[] = [];
  private _animation: BABYLON.AnimationGroup | undefined;
  private _animations: Record<Animation, BABYLON.AnimationGroup | undefined> = {
    [Animation.Defeat]: undefined,
    [Animation.Idle]: undefined,
    [Animation.Pickup]: undefined,
    [Animation.Punch]: undefined,
    [Animation.ReceiveHit]: undefined,
    [Animation.Shoot]: undefined,
    [Animation.SitDown]: undefined,
    [Animation.StandUp]: undefined,
    [Animation.Victory]: undefined,
    [Animation.Walk]: undefined,
    [Animation.WalkCarry]: undefined,
  };

  public constructor(scene: BABYLON.Scene, camera: BABYLON.FollowCamera) {
    this.scene = scene;
    this._registerKeyboardEventsHandlers();
    BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'characters/player.glb').then(
      (result) => {
        this._meshes = result.meshes;
        this._meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        result.animationGroups[Animation.Walk].speedRatio = 2;
        this._animations = {
          [Animation.Defeat]: result.animationGroups[Animation.Defeat],
          [Animation.Idle]: result.animationGroups[Animation.Idle],
          [Animation.Pickup]: result.animationGroups[Animation.Pickup],
          [Animation.Punch]: result.animationGroups[Animation.Punch],
          [Animation.ReceiveHit]: result.animationGroups[Animation.ReceiveHit],
          [Animation.Shoot]: result.animationGroups[Animation.Shoot],
          [Animation.SitDown]: result.animationGroups[Animation.SitDown],
          [Animation.StandUp]: result.animationGroups[Animation.StandUp],
          [Animation.Victory]: result.animationGroups[Animation.Victory],
          [Animation.Walk]: result.animationGroups[Animation.Walk],
          [Animation.WalkCarry]: result.animationGroups[Animation.WalkCarry],
        };

        if (this._meshes[0]) {
          camera.lockedTarget = this._meshes[0];
        }

        scene.onBeforeRenderObservable.add(() => {
          this._move();
          this._rotate();
        });

        result.addAllToScene();
      },
    );
  }

  private _registerKeyboardEventsHandlers(): void {
    this.scene.onKeyboardObservable.add(({ type, event }) => {
      if (type === BABYLON.KeyboardEventTypes.KEYDOWN) {
        switch (event.key) {
          case Key.z:
            this._moveDirection = MoveDirection.Forward;
            break;
          case Key.s:
            this._moveDirection = MoveDirection.Backward;
            break;
          case Key.a:
            this._moveDirection = MoveDirection.Left;
            break;
          case Key.e:
            this._moveDirection = MoveDirection.Right;
            break;
          case Key.d:
            this._rotationDirection = RotationDirection.Right;
            break;
          case Key.q:
            this._rotationDirection = RotationDirection.Left;
            break;
          default:
            break;
        }

        if (isMoveDirection(event.key)) {
          this._setAnimation(Animation.Walk);
        }
      } else {
        if (isMoveDirection(event.key)) {
          this._moveDirection = MoveDirection.None;
        } else if (isRotationDirection(event.key)) {
          this._rotationDirection = RotationDirection.None;
        }

        if (!this._moveDirection && !this._rotationDirection) {
          this._setAnimation(Animation.Idle);
        }
      }
    });
  }

  private _setAnimation(animation: Animation): void {
    this._animation?.stop();
    this._animation = this._animations[animation];
    this._animation?.play(true);
  }

  private _move(): void {
    switch (this._moveDirection) {
      case MoveDirection.Forward:
        this._meshes[0]?.movePOV(0, 0, moveStep);
        break;
      case MoveDirection.Backward:
        this._meshes[0]?.movePOV(0, 0, moveStep * -1);
        break;
      case MoveDirection.Left:
        this._meshes[0]?.movePOV(moveStep * -1, 0, 0);
        break;
      case MoveDirection.Right:
        this._meshes[0]?.movePOV(moveStep, 0, 0);
        break;
      default:
        break;
    }
  }

  private _rotate(): void {
    if (this._rotationDirection === RotationDirection.Left) {
      this._meshes[0]?.rotate(
        BABYLON.Axis.Y,
        BABYLON.Tools.ToRadians(rotationStep * -1),
        BABYLON.Space.WORLD,
      );
    } else if (this._rotationDirection === RotationDirection.Right) {
      this._meshes[0]?.rotate(
        BABYLON.Axis.Y,
        BABYLON.Tools.ToRadians(rotationStep),
        BABYLON.Space.WORLD,
      );
    }
  }
}
