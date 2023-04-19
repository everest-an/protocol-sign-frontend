const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  chainWebpack: config => {
    config.module
      .rule('pdf')
      .test(/\.(pdf)$/i)
      .use('file-loader')
        .loader('file-loader')
  }
})
