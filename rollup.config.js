const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");


module.exports = [
  {
    input: "lib/index.js",
    output: {
      format: "esm",
      file: `dist/json-schema-annotations.js`,
      name: "JsonSchema",
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        browser: true
      }),
      commonjs()
    ]
  }
];
