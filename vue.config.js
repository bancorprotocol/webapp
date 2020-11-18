const webpack = require('webpack')

module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false)

    config.module
      .rule('js')
      .use('babel-loader')
      .loader('babel-loader')
      .tap((options = {}) => {
        options.plugins = [...(options.plugins || []), "lodash"]
        return options
      })

    config
      .plugin('lodash-webpack')
      .use(require('lodash-webpack-plugin'), [])
  },
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }),
    ]
  },
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
