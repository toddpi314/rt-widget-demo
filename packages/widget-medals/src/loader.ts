import React from 'react';
import ReactDOM from 'react-dom/client';
import MedalsWidget from './MedalsWidget';
import { logger } from './utils/logger';

interface WidgetConfig {
  element_id: string;
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
    logger.log('WidgetLoader constructor called');
    // Get the existing queue before we override the global function
    const existingQueue = (window as any).rtWidgetMedals?.q || [];
    logger.log('Existing queue at constructor:', existingQueue);
    
    // Store the queue for processing
    this.queue = [...existingQueue];
    
    // Set up the global function immediately
    (window as any).rtWidgetMedals = (command: string, args: WidgetConfig) => {
      logger.log('Global rtWidgetMedals called with:', command, args);
      this.push(command, args);
    };

    // Process queue when React is ready
    this.waitForDependencies().then(() => {
      logger.log('Dependencies ready, processing queue');
      this.processQueue();
    });
  }

  private async waitForDependencies(): Promise<void> {
    logger.log('Checking for React and ReactDOM...');
    // Always resolve immediately since we're using imports
    logger.log('Using imported React and ReactDOM');
    return Promise.resolve();
  }

  private ensureContainerVisible(container: HTMLElement) {
    logger.log('Ensuring container visibility for:', container);
    // Create a wrapper div for the content
    const wrapper = document.createElement('div');
    
    // Move container's children to wrapper
    while (container.firstChild) {
      wrapper.appendChild(container.firstChild);
    }
    container.appendChild(wrapper);
  }

  public async init(config: WidgetConfig) {
    logger.log('Init called with config:', config);
    const targetElement = document.getElementById(config.element_id);
    if (!targetElement) {
      logger.error(`Target element #${config.element_id} not found`);
      return;
    }

    try {
      await this.waitForDependencies();
      logger.log('Creating root for element:', config.element_id);
      this.ensureContainerVisible(targetElement);

      // Clean up existing root if it exists
      const existingRoot = this.roots.get(config.element_id);
      if (existingRoot) {
        logger.log('Unmounting existing root');
        existingRoot.unmount();
      }

      const root = ReactDOM.createRoot(targetElement);
      this.roots.set(config.element_id, root);

      logger.log('Rendering widget with config:', config);
      root.render(
        React.createElement(MedalsWidget, { 
          element_id: config.element_id,
        }, config.content)
      );
      this.initialized = true;
      logger.log('Widget rendered successfully');
    } catch (error) {
      logger.error('Error rendering widget:', error);
      logger.error('Error details:', {
        error,
        React: !!React,
        ReactDOM: !!ReactDOM,
        targetElement: !!targetElement,
        config
      });
    }
  }

  private async processQueue() {
    logger.log('Processing queue:', this.queue);
    while (this.queue.length > 0) {
      const [command, args] = this.queue.shift()!;
      logger.log('Processing command from queue:', command, args);
      if (command === 'init') {
        await this.init(args);
      }
    }
  }

  public async push(command: string, args: WidgetConfig) {
    logger.log('Push called with:', command, args);
    if (this.initialized && window.React && window.ReactDOM) {
      logger.log('Already initialized, executing command directly');
      if (command === 'init') {
        await this.init(args);
      }
    } else {
      logger.log('Not initialized or missing dependencies, queueing command');
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
  logger.log('Loader function called with:', command, args);
  loader.push(command, args);
} 