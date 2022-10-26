import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

const extensions = [".ts"];

const babelOptions = {
  babelrc: false,
  extensions,
  exclude: "**/node_modules/**",
  babelHelpers: "bundled",
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
        targets: ">0.5%, not dead, not ie 11, not op_mini all",
      },
    ],
    "@babel/preset-typescript",
  ],
};

export default [
  {
    input: `./src/cannon-es-debugger-babylonjs`,
    output: {
      file: `dist/cannon-es-debugger-babylonjs.js`,
      format: "esm",
    },
    plugins: [resolve({ extensions }), babel(babelOptions)],
    external: ["cannon-es", "../node_modules/@babylonjs/core/index.js"],
  },
  // {
  //   input: `./src/cannon-es-debugger-babylonjs`,
  //   output: {
  //     file: `dist/cannon-es-debugger.cjs.js-babylonjs`,
  //     format: "cjs",
  //     exports: "default",
  //   },
  //   plugins: [resolve({ extensions }), babel(babelOptions)],
  //   external: ["cannon-es", "@babylonjs/core"],
  // },
];
