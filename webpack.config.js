const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");
const webpack = require("webpack");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ["babel-loader"],
  });

  config.resolve.extensions.push(".jsx");
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native": "react-native-web",
  };

  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: true,
    })
  );

  config.devServer = {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
  };

  // Customize the config before returning it.
  return config;
};
