declare module "cannon-es-debugger" {
    import { Shape } from "cannon-es";
    import type { Mesh, Scene } from "@babylonjs/core";
    import { Color3 } from "@babylonjs/core";
    import type { Body, World } from "cannon-es";
    export type DebugOptions = {
        color?: string | number | Color3;
        scale?: number;
        onInit?: (body: Body, mesh: Mesh, shape: Shape) => void;
        onUpdate?: (body: Body, mesh: Mesh, shape: Shape) => void;
    };
    export default function CannonDebugger(scene: Scene, world: World, { color, scale, onInit, onUpdate }?: DebugOptions): {
        update: () => void;
    };
}
