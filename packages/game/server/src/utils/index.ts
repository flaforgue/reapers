import * as BABYLON from 'babylonjs';

function getRandomVector3(origin: BABYLON.Vector3, distances: BABYLON.Vector3) {
  return new BABYLON.Vector3(
    Math.floor(Math.random() * distances.x * 2 - distances.x) + origin.x,
    Math.floor(Math.random() * distances.y * 2 - distances.y) + origin.y,
    Math.floor(Math.random() * distances.z * 2 - distances.z) + origin.z,
  );
}

export function getRandomPosition(origin: BABYLON.Vector3, distance: number) {
  return getRandomVector3(origin, new BABYLON.Vector3(distance, 0, distance));
}

export function getRandomRotation(origin: BABYLON.Vector3, distance: number) {
  return getRandomVector3(origin, new BABYLON.Vector3(0, distance, 0));
}

// export function getRotationYTo(from: BABYLON.Vector3, to: BABYLON.Vector3) {
//   const axis1 = from.subtract(to);
//   const axis2 = BABYLON.Vector3.Cross(axis1, BABYLON.Vector3.Up());
//   const axis3 = BABYLON.Vector3.Cross(axis1, axis2);

//   return BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3).y + Math.PI / 2;
// }
