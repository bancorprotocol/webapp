module.exports = {
  transpileDependencies: [
    // can be string or regex
    "/node_modules/@bandprotocol/bandchain.js"
  ],
  chainWebpack: config => config.resolve.symlinks(false),
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
