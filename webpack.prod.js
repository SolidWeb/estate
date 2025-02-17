const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CriticalCssPlugin = require('critical-css-webpack-plugin');
const commonConfig = require('./webpack.common.js');

const extractCriticalCSS = false;

const prodConfig = {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [],
};

// Extract critical css
if (extractCriticalCSS) {
  prodConfig.plugins.push(
    new CriticalCssPlugin({
      base: 'dist/',
      src: 'index.html',
      target: 'index.html',
      // If there is a need to scope critical css sources
      // css: ['dist/css/*.css'],
      inline: true,
      extract: false,
      dimensions: [
        {
          width: 412,
          height: 823,
        },
        {
          width: 1920,
          height: 1080,
        },
      ],
      penthouse: {
        forceInclude: ['.critical-css-font-carrier'],
        // Hide image-set() related w3c errors
        forceExclude: [/^(body.webp)$|^.webp/],
      },
    }),
  );
}

module.exports = merge(commonConfig, prodConfig);
