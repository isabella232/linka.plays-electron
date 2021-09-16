module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions:{
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
