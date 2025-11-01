const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  // publicPath: '/dsign/', //服务器打包地址
  productionSourceMap: false,
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          pdfjs: {
            name: 'chunk-pdfjs',
            test: /[\\/]node_modules[\\/]pdfjs-dist[\\/]/,
            priority: 20
          }
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('pdf')
      .test(/\.(pdf)$/i)
      .use('file-loader')
        .loader('file-loader')
  }
})
