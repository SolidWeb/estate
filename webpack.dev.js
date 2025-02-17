const path = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = (env) => {
  // Detect if the dev server is running
  const isDevServer = env && env.DEV_SERVER === 'true';

  const devConfig = {
    mode: 'development',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
      open: true,
    },
    // Inline source maps when the dev server is running
    devtool: isDevServer ? 'inline-source-map' : false,
  };

  return merge(commonConfig, devConfig);
};
