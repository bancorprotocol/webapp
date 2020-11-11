module.exports = {
  chainWebpack: config => config.resolve.symlinks(false),
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  lintOnSave: false
};
