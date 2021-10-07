module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ['github'],
        extraResources: [
          {
            from: "./extraResources/",
            to: "extraResources",
            filter: ["**/*"],
          },
        ],
      }
    },
  },
};
