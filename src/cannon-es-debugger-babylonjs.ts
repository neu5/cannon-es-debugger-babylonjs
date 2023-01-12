import {
  Quaternion as CannonQuaternion,
  Vec3 as CannonVector3,
  Shape,
} from "cannon-es";
import type { FloatArray, Scene } from "@babylonjs/core";
import {
  Color3,
  Mesh,
  MeshBuilder,
  Quaternion,
  StandardMaterial,
  Vector3,
  VertexBuffer,
  VertexData,
} from "@babylonjs/core";

import type {
  Box,
  Body as CannonBody,
  Cylinder,
  Sphere,
  World,
} from "cannon-es";

import type { Trimesh } from 'shapes/Trimesh';

export type DebugOptions = {
  color?: { r: number; g: number; b: number };
  scale?: number;
  onInit?: (body: CannonBody, mesh: Mesh, shape: Shape) => void;
  onUpdate?: (body: CannonBody, mesh: Mesh, shape: Shape) => void;
};

const BABYLON_DEBUGGER: string = "CANNONES_DEBUGGER_BABYLONJS";
const getMeshName = (name: string, num: number) =>
  `${name}_${BABYLON_DEBUGGER}_${num}`;

export default function CannonDebugger(
  scene: Scene,
  world: World,
  {
    color = { r: 0, g: 1, b: 0 },
    scale = 1,
    onInit,
    onUpdate,
  }: DebugOptions = {}
) {
  const meshes: Mesh[] = [];
  const material = new StandardMaterial("myMaterial", scene);
  material.diffuseColor = new Color3(color.r, color.g, color.b);
  material.wireframe = true;
  const tempVec0 = new CannonVector3();
  const tempQuat0 = new CannonQuaternion();
  let meshCounter: number = 0;

  function createMesh(shape: Shape): Mesh | undefined {
    let mesh;
    const { SPHERE, BOX, PLANE, CYLINDER, TRIMESH } = Shape.types;

    switch (shape.type) {
      case BOX: {
        mesh = MeshBuilder.CreateBox(
          getMeshName("box", meshCounter),
          {},
          scene
        );
        meshCounter = meshCounter + 1;
        mesh.rotationQuaternion = mesh.rotationQuaternion || new Quaternion();
        break;
      }
      case CYLINDER: {
        const { height, numSegments, radiusBottom, radiusTop } =
          shape as Cylinder;

        mesh = MeshBuilder.CreateCylinder(
          getMeshName("cylinder", meshCounter),
          {
            diameterTop: radiusTop * 2,
            diameterBottom: radiusBottom * 2,
            height,
            tessellation: numSegments,
          },
          scene
        );
        meshCounter = meshCounter + 1;
        mesh.rotationQuaternion = mesh.rotationQuaternion || new Quaternion();
        break;
      }
      case PLANE: {
        mesh = MeshBuilder.CreatePlane(
          getMeshName("plane", meshCounter),
          { width: 10, height: 10 },
          scene
        );
        meshCounter = meshCounter + 1;
        mesh.rotation = new Vector3(Math.PI / 2, 0, 0);
        break;
      }
      case SPHERE: {
        mesh = MeshBuilder.CreateSphere(
          getMeshName("sphere", meshCounter),
          { segments: 16 },
          scene
        );
        meshCounter = meshCounter + 1;
        mesh.rotationQuaternion = mesh.rotationQuaternion || new Quaternion();
        break;
      }
      case TRIMESH:
      {
        mesh = new Mesh(getMeshName("trimesh", meshCounter), scene);

        const vertexData = new VertexData();
        const { indices, vertices } = shape as Trimesh;
        const normals: FloatArray = [];

        vertexData.positions = vertices;
        vertexData.indices = indices as unknown as Uint16Array;
        VertexData.ComputeNormals(vertices, mesh.getIndices(), normals, { useRightHandedSystem: true });
        mesh.setVerticesData(VertexBuffer.NormalKind, normals);
        vertexData.applyToMesh(mesh);
        meshCounter = meshCounter + 1;
        mesh.rotationQuaternion = mesh.rotationQuaternion || new Quaternion();

        break;
      }
    }

    if (!mesh) {
      return;
    }

    mesh.material = material;
    scene.addMesh(mesh);

    return mesh;
  }

  function scaleMesh(mesh: Mesh, shape: Shape): void {
    const { SPHERE, BOX, PLANE, CYLINDER, TRIMESH } = Shape.types;

    switch (shape.type) {
      case BOX: {
        const { halfExtents } = shape as Box;
        const size = new Vector3(
          halfExtents.x * scale * 2,
          halfExtents.y * scale * 2,
          halfExtents.z * scale * 2
        );
        mesh.scaling = size;
        break;
      }
      case CYLINDER: {
        break;
      }
      case PLANE: {
        break;
      }
      case SPHERE: {
        const { radius } = shape as Sphere;
        mesh.scalingDeterminant = radius * scale * 2;
        break;
      }
      case TRIMESH:
        mesh.scaling.x = scale;
        mesh.scaling.y = scale;
        mesh.scaling.z = scale;
        break;
    }
  }

  function typeMatch(mesh: Mesh, shape: Shape): boolean {
    if (!mesh) {
      return false;
    }

    return (
      shape.type === Shape.types.SPHERE ||
      shape.type === Shape.types.PLANE ||
      shape.type === Shape.types.BOX ||
      shape.type === Shape.types.CYLINDER ||
      shape.type === Shape.types.TRIMESH
    );
  }

  function updateMesh(index: number, shape: Shape): boolean {
    let mesh = meshes[index];
    let didCreateNewMesh = false;
    if (!typeMatch(mesh, shape)) {
      if (mesh) {
        scene.removeMesh(mesh);
      }

      const newMesh = createMesh(shape);
      if (newMesh) {
        meshes[index] = mesh = newMesh;
      }

      didCreateNewMesh = true;
    }
    scaleMesh(mesh, shape);
    return didCreateNewMesh;
  }

  function update(): void {
    const meshesCopy = meshes;
    const shapeWorldPosition = tempVec0;
    const shapeWorldQuaternion = tempQuat0;
    let meshIndex = 0;
    for (const body of world.bodies) {
      for (let i = 0; i !== body.shapes.length; i++) {
        const shape = body.shapes[i];
        const didCreateNewMesh = updateMesh(meshIndex, shape);
        const mesh = meshesCopy[meshIndex];
        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);
          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion);
          // Copy to meshes
          mesh.position.set(
            shapeWorldPosition.x,
            shapeWorldPosition.y,
            shapeWorldPosition.z
          );

          if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion.set(
              shapeWorldQuaternion.x,
              shapeWorldQuaternion.y,
              shapeWorldQuaternion.z,
              shapeWorldQuaternion.w
            );
          }

          if (didCreateNewMesh && onInit instanceof Function)
            onInit(body, mesh, shape);
          if (!didCreateNewMesh && onUpdate instanceof Function)
            onUpdate(body, mesh, shape);
        }
        meshIndex++;
      }
    }
    for (let i = meshIndex; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (mesh) scene.removeMesh(mesh);
    }
    meshes.length = meshIndex;
  }

  return { update };
}
