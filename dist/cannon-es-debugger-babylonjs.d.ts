declare module "cannon-es-debugger-babylonjs" {
    import { Shape } from "cannon-es";
    import type { Scene } from "@babylonjs/core";
    import { Mesh } from "@babylonjs/core";
    import type { Body as CannonBody, World } from "cannon-es";
    export type DebugOptions = {
        color?: {
            r: number;
            g: number;
            b: number;
        };
        scale?: number;
        onInit?: (body: CannonBody, mesh: Mesh, shape: Shape) => void;
        onUpdate?: (body: CannonBody, mesh: Mesh, shape: Shape) => void;
    };
    export default function CannonDebugger(scene: Scene, world: World, { color, scale, onInit, onUpdate, }?: DebugOptions): {
        update: () => void;
    };
}
