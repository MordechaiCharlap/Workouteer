const createExpoWebpackConfigAsync = require("@expo/webpack-config");
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve.extensions = [
    ".tsx",
    ".ts",
    ".js",
    ".ios.js",
    ".android.js",
    ".web.js",
  ];
  return config;
};
