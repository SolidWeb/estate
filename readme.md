## Project initialization

Install npm packages according to the package-lock.json file:

- `npm ci`

## Project build

### Production build

Compile a production build:

- `npm run build:prod`

Compile a production build without minification of HTML files:

- Set `minimizeHTML` to `false` in `webpack.common.js`

Compile a production build and extract critical CSS:

- Set `extractCriticalCSS` to `true` in `webpack.prod.js`

### Development build

Compile a development (unminified) build:

- `npm run build:dev`
