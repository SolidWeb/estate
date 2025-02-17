const path = require('path');
const PugPlugin = require('pug-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const minimizeHTML = true;
const isProduction = process.env.NODE_ENV === 'production';
const svgSpriteHash = Math.random().toString(36).substring(2, 10);

module.exports = {
  resolve: {
    alias: {
      '@fonts': path.join(__dirname, './src/fonts/'),
      '@img': path.join(__dirname, './src/img/'),
      '@svg': path.join(__dirname, './src/svg/'),
      '@js': path.join(__dirname, './src/js/'),
      '@partials': path.join(__dirname, './src/pug/partials/'),
    },
  },
  entry: {
    // Put .svg-icons into the .svg-sprite
    svgSprite: {
      import: '@js/utils/svg-sprite-compiler.js',
      // Sprite compiler will be removed after webpack compilation
      filename: 'js/svg-sprite-compiler.js',
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'js/[name].[contenthash:8].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g)$/,
        type: 'asset/resource',
        use: {
          loader: 'responsive-loader',
          options: {
            context: 'src/', // keeping folder structure
            name: '[path][name]-[width]w.[ext]',
            quality: 85,
          },
        },
      },
      {
        test: /\.(ico)/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: /[\\/]sprite[\\/]/,
        options: {
          extract: true,
          spriteFilename: `svg/icons/sprite.svg`,
        },
      },
      {
        test: /\.svg$/,
        exclude: [/[\\/]sprite[\\/]/, /[\\/]inline[\\/]/],
        type: 'asset/resource',
        generator: {
          // keeping folder structure
          filename: (pathData) => {
            const { dir } = path.parse(pathData.filename);
            const outputPath = dir.replace('src/', '');
            return outputPath + '/[name][ext]';
          },
        },
      },
      {
        test: /\.svg$/,
        include: /[\\/]inline[\\/]/,
        type: 'asset/inline',
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'css-loader' }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        // match .svg-font only from '/fonts/' directory
        include: /[\\/]fonts[\\/]/,
        type: 'asset/resource',
        generator: {
          // keeping folder structure
          filename: (pathData) => {
            const { dir } = path.parse(pathData.filename);
            const outputPath = dir.replace('src/', '');
            return outputPath + '/[name][ext]';
          },
        },
      },
    ],
  },
  plugins: [
    new PugPlugin({
      entry: 'src/pug/pages/',
      css: {
        filename: isProduction
          ? 'css/[name].[contenthash:8].min.css'
          : 'css/[name].[contenthash:8].css',
      },
      hotUpdate: true,
      pretty: isProduction ? !minimizeHTML : true,
      loaderOptions: {
        sources: [
          {
            tag: 'use',
            // Don't process svg sprites
            filter: ({ value }) => {
              if (value.includes('sprite')) return false;
            },
          },
          {
            tag: 'link',
            filter: ({ value }) => {
              // Don't process non-.svg favicons
              if (value.includes('favicon') && !value.endsWith('.svg'))
                return false;
              // Don't process vendor files
              if (value.includes('vendor')) return false;
            },
          },
          {
            tag: 'script',
            filter: ({ value }) => {
              // Don't process vendor files
              if (value.includes('vendor')) return false;
            },
          },
        ],
      },
      data: {
        svgSpriteHash: svgSpriteHash,
      },
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/vendor/', to: 'vendor/' }],
    }),
    new FaviconsWebpackPlugin({
      logo: 'src/img/favicon/favicon.svg',
      outputPath: 'img/favicon',
      devMode: 'webapp',
      inject: false,
      manifest: 'src/img/favicon/manifest.webmanifest',
      favicons: {
        icons: {
          android: ['android-chrome-192x192.png', 'android-chrome-512x512.png'],
          appleIcon: ['apple-touch-icon-180x180.png'],
          appleStartup: false,
          favicons: ['favicon.ico'],
          windows: false,
          yandex: false,
        },
      },
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
    }),
    new RemovePlugin({
      after: {
        include: ['./dist/js/svg-sprite-compiler.js'],
        log: false,
        logWarning: false,
      },
    }),
  ],
};
