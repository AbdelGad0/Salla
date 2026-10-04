const path = require("path");

let watcherPlugin = [];
try {
  const ThemeWatcher = require("@salla.sa/twilight/watcher");
  watcherPlugin = [new ThemeWatcher()];
} catch (e) {
  // يعمل بدون الـ watcher حتى يُثبَّت @salla.sa/twilight
}

module.exports = {
  entry: "./src/assets/js/app.js",
  output: {
    filename: "app.bundle.js",
    path: path.resolve(__dirname, "src/assets/js/dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [...watcherPlugin]
};
