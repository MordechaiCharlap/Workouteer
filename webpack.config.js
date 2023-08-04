const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "react-native": "react-native-web",
      "react-native-maps": "react-native-web-maps",
      "expo-av": "../services/audioService",
    },

    extensions: [".web.ts", ".web.tsx", ".web.js", ".js", ".ts", ".tsx"],
  };
  return config;
};
