import * as BABYLON from 'babylonjs';
import { createCanvas, loadImage, Image } from 'canvas';

function getRandomVector3(
  origin: BABYLON.Vector3,
  distances: BABYLON.Vector3,
): BABYLON.Vector3 {
  return new BABYLON.Vector3(
    Math.floor(Math.random() * distances.x * 2 - distances.x) + origin.x,
    Math.floor(Math.random() * distances.y * 2 - distances.y) + origin.y,
    Math.floor(Math.random() * distances.z * 2 - distances.z) + origin.z,
  );
}

export function getRandomPosition(
  origin: BABYLON.Vector3,
  distance: number,
): BABYLON.Vector3 {
  return getRandomVector3(origin, new BABYLON.Vector3(distance, 0, distance));
}

export function optimizeMotionlessMesh(mesh: BABYLON.Mesh | BABYLON.InstancedMesh): void {
  mesh.freezeWorldMatrix();
  mesh.doNotSyncBoundingInfo = true;

  if (mesh instanceof BABYLON.Mesh) {
    mesh.freezeNormals();
  }
}

export function createGroundFromHeightMap(
  name: string,
  url: string,
  options: {
    width: number;
    height: number;
    subdivisions: number;
    minHeight: number;
    maxHeight: number;
    updatable: boolean;
    colorFilter?: BABYLON.Color3;
    alphaFilter?: number;
    onReady?: (mesh: BABYLON.GroundMesh) => void;
  },
  scene: BABYLON.Scene,
): BABYLON.GroundMesh {
  const width = options.width;
  const height = options.height;
  const subdivisions = options.subdivisions;
  const minHeight = options.minHeight;
  const maxHeight = options.maxHeight;
  const updatable = options.updatable;
  const filter = options.colorFilter ?? new BABYLON.Color3(0.3, 0.59, 0.11);
  const alphaFilter = options.alphaFilter ?? 0.0;
  const onReady = options.onReady;

  const ground = new BABYLON.GroundMesh(name, scene);
  ground._subdivisionsX = subdivisions;
  ground._subdivisionsY = subdivisions;
  ground._width = width;
  ground._height = height;
  ground._maxX = ground._width / 2.0;
  ground._maxZ = ground._height / 2.0;
  ground._minX = -ground._maxX;
  ground._minZ = -ground._maxZ;

  ground._setReady(false);

  const onload = (img: Image): void => {
    const bufferWidth = img.width;
    const bufferHeight = img.height;

    const canvas = createCanvas(bufferWidth, bufferHeight);
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to get 2d context for createGroundFromHeightMap');
    }

    if (scene.isDisposed) {
      return;
    }

    context.drawImage(img, 0, 0);

    // Create VertexData from map data
    const buffer = Uint8Array.from(
      context.getImageData(0, 0, bufferWidth, bufferHeight).data,
    );
    const vertexData = BABYLON.VertexData.CreateGroundFromHeightMap({
      width: width,
      height: height,
      subdivisions: subdivisions,
      minHeight: minHeight,
      maxHeight: maxHeight,
      colorFilter: filter,
      buffer,
      bufferWidth: bufferWidth,
      bufferHeight: bufferHeight,
      alphaFilter: alphaFilter,
    });

    vertexData.applyToMesh(ground, updatable);

    //execute ready callback, if set
    if (onReady) {
      onReady(ground);
    }

    ground._setReady(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  loadImage(url).then((image) => onload(image));

  return ground;
}
