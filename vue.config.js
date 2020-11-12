// const webpack = require('webpack')

module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
  },
  // configureWebpack: {
  //   plugins: [
  //     new webpack.IgnorePlugin({
  //       resourceRegExp: /^\.\/locale$/,
  //       contextRegExp: /moment$/
  //     })
  //   ]
  // },
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
