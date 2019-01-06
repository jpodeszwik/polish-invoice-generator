const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: 'umd',
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.ttf$/, loader: "file-loader" },
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
};
