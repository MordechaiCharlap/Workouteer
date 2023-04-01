const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");
const webpack = require("webpack");
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  delete config.output.uniqueName;
  delete config.output.assetModuleFilename;
  config.module.rules[1].oneOf = [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ["babel-loader"],
      type: "javascript/dynamic",
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ["babel-loader"],
      type: "json",
    },
    {
      test: /\.m?js/,
      type: "javascript/esm",
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ["babel-loader"],
      type: "javascript/auto",
    },
  ];
  config.resolve.extensions.push(".jsx");
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native": "react-native-web",
  };
  config.target = "web";
  config.devServer = {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
  };
  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: true,
    })
  );
  return config;
};
