const path = require("path");

module.exports = {
  entry: {
    main: [path.resolve(__dirname, "src", "memory_game_app.js")],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
};
