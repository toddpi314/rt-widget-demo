# RT Medals Widget Usage Guide

This guide explains how to integrate the RT Medals Widget into your application. The widget is available in multiple formats to suit different integration needs.

## Integration Methods

### 1. Basic Script Integration

The simplest way to integrate the widget is using the standalone script loader:

```html
<!-- 1. Add a target container -->
<div id="rt-widget-target"></div>

<!-- 2. Include the widget loader script -->
<script src="https://<cnd>/widget-medals/loader.js"></script>

<!-- 3. Initialize the widget -->
<script>
    rtWidgetMedals('init', {
        element_id: 'rt-widget-target',
        sort: 'gold'  // optional, defaults to 'gold'
    });
</script>
```

### 2. Web Component Integration

For applications using Web Components:

```html
<!-- 1. Include the web component script -->
<script src="https://<cnd>/widget-medals/web-components/index.js"></script>

<!-- 2. Use the custom element -->
<medals-widget 
    id="rt-widget-target"
    sort="gold">
</medals-widget>
```

### 3. Module Federation Integration

#### Runtime Integration

For runtime integration using a script tag:

```html
<!-- 1. Add a target container -->
<div id="rt-widget-target"></div>

<!-- 2. Initialize the widget queue -->
<script>
    window.rtWidgetMedals = window.rtWidgetMedals || { q: [] };
    window.rtWidgetMedals.q.push(['init', {
        element_id: 'rt-widget-target',
        sort: 'gold'  // optional, defaults to 'gold'
    }]);
</script>

<!-- 3. Include the remote entry -->
<script src="https://<cnd>/widget-medals/federation/remoteEntry.js"></script>

<!-- 4. Initialize the federated module -->
<script>
    (async function() {
        try {
            // Wait for the container to be ready
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (window.medals_widget) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 10);
            });

            // Get the widget module and initialize it
            const widget = await window.medals_widget.get('./Widget');
            const rtWidgetMedals = widget().default;
            
            // Process any queued commands
            const queue = window.rtWidgetMedals.q || [];
            queue.forEach(([command, args]) => {
                rtWidgetMedals(command, args);
            });
        } catch (error) {
            console.error('Failed to load widget:', error);
        }
    })();
</script>
```

#### Build-time Integration

For applications using Webpack 5+, you can integrate the widget directly in your webpack configuration:

1. Update your webpack.config.js:

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // ... your other webpack configuration
  plugins: [
    new ModuleFederationPlugin({
      name: 'host_app',
      remotes: {
        medals_widget: 'medals_widget@https://<cnd>/widget-medals/federation/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
      },
    }),
  ],
};
```

2. Create a bootstrap file (e.g., `src/bootstrap.js`):

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';

// Dynamic import of the federated module
const MedalsWidget = React.lazy(() => import('medals_widget/Widget'));

const App = () => {
  return (
    <div>
      <React.Suspense fallback="Loading Medals Widget...">
        <MedalsWidget
          element_id="rt-widget-target"
          sort="gold"
        />
      </React.Suspense>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

3. Update your entry point (e.g., `src/index.js`):

```javascript
// Initialize the shared scope
import('./bootstrap');
```

4. Add the container element to your HTML:

```html
<div id="root"></div>
```

### 4. Direct React Component Usage (CDN)

For applications that want to use the widget as a direct React component:

```html
<div id="rt-widget-target"></div>
<script src="https://<cnd>/widget-medals/index.js"></script>
<script>
    const root = ReactDOM.createRoot(document.getElementById('rt-widget-target'));
    root.render(
        React.createElement(RTWidgetMedals.MedalsWidget, {
            element_id: 'rt-widget-target',
            sort: 'gold'
        })
    );
</script>
```

### 5. Script Embed Integration

For dynamic script loading and initialization:

```html
<div id="rt-widget-target"></div>
<script>
    // Set up the command queue
    window.rtWidgetMedals = window.rtWidgetMedals || function() {
        (window.rtWidgetMedals.q = window.rtWidgetMedals.q || []).push(arguments);
    };
    window.rtWidgetMedals.q = window.rtWidgetMedals.q || [];

    // Queue the init command
    rtWidgetMedals('init', {
        element_id: 'rt-widget-target',
        sort: 'gold'
    });

    // Load dependencies
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Load all required scripts
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js')
        .then(() => loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'))
        .then(() => loadScript('https://<cnd>/widget-medals/loader.js'));
</script>
```

### 6. IFrame Integration

For complete isolation, you can embed the widget in an iframe:

```html
<style>
    #widget-frame {
        width: 100%;
        height: 300px;
        border: none;
    }
</style>
<iframe id="widget-frame" src="https://<cnd>/widget-medals/iframe.html"></iframe>
```

## Configuration

The widget accepts the following configuration options:

- `element_id` (required): The ID of the target DOM element
- `sort` (optional): The initial sort field for medals. Options:
  - `'gold'` (default) - Sort by gold medals
  - `'silver'` - Sort by silver medals
  - `'bronze'` - Sort by bronze medals
  - `'total'` - Sort by total medal count

## Styling

Add these styles to ensure proper widget display:

```css
#rt-widget-target {
    display: block !important;
    visibility: visible !important;
    min-height: 100px !important;
    height: auto !important;
    opacity: 1 !important;
}
```

## CDN Usage

When using a CDN, replace all script sources with your CDN URL:

```html
<!-- Example CDN usage -->
<script src="https://<cnd>/widget-medals/loader.js"></script>
```

Make sure to update the following paths in your CDN:
- `/widget-medals/loader.js` - Basic integration
- `/widget-medals/web-components/index.js` - Web Components
- `/widget-medals/federation/remoteEntry.js` - Module Federation
- `/widget-medals/index.js` - Direct React component usage
- `/widget-medals/iframe.html` - IFrame integration 