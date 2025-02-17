const autoprefixer = require('autoprefixer'),
  purgecss = require('@fullhuman/postcss-purgecss'),
  sortMediaQueries = require('postcss-sort-media-queries'),
  cssnano = require('cssnano'),
  discardComments = require('postcss-discard-comments');

module.exports = {
  plugins: [
    autoprefixer,
    /* purgecss({
      content: ['dist/*.html'],
      safelist: {
        standard: ['tbody', 'iframe'],
        deep:
          process.env.NODE_ENV === 'production'
            ? [/^(js-|is-)[a-zA-Z0-9]+/]
            : [
                /^(data-|js-|is-|row-|col-|g-|gx-|gy-|justify-|align-|overflow-)[a-zA-Z0-9]+/,
              ],
      },
    }), */
    sortMediaQueries({
      sort: 'mobile-first',
    }),
    process.env.NODE_ENV === 'production'
      ? cssnano({
          preset: 'default',
        })
      : cssnano({ plugins: [discardComments] }),
  ],
};
