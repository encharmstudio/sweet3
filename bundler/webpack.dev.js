const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const portFinderSync = require('portfinder-sync')

const infoColor = (_message) =>
{
  return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
  commonConfiguration,
  {
    mode: 'development',
    watchOptions: {
      aggregateTimeout: 600,
    },
    devServer: {
      host: '0.0.0.0',
      port: portFinderSync.getPort(8080),
      static: {
        publicPath: './dist',
      },
      open: false,
      https: false,
      allowedHosts: 'all',
      client: {
        overlay: true,
        logging: 'none',
      },
      setupMiddlewares: (middlewares, server) => {
        
        const port = server.options.port
        const https = server.options.https ? 's' : ''
        const domain = `http${https}://localhost:${port}`
        
        console.log(`Project running at:\n - ${infoColor(domain)}`)

        return middlewares
      }
    }
  }
)
