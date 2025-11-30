const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@react-navigation'],
      },
    },
    argv
  )

  // Cấu hình proxy để bypass CORS
  if (config.devServer) {
    config.devServer = {
      ...config.devServer,
      // Proxy tất cả request đến /api sang server thực
      proxy: [
        {
          context: ['/api'],
          target: 'https://api.metrohcmc.xyz',
          changeOrigin: true,
          secure: true,
          logLevel: 'debug',
          onProxyReq: (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url)
          },
          onProxyRes: (proxyRes, req, res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url)
          },
          onError: (err, req, res) => {
            console.error('Proxy error:', err.message)
          },
        },
      ],
    }
  }

  // Cấu hình để xử lý CORS
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      crypto: false,
      stream: false,
      buffer: false,
    },
  }

  return config
}

