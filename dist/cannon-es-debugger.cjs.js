'use strict';

var cannonEs = require('cannon-es');
var core = require('@babylonjs/core');

function CannonDebugger(scene, world, _temp) {
  let {
    color = {
      r: 0,
      g: 1,
      b: 0
    },
    scale = 1,
    onInit,
    onUpdate
  } = _temp === void 0 ? {} : _temp;
  const meshes = [];

  const _material = new core.StandardMaterial("myMaterial", scene);

  _material.diffuseColor = new core.Color3(color.r, color.g, color.b);
  _material.wireframe = true;

  const _tempVec0 = new cannonEs.Vec3();

  new cannonEs.Vec3();

  new cannonEs.Vec3();

  const _tempQuat0 = new cannonEs.Quaternion(); //   function createConvexPolyhedronGeometry(shape: ConvexPolyhedron): BufferGeometry {
  //     const geometry = new BufferGeometry()
  //     // Add vertices
  //     const positions = []
  //     for (let i = 0; i < shape.vertices.length; i++) {
  //       const vertex = shape.vertices[i]
  //       positions.push(vertex.x, vertex.y, vertex.z)
  //     }
  //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  //     // Add faces
  //     const indices = []
  //     for (let i = 0; i < shape.faces.length; i++) {
  //       const face = shape.faces[i]
  //       const a = face[0]
  //       for (let j = 1; j < face.length - 1; j++) {
  //         const b = face[j]
  //         const c = face[j + 1]
  //         indices.push(a, b, c)
  //       }
  //     }
  //     geometry.setIndex(indices)
  //     geometry.computeBoundingSphere()
  //     geometry.computeVertexNormals()
  //     return geometry
  //   }
  //   function createTrimeshGeometry(shape: Trimesh): BufferGeometry {
  //     const geometry = new BufferGeometry()
  //     const positions = []
  //     const v0 = _tempVec0
  //     const v1 = _tempVec1
  //     const v2 = _tempVec2
  //     for (let i = 0; i < shape.indices.length / 3; i++) {
  //       shape.getTriangleVertices(i, v0, v1, v2)
  //       positions.push(v0.x, v0.y, v0.z)
  //       positions.push(v1.x, v1.y, v1.z)
  //       positions.push(v2.x, v2.y, v2.z)
  //     }
  //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  //     geometry.computeBoundingSphere()
  //     geometry.computeVertexNormals()
  //     return geometry
  //   }
  //   function createHeightfieldGeometry(shape: Heightfield): BufferGeometry {
  //     const geometry = new BufferGeometry()
  //     const s = shape.elementSize || 1 // assumes square heightfield, else i*x, j*y
  //     const positions = shape.data.flatMap((row, i) => row.flatMap((z, j) => [i * s, j * s, z]))
  //     const indices = []
  //     for (let xi = 0; xi < shape.data.length - 1; xi++) {
  //       for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
  //         const stride = shape.data[xi].length
  //         const index = xi * stride + yi
  //         indices.push(index + 1, index + stride, index + stride + 1)
  //         indices.push(index + stride, index + 1, index)
  //       }
  //     }
  //     geometry.setIndex(indices)
  //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  //     geometry.computeBoundingSphere()
  //     geometry.computeVertexNormals()
  //     return geometry
  //   }


  function createMesh(shape) {
    let mesh;
    const {
      SPHERE,
      BOX,
      PLANE,
      CYLINDER,
      CONVEXPOLYHEDRON,
      TRIMESH,
      HEIGHTFIELD
    } = cannonEs.Shape.types;

    switch (shape.type) {
      case SPHERE:
        {
          mesh = core.MeshBuilder.CreateSphere("sphere", {
            segments: 16
          }, scene);
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }

      case PLANE:
        {
          mesh = core.MeshBuilder.CreatePlane("plane", {
            width: 10,
            height: 10
          }, scene);
          mesh.rotation = new core.Vector3(Math.PI / 2, 0, 0);
          break;
        }

      case BOX:
        {
          mesh = core.MeshBuilder.CreateBox("box", {}, scene);
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }

      case CYLINDER:
        {
          const {
            height,
            numSegments,
            radiusBottom,
            radiusTop
          } = shape;
          mesh = core.MeshBuilder.CreateCylinder("cylinder", {
            diameterTop: radiusTop * 2,
            diameterBottom: radiusBottom * 2,
            height,
            tessellation: numSegments
          }, scene);
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }
      //   case CONVEXPOLYHEDRON: {
      //     const geometry = createConvexPolyhedronGeometry(shape as ConvexPolyhedron)
      //     mesh = new Mesh(geometry, _material)
      //     ;(shape as ComplexShape).geometryId = geometry.id
      //     break
      //   }
      //   case TRIMESH: {
      //     const geometry = createTrimeshGeometry(shape as Trimesh)
      //     mesh = new Mesh(geometry, _material)
      //     ;(shape as ComplexShape).geometryId = geometry.id
      //     break
      //   }
      //   case HEIGHTFIELD: {
      //     const geometry = createHeightfieldGeometry(shape as Heightfield)
      //     mesh = new Mesh(geometry, _material)
      //     ;(shape as ComplexShape).geometryId = geometry.id
      //     break
      //   }
    }

    mesh.material = _material;
    scene.addMesh(mesh);
    return mesh;
  }

  function scaleMesh(mesh, shape) {
    const {
      SPHERE,
      BOX,
      PLANE,
      CYLINDER,
      CONVEXPOLYHEDRON,
      TRIMESH,
      HEIGHTFIELD
    } = cannonEs.Shape.types;

    switch (shape.type) {
      case SPHERE:
        {
          const {
            radius
          } = shape;
          mesh.scalingDeterminant = radius * scale * 2;
          break;
        }

      case BOX:
        {
          const size = new core.Vector3(shape.halfExtents.x * scale * 2, shape.halfExtents.y * scale * 2, shape.halfExtents.z * scale * 2);
          mesh.scaling = size;
          break;
        }
      // case CONVEXPOLYHEDRON: {
      //   mesh.scale.set(1 * scale, 1 * scale, 1 * scale)
      //   break
      // }
      // case TRIMESH: {
      //   mesh.scale.copy((shape as Trimesh).scale as unknown as Vector3).multiplyScalar(scale)
      //   break
      // }
      // case HEIGHTFIELD: {
      //   mesh.scale.set(1 * scale, 1 * scale, 1 * scale)
      //   break
      // }
    }
  }

  function typeMatch(mesh, shape) {
    if (!mesh) return false; // const { geometry } = mesh

    return shape.type === cannonEs.Shape.types.SPHERE || shape.type === cannonEs.Shape.types.PLANE || shape.type === cannonEs.Shape.types.BOX || shape.type === cannonEs.Shape.types.CYLINDER; // geometry instanceof SphereGeometry && shape.type === Shape.types.SPHERE ||
    // (geometry instanceof BoxGeometry && shape.type === Shape.types.BOX) ||
    // (geometry instanceof PlaneGeometry && shape.type === Shape.types.PLANE) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.CYLINDER) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.CONVEXPOLYHEDRON) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.TRIMESH) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.HEIGHTFIELD)
  }

  function updateMesh(index, shape) {
    let mesh = meshes[index];
    let didCreateNewMesh = false;

    if (!typeMatch(mesh, shape)) {
      if (mesh) scene.removeMesh(mesh);
      meshes[index] = mesh = createMesh(shape);
      didCreateNewMesh = true;
    }

    scaleMesh(mesh, shape);
    return didCreateNewMesh;
  }

  function update() {
    const meshesCopy = meshes;
    const shapeWorldPosition = _tempVec0;
    const shapeWorldQuaternion = _tempQuat0;
    let meshIndex = 0;

    for (const body of world.bodies) {
      for (let i = 0; i !== body.shapes.length; i++) {
        const shape = body.shapes[i];
        const didCreateNewMesh = updateMesh(meshIndex, shape);
        const mesh = meshesCopy[meshIndex];

        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition); // Get world quaternion

          body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion); // Copy to meshes

          mesh.position.set(shapeWorldPosition.x, shapeWorldPosition.y, shapeWorldPosition.z);

          if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion.set(shapeWorldQuaternion.x, shapeWorldQuaternion.y, shapeWorldQuaternion.z, shapeWorldQuaternion.w);
          }

          if (didCreateNewMesh && onInit instanceof Function) onInit(body, mesh, shape);
          if (!didCreateNewMesh && onUpdate instanceof Function) onUpdate(body, mesh, shape);
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

  return {
    update
  };
}

module.exports = CannonDebugger;
