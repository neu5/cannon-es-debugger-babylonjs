[![Deploy demo on GH Pages](https://github.com/neu5/cannon-es-debugger-babylonjs/actions/workflows/deploy-demo.yml/badge.svg)](https://github.com/neu5/cannon-es-debugger-babylonjs/actions/workflows/deploy-demo.yml)

# cannon-es-debugger-babylonjs

This is a debugger for use with [cannon-es](https://github.com/pmndrs/cannon-es) and [BabylonJS](https://www.babylonjs.com/).

## Example

https://neu5.github.io/cannon-es-debugger-babylonjs/

## Installation

```
yarn add cannon-es-debugger-babylonjs --dev
```

Make sure you also have `@babylonjs/core` and `cannon-es` installed.

## Usage

To make it work in your BabylonJS + cannon-es project you need these three steps:

1. import the `CannonDebugger` from the installed package

```javascript
import CannonDebugger from "cannon-es-debugger-babylonjs";
```

2. initialise the cannonDebugger passing the `scene` and the `physicalWorld`

```javascript
const cannonDebugger = new CannonDebugger(scene, physicalWorld);
```

3. update the cannonDebugger inside of your render loop

```javascript
engine.runRenderLoop(function () {
  // make the next step with the physicalWorld
  physicalWorld.fixedStep();
  // update debugger
  cannonDebugger.update();
  // possibly you want to update your meshses positions
  updateMeshPositions();
  // render the scene
  scene.render();
});
```

## Credits

This is a debugger inspired by https://github.com/pmndrs/cannon-es-debugger which was adapted from the original cannon.js debugger written by Stefan Hedman [@schteppe](https://github.com/schteppe).

### Development

First install all the dependencies by running

```
yarn
```

or `npm install`

Next create developer's build with watcher by running

```
yarn dev
```

and in another terminal window start serving the application with

```
yarn start
```

This will show you the `index.html` at the `localhost:3000`
