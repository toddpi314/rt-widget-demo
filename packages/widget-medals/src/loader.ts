import React from 'react';
import ReactDOM from 'react-dom/client';
import MedalsWidget from './MedalsWidget';

interface WidgetConfig {
  container: string;
  title: string;
  content?: string;
}

class WidgetLoader {
  private queue: Array<[string, WidgetConfig]> = [];
  private initialized = false;
  private static instance: WidgetLoader | null = null;
  private roots: Map<string, ReactDOM.Root> = new Map();

  static getInstance(): WidgetLoader {
    if (!WidgetLoader.instance) {
      WidgetLoader.instance = new WidgetLoader();
    }
    return WidgetLoader.instance;
  }

  constructor() {
    console.log('WidgetLoader constructor called');
    // Get the existing queue before we override the global function
    const existingQueue = (window as any).rtWidgetMedals?.q || [];
    console.log('Existing queue at constructor:', existingQueue);
    
    // Store the queue for processing
    this.queue = [...existingQueue];
    
    // Set up the global function immediately
    (window as any).rtWidgetMedals = (command: string, args: WidgetConfig) => {
      console.log('Global rtWidgetMedals called with:', command, args);
      this.push(command, args);
    };

    // Process queue when React is ready
    this.waitForDependencies().then(() => {
      console.log('Dependencies ready, processing queue');
      this.processQueue();
    });
  }

  private async waitForDependencies(): Promise<void> {
    console.log('Checking for React and ReactDOM...');
    if (window.React && window.ReactDOM) {
      console.log('React and ReactDOM already available');
      return;
    }

    console.log('Waiting for React and ReactDOM...');
    return new Promise<void>((resolve) => {
      const checkDeps = () => {
        if (window.React && window.ReactDOM) {
          console.log('React and ReactDOM now available');
          resolve();
        } else {
          setTimeout(checkDeps, 100);
        }
      };
      checkDeps();
    });
  }

  private ensureContainerVisible(container: HTMLElement) {
    console.log('Ensuring container visibility for:', container);
    // Add a style tag to ensure visibility
    const styleId = 'rt-widget-medals-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .rt-widget-medals-container {
          display: block !important;
          visibility: visible !important;
          min-height: 100px !important;
          height: auto !important;
          opacity: 1 !important;
          position: relative !important;
          z-index: 1 !important;
        }
      `;
      document.head.appendChild(style);
      console.log('Added visibility styles');
    }

    // Add our class and inline styles
    container.classList.add('rt-widget-medals-container');
    container.style.cssText = `
      display: block !important;
      visibility: visible !important;
      min-height: 100px !important;
      height: auto !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 1 !important;
    `;

    // Create a wrapper div for the content
    const wrapper = document.createElement('div');
    wrapper.className = 'rt-widget-medals-container';
    wrapper.style.cssText = `
      display: block !important;
      visibility: visible !important;
      min-height: 100px !important;
      height: auto !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 1 !important;
    `;
    
    // Move container's children to wrapper
    while (container.firstChild) {
      wrapper.appendChild(container.firstChild);
    }
    container.appendChild(wrapper);

    // Ensure parent containers are visible
    let element: HTMLElement | null = container.parentElement;
    while (element) {
      element.style.cssText = `
        display: block !important;
        visibility: visible !important;
        min-height: 100px !important;
        height: auto !important;
        opacity: 1 !important;
      `;
      element = element.parentElement;
    }
  }

  public async init(config: WidgetConfig) {
    console.log('Init called with config:', config);
    const container = document.getElementById(config.container);
    if (!container) {
      console.error(`Container #${config.container} not found`);
      return;
    }

    try {
      await this.waitForDependencies();
      console.log('Creating root for container:', config.container);
      this.ensureContainerVisible(container);

      // Clean up existing root if it exists
      const existingRoot = this.roots.get(config.container);
      if (existingRoot) {
        console.log('Unmounting existing root');
        existingRoot.unmount();
      }

      const root = (window as any).ReactDOM.createRoot(container);
      this.roots.set(config.container, root);

      console.log('Rendering widget with config:', config);
      root.render(
        (window as any).React.createElement(
          'div',
          { 
            className: 'rt-widget-medals-container',
            style: {
              display: 'block',
              visibility: 'visible',
              minHeight: '100px',
              position: 'relative',
              zIndex: 1
            }
          },
          (window as any).React.createElement(MedalsWidget, { title: config.title },
            (window as any).React.createElement('div', {
              className: 'rt-widget-medals-container',
              style: {
                display: 'block',
                visibility: 'visible',
                minHeight: '100px',
                position: 'relative',
                zIndex: 1
              }
            }, config.content)
          )
        )
      );
      this.initialized = true;
      console.log('Widget rendered successfully');
    } catch (error) {
      console.error('Error rendering widget:', error);
      console.error('Error details:', {
        error,
        React: !!window.React,
        ReactDOM: !!window.ReactDOM,
        container: !!container,
        config
      });
    }
  }

  private async processQueue() {
    console.log('Processing queue:', this.queue);
    while (this.queue.length > 0) {
      const [command, args] = this.queue.shift()!;
      console.log('Processing command from queue:', command, args);
      if (command === 'init') {
        await this.init(args);
      }
    }
  }

  public async push(command: string, args: WidgetConfig) {
    console.log('Push called with:', command, args);
    if (this.initialized && window.React && window.ReactDOM) {
      console.log('Already initialized, executing command directly');
      if (command === 'init') {
        await this.init(args);
      }
    } else {
      console.log('Not initialized or missing dependencies, queueing command');
      this.queue.push([command, args]);
      if (!this.initialized) {
        await this.waitForDependencies();
        this.processQueue();
      }
    }
  }
}

// Create and get the singleton instance immediately
const loader = WidgetLoader.getInstance();

// Export the loader function
export default function(command: string, args: WidgetConfig) {
  console.log('Loader function called with:', command, args);
  loader.push(command, args);
} 