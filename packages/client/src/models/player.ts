import * as BABYLON from 'babylonjs';
import { Key } from '../configs/keycodes';

enum RotationDirection {
  None,
  Left,
  Right,
}

enum MoveDirection {
  None,
  Forward,
  Backward,
  Left,
  Right,
}

enum Animation {
  Alert = 0,
  None = 1,
  Stand = 2,
  Walk = 3,
}

const moveStep = 0.04;
const rotationStep = 2;

export default class Player {
  public readonly scene: BABYLON.Scene;
  private _moveDirection: MoveDirection = MoveDirection.None;
  private _rotationDirection: RotationDirection = RotationDirection.None;
  private _meshes: BABYLON.AbstractMesh[] = [];
  private _animationGroups: Record<Animation, BABYLON.AnimationGroup | null> = {
    [Animation.Alert]: null,
    [Animation.None]: null,
    [Animation.Stand]: null,
    [Animation.Walk]: null,
  };

  public constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this._registerKeyboardEventsHandlers();
    const camera = this._createCamera();
    BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'spider.glb').then((result) => {
      this._meshes = result.meshes;
      result.animationGroups[3].speedRatio = 2.5;
      this._animationGroups = {
        [Animation.Alert]: result.animationGroups[0],
        [Animation.None]: result.animationGroups[1],
        [Animation.Stand]: result.animationGroups[2],
        [Animation.Walk]: result.animationGroups[3],
      };

      if (this._meshes[0]) {
        camera.lockedTarget = this._meshes[0];
      }

      scene.onBeforeRenderObservable.add(() => {
        this._move();
        this._rotate();
      });
    });
  }

  public get moveDirection(): MoveDirection {
    return this._moveDirection;
  }

  private _registerKeyboardEventsHandlers(): void {
    this.scene.onKeyboardObservable.add(({ type, event }) => {
      if (type === BABYLON.KeyboardEventTypes.KEYDOWN) {
        let matched = true;

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
            matched = false;
            break;
        }

        if (matched) {
          this._playAnimation(Animation.Walk);
        }
      } else {
        switch (event.key) {
          case Key.z:
          case Key.s:
          case Key.a:
          case Key.e:
            this._moveDirection = MoveDirection.None;
            if (!this._rotationDirection) {
              this._stopAnimation(Animation.Walk);
            }
            break;
          case Key.d:
          case Key.q:
            this._rotationDirection = RotationDirection.None;
            if (!this._moveDirection) {
              this._stopAnimation(Animation.Walk);
            }
            break;
          default:
            break;
        }
      }
    });
  }

  private _playAnimation(animation: Animation): void {
    if (this._animationGroups[animation]) {
      (this._animationGroups[animation] as BABYLON.AnimationGroup).play(true);
    }
  }

  private _stopAnimation(animation: Animation): void {
    if (this._animationGroups[animation]) {
      (this._animationGroups[animation] as BABYLON.AnimationGroup).reset().stop();
    }

    this._playAnimation(Animation.None);
  }

  private _createCamera(): BABYLON.FollowCamera {
    const camera = new BABYLON.FollowCamera(
      'playerCamera',
      new BABYLON.Vector3(0, 2, -2),
      this.scene,
    );

    camera.radius = 2;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 2;

    camera.heightOffset = 2;
    camera.upperHeightOffsetLimit = 2;
    camera.lowerHeightOffsetLimit = 2;

    camera.rotationOffset = 0;
    camera.upperRotationOffsetLimit = 0;
    camera.lowerRotationOffsetLimit = 0;

    camera.inputs.add;
    camera.attachControl(true);

    return camera;
  }

  private _move(): void {
    if (this._meshes[0]) {
      switch (this._moveDirection) {
        case MoveDirection.Forward:
          this._meshes[0].movePOV(0, 0, moveStep);
          break;
        case MoveDirection.Backward:
          this._meshes[0].movePOV(0, 0, moveStep * 0.5 * -1);
          break;
        case MoveDirection.Left:
          this._meshes[0].movePOV(moveStep * -1, 0, 0);
          break;
        case MoveDirection.Right:
          this._meshes[0].movePOV(moveStep, 0, 0);
          break;
        default:
          break;
      }
    }
  }

  private _rotate(): void {
    if (this._meshes[0]) {
      switch (this._rotationDirection) {
        case RotationDirection.Left:
          this._meshes[0].rotate(
            BABYLON.Axis.Y,
            BABYLON.Tools.ToRadians(rotationStep * -1),
            BABYLON.Space.WORLD,
          );
          break;
        case RotationDirection.Right:
          this._meshes[0].rotate(
            BABYLON.Axis.Y,
            BABYLON.Tools.ToRadians(rotationStep),
            BABYLON.Space.WORLD,
          );
          break;
        default:
          break;
      }
    }
  }
}
