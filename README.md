# RT Medals Widget

For detailed integration instructions, see [Usage Guide](usage.md).

## Prerequisites

The widget requires the following dependencies:

- React 18 as a peer dependency
- Node.js 16 or higher
- npm 8 or higher

Before using the widget, you'll need to:

1. Run the setup script:

```bash
npm run setup
```

## Development

Generally, this is a test-harness focused development cycle, so you'll need to run the test harness and make changes to the test harness to see the changes.

To run the test harness's webpack dev server to verify consumption scenarios in a browser at localhost:3000:

```bash
yarn workspace @rt/test-integration run start
# http://localhost:3000/harness/basic.html
# http://localhost:3000/harness/cdn.html
# http://localhost:3000/harness/embedded.html
# http://localhost:3000/harness/script-embed.html 
# http://localhost:3000/harness/web-component.html
# http://localhost:3000/harness/federation.html
# http://localhost:3000/harness/iframe-embed.html
# http://localhost:3000/harness/iframe.html
```

To run both the server and the test harness:

```bash
# Runs jest based tests
# Runs chrome-based tests in playwright
yarn test
```

To run the full suite (90p browsers and resolutions):

```bash
CI=true yarn test
```

## Building Releases

To build the widget for production:

```bash
yarn workspace @rt/widget-medals run build
```

The build artifacts will be generated in the `packages/widget-medals/dist` folder, containing:

- `loader.js` - Standalone script integration
- `web-components/index.js` - Web Components build
- `federation/remoteEntry.js` - Module Federation build

### Environment Configuration

The widget supports the following environment variables that can be configured at build time:

- `MEDALS_DATA_ENDPOINT`: The endpoint for medals data (default: '/assets/medals.json')
- `FLAG_ASSETS_BASE_URL`: The base URL for flag assets (default: '/assets/flags')

## Project Structure

```
packages/
  ├── widget-medals/        # Main widget package
  ├── test-integration/    # Integration tests and examples
  └── test-unit/          # Unit tests
```

## Available Scripts

- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run start` - Start development server
